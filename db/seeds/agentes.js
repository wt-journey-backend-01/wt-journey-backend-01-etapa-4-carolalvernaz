// db/seeds/agentes.js
exports.seed = async function (knex) {
  // Limpa na ordem segura e reseta IDs (assim agente_id 1 e 2 ficam garantidos)
  await knex.raw('TRUNCATE TABLE casos RESTART IDENTITY CASCADE');
  await knex.raw('TRUNCATE TABLE agentes RESTART IDENTITY CASCADE');

  await knex('agentes').insert([
    { nome: 'João Silva', dataDeIncorporacao: '2020-01-10', cargo: 'Delegado' },
    { nome: 'Maria Souza', dataDeIncorporacao: '2018-05-23', cargo: 'Investigadora' }
  ]);
};
