const casosRepo = require('../repositories/casosRepository');
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

async function validarAgenteExistente(agente_id, res) {
  if (agente_id == null) return true;
  const idNum = parseInt(agente_id, 10);
  if (isNaN(idNum) || idNum <= 0) {
    badRequest(res, 'agente_id inválido');
    return false;
  }
  const agente = await agentesRepo.findById(idNum);
  if (!agente) {
    notFound(res, 'Agente não encontrado');
    return false;
  }
  return true;
}

async function getAll(req, res) {
  try {
    const itens = await casosRepo.findAll();
    res.status(200).json(itens);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao listar casos' });
  }
}

async function getById(req, res) {
  const id = parseIdOr404(req, res);
  if (id === null) return;
  try {
    const caso = await casosRepo.findById(id);
    if (!caso) return notFound(res, 'Caso não encontrado');
    res.status(200).json(caso);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao buscar caso' });
  }
}

async function create(req, res) {
  try {
    const { titulo, descricao, status, agente_id } = req.body;
    const statusOk = ['aberto', 'solucionado'];

    if (!titulo) return badRequest(res, 'Campo obrigatório: titulo');
    if (!descricao) return badRequest(res, 'Campo obrigatório: descricao');
    if (!statusOk.includes(status)) return badRequest(res, "status deve ser 'aberto' ou 'solucionado'");
    if (agente_id == null) return badRequest(res, 'Campo obrigatório: agente_id');

    const fkOk = await validarAgenteExistente(agente_id, res);
    if (!fkOk) return;

    const novo = await casosRepo.create({ titulo, descricao, status, agente_id });
    res.status(201).json(novo);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao criar caso' });
  }
}

async function update(req, res) {
  const id = parseIdOr404(req, res);
  if (id === null) return;
  try {
    const { titulo, descricao, status, agente_id } = req.body;
    const statusOk = ['aberto', 'solucionado'];

    if (!titulo || !descricao || !statusOk.includes(status) || agente_id == null) {
      return badRequest(res, 'Campos obrigatórios inválidos');
    }

    const fkOk = await validarAgenteExistente(agente_id, res);
    if (!fkOk) return;

    const atualizado = await casosRepo.update(id, { titulo, descricao, status, agente_id });
    if (!atualizado) return notFound(res, 'Caso não encontrado');
    res.status(200).json(atualizado);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao atualizar caso' });
  }
}

async function partialUpdate(req, res) {
  const id = parseIdOr404(req, res);
  if (id === null) return;
  try {
    if (req.body.status && !['aberto', 'solucionado'].includes(req.body.status)) {
      return badRequest(res, "status deve ser 'aberto' ou 'solucionado'");
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'agente_id')) {
      const fkOk = await validarAgenteExistente(req.body.agente_id, res);
      if (!fkOk) return;
    }

    const atualizado = await casosRepo.partialUpdate(id, req.body);
    if (!atualizado) return notFound(res, 'Caso não encontrado');
    res.status(200).json(atualizado);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao atualizar caso' });
  }
}

async function remove(req, res) {
  const id = parseIdOr404(req, res);
  if (id === null) return;
  try {
    const removido = await casosRepo.remove(id);
    if (removido === 0) return notFound(res, 'Caso não encontrado');
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: 'Erro ao remover caso' });
  }
}

module.exports = { getAll, getById, create, update, partialUpdate, remove };
