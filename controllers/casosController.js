const casosRepo = require('../repositories/casosRepository');
const agentesRepo = require('../repositories/agentesRepository');

function parseIdOr404(req, res) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    res.status(404).json({ error: 'ID inválido' });
    return null;
  }
  return id;
}

async function validarAgenteExistente(agente_id, res) {
  if (agente_id == null) return true; // para PATCH pode não enviar
  const idNum = parseInt(agente_id, 10);
  if (isNaN(idNum) || idNum <= 0) {
    res.status(400).json({
      status: 400,
      message: 'Parâmetros inválidos',
      errors: ['agente_id inválido']
    });
    return false;
  }
  const agente = await agentesRepo.findById(idNum);
  if (!agente) {
    res.status(404).json({ error: 'Agente não encontrado' });
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
  if (!id) return;
  try {
    const caso = await casosRepo.findById(id);
    if (!caso) return res.status(404).json({ error: 'Caso não encontrado' });
    res.status(200).json(caso);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao buscar caso' });
  }
}

async function create(req, res) {
  try {
    const camposValidos = ['titulo', 'descricao', 'status', 'agente_id'];
    const recebidos = Object.keys(req.body);
    const extras = recebidos.filter(c => !camposValidos.includes(c));
    if (extras.length) {
      return res.status(400).json({
        status: 400,
        message: 'Parâmetros inválidos',
        errors: [`Campos inválidos no payload: ${extras.join(', ')}`]
      });
    }

    const { titulo, descricao, status, agente_id } = req.body;

    const statusOk = ['aberto', 'solucionado'];
    const errors = [];
    if (!titulo) errors.push('titulo é obrigatório');
    if (!descricao) errors.push('descricao é obrigatória');
    if (!status || !statusOk.includes(status)) errors.push("status deve ser 'aberto' ou 'solucionado'");
    if (agente_id == null) errors.push('agente_id é obrigatório');
    if (errors.length) {
      return res.status(400).json({ status: 400, message: 'Parâmetros inválidos', errors });
    }

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
  if (!id) return;
  try {
    const camposValidos = ['titulo', 'descricao', 'status', 'agente_id'];
    const recebidos = Object.keys(req.body);
    const extras = recebidos.filter(c => !camposValidos.includes(c));
    if (extras.length) {
      return res.status(400).json({
        status: 400,
        message: 'Parâmetros inválidos',
        errors: [`Campos inválidos no payload: ${extras.join(', ')}`]
      });
    }

    const { titulo, descricao, status, agente_id } = req.body;

    const statusOk = ['aberto', 'solucionado'];
    const errors = [];
    if (!titulo) errors.push('titulo é obrigatório');
    if (!descricao) errors.push('descricao é obrigatória');
    if (!status || !statusOk.includes(status)) errors.push("status deve ser 'aberto' ou 'solucionado'");
    if (agente_id == null) errors.push('agente_id é obrigatório');
    if (errors.length) {
      return res.status(400).json({ status: 400, message: 'Parâmetros inválidos', errors });
    }

    const fkOk = await validarAgenteExistente(agente_id, res);
    if (!fkOk) return;

    const atualizado = await casosRepo.update(id, { titulo, descricao, status, agente_id });
    if (!atualizado) return res.status(404).json({ error: 'Caso não encontrado' });
    res.status(200).json(atualizado);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao atualizar caso' });
  }
}

async function partialUpdate(req, res) {
  const id = parseIdOr404(req, res);
  if (!id) return;
  try {
    const camposValidos = ['titulo', 'descricao', 'status', 'agente_id'];
    const recebidos = Object.keys(req.body);
    if (recebidos.length === 0) {
      return res.status(400).json({
        status: 400,
        message: 'Parâmetros inválidos',
        errors: ['Envie ao menos um campo para atualizar']
      });
    }

    const extras = recebidos.filter(c => !camposValidos.includes(c));
    if (extras.length) {
      return res.status(400).json({
        status: 400,
        message: 'Parâmetros inválidos',
        errors: [`Campos inválidos no payload: ${extras.join(', ')}`]
      });
    }

    if (req.body.status && !['aberto', 'solucionado'].includes(req.body.status)) {
      return res.status(400).json({
        status: 400,
        message: 'Parâmetros inválidos',
        errors: ["status deve ser 'aberto' ou 'solucionado'"]
      });
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'agente_id')) {
      const fkOk = await validarAgenteExistente(req.body.agente_id, res);
      if (!fkOk) return;
    }

    const atualizado = await casosRepo.partialUpdate(id, req.body);
    if (!atualizado) return res.status(404).json({ error: 'Caso não encontrado' });
    res.status(200).json(atualizado);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao atualizar caso' });
  }
}

async function remove(req, res) {
  const id = parseIdOr404(req, res);
  if (!id) return;
  try {
    const removido = await casosRepo.remove(id);
    if (!removido) return res.status(404).json({ error: 'Caso não encontrado' });
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: 'Erro ao remover caso' });
  }
}

module.exports = { getAll, getById, create, update, partialUpdate, remove };
