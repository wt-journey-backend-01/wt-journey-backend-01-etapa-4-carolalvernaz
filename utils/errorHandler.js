function badRequest(res, message) {
  return res.status(400).json({
    status: 400,
    message: 'Parâmetros inválidos',
    errors: Array.isArray(message) ? message : [message]
  });
}

function notFound(res, message) {
  return res.status(404).json({
    status: 404,
    message: message,
    errors: [message]
  });
}

function unauthorized(res, message = 'Não autorizado') {
  return res.status(401).json({
    status: 401,
    message,
    errors: [message]
  });
}

module.exports = { badRequest, notFound, unauthorized };
