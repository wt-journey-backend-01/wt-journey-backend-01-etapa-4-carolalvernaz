const agentesRepo = require('../repositories/agentesRepository');
const { badRequest, notFound } = require('../utils/errorHandler');

function parseIdOr404(req, res) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    notFound(res, 'ID inválido');
    return null;
  }
  return id;
}

async function getAll(req, res) {
  try {
    const itens = await agentesRepo.findAll();
    res.status(200).json(itens);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao listar agentes' });
  }
}

async function getById(req, res) {
  const id = parseIdOr404(req, res);
  if (!id) return;
  try {
    const agente = await agentesRepo.findById(id);
    if (!agente) return notFound(res, 'Agente não encontrado');
    res.status(200).json(agente);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao buscar agente' });
  }
}

async function create(req, res) {
  try {
    const camposValidos = ['nome', 'dataDeIncorporacao', 'cargo'];
    const recebidos = Object.keys(req.body);
    const extras = recebidos.filter(c => !camposValidos.includes(c));
    if (extras.length) return badRequest(res, `Campos inválidos: ${extras.join(', ')}`);

    const { nome, dataDeIncorporacao, cargo } = req.body;
    if (!nome || !dataDeIncorporacao || !cargo) {
      return badRequest(res, 'Campos obrigatórios: nome, dataDeIncorporacao, cargo');
    }

    const [novo] = await agentesRepo.create({ nome, dataDeIncorporacao, cargo });
    res.status(201).json(novo);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao criar agente' });
  }
}

async function update(req, res) {
  const id = parseIdOr404(req, res);
  if (!id) return;
  try {
    const { nome, dataDeIncorporacao, cargo } = req.body;
    if (!nome || !dataDeIncorporacao || !cargo) {
      return badRequest(res, 'Campos obrigatórios: nome, dataDeIncorporacao, cargo');
    }

    const [atualizado] = await agentesRepo.update(id, { nome, dataDeIncorporacao, cargo });
    if (!atualizado) return notFound(res, 'Agente não encontrado');
    res.status(200).json(atualizado);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao atualizar agente' });
  }
}

async function partialUpdate(req, res) {
  const id = parseIdOr404(req, res);
  if (!id) return;
  try {
    const camposValidos = ['nome', 'dataDeIncorporacao', 'cargo'];
    const recebidos = Object.keys(req.body);
    if (recebidos.length === 0) return badRequest(res, 'Envie ao menos um campo para atualizar');

    const extras = recebidos.filter(c => !camposValidos.includes(c));
    if (extras.length) return badRequest(res, `Campos inválidos: ${extras.join(', ')}`);

    const [atualizado] = await agentesRepo.update(id, req.body);
    if (!atualizado) return notFound(res, 'Agente não encontrado');
    res.status(200).json(atualizado);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao atualizar agente' });
  }
}

async function remove(req, res) {
  const id = parseIdOr404(req, res);
  if (!id) return;
  try {
    const removido = await agentesRepo.remove(id);
    if (removido === 0) return notFound(res, 'Agente não encontrado');
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: 'Erro ao remover agente' });
  }
}

module.exports = { getAll, getById, create, update, partialUpdate, remove };
