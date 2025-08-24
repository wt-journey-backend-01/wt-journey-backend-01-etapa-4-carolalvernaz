## Atualizar parcialmente (PATCH)

### PATCH /agentes/:id
Body:
{
  "cargo": "Delegado Chefe"
}

### PATCH /casos/:id
Body:
{
  "status": "solucionado"
}

## Usuário autenticado
### GET /auth/me
Header:
Authorization: Bearer SEU_TOKEN
Retorna:
{
  "id": 1,
  "email": "carol@teste.com"
}
