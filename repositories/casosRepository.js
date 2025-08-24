const db = require('../db/db');

async function findAll() {
  return db('casos').select('*');
}

async function findById(id) {
  return db('casos').where({ id }).first();
}

async function create(data) {
  const [created] = await db('casos').insert(data).returning('*');
  return created;
}

async function update(id, data) {
  const [updated] = await db('casos').where({ id }).update(data).returning('*');
  return updated;
}

async function partialUpdate(id, data) {
  const [updated] = await db('casos').where({ id }).update(data).returning('*');
  return updated;
}

async function remove(id) {
  return db('casos').where({ id }).del();
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  partialUpdate,
  remove,
};
