const db = require('../db/db');

async function create({ nome, email, senha }) {
  const [usuario] = await db('usuarios')
    .insert({ nome, email, senha })
    .returning(['id', 'nome', 'email']);
  return usuario;
}

async function findByEmail(email) {
  return db('usuarios').where({ email }).first();
}

async function remove(id) {
  return db('usuarios').where({ id }).del();
}

module.exports = { create, findByEmail, remove };
