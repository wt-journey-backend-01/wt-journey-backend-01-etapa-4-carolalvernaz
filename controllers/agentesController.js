const agentesRepo = require('../repositories/agentesRepository');

async function getAll(req, res) {
  try {
    const agentes = await agentesRepo.findAll();
    res.status(200).json(agentes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getById(req, res) {
  try {
    const agente = await agentesRepo.findById(req.params.id);
    if (!agente) {
      return res.status(404).json({ error: 'Agente não encontrado' });
    }
    res.status(200).json(agente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function create(req, res) {
  try {
    const { nome, dataDeIncorporacao, cargo } = req.body;

    if (!nome || !dataDeIncorporacao || !cargo) {
      return res.status(400).json({
        status: 400,
        message: 'Parâmetros inválidos',
        errors: [
          "Campos obrigatórios: nome, dataDeIncorporacao, cargo"
        ]
      });
    }

    const [novoAgente] = await agentesRepo.create({ nome, dataDeIncorporacao, cargo });
    res.status(201).json(novoAgente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function update(req, res) {
  try {
    const [atualizado] = await agentesRepo.update(req.params.id, req.body);
    if (!atualizado) {
      return res.status(404).json({ error: 'Agente não encontrado' });
    }
    res.status(200).json(atualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function partialUpdate(req, res) {
  try {
    const [atualizado] = await agentesRepo.update(req.params.id, req.body); // usando update para parcial também
    if (!atualizado) {
      return res.status(404).json({ error: 'Agente não encontrado' });
    }
    res.status(200).json(atualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function remove(req, res) {
  try {
    const removido = await agentesRepo.remove(req.params.id);
    if (!removido) {
      return res.status(404).json({ error: 'Agente não encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  partialUpdate,
  remove
};
