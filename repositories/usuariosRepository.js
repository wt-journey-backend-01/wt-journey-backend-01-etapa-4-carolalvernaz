const db = require('../db/db');

// Criar usuário
async function create({ nome, email, senha }) {
  const [usuario] = await db('usuarios')
    .insert({ nome, email, senha })
    .returning(['id', 'nome', 'email']);
  return usuario;
}

// Buscar por email
async function findByEmail(email) {
  return db('usuarios').where({ email }).first();
}

// Buscar por ID
async function findById(id) {
  return db('usuarios').where({ id }).first();
}

// Remover usuário
async function remove(id) {
  const deleted = await db('usuarios').where({ id }).del();
  return deleted; // número de linhas deletadas
}

module.exports = { create, findByEmail, findById, remove };
