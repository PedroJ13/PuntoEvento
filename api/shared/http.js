function json(status, body) {
  return {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body,
  };
}

function badRequest(message, details = undefined) {
  return json(400, { error: message, details });
}

function serverError(_error) {
  return json(500, {
    error: "Unexpected server error",
  });
}

module.exports = { badRequest, json, serverError };
