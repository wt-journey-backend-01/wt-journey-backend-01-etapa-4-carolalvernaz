# Instruções para Rodar o Projeto - Etapa 3

## Subir o banco de dados com Docker
docker-compose up -d

## Executar migrations
npx knex migrate:latest

## Rodar seeds
npx knex seed:run
