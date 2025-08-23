// db/seeds/usuarios.js
const bcrypt = require('bcrypt');

exports.seed = async function (knex) {
  await knex('usuarios').del();

  const senhaHash1 = await bcrypt.hash('Senha@123', 10);
  const senhaHash2 = await bcrypt.hash('Senha@456', 10);

  await knex('usuarios').insert([
    { nome: 'Carol', email: 'carol@teste.com', senha: senhaHash1 },
    { nome: 'Admin', email: 'admin@teste.com', senha: senhaHash2 }
  ]);
};
