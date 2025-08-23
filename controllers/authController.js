const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuariosRepo = require('../repositories/usuariosRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo';

async function register(req, res) {
  try {
    const { nome, email, senha } = req.body;

    // 1. Validação de campos obrigatórios
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, email, senha' });
    }

    // 2. Rejeitar campos extras
    const camposValidos = ['nome', 'email', 'senha'];
    const camposRecebidos = Object.keys(req.body);
    const camposInvalidos = camposRecebidos.filter(c => !camposValidos.includes(c));
    if (camposInvalidos.length > 0) {
      return res.status(400).json({
        error: `Campos inválidos no payload: ${camposInvalidos.join(', ')}`
      });
    }

    // 3. Validar se o email já existe
    const existente = await usuariosRepo.findByEmail(email);
    if (existente) {
      return res.status(400).json({ error: 'Email já em uso' });
    }

    // 4. Validação da senha com regex (mínimo 8 caracteres, maiúscula, minúscula, número e especial)
    const senhaValida = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!senhaValida.test(senha)) {
      return res.status(400).json({
        error: 'Senha deve ter no mínimo 8 caracteres, incluindo uma letra minúscula, uma maiúscula, um número e um caractere especial.'
      });
    }

    // 5. Criptografar senha e salvar usuário
    const hashed = await bcrypt.hash(senha, 10);
    const novo = await usuariosRepo.create({ nome, email, senha: hashed });

    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const usuario = await usuariosRepo.findByEmail(email);
    if (!usuario) return res.status(401).json({ error: 'Credenciais inválidas' });

    const valido = await bcrypt.compare(senha, usuario.senha);
    if (!valido) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ acess_token: token });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
}

async function logout(req, res) {
  res.status(200).json({ message: 'Logout realizado com sucesso' });
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const deleted = await usuariosRepo.remove(id);
    if (!deleted) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
}

module.exports = { register, login, logout, remove };
