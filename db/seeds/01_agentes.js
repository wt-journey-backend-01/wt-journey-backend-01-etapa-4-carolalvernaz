exports.seed = async function (knex) {
  await knex('agentes').insert([
    { nome: 'João Silva', dataDeIncorporacao: '2020-01-10', cargo: 'Delegado' },
    { nome: 'Maria Souza', dataDeIncorporacao: '2018-05-23', cargo: 'Investigadora' }
  ]);
};
