function adminMiddleware(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  // Aqui assumimos que o token JWT (req.user) inclui a role do usuário
  // Exemplo no payload: { id: 1, email: '...', role: 'admin' }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado: apenas administradores podem realizar esta ação' });
  }

  next();
}

module.exports = adminMiddleware;
