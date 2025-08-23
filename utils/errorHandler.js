// utils/errorHandler.js
function badRequest(res, errors) {
  return res.status(400).json({
    status: 400,
    message: 'Parâmetros inválidos',
    errors: Array.isArray(errors) ? errors : [String(errors)]
  });
}

function notFound(res, msg = 'Recurso não encontrado') {
  return res.status(404).json({ error: msg });
}

module.exports = { badRequest, notFound };
