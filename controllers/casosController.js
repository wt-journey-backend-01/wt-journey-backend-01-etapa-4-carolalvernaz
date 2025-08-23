const casosRepo = require('../repositories/casosRepository');

async function getAll(req, res) {
  try {
    const casos = await casosRepo.findAll();
    res.status(200).json(casos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getById(req, res) {
  try {
    const caso = await casosRepo.findById(req.params.id);
    if (!caso) {
      return res.status(404).json({ error: 'Caso não encontrado' });
    }
    res.status(200).json(caso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function create(req, res) {
  try {
    const { titulo, descricao, status, agente_id } = req.body;

    if (!titulo || !descricao || !['aberto', 'solucionado'].includes(status) || !agente_id) {
      return res.status(400).json({
        status: 400,
        message: 'Parâmetros inválidos',
        errors: [
          "Campos obrigatórios: titulo, descricao, status ('aberto' ou 'solucionado'), agente_id"
        ]
      });
    }

    const [novoCaso] = await casosRepo.create({ titulo, descricao, status, agente_id });
    res.status(201).json(novoCaso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function update(req, res) {
  try {
    const [atualizado] = await casosRepo.update(req.params.id, req.body);
    if (!atualizado) {
      return res.status(404).json({ error: 'Caso não encontrado' });
    }
    res.status(200).json(atualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function partialUpdate(req, res) {
  try {
    const [atualizado] = await casosRepo.update(req.params.id, req.body);
    if (!atualizado) {
      return res.status(404).json({ error: 'Caso não encontrado' });
    }
    res.status(200).json(atualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function remove(req, res) {
  try {
    const removido = await casosRepo.remove(req.params.id);
    if (!removido) {
      return res.status(404).json({ error: 'Caso não encontrado' });
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
