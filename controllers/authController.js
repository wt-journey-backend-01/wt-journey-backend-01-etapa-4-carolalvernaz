const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuariosRepo = require('../repositories/usuariosRepository');
const { badRequest, notFound } = require('../utils/errorHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo';

// Função auxiliar para validar IDs
function parseIdOr404(req, res) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    notFound(res, 'ID inválido');
    return null;
  }
  return id;
}

// Registro de usuário
async function register(req, res) {
  try {
    const { nome, email, senha } = req.body;

    // Rejeita campos extras
    const camposValidos = ['nome', 'email', 'senha'];
    const recebidos = Object.keys(req.body);
    const extras = recebidos.filter(c => !camposValidos.includes(c));
    if (extras.length) {
      return badRequest(res, `Campos inválidos no payload: ${extras.join(', ')}`);
    }

    // Campos obrigatórios
    if (!nome || !email || !senha) {
      return badRequest(res, 'Campos obrigatórios: nome, email, senha');
    }

    // Email único
    const existente = await usuariosRepo.findByEmail(email);
    if (existente) {
      return badRequest(res, 'Email já em uso');
    }

    // Senha forte
    const senhaValida = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!senhaValida.test(senha)) {
      return badRequest(
        res,
        'Senha deve ter no mínimo 8 caracteres, incluindo uma letra minúscula, uma maiúscula, um número e um caractere especial.'
      );
    }

    // Cria usuário
    const hashed = await bcrypt.hash(senha, 10);
    const novo = await usuariosRepo.create({ nome, email, senha: hashed });

    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
}

// Login
async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const usuario = await usuariosRepo.findByEmail(email);
    if (!usuario) return res.status(401).json({ error: 'Credenciais inválidas' });

    const valido = await bcrypt.compare(senha, usuario.senha);
    if (!valido) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ access_token: token });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
}

// Logout (apenas informativo)
async function logout(req, res) {
  res.status(200).json({ message: 'Logout realizado com sucesso' });
}

// Remover usuário
async function remove(req, res) {
  try {
    const id = parseIdOr404(req, res);
    if (id === null) return;

    const deleted = await usuariosRepo.remove(id);
    if (deleted === 0) return notFound(res, 'Usuário não encontrado');

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
}

// Retorna usuário autenticado
async function me(req, res) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Não autenticado' });

    const usuario = await usuariosRepo.findById(req.user.id);
    if (!usuario) return notFound(res, 'Usuário não encontrado');

    res.status(200).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuário autenticado' });
  }
}

module.exports = { register, login, logout, remove, me };
