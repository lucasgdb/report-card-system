# @usefaz/ui

Design system da Usefaz: componentes [shadcn/ui](https://ui.shadcn.com) sobre [Base UI](https://base-ui.com), Tailwind CSS v4 e os tokens da marca. Os apps (`apps/boletim`, `apps/admin`) **só compõem** estes componentes: estilo de componente fica aqui; nas páginas, apenas classes de layout (flex, grid, gap, margens, larguras).

## Estrutura

```
src/
  styles/globals.css     tokens, base, regras globais e CSS de cada app
  lib/                   utilitários (`cn`, calendário de datas comemorativas)
  hooks/                 hooks compartilhados
  components/ui/         primitivos shadcn (adicione com o CLI, abaixo)
  components/            componentes de produto, compostos só a partir de components/ui
  components/seasonal/   temas de datas comemorativas
```

Sem barrel: importe cada componente pelo caminho.

```tsx
import '@usefaz/ui/globals.css'; // uma vez, na entrada do app
import { Button } from '@usefaz/ui/components/ui/button';
import { ReportTable } from '@usefaz/ui/components/report-table';
import { cn } from '@usefaz/ui/lib/utils';
```

Novos primitivos: `pnpm dlx shadcn@latest add <componente>` dentro de `packages/ui` (estilo `base-nova`, Base UI). Confira os imports gerados.

## Convenções

- **Tokens, não cores soltas.** Use os tokens semânticos (`bg-primary`, `text-muted-foreground`, `bg-(--surface)`…). Somente tema claro. Tokens marcados como _legacy_ serão removidos.
- **`data-slot` em todo componente** (nome do arquivo em kebab-case) para estilização contextual (`has-data-[slot=…]`). Estados visuais vão em `data-state` (ex.: `image-with-loader` → `loading | loaded | error`; `grade-value` → `empty | graded | recovered`).
- **Props nativas.** Componentes de um elemento estendem `React.ComponentProps<'tag'>` e repassam `...props` por último; `className` é mesclado com `cn`.
- **Estado controlado e não controlado** quando o componente tem estado (ex.: `PasswordInput`: `visible` / `defaultVisible` / `onVisibleChange`).
- **Interação:** tudo que é clicável tem `cursor: pointer`; desabilitado tem `not-allowed` (regra global). Foco visível com `focus-visible:ring-*`. Botões: sem sombra e sem movimento — estados por cor.
- **Movimento:** `prefers-reduced-motion` reduz qualquer animação/transição a uma troca instantânea (exceto spinners).
- **Texto:** pt-BR em caixa de frase; `…` (não `...`) em placeholders e estados de carregamento; números com `Intl.NumberFormat`/`tabular-nums`; datas com `Intl.DateTimeFormat`.

## Componentes

### Primitivos (`components/ui`)

| Componente                                                                                          | Uso                                                                                                                                                                                                                     | Notas                                                                                                                                |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `button`                                                                                            | Ações. `variant`: default, secondary, outline, ghost, ghost-inverse, destructive, soft (Cancelar das confirmações), link; `size`: default, xs, sm, lg, icon, icon-xs, icon-sm, icon-lg                                  | `loading` mostra spinner, mantém o foco e anuncia "Carregando…" (`role="status"`). Para links: `nativeButton={false} render={<a />}` |
| `input`, `input-group`                                                                              | Campos de texto, com ícones/botões internos (`InputGroupAddon`, `InputGroupButton`: botão quadrado `icon-sm`, ~85% da altura do campo, cantos `rounded-md`, mesmo respiro em volta; o X nativo da busca fica escondido) | 16px no mobile (sem zoom no iOS); hover/foco com anel na cor primária                                                                |
| `field`, `label`, `checkbox`                                                                        | Rótulo, descrição e erro (`FieldError` usa `role="alert"`)                                                                                                                                                              | Rótulo de checkbox é clicável                                                                                                        |
| `dialog`, `alert-dialog`                                                                            | Modais; `AlertDialog` para confirmações destrutivas                                                                                                                                                                     | Animação de entrada/saída, botão fechar embutido, rolagem interna                                                                    |
| `dropdown-menu`, `popover`, `tooltip`, `select`                                                     | Menus, painéis e dicas                                                                                                                                                                                                  | Teclado e foco gerenciados pelo Base UI                                                                                              |
| `table`, `badge` (+ `success`, `warning`), `spinner`, `skeleton`, `avatar`, `separator`, `textarea` | —                                                                                                                                                                                                                       | —                                                                                                                                    |
| `sonner`                                                                                            | `<Toaster />` (uma vez por app) e `toast.success/error`                                                                                                                                                                 | Região `aria-live`                                                                                                                   |

### Produto (`components`)

| Componente                                                                              | Uso                                                                                                                                                  | Acessibilidade                                                                              |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `password-input`                                                                        | Senha com cadeado e mostrar/ocultar                                                                                                                  | Nome padrão = placeholder; botão "Mostrar senha" com `aria-pressed`                         |
| `rm-input`                                                                              | Nº de matrícula                                                                                                                                      | Nome padrão = placeholder; sem corretor ortográfico                                         |
| `data-table`                                                                            | Tabela com ordenação e paginação (TanStack Table)                                                                                                    | `aria-sort` nos cabeçalhos                                                                  |
| `seasonal/season-illustration`                                                          | Ilustração decorativa cujo personagem usa o acessório da data comemorativa                                                                           | `head` em pixels do tamanho intrínseco; imagem com `alt=""`                                 |
| `auth-layout`                                                                           | Login e recuperação de senha: no desktop, composição em prancheta 1440×810 escalada para a tela                                                      | Conteúdo centralizado no mobile; arte decorativa com `alt=""`                               |
| `form-alert`                                                                            | Erro do formulário inteiro (credenciais, link expirado, servidor fora)                                                                               | `role="alert"`; `tone="inverse"` sobre fundo azul                                           |
| `app-shell` (+ `AppShellBrand`, `SidebarNav`, `SidebarNavItem`, `SidebarAccountButton`) | Área logada do admin: barra lateral azul fixa no desktop, gaveta no celular (fecha ao navegar)                                                       | Link de pular para o conteúdo; `aria-current` no item ativo                                 |
| `page-header` (+ `PageContainer`)                                                       | Título, descrição e ações de uma página, com a largura e o espaçamento do conteúdo                                                                   | Um único `<h1>` por página                                                                  |
| `status-badge`                                                                          | Status de uma linha (pedido etc.): pílula suave na cor do status; `tone`: neutral, info, warning, success, destructive                               | O texto diz o status (a cor só reforça)                                                     |
| `file-dropzone`                                                                         | Escolha de um arquivo por clique ou arrastar e soltar; depois mostra o arquivo com botão de remover                                                  | Botão nativo focável; `aria-invalid` e `aria-describedby` para o erro                       |
| `spreadsheet-preview`                                                                   | Algumas linhas de uma planilha como devem estar no arquivo (rola na horizontal)                                                                      | `<th scope="col">` nos cabeçalhos                                                           |
| `app-header`                                                                            | Cabeçalho fixo com fundo translúcido (blur) e estado `condensed` ao rolar                                                                            | `<header>` como landmark; `data-state` expanded/condensed                                   |
| `report-table` (+ `grade-value`, `score-badge`, `tone-legend`, `icon-tile`)             | Boletim: colunas por bimestre, notas, recuperação e selos                                                                                            | `caption`, `scope` nos cabeçalhos, região rolável focável; a cor nunca é a única informação |
| `grade-input` (+ `parseMark`)                                                           | Campo curto de nota ou faltas (vazio = ainda não lançado; aceita "8,5" e "8.5"). Também: `EmptyValue` ("—" ou `symbol`, como "N/A") em `grade-value` | `EmptyValue` lê um rótulo para leitores de tela; o campo pede `aria-label`                  |
| `error-page`, `error-boundary`                                                          | Página de erro e fallback de renderização                                                                                                            | —                                                                                           |
| `page-loader`, `image-with-loader`, `avatar-initials`                                   | Carregamento, imagem com spinner/erro, iniciais                                                                                                      | —                                                                                           |

### Datas comemorativas (`components/seasonal`)

`SeasonProvider` (envolve o app) detecta a data em `lib/seasons.ts` — Ano Novo, Carnaval, Páscoa, Festa Junina, Dia do Estudante, Independência, Halloween e Natal —, `SeasonDecorations` desenha a camada decorativa, `SeasonAvatarAccessory` o acessório do avatar e `SeasonToggle` liga/desliga (preferência salva). Pré-visualize qualquer data com `?tema=natal` (ou `?tema=off`). Decorações são `aria-hidden`, não capturam cliques e ficam paradas com movimento reduzido.

## Erros de formulário

Dois tipos, sempre tratados do mesmo jeito:

| Tipo      | Quem detecta                                                                       | Onde aparece                                                                        |
| --------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Validação | o cliente, antes de enviar (`useFormValidation` com `required`, `email`, `sameAs`) | no campo (`FieldError`)                                                             |
| Backend   | o servidor, no payload da mutation: `error { field userMessage }`                  | no campo indicado por `field`; sem `field`, no formulário (`FormAlert`) ou em toast |

Servidor: o resolver da mutation roda dentro de `withUserErrors` e lança `new UserError(userMessage, field?)` para falhas que o usuário pode corrigir (`parseInput` faz o mesmo com os erros do Zod). `field` é o nome do campo do input da mutation. Qualquer outro erro é inesperado e chega mascarado ao cliente.

Cliente: toda mutation seleciona `error { field userMessage }` e usa `handleMutationError` (de `@usefaz/shared`) nos dois callbacks:

```tsx
const form = useFormValidation({ RM: [required('Informe seu número de matrícula.')] });

commit({
  variables: { input: values },
  onCompleted: ({ sendRequest }) => {
    if (handleMutationError(form, sendRequest?.error)) return;
    navigate('/solicitacao-enviada');
  },
  onError: (error) => handleMutationError(form, error), // rede/servidor: mensagem genérica
});

<FormAlert message={form.formError} />;
```

Fora de formulários (menus, confirmações), passe `toastErrors` (de `@usefaz/ui/lib/toast-errors`) no lugar de `form`. Para um formulário mostrar os erros gerais em toast, use `useFormValidation(schema, { formErrors: 'toast' })`.

## Scripts

```bash
pnpm --filter @usefaz/ui typecheck
```
