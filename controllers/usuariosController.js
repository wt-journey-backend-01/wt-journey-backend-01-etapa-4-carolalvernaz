const usuariosRepo = require('../repositories/usuariosRepository');
const { badRequest, notFound } = require('../utils/errorHandler');

function parseIdOr404(req, res) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    notFound(res, 'ID inválido');
    return null;
  }
  return id;
}

// Listar todos os usuários
async function getAll(req, res) {
  try {
    const usuarios = await usuariosRepo.findAll();
    res.status(200).json(usuarios);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
}

// Buscar usuário por ID
async function getById(req, res) {
  const id = parseIdOr404(req, res);
  if (id === null) return;
  try {
    const usuario = await usuariosRepo.findById(id);
    if (!usuario) return notFound(res, 'Usuário não encontrado');
    res.status(200).json(usuario);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
}

// Criar usuário (sem hash automático aqui, apenas CRUD puro)
async function create(req, res) {
  try {
    const { nome, email, senha } = req.body;
    if (!nome) return badRequest(res, 'Campo obrigatório: nome');
    if (!email) return badRequest(res, 'Campo obrigatório: email');
    if (!senha) return badRequest(res, 'Campo obrigatório: senha');

    const novo = await usuariosRepo.create({ nome, email, senha });
    res.status(201).json(novo);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
}

// Atualizar usuário (PUT)
async function update(req, res) {
  const id = parseIdOr404(req, res);
  if (id === null) return;
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return badRequest(res, 'Campos obrigatórios: nome, email, senha');
    }

    const atualizado = await usuariosRepo.update(id, { nome, email, senha });
    if (!atualizado) return notFound(res, 'Usuário não encontrado');
    res.status(200).json(atualizado);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
}

// Atualizar parcialmente usuário (PATCH)
async function partialUpdate(req, res) {
  const id = parseIdOr404(req, res);
  if (id === null) return;
  try {
    if (Object.keys(req.body).length === 0) {
      return badRequest(res, 'Envie ao menos um campo para atualizar');
    }

    const atualizado = await usuariosRepo.partialUpdate(id, req.body);
    if (!atualizado) return notFound(res, 'Usuário não encontrado');
    res.status(200).json(atualizado);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
}

// Remover usuário
async function remove(req, res) {
  const id = parseIdOr404(req, res);
  if (id === null) return;
  try {
    const removido = await usuariosRepo.remove(id);
    if (removido === 0) return notFound(res, 'Usuário não encontrado');
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: 'Erro ao remover usuário' });
  }
}

module.exports = { getAll, getById, create, update, partialUpdate, remove };
