exports.seed = async function (knex) {
  await knex('casos').insert([
    { titulo: 'Roubo no Centro', descricao: 'Roubo a joalheria', status: 'aberto', agente_id: 1 },
    { titulo: 'Sequestro na Zona Sul', descricao: 'Vítima libertada', status: 'solucionado', agente_id: 2 }
  ]);
};
  