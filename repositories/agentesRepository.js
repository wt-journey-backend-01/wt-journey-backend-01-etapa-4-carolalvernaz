const db = require('../db/db');

async function findAll() {
  return db('agentes').select('*');
}

async function findById(id) {
  return db('agentes').where({ id }).first();
}

async function create(data) {
  const [created] = await db('agentes').insert(data).returning('*');
  return created;
}

async function update(id, data) {
  const [updated] = await db('agentes').where({ id }).update(data).returning('*');
  return updated;
}

async function partialUpdate(id, data) {
  const [updated] = await db('agentes').where({ id }).update(data).returning('*');
  return updated;
}

async function remove(id) {
  return db('agentes').where({ id }).del();
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  partialUpdate,
  remove,
};
