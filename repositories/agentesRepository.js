const db = require('../db/db');

module.exports = {
  findAll: () => db('agentes').select('*'),
  findById: (id) => db('agentes').where({ id }).first(),
  create: (data) => db('agentes').insert(data).returning('*'),
  update: (id, data) => db('agentes').where({ id }).update(data).returning('*'),
  partialUpdate: (id, data) => db('agentes').where({ id }).update(data).returning('*'),
  remove: (id) => db('agentes').where({ id }).del(),
};
