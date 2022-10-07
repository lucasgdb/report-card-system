# Boletim Usefaz

## Requisitos

- Docker
- Node >= 16.x
- Yarn

## Iniciando

### Desenvolvimento (com Docker)

- `yarn`: Instala as dependências do projeto
- Copie o arquivo `.env.example` do `apps/server` para `.env`
- `yarn dev`: Inicia os containers do projeto
- `yarn seed`: Alimenta o banco com dados de teste
  - Executar dentro do container do servidor
  - `docker container exec -it server sh` ou `docker container exec -it server bash`
- Abra o Sistema de Boletim em `http://localhost:8080`
  - Login `12345`
  - Password `123`
- Abra o Sistema do Administrador em `http://localhost:8081`
  - Login `lucasgdbittencourt@gmail.com`
  - Password `123`
- `yarn stop`: Desliga o projeto.

## Telas do Sistema de Boletim

![](./assets/student_screens/1.png)
![](./assets/student_screens/2.png)
![](./assets/student_screens/3.png)
![](./assets/student_screens/4.png)
![](./assets/student_screens/5.png)
![](./assets/student_screens/6.png)
![](./assets/student_screens/7.png)
![](./assets/student_screens/8.png)

## Telas do Sistema do Administrador

![](./assets/admin_screens/1.png)
![](./assets/admin_screens/2.png)
![](./assets/admin_screens/3.png)
![](./assets/admin_screens/4.png)
![](./assets/admin_screens/5.png)
![](./assets/admin_screens/6.png)
![](./assets/admin_screens/7.png)
![](./assets/admin_screens/8.png)
![](./assets/admin_screens/9.png)
![](./assets/admin_screens/10.png)
![](./assets/admin_screens/11.png)

## Autor

| [<img src="https://avatars3.githubusercontent.com/u/13838273?v=3&s=115"><br><sub>@lucasgdb</sub>](https://github.com/lucasgdb) |
| :----------------------------------------------------------------------------------------------------------------------------: |
