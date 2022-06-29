# Boletim Usefaz

## Recomendações

- Docker
- Node >= 16.x
- Yarn

## Iniciando

### Desenvolvimento (com Docker)

- `yarn`: Instala as dependências do projeto
- Copie o arquivo `.env.example` do `apps/server` para `.env`
- `yarn start`: Inicia os containers do projeto
- `yarn seed`: Alimenta o banco com dados de teste
  - Executar dentro do container do servidor
  - `docker container exec -it server sh` ou `docker container exec -it server bash`
- Abra o Sistema de Boletim em `http://localhost:8080`
- Abra o Sistema do Administrador em `http://localhost:8081`
- `yarn stop`: Desliga o projeto.

## Autor

| [<img src="https://avatars3.githubusercontent.com/u/13838273?v=3&s=115"><br><sub>@lucasgdb</sub>](https://github.com/lucasgdb) |
| :----------------------------------------------------------------------------------------------------------------------------: |
