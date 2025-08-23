const express = require('express');
const app = express();

// Importação das rotas
const casosRoutes = require('./routes/casosRoutes');
const agentesRoutes = require('./routes/agentesRoutes');
const authRoutes = require('./routes/authRoutes'); // ✅ Novo

// Middleware para aceitar JSON
app.use(express.json());

// Rotas principais
app.use('/casos', casosRoutes);
app.use('/agentes', agentesRoutes);
app.use('/auth', authRoutes); // ✅ Novo

// Rota base
app.get('/', (req, res) => {
  res.send('API do Departamento de Polícia - Etapa 4 🔐');
});

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚓`);
});
