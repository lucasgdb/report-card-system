# Boletim Usefaz

## Requisitos

- Docker (com Compose v2)
- Node >= 26 (o pnpm baixa a versão definida em `devEngines` automaticamente)
- pnpm (`corepack enable` instala a versão definida em `package.json`)

## Estrutura

Monorepo com [pnpm workspaces](https://pnpm.io/workspaces). As versões compartilhadas ficam no `catalog` do `pnpm-workspace.yaml`.

| Pacote                 | Descrição                                                        |
| ---------------------- | ---------------------------------------------------------------- |
| `apps/server`          | API GraphQL (Hono + GraphQL Yoga + Pothos + Kysely/PostgreSQL)   |
| `apps/boletim`         | Sistema de Boletim (React + Relay + Vite)                        |
| `apps/admin`           | Sistema do Administrador (React + Relay + Vite)                  |
| `packages/ui`          | Componentes React compartilhados (Tailwind + shadcn com Base UI) |
| `packages/relay`       | Environment do Relay                                             |
| `packages/shared`      | Utilitários compartilhados entre front-end e servidor            |
| `packages/vite-config` | Configuração do Vite usada pelos apps                            |

## Iniciando

### Desenvolvimento (com Docker)

- `pnpm install`: Instala as dependências do projeto
- Copie o arquivo `.env.example` do `apps/server` para `.env`
- `pnpm dev`: Inicia os containers do projeto
  - Se a porta 3000 estiver ocupada, use `SERVER_PORT=3010 pnpm dev`: a API sobe na 3010 e os apps passam a chamá-la lá
- `pnpm db:reset`: Recria o banco do zero e alimenta com dados de teste (só em desenvolvimento)
- Abra o Sistema de Boletim em `http://localhost:8080`
  - RM `12345`
  - Senha `usefaz123`
- Abra o Sistema do Administrador em `http://localhost:8081`
  - E-mail `lucasgdbittencourt@gmail.com`
  - Senha `usefaz123`
- `pnpm stop`: Desliga o projeto.

E-mails (links de redefinição de senha) saem pelo SMTP do Gmail. Para testar sem enviar nada, use `MAIL_DRIVER=log` no `.env` do servidor: o e-mail, com o link, aparece no log (`docker logs server`).

### Scripts

- `pnpm lint` / `pnpm lint:fix`: Lint e formatação com [Biome](https://biomejs.dev)
- `pnpm typecheck`: Gera os artefatos do Relay e checa os tipos de todos os pacotes
- `pnpm build`: Gera o build de produção de todos os apps

No servidor (`pnpm --filter @usefaz/server <script>`, ou `docker compose exec server pnpm <script>`):

- `migrate` / `rollback`: Aplica as migrations pendentes / desfaz a última
- `db:types`: Gera os tipos do Kysely (`src/database/types.ts`) a partir do banco, depois de uma migration
- `db:reset`: Recria o banco com os dados de teste (só em desenvolvimento)

### Servidor

- **Sessão**: cookie `httpOnly` com um token opaco (só o hash fica no banco), um por app (`X-Usefaz-App`). Senhas com argon2id.
- **GraphQL**: só aceita persisted queries em produção. O `relay-compiler` de cada app grava as operações em `apps/server/persisted-operations/`; rode `pnpm relay` depois de mudar uma query ou mutation.
- **Erros**: falhas que o usuário pode corrigir voltam como dado (`error { field userMessage }`); veja `packages/ui/README.md`.
- **Uploads**: avatares no `public/` do servidor (`STORAGE_DRIVER=local`) ou num bucket S3 (`STORAGE_DRIVER=s3` e as variáveis `S3_*`).

## Telas do Sistema de Boletim

### Login

<p align="center">
  <img src="./assets/screens/desktop-login.webp" alt="Login do boletim: o aluno entra com o número de matrícula e a senha" width="100%">
</p>

### Página inicial

<p align="center">
  <img src="./assets/screens/desktop-home.webp" alt="Página inicial do boletim: perfil do aluno e boletim escolar" width="100%">
</p>

### Outras telas

<table>
  <tr>
    <td width="50%" valign="top"><img src="./assets/screens/desktop-report-card.webp" alt="Boletim com notas, faltas e médias" width="100%"><br><sub>Boletim com notas, faltas e médias</sub></td>
    <td width="50%" valign="top"><img src="./assets/screens/desktop-avatar-dialog.webp" alt="Foto de perfil" width="100%"><br><sub>Foto de perfil</sub></td>
  </tr>
  <tr>
    <td width="50%" valign="top"><img src="./assets/screens/desktop-login-error.webp" alt="Erro do servidor no formulário" width="100%"><br><sub>Erro do servidor no formulário</sub></td>
    <td width="50%" valign="top"><img src="./assets/screens/desktop-forgot-password.webp" alt="Recuperação de senha" width="100%"><br><sub>Recuperação de senha</sub></td>
  </tr>
  <tr>
    <td width="50%" valign="top"><img src="./assets/screens/desktop-offline.webp" alt="Modo offline (PWA) com a última cópia salva" width="100%"><br><sub>Modo offline (PWA) com a última cópia salva</sub></td>
    <td width="50%" valign="top"><img src="./assets/screens/desktop-season-christmas.webp" alt="Tema de Natal" width="100%"><br><sub>Tema de Natal</sub></td>
  </tr>
</table>

Datas comemorativas (Natal, Halloween, Páscoa, Festa Junina, entre outras) decoram o boletim e a foto do aluno. Para ver um tema fora da época, use `?tema=natal` (ou `?tema=off` para desligar).

### Celular

<table>
  <tr>
    <td width="25%" valign="top" align="center"><img src="./assets/screens/mobile-login.webp" alt="Login" width="100%"><br><sub>Login</sub></td>
    <td width="25%" valign="top" align="center"><img src="./assets/screens/mobile-home.webp" alt="Perfil" width="100%"><br><sub>Perfil</sub></td>
    <td width="25%" valign="top" align="center"><img src="./assets/screens/mobile-report-card.webp" alt="Boletim" width="100%"><br><sub>Boletim</sub></td>
    <td width="25%" valign="top" align="center"><img src="./assets/screens/mobile-season-christmas.webp" alt="Tema de Natal" width="100%"><br><sub>Tema de Natal</sub></td>
  </tr>
</table>

## Autor

| [<img src="https://avatars3.githubusercontent.com/u/13838273?v=3&s=115"><br><sub>@lucasgdb</sub>](https://github.com/lucasgdb) |
| :----------------------------------------------------------------------------------------------------------------------------: |
