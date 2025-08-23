// db/seeds/casos.js
exports.seed = async function (knex) {
  // (Opcional) garantir que a tabela está limpa. IDs já foram resetados no seed de agentes.
  await knex('casos').del();

  await knex('casos').insert([
    { titulo: 'Roubo no Centro', descricao: 'Roubo a joalheria', status: 'aberto', agente_id: 1 },
    { titulo: 'Sequestro na Zona Sul', descricao: 'Vítima libertada', status: 'solucionado', agente_id: 2 }
  ]);
};
