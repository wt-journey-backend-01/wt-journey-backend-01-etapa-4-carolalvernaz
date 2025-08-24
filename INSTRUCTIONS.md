## Autenticação

### Registrar usuário
POST /auth/register
Body:
{
  "nome": "Carol",
  "email": "carol@example.com",
  "senha": "Senha@123"
}

### Login
POST /auth/login
Body:
{
  "email": "carol@example.com",
  "senha": "Senha@123"
}
Resposta:
{
  "acess_token": "seu_jwt_token"
}

### Usando o token JWT para acessar rotas protegidas
Adicionar o header:
Authorization: Bearer seu_jwt_token