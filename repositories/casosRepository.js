const db = require('../db/db');

module.exports = {
  findAll: () => db('casos').select('*'),
  findById: (id) => db('casos').where({ id }).first(),
  create: (data) => db('casos').insert(data).returning('*'),
  update: (id, data) => db('casos').where({ id }).update(data).returning('*'),
  partialUpdate: (id, data) => db('casos').where({ id }).update(data).returning('*'),
  remove: (id) => db('casos').where({ id }).del(),
};
