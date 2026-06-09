param(
    [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
    [string]$OutputDir = "tasks/generated"
)

$ErrorActionPreference = "Stop"

$tasksDir = Join-Path $Root "tasks"
$chatStartDir = Join-Path $Root "chat-start"
$generatedDir = Join-Path $Root $OutputDir
$promptsDir = Join-Path $generatedDir "prompts"

New-Item -ItemType Directory -Force -Path $generatedDir | Out-Null
New-Item -ItemType Directory -Force -Path $promptsDir | Out-Null

$roles = @(
    [pscustomobject]@{ Key = "product-architect"; Name = "Product Architect"; ChatStart = "chat-start/PRODUCT_ARCHITECT.md"; Match = @("Product Architect", "Product/Architect", "Product / Architect") },
    [pscustomobject]@{ Key = "web-dev"; Name = "Web Dev"; ChatStart = "chat-start/WEB_DEV.md"; Match = @("Web Dev", "Frontend") },
    [pscustomobject]@{ Key = "backend-api"; Name = "Backend API"; ChatStart = "chat-start/BACKEND_API.md"; Match = @("Backend API", "Backend/API", "Backend / API") },
    [pscustomobject]@{ Key = "infra-azure"; Name = "Infra Azure"; ChatStart = "chat-start/INFRA_AZURE.md"; Match = @("Infra Azure", "Infra") },
    [pscustomobject]@{ Key = "diseno-ux"; Name = "Diseno UX"; ChatStart = "chat-start/DISENO_UX.md"; Match = @("Diseno UX", "Diseno/UX", "Diseno / UX", "Diseño UX", "Diseño/UX", "Diseño / UX") },
    [pscustomobject]@{ Key = "qa"; Name = "QA"; ChatStart = "chat-start/QA.md"; Match = @("QA") }
)

function Get-SectionText {
    param(
        [string]$Content,
        [string]$Heading
    )

    $escapedHeading = [regex]::Escape($Heading)
    $pattern = "(?ms)^##\s+$escapedHeading\s*\r?\n(?<body>.*?)(?=^##\s+|\z)"
    $match = [regex]::Match($Content, $pattern)
    if (-not $match.Success) {
        return ""
    }

    return $match.Groups["body"].Value.Trim()
}

function Get-FirstMeaningfulLine {
    param([string]$Text)

    foreach ($line in ($Text -split "\r?\n")) {
        $clean = $line.Trim()
        if ($clean -and -not $clean.StartsWith('```')) {
            return $clean.TrimEnd(".")
        }
    }

    return ""
}

function Resolve-Role {
    param([string]$TeamText)

    foreach ($role in $roles) {
        foreach ($candidate in $role.Match) {
            if ($TeamText -match [regex]::Escape($candidate)) {
                return $role
            }
        }
    }

    return ([pscustomobject]@{ Key = "unassigned"; Name = "Sin asignar"; ChatStart = ""; Match = @() })
}

function Convert-ToRepoPath {
    param([string]$Path)

    return ($Path.Substring($Root.Length).TrimStart("\", "/") -replace "\\", "/")
}

$assignments = Get-ChildItem -Path $tasksDir -Filter "TASK-*-assignment.md" | Sort-Object Name
$taskItems = @()

foreach ($assignment in $assignments) {
    $content = Get-Content -Raw -Path $assignment.FullName
    $taskId = [regex]::Match($assignment.BaseName, "TASK-\d+").Value
    if (-not $taskId) {
        continue
    }

    $numberMatch = [regex]::Match($taskId, "\d+")
    $number = if ($numberMatch.Success) { [int]$numberMatch.Value } else { 0 }
    $titleLine = (($content -split "\r?\n") | Where-Object { $_.Trim() } | Select-Object -First 1)
    $title = if ($titleLine) { $titleLine.Trim().TrimStart("#").Trim() } else { $taskId }
    $teamText = Get-FirstMeaningfulLine (Get-SectionText $content "Equipo encargado")
    if (-not $teamText) {
        $teamText = Get-FirstMeaningfulLine (Get-SectionText $content "Equipo asignado")
    }
    if (-not $teamText) {
        $teamText = Get-FirstMeaningfulLine (Get-SectionText $content "Equipo")
    }

    $role = Resolve-Role $teamText
    $objective = Get-FirstMeaningfulLine (Get-SectionText $content "Objetivo")
    $handoffPath = Join-Path $tasksDir "$taskId-HANDOFF.md"
    $cancelledPath = Join-Path $tasksDir "$taskId-CANCELLED.md"
    $status = "pending"
    $handoffRepoPath = $null

    if (Test-Path $cancelledPath) {
        $status = "cancelled"
    }
    elseif (Test-Path $handoffPath) {
        $status = "done"
        $handoffRepoPath = Convert-ToRepoPath $handoffPath
    }

    $taskItems += [pscustomobject]@{
        id = $taskId
        number = $number
        title = $title
        role = $role.Name
        roleKey = $role.Key
        status = $status
        assignment = Convert-ToRepoPath $assignment.FullName
        handoff = $handoffRepoPath
        objective = $objective
        updatedAt = $assignment.LastWriteTime.ToString("s")
    }
}

$handoffs = Get-ChildItem -Path $tasksDir -Filter "TASK-*-HANDOFF.md" |
    Sort-Object LastWriteTime -Descending |
    ForEach-Object {
        $taskId = [regex]::Match($_.BaseName, "TASK-\d+").Value
        [pscustomobject]@{
            id = $taskId
            path = Convert-ToRepoPath $_.FullName
            updatedAt = $_.LastWriteTime.ToString("s")
        }
    }

$pendingTasks = @($taskItems | Where-Object { $_.status -eq "pending" } | Sort-Object number)
$doneTasks = @($taskItems | Where-Object { $_.status -eq "done" } | Sort-Object number)
$cancelledTasks = @($taskItems | Where-Object { $_.status -eq "cancelled" } | Sort-Object number)

$status = [pscustomobject]@{
    generatedAt = (Get-Date).ToString("s")
    totals = [pscustomobject]@{
        assignments = $taskItems.Count
        pending = $pendingTasks.Count
        done = $doneTasks.Count
        cancelled = $cancelledTasks.Count
        handoffs = @($handoffs).Count
    }
    pending = $pendingTasks
    done = $doneTasks
    cancelled = $cancelledTasks
    recentHandoffs = @($handoffs | Select-Object -First 10)
}

$status | ConvertTo-Json -Depth 8 | Set-Content -Path (Join-Path $generatedDir "status.json") -Encoding UTF8

$board = @()
$board += "# Manager board generado"
$board += ""
$board += "Generado: $($status.generatedAt)"
$board += ""
$board += "Este archivo es generado por tools/codex-coordination.ps1. No lo edites a mano; cambia assignments/handoffs y vuelve a correr el script."
$board += ""
$board += "## Resumen"
$board += ""
$board += "- Assignments: $($status.totals.assignments)"
$board += "- Pendientes: $($status.totals.pending)"
$board += "- Completadas: $($status.totals.done)"
$board += "- Canceladas: $($status.totals.cancelled)"
$board += "- Handoffs: $($status.totals.handoffs)"
$board += ""
$board += "## Pendientes por rol"
$board += ""

foreach ($role in $roles) {
    $rolePending = @($pendingTasks | Where-Object { $_.roleKey -eq $role.Key })
    $board += "### $($role.Name)"
    $board += ""
    if ($rolePending.Count -eq 0) {
        $board += "- Sin tareas pendientes detectadas."
    }
    else {
        foreach ($task in $rolePending) {
            $suffix = if ($task.objective) { " - $($task.objective)" } else { "" }
            $board += "- $($task.assignment)$suffix"
        }
    }
    $board += ""
}

$unassignedPending = @($pendingTasks | Where-Object { $_.roleKey -eq "unassigned" })
if ($unassignedPending.Count -gt 0) {
    $board += "### Sin asignar"
    $board += ""
    foreach ($task in $unassignedPending) {
        $board += "- $($task.assignment)"
    }
    $board += ""
}

$board += "## Handoffs recientes"
$board += ""
foreach ($handoff in (@($handoffs) | Select-Object -First 10)) {
    $board += "- $($handoff.path) ($($handoff.updatedAt))"
}
$board += ""
$board += "## Prompts generados"
$board += ""
foreach ($role in $roles) {
    $board += "- $OutputDir/prompts/$($role.Key)-next-prompt.md"
}

Set-Content -Path (Join-Path $generatedDir "manager-board.md") -Value ($board -join [Environment]::NewLine) -Encoding UTF8

foreach ($role in $roles) {
    $rolePending = @($pendingTasks | Where-Object { $_.roleKey -eq $role.Key } | Sort-Object number)
    $nextTask = $rolePending | Select-Object -First 1
    $prompt = @()

    $prompt += "# Prompt para $($role.Name)"
    $prompt += ""
    $prompt += "Lee primero:"
    $prompt += ""
    $prompt += "- AGENTS.md"
    if ($role.ChatStart) {
        $prompt += "- $($role.ChatStart)"
    }
    $prompt += "- docs/README.md"
    $prompt += "- docs/WORKFLOW_CODEX.md"
    $prompt += "- $OutputDir/manager-board.md"
    $prompt += ""

    if ($role.Key -eq "product-architect") {
        $prompt += "Tu rol ahora:"
        $prompt += ""
        $prompt += "- Revisa los handoffs recientes."
        $prompt += "- Actualiza docs/BACKLOG.md, docs/DECISION_LOG.md o contratos si corresponde."
        $prompt += "- Crea una nueva tarea pequena en tasks/TASK-###-assignment.md cuando haya siguiente paso claro."
        $prompt += "- Vuelve a correr .\tools\codex-coordination.ps1 despues de crear o cerrar tareas."
        $prompt += ""
        $prompt += "Handoffs recientes:"
        $prompt += ""
        foreach ($handoff in (@($handoffs) | Select-Object -First 8)) {
            $prompt += "- $($handoff.path)"
        }
        if (@($handoffs).Count -eq 0) {
            $prompt += "- No hay handoffs detectados."
        }
    }
    elseif ($nextTask) {
        $prompt += "Tu tarea actual:"
        $prompt += ""
        $prompt += "Lee este assignment y ejecutalo con alcance pequeno:"
        $prompt += ""
        $prompt += "- $($nextTask.assignment)"
        $prompt += ""
        $prompt += "Al terminar:"
        $prompt += ""
        $prompt += "- Crea o actualiza tasks/$($nextTask.id)-HANDOFF.md."
        $prompt += "- Incluye resumen, archivos tocados, verificacion, riesgos, pendientes y recomendacion para Product/Architect."
        $prompt += "- Responde en tu chat: Termine $($nextTask.id). Product/Architect debe leer tasks/$($nextTask.id)-HANDOFF.md."
        $prompt += ""
        $prompt += "Contexto reciente util:"
        $prompt += ""
        foreach ($handoff in (@($handoffs) | Select-Object -First 5)) {
            $prompt += "- $($handoff.path)"
        }
        if (@($handoffs).Count -eq 0) {
            $prompt += "- No hay handoffs previos detectados."
        }
    }
    else {
        $prompt += "No hay tareas pendientes detectadas para este rol."
        $prompt += ""
        $prompt += "Pide a Product/Architect una nueva tarea o revisa $OutputDir/manager-board.md."
    }

    Set-Content -Path (Join-Path $promptsDir "$($role.Key)-next-prompt.md") -Value ($prompt -join [Environment]::NewLine) -Encoding UTF8
}

Write-Host "Coordinacion generada en $OutputDir"
Write-Host "Board: $OutputDir/manager-board.md"
Write-Host "Prompts: $OutputDir/prompts/*.md"
