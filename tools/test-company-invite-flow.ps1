param(
  [string]$BaseUrl = "https://zealous-field-08fdd720f.7.azurestaticapps.net",
  [string]$CompanyId = "company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2",
  [string]$Email = "qa-company-register-test@example.com"
)

$ErrorActionPreference = "Stop"

function Write-Step($Message) {
  Write-Host ""
  Write-Host "== $Message =="
}

function Invoke-JsonRequest {
  param(
    [string]$Method,
    [string]$Uri,
    [hashtable]$Headers = @{},
    [object]$Body = $null,
    [Microsoft.PowerShell.Commands.WebRequestSession]$WebSession = $null
  )

  $params = @{
    Method = $Method
    Uri = $Uri
    Headers = $Headers
    ContentType = "application/json"
    ErrorAction = "Stop"
  }

  if ($null -ne $Body) {
    $params.Body = ($Body | ConvertTo-Json -Depth 6)
  }

  if ($null -ne $WebSession) {
    $params.WebSession = $WebSession
  }

  try {
    $response = Invoke-WebRequest @params
    return @{
      StatusCode = [int]$response.StatusCode
      Headers = $response.Headers
      Body = if ($response.Content) { $response.Content | ConvertFrom-Json } else { $null }
      RawBody = $response.Content
    }
  } catch {
    $httpResponse = $_.Exception.Response
    if ($null -eq $httpResponse) {
      throw
    }

    $reader = New-Object System.IO.StreamReader($httpResponse.GetResponseStream())
    $content = $reader.ReadToEnd()
    return @{
      StatusCode = [int]$httpResponse.StatusCode
      Headers = $httpResponse.Headers
      Body = if ($content) { $content | ConvertFrom-Json } else { $null }
      RawBody = $content
    }
  }
}

function Redact-SetCookie($SetCookie) {
  if (-not $SetCookie) { return "" }
  return ($SetCookie -replace "pe_company_session=[^;]*", "pe_company_session=<redacted>")
}

if (-not $env:ADMIN_USERNAME -or -not $env:ADMIN_PASSWORD) {
  Write-Error "ADMIN_USERNAME and ADMIN_PASSWORD must be set as environment variables in this PowerShell session."
}

$authPlain = "$($env:ADMIN_USERNAME):$($env:ADMIN_PASSWORD)"
$authBytes = [Text.Encoding]::UTF8.GetBytes($authPlain)
$authHeader = "Basic " + [Convert]::ToBase64String($authBytes)
$headers = @{ Authorization = $authHeader }

Write-Host "Punto Evento invite auth flow test"
Write-Host "BaseUrl: $BaseUrl"
Write-Host "CompanyId: $CompanyId"
Write-Host "Email: $Email"
Write-Host "Secrets: redacted"

Write-Step "1. Create invite"
$inviteResponse = Invoke-JsonRequest `
  -Method "POST" `
  -Uri "$BaseUrl/api/internal/company-invites" `
  -Headers $headers `
  -Body @{ companyId = $CompanyId; email = $Email }

Write-Host "Status: $($inviteResponse.StatusCode)"
if ($inviteResponse.StatusCode -ne 201) {
  Write-Host "Body: $($inviteResponse.RawBody)"
  throw "Expected 201 when creating invite."
}

$inviteId = $inviteResponse.Body.inviteId
$inviteUrl = [string]$inviteResponse.Body.inviteUrl
Write-Host "inviteId: $inviteId"
Write-Host "companyId: $($inviteResponse.Body.companyId)"
Write-Host "email: $($inviteResponse.Body.email)"
Write-Host "role: $($inviteResponse.Body.role)"
Write-Host "expiresAt: $($inviteResponse.Body.expiresAt)"
Write-Host "inviteUrl: <redacted>"

$inviteUri = [Uri]$inviteUrl
$token = ""
foreach ($part in $inviteUri.Query.TrimStart("?").Split("&")) {
  if (-not $part) { continue }
  $pair = $part.Split("=", 2)
  if ($pair[0] -eq "invite" -and $pair.Length -gt 1) {
    $token = [Uri]::UnescapeDataString($pair[1])
  }
}
if (-not $token) {
  throw "invite token was not found in inviteUrl query string."
}

Write-Step "2. Accept invite"
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$acceptParams = @{
  Method = "POST"
  Uri = "$BaseUrl/api/company-auth/accept-invite"
  ContentType = "application/json"
  Body = (@{ token = $token } | ConvertTo-Json)
  WebSession = $session
  ErrorAction = "Stop"
}
$acceptResponse = Invoke-WebRequest @acceptParams
$acceptBody = $acceptResponse.Content | ConvertFrom-Json
Write-Host "Status: $([int]$acceptResponse.StatusCode)"
Write-Host "companyId: $($acceptBody.companyId)"
Write-Host "email: $($acceptBody.email)"
Write-Host "role: $($acceptBody.role)"
Write-Host "Set-Cookie: $(Redact-SetCookie $acceptResponse.Headers['Set-Cookie'])"

Write-Step "3. Reuse token"
$reuseResponse = Invoke-JsonRequest `
  -Method "POST" `
  -Uri "$BaseUrl/api/company-auth/accept-invite" `
  -Body @{ token = $token }
Write-Host "Status: $($reuseResponse.StatusCode)"
Write-Host "Body: $($reuseResponse.RawBody)"

Write-Step "4. Logout with cookie"
$logoutResponse = Invoke-JsonRequest `
  -Method "POST" `
  -Uri "$BaseUrl/api/company-auth/logout" `
  -Body @{} `
  -WebSession $session
Write-Host "Status: $($logoutResponse.StatusCode)"
Write-Host "Body: $($logoutResponse.RawBody)"
Write-Host "Set-Cookie: $(Redact-SetCookie $logoutResponse.Headers['Set-Cookie'])"

Write-Step "Summary"
Write-Host "createInviteStatus=$($inviteResponse.StatusCode)"
Write-Host "acceptInviteStatus=$([int]$acceptResponse.StatusCode)"
Write-Host "reuseTokenStatus=$($reuseResponse.StatusCode)"
Write-Host "logoutStatus=$($logoutResponse.StatusCode)"
Write-Host "inviteId=$inviteId"
Write-Host "token=<redacted>"
Write-Host "sessionCookie=<redacted>"
