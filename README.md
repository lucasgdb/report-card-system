# Monorepo - Relay and GraphQL

## Recommendations

- Docker
- Node >= 16.x
- Yarn

## Getting started

### Development mode with Docker

- `yarn`: Installs workspace dependencies
- Don't forget to copy/paste the `.env.example` files to `.env`
- `yarn start`: Starts the project using Docker
- Open the web app at `http://localhost:8080`
- Type `yarn stop` to stop the project

### Development mode without Docker

- `yarn`: Installs workspace dependencies
- Don't forget to copy/paste the `.env.example` files to `.env`
- `yarn start:server`: Starts the server
  - An active postgres database is required
  - Alternatively, you can type `yarn start database` to start it using Docker
- `yarn start:web`: Starts the web

## Author

| [<img src="https://avatars3.githubusercontent.com/u/13838273?v=3&s=115"><br><sub>@lucasgdb</sub>](https://github.com/lucasgdb) |
| :----------------------------------------------------------------------------------------------------------------------------: |
