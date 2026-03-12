# 🏛️ Portal – Congresso Nacional APAE Brasil 2026

Site oficial do Congresso Nacional APAE Brasil 2026, desenvolvido com **React + Vite + TanStack Router**, integrado à plataforma **TOTVS Fluig** como backend.

---

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Datasets Fluig Utilizados](#datasets-fluig-utilizados)
- [Formulários Fluig Utilizados](#formulários-fluig-utilizados)
- [Rotas](#rotas)
- [Componentes](#componentes)
- [Serviços](#serviços)
- [Hooks](#hooks)
- [Contexto de Autenticação](#contexto-de-autenticação)
- [Tipos](#tipos)
- [Utilitários](#utilitários)
- [Constantes](#constantes)
- [Deploy](#deploy)
- [Regras e Convenções](#regras-e-convenções)
- [Autenticação e Segurança](#autenticação-e-segurança)

---

## Visão Geral

O portal é composto por:
- **Área pública**: landing page, programação de palestras, palestrantes, galeria e inscrição.
- **Área autenticada (Painel)**: gerenciamento de dados cadastrais, compra de ingressos/lotes, seleção de atividades e histórico de compras.

O backend é 100% baseado no **TOTVS Fluig**, usando datasets e formulários (cards) da plataforma. A autenticação é feita por CPF + senha (hash SHA-256), com token JWT gerenciado via cookies.

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| React 19 | UI |
| Vite 7 | Bundler / Dev server |
| TypeScript 5.9 | Tipagem estática |
| TanStack Router v1 | Roteamento com file-based routing |
| TanStack Query v4 | Cache e fetching assíncrono |
| Tailwind CSS v4 | Estilização |
| Radix UI | Componentes acessíveis (Dialog, Select, Label…) |
| React Hook Form + Zod | Formulários com validação |
| Axios | Requisições HTTP |
| OAuth 1.0a (oauth-1.0a) | Autenticação com Fluig em desenvolvimento |
| CryptoJS | HMAC-SHA1 para OAuth e AES para transporte de senha |
| date-fns | Manipulação de datas |
| Embla Carousel | Carrossel de patrocinadores |
| Framer Motion | Animações |
| Sonner | Notificações toast |
| Material UI (Autocomplete) | Autocomplete de APAEs |
| Lucide React | Ícones |

---

## Estrutura do Projeto

```
site congresso prod/
├── public/                     # Assets estáticos (logo, imagens de fundo)
├── proxy.php                   # Proxy PHP para produção (OAuth + cURL → Fluig)
├── .htaccess                   # Redireciona para index.html (SPA) e gerencia PHP
├── vite.config.ts              # Config do Vite (proxy dev, alias @, TanStack Router)
├── src/
│   ├── main.tsx                # Entry point React
│   ├── root.tsx                # Layout raiz com QueryClient e AuthProvider
│   ├── index.css               # CSS global + design tokens
│   ├── routeTree.gen.ts        # Árvore de rotas gerada automaticamente (não editar)
│   ├── routes/                 # Rotas (file-based routing)
│   │   ├── __root.tsx          # Rota raiz
│   │   ├── index.tsx           # Home (/)
│   │   ├── login.tsx           # Login (/login)
│   │   ├── inscricao.tsx       # Inscrição (/inscricao)
│   │   ├── palestrantes.tsx    # Palestrantes (/palestrantes)
│   │   ├── palestras.tsx       # Programação (/palestras)
│   │   ├── galeria.tsx         # Galeria (/galeria)
│   │   ├── quem-somos.tsx      # Sobre (/quem-somos)
│   │   ├── recuperar-senha.tsx # Recuperação de senha
│   │   ├── not-found.tsx       # 404
│   │   ├── sub-trabalho.tsx    # Subtrabalho
│   │   ├── _authenticated.tsx  # Layout guard (valida token antes de renderizar filhos)
│   │   └── _authenticated/
│   │       ├── painel.tsx          # Shell do painel com nav lateral
│   │       ├── painel.evento.tsx   # Compra de eventos/lotes + seleção de atividades
│   │       ├── painel.data.tsx     # Edição de dados cadastrais
│   │       ├── painel.historico.tsx # Histórico de compras
│   │       └── painel.ingresso.tsx  # Visualização do ingresso
│   ├── components/             # Componentes UI reutilizáveis
│   ├── services/               # Camada de serviços (API, OAuth, parser)
│   ├── hooks/                  # Hooks customizados
│   ├── context/                # Contextos React
│   ├── types/                  # Interfaces e tipos TypeScript
│   ├── constants/              # Dados estáticos (opções de formulário, navegação)
│   ├── utils/                  # Funções utilitárias
│   └── lib/                    # Utilitários de cookies e outros
```

---

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz com as seguintes variáveis:

```env
# IDs dos formulários (cards) no Fluig
VITE_FORM_PARTICIPANTE=210890          # Formulário de participantes
VITE_FORM_PALESTRANT=211031            # Formulário de palestrantes
VITE_FORM_EVENTO=211985                # Formulário de eventos
VITE_FORM_LOTES=211007                 # Formulário de lotes/ingressos
VITE_FORM_ATIVIDADE=210934             # Formulário de atividades
VITE_FORM_VINCULO_PALESTRANTE_ATIVIDADE=211042  # Formulário de vínculo palestrante-atividade
VITE_FORM_PARCEIROS=212003             # Formulário de parceiros/patrocinadores

# IDs dos datasets no Fluig
VITE_DATASET_ATIVIDADE=cadAtividadeCN
VITE_DATASET_VINCULO_PALESTRA_ATIVIDADE=vincPalestraAtividadeCN
VITE_DATASET_EVENTO=cadEventCN
VITE_DATASET_LOTE=cadLoteCN
VITE_DATASET_PARTICIPANTE=cadParticipanteCN

# Datasets de autenticação
VITE_DATASET_DS_LOGIN=dsLogin
VITE_DATASET_DS_VALIDATE_TOKEN=dsValidateToken

# Credenciais OAuth 1.0a para uso em desenvolvimento
VITE_CONSUMER_KEY_BASE_TESTE=API_Key
VITE_CONSUMER_SECRET_BASE_TESTE=api_secret
VITE_ACCESS_TOKEN_BASE_TESTE=<access_token>
VITE_TOKEN_SECRET_BASE_TESTE=<token_secret>

# URLs base do Fluig
VITE_BASE_URL_TESTE=https://federacaonacional201538.fluig.cloudtotvs.com.br
VITE_BASE_URL_PROD=https://federacaonacional130419.fluig.cloudtotvs.com.br
```

> ⚠️ **Nunca comite o `.env.local` no repositório.** Ele está no `.gitignore`.

---

## Datasets Fluig Utilizados

Datasets são endpoints de leitura somente no Fluig, acessados via `/dataset/api/v2/dataset-handle/search`.

| Dataset ID | Descrição | Campos Principais |
|---|---|---|
| `cadAtividadeCN` | Catálogo de atividades/palestras do congresso | `documentid`, `titulo`, `descricao`, `sala`, `eixo`, `hora_inicio`, `hora_fim`, `data_inicio`, `data_fim`, `id_lote`, `vagas_disponiveis` |
| `vincPalestraAtividadeCN` | Vínculo entre palestrantes e atividades | `id_atividade`, `id_palestrante`, `palestrante`, `atividade`, `id_evento` |
| `cadEventCN` | Dados do evento principal | `titulo`, `descricao`, `data_inicio`, `data_fim`, `hora_inicio`, `hora_fim`, `local`, `local_evento`, `cidade`, `estado`, `cep`, `endereco` |
| `cadLoteCN` | Lotes de ingressos disponíveis | `nome`, `descricao`, `preco`, `quantidade`, `maximo_compra`, `minimo_compra`, `data_inicio_vendas`, `data_fim_vendas`, `publico_privado`, `id_evento` |
| `cadParticipanteCN` | Participantes cadastrados | `cpf`, `nome`, `sobrenome`, `email`, `atividades`, `status`, `documentid` |
| `dsLogin` | Dataset de autenticação — recebe `cpf\|senha_hash` e retorna token | `token`, `nome`, `email`, `apae_filiada`, `atividades`, `documentid`, etc. |
| `dsValidateToken` | Valida token JWT, retorna dados do usuário logado | `status`, `exp`, `documentid`, `nome`, `atividades`, etc. |
| `cadPalestranteCN` | Palestrantes cadastrados | `nome`, `descricao`, `email`, `eixo`, `empresa_faculdade`, `url_foto`, `linkedin`, `instagram`, `id_evento` |
| `dsConsultaApaesFeapaes` | Consulta APAEs cadastradas (usada no autocomplete da inscrição) | `firstName` (nome da APAE), `lastname` (UF) |
| `dsConsultaCpfCadastrado` | Verifica se CPF já existe e pré-preenche nome | `nome`, `data_nascimento` |
| `pagCN` | Dataset de processamento de pagamento | `status`, `init_point`, `ref_id` |

### Constraints de Dataset

A função `fetchDataset` aceita constraints do tipo:

```ts
{
  fieldName: string;
  initialValue: string | number | boolean;
  finalValue?: string | number | boolean;
  constraintType?: "MUST" | "SHOULD" | "MUST_NOT";
}
```

---

## Formulários Fluig Utilizados

Formulários (card index) são endpoints de escrita no Fluig, acessados via `/ecm-forms/api/v2/cardindex/{documentId}/cards`.

| Form ID | Variável de Ambiente | Uso |
|---|---|---|
| `210890` | `VITE_FORM_PARTICIPANTE` | Criar (`POST`) e atualizar (`PUT`) cadastro de participantes |
| `211031` | `VITE_FORM_PALESTRANT` | Cadastro de palestrantes |
| `211985` | `VITE_FORM_EVENTO` | Cadastro de eventos |
| `211007` | `VITE_FORM_LOTES` | Lotes de ingressos (lido via `GET` no `useLotes`) |
| `210934` | `VITE_FORM_ATIVIDADE` | Atividades do congresso |
| `211042` | `VITE_FORM_VINCULO_PALESTRANTE_ATIVIDADE` | Vínculos palestrante-atividade |
| `212003` | `VITE_FORM_PARCEIROS` | Patrocinadores/parceiros |

---

## Rotas

A aplicação usa **TanStack Router v1** com file-based routing. A árvore é gerada automaticamente em `routeTree.gen.ts`.

### Rotas Públicas

| Caminho | Arquivo | Descrição |
|---|---|---|
| `/` | `routes/index.tsx` | Landing page com hero, patrocinadores, palestrantes, programação, galeria e CTA |
| `/login` | `routes/login.tsx` | Tela de login (CPF + senha). Redireciona para `/painel` se já autenticado |
| `/inscricao` | `routes/inscricao.tsx` | Formulário completo de inscrição com validação Zod |
| `/palestras` | `routes/palestras.tsx` | Programação completa filtrada por data e eixo/categoria |
| `/palestrantes` | `routes/palestrantes.tsx` | Lista de palestrantes com filtro por eixo |
| `/galeria` | `routes/galeria.tsx` | Galeria de fotos do evento |
| `/quem-somos` | `routes/quem-somos.tsx` | Página institucional sobre a APAE |
| `/recuperar-senha` | `routes/recuperar-senha.tsx` | Recuperação de senha |

### Rotas Autenticadas

Todas protegidas pelo guard `_authenticated.tsx` que valida o token via `dsValidateToken` antes de renderizar.

| Caminho | Arquivo | Descrição |
|---|---|---|
| `/painel` | `_authenticated/painel.tsx` | Shell do painel com header e menu lateral. Redireciona `/painel` → `/painel/evento` |
| `/painel/evento` | `_authenticated/painel.evento.tsx` | Lista de lotes para compra + seleção de atividades por data/eixo |
| `/painel/data` | `_authenticated/painel.data.tsx` | Visualização e edição dos dados cadastrais do participante |
| `/painel/historico` | `_authenticated/painel.historico.tsx` | Histórico de compras (em desenvolvimento) |
| `/painel/ingresso` | `_authenticated/painel.ingresso.tsx` | Visualização do ingresso digital do participante |

### Guard de Autenticação (`_authenticated.tsx`)

O `beforeLoad` executa antes de qualquer rota filha:
1. Lê cookies `token` e `tokenExp`
2. Se não houver token → redireciona para `/login`
3. Se token expirado → limpa cookies e redireciona
4. Valida o token no dataset `dsValidateToken`
5. Se `status !== "SUCCESS"` → limpa cookies e redireciona

---

## Componentes

### Componentes de Layout

| Componente | Arquivo | Descrição |
|---|---|---|
| `Header` | `components/header.tsx` | Header principal com logo, nav e ações (login/painel) |
| `HeaderNav` | `components/header-nav.tsx` | Links de navegação do header |
| `HeaderActions` | `components/header-actions.tsx` | Botões de ação (Login/Painel) no header |
| `HeaderMobileMenu` | `components/header-mobile-menu.tsx` | Menu hamburguer para mobile |
| `Footer` | `components/footer.tsx` | Rodapé com links e informações de contato |

### Componentes da Landing Page

| Componente | Arquivo | Descrição |
|---|---|---|
| `Hero` | `components/hero.tsx` | Seção hero com título, data/local do evento e CTA |
| `SponsorsSection` | `components/sponsor-section.tsx` | Carrossel de patrocinadores usando Embla Carousel |
| `SpeakersSection` | `components/speakers-section.tsx` | Grid de palestrantes em destaque |
| `FeaturedSchedule` | `components/featured-schedule.tsx` | Prévia da programação (atividades em destaque) |
| `GallerySection` | `components/galery.tsx` | Galeria de imagens do evento |
| `CTASection` | `components/cta-section.tsx` | Call-to-action de inscrição |
| `About` | `components/about.tsx` | Seção "Sobre" |
| `EventInfoSection` | `components/event-info-section.tsx` | Informações do evento (data, local, etc.) |

### Componentes do Painel

#### Evento (`components/painel/evento/`)

| Componente | Arquivo | Descrição |
|---|---|---|
| `AvailableEvents` | `available-events.tsx` | Lista de lotes/eventos disponíveis para compra |
| `EventDetails` | `event-details.tsx` | Detalhes do lote selecionado com programação de atividades, filtros de data/eixo e botão de pagamento |

#### Dados (`components/painel/data/`)

| Componente | Arquivo | Descrição |
|---|---|---|
| `PersonalDataSection` | `form-sections.tsx` | Seção de dados pessoais (nome, nascimento, escolaridade, camisa) |
| `ApaeDataSection` | `form-sections.tsx` | Seção de dados da APAE (filiada, presidente, função, coordenação) |
| `ContactDataSection` | `form-sections.tsx` | Seção de contato (email, telefone, whatsapp) |
| `AddressDataSection` | `form-sections.tsx` | Seção de endereço (CEP, UF, município) |
| `AccessibilitySection` | `form-sections.tsx` | Seção de acessibilidade (deficiência, apoio especial) |

#### Histórico (`components/painel/historico/`)

| Componente | Arquivo | Descrição |
|---|---|---|
| `OrderCard` | `order-card.tsx` | Card individual de uma compra no histórico |

#### Ticket/Ingresso

| Componente | Arquivo | Descrição |
|---|---|---|
| `TicketCard` | `components/painel/ticket-card.tsx` | Ingresso digital com nome, CPF e número de inscrição |
| `PendingTicket` | `components/painel/pending-ticket.tsx` | Estado de ingresso pendente/aguardando pagamento |

### Componentes de Registro

| Componente | Arquivo | Descrição |
|---|---|---|
| `RegistrationFormFields` | `components/registration/registration-form-fields.tsx` | Campos do formulário de inscrição reutilizáveis |
| `RegistrationInfo` | `components/registration/registration-info.tsx` | Informações sobre o processo de inscrição |
| `RegistrationSuccess` | `components/registration/registration-success.tsx` | Tela de sucesso após inscrição |

### Componentes Gerais

| Componente | Arquivo | Descrição |
|---|---|---|
| `SwitchChoiceCard` | `components/switch-choice-event-card.tsx` | Card de atividade com toggle switch para marcar presença. Atualiza `user.atividades` via `updateUser` |
| `MultiSelectCommand` | `components/multi-select-command.tsx` | Multiselect com busca para seleção de atividades na inscrição |
| `EmptyState` | `components/empty-state.tsx` | Estado vazio com ícone e mensagem customizáveis |
| `LoadingScreen` | `components/loading.tsx` | Tela de carregamento (usada como `pendingComponent` nas rotas) |
| `PurchaseStep` | `components/purchase-step.tsx` | Passo pós-inscrição indicando conclusão |
| `SkeletonCard` | `components/skelton-card.tsx` | Skeleton loader para cards de atividade |
| `StepCard` | `components/step-card.tsx` | Card de etapa do processo |
| `SuccessHeader` | `components/success-header.tsx` | Header da tela de sucesso |

---

## Serviços

### `src/services/api-root.ts`

Instância central do Axios configurada para autenticação **OAuth 1.0a**.

**Funções e lógica:**
- `getBaseURL()` — Em `DEV`, retorna `""` (o Vite Proxy intercepta). Em produção, retorna `https://<hostinger>/proxy.php`.
- **Interceptor de requisição** — Em `DEV`: injeta o header `Authorization: OAuth ...` calculado via `oauth-1.0a` + `CryptoJS.HmacSHA1`. Em produção: reescreve a URL para `proxy.php?endpoint=<path>&method=<METHOD>`.
- **Interceptor de resposta** — Loga erros de rede com informações contextuais de ambiente.

### `src/services/fetch-dataset.ts`

```ts
fetchDataset<T>({ datasetId, offset?, limit?, constraints? }): Promise<{ items: T[]; hasNext: boolean }>
```

Busca registros de um dataset do Fluig via `GET /dataset/api/v2/dataset-handle/search`. Suporta paginação e constraints de filtro. Retorna `{ items: [], hasNext: false }` em caso de erro.

### `src/services/form-service.ts`

CRUD de cards (formulários) no Fluig.

| Função | Método HTTP | Endpoint | Descrição |
|---|---|---|---|
| `handlePostFormParticipant({ documentId, values })` | `POST` | `/ecm-forms/api/v2/cardindex/{documentId}/cards` | Cria novo card (nova inscrição) |
| `handleGetFormParticipant({ documentId, queryParams? })` | `GET` | `/ecm-forms/api/v2/cardindex/{documentId}/cards` | Lista cards com filtro opcional |
| `handleUpdateFormParticipant({ documentId, cardId, values })` | `PUT` | `/ecm-forms/api/v2/cardindex/{documentId}/cards/{cardId}` | Atualiza card existente |

O parâmetro `values` é do tipo `{ fieldId: string; value: string | null }[]` — array de campos com valores.

**Re-exports para retrocompatibilidade:** `parsePalestrante`, `parsePalestranteCard`, `parseEventoCard`, `parseLoteCard`, `parseAtividadeCard`.

### `src/services/fluig-parser.ts`

```ts
parseFluigCard<T>(card: FluigCardRaw): T
parseFluigEntity<T>(card: FluigCardRaw): FluigEntity<T>
```

Converte a estrutura bruta de um card Fluig (`values: [{ fieldId, value }]`) em um objeto JavaScript tipado com chaves diretas. `parseFluigEntity` adiciona metadados do card (`cardId`, `version`, etc.).

### `src/services/crypto-service.ts`

```ts
SecurityService.encryptForTransport(password: string): string
```

Criptografa uma string via **AES-ECB com PKCS7 padding** usando os primeiros 32 caracteres do `VITE_ACCESS_TOKEN_BASE_TESTE` como chave. Retorna Base64. (Usado para transporte seguro de senha quando necessário.)

### `src/services/cep.ts`

```ts
fetchCep(cep: string): Promise<{ uf, localidade, ... }>
```

Consulta a API pública **ViaCEP** para preencher automaticamente UF e município a partir do CEP digitado na inscrição.

---

## Hooks

### `useAuth()` (via `AuthContext`)

Hook principal de autenticação. Retorna:
- `user: User | null` — dados do usuário logado
- `isAuthenticated: boolean`
- `isLoading: boolean`
- `login(cpf, pass): Promise<void>` — realiza login
- `logout(): void` — limpa cookies e deautentica
- `updateUser(data: Partial<User>): void` — atualiza dados do usuário in-memory

### `useLotes()`

```ts
const { formatedDataLote } = useLotes();
```

Busca lotes de ingressos via `handleGetFormParticipant` (formulário `VITE_FORM_LOTES`) e parseia via `parseLoteCard`. Cache com React Query (`queryKey: ["lotes_evento"]`).

### `useEvents()`

```ts
const { formatedDataEvento, isLoading } = useEvents();
```

Busca dados do evento principal via `handleGetFormParticipant` (formulário `VITE_FORM_EVENTO`) e parseia via `parseEventoCard`. Cache com React Query (`queryKey: ["evento_congresso"]`).

### `useAtividade(id_lote?: string)`

```ts
const { atividades } = useAtividade(id_lote);
```

Busca atividades do dataset `cadAtividadeCN`. Se `id_lote` for informado, filtra pelo constraint `id_lote = MUST`. Cache com React Query (`queryKey: ["evento_atividade"]`).

### `usePalestrantes(event_id?: string)`

```ts
const { palestrantes } = usePalestrantes(event_id);
```

Busca palestrantes do dataset `cadPalestranteCN`. Se `event_id` for informado, filtra por `id_evento`. Cache com React Query (`queryKey: ["palestrantes"]`).

### `useVinculo()`

```ts
const { vinculo } = useVinculo();
```

Busca todos os vínculos palestrante-atividade do dataset `vincPalestraAtividadeCN`. Cache com React Query (`queryKey: ["vincPalestraAtividadeCN"]`).

---

## Contexto de Autenticação

### `AuthProvider` (`src/context/auth-context.tsx`)

Gerencia o estado global de autenticação.

**Fluxo de `login(cpf, pass)`:**
1. Gera hash SHA-256 da senha.
2. Chama dataset `dsLogin` com constraint `ref_id = cpf|hash`.
3. Se retornar token válido, valida com `dsValidateToken`.
4. Se `status === "SUCCESS"`, armazena token em cookie (`setAuthCookie`) e popula `user` no estado.

**`updateUser(data: Partial<User>)`:**
Atualiza campos específicos do usuário no estado in-memory sem chamada API (a persistência é feita separadamente via `handleUpdateFormParticipant`).

**`logout()`:**
Chama `clearAuthCookies()` e define `isAuthenticated = false`.

**Verificação de sessão (mount):**
No `useEffect`, verifica cookies `token` e `tokenExp`. Se token expirado ou ausente, limpa os cookies.

---

## Tipos

### `src/types/user.tsx` — `User`

```ts
interface User {
  cpf, nome, sobrenome, email, data_nascimento,
  uf, municipio, telefone, whatsapp, escolaridade,
  apaeFiliada, inscricao, dataInscricao, tamanho_camiseta,
  documentid, presidente_apae, cep, funcao, area_atuacao,
  possui_deficiencia, necessita_apoio, coordenacao,
  atividades: string[]  // Array de IDs de atividades selecionadas
}
```

### `src/types/entities.types.ts`

| Interface | Descrição |
|---|---|
| `PalestranteFields` | Dados de um palestrante (nome, email, eixo, foto, redes sociais) |
| `EventoFields` | Dados do evento (datas, local, endereço) |
| `LoteFields` | Dados de um lote de ingresso (nome, preço, datas de venda) |
| `ActivityFields` | Dados de uma atividade (título, sala, eixo, horários, palestrantes vinculados) |

### `src/types/fluig.types.ts`

| Interface | Descrição |
|---|---|
| `FluigCardField` | `{ fieldId: string; value: string \| null }` — campo de um form card |
| `FluigCardRaw` | Estrutura bruta de um card Fluig (antes do parse) |
| `FluigCardsResponse` | `{ items: FluigCardRaw[]; hasNext: boolean }` |
| `FluigEntity<T>` | Card parseado com campos tipados em `fields: T` |
| `FluigPostResponse` | Resposta de criação/atualização de card |
| `SendFormData` | Parâmetros para as funções CRUD do `form-service` |

### `src/types/login-response.tsx` — `LoginResponseProps`

Retorno do dataset `dsLogin` (token, nome, email, documentid, atividades, etc.).

### `src/types/token.tsx` — `TokenProps`

Retorno do dataset `dsValidateToken` (status, exp, documentid, campos de usuário).

### `src/types/payment-type.tsx` — `Payment`

Dados de retorno do processamento de pagamento (`status`, `init_point`).

---

## Utilitários

| Arquivo | Função | Descrição |
|---|---|---|
| `utils/format-cpf.ts` | `formatCPF(value)` | Formata string como CPF: `000.000.000-00` |
| `utils/format-phone.ts` | `formatPhone(value)` | Formata como telefone: `(00) 00000-0000` |
| `utils/format-cep.ts` | `formatCEP(value)` | Formata como CEP: `00000-000` |
| `utils/hash-pass.tsx` | `sha256(text)` | Hash SHA-256 assíncrono via Web Crypto API |
| `utils/formatThreeDayRange.ts` | `formatThreeDayRange(...)` | Formata intervalo de datas para exibição |

---

## Constantes

| Arquivo | Exportação | Descrição |
|---|---|---|
| `constants/navigation.ts` | `navItems` | Links de navegação do header (`/quem-somos`, `/palestrantes`, `/palestras`, `/galeria`) |
| `constants/form-options.ts` | `escolaridades`, `estados`, `tamanhosCamisa` | Opções dos selects do formulário de inscrição |
| `constants/disability-options.ts` | `DISABILITY_OPTIONS` | Opções de tipos de deficiência |
| `constants/steps.tsx` | `steps` | Etapas do processo de inscrição |
| `constants/gallery-data.ts` | `galleryData` | Dados das imagens da galeria |
| `constants/index.ts` | Re-exports | Barrel de todos os constants |

---

## Deploy

### Ambiente de Desenvolvimento

```bash
npm install
npm run dev
# Servidor em http://localhost:5125
```

O Vite Proxy redireciona automaticamente os seguintes prefixos para o Fluig de teste (`federacaonacional201538`):
- `/dataset/api` → Fluig
- `/ecm-forms` → Fluig
- `/api/public` → Fluig
- `/collaboration` → Fluig
- `/process-management/api` → Fluig
- `/content-management/api` → Fluig

Em DEV, o OAuth 1.0a é calculado no frontend pelo interceptor do Axios.

### Build de Produção

```bash
npm run build
# Gera os arquivos em /dist
```

### Deploy em Produção (Hostinger)

O site é hospedado em **Hostinger** com PHP disponível.

**Fluxo em produção:**
1. O frontend faz requisições para `proxy.php?endpoint=<path>&method=<METHOD>`.
2. O `proxy.php` assina a requisição com **OAuth 1.0a via HMAC-SHA1** (usando cURL) e encaminha para o Fluig de produção (`federacaonacional201538`).
3. O `.htaccess` garante que todas as rotas SPA redirecionem para `index.html`, e libera o `proxy.php` como exceção.

**Passos para deploy:**
1. Executar `npm run build` localmente.
2. Fazer upload do conteúdo da pasta `/dist` e do `proxy.php` para a raiz do domínio na Hostinger.
3. O `.htaccess` já está configurado para SPA + proxy PHP.

> ⚠️ As credenciais OAuth no `proxy.php` são hardcoded. Em ambiente de produção, considere movê-las para variáveis de ambiente PHP (`.env` no servidor).

---

## Regras e Convenções

### Estrutura de Rotas

- Rotas públicas ficam diretamente em `src/routes/`.
- Rotas autenticadas ficam em `src/routes/_authenticated/` e são protegidas pelo layout guard `_authenticated.tsx`.
- A árvore `routeTree.gen.ts` é **gerada automaticamente** pelo plugin TanStack Router — nunca edite manualmente.
- O painel redireciona `/painel` → `/painel/evento` automaticamente.

### Dados e API

- **Todo acesso ao Fluig passa por `axiosApi`** (definido em `api-root.ts`). Nunca use `fetch` ou outro axios direto.
- **Datasets (leitura)** → `fetchDataset()`.
- **Formulários/Cards (escrita/leitura paginada)** → funções de `form-service.ts`.
- O campo `values` ao atualizar um card deve ser sempre um array de `{ fieldId, value }`.
- O campo **`atividades`** no formulário Fluig é armazenado como JSON string (`JSON.stringify(array)`), mas no estado React (`User.atividades`) é um `string[]`.

### Autenticação e Sessão

- O token de sessão é armazenado em **cookie** (não localStorage) com data de expiração.
- O `AuthContext` valida o cookie no mount. Se expirado, limpa e desautentica.
- O guard `_authenticated.tsx` faz **dupla validação**: cookie local + chamada ao `dsValidateToken`.

### Atualização de Atividades

Quando o usuário seleciona/desseleciona uma atividade no painel:
1. `SwitchChoiceCard.handleToggle` calcula o novo array e chama `updateUser({ atividades: novas })` (atualização local imediata).
2. `painel.evento.tsx` — `handleToggleAtividade` persiste no Fluig via `handleUpdateFormParticipant` com `values: [{ fieldId: "atividades", value: JSON.stringify(novasAtividades) }]`.

### Formulários

- Todos os formulários usam **React Hook Form + Zod** para validação.
- CPF é formatado com máscara (`formatCPF`) e validado com 11 dígitos.
- Telefone/WhatsApp são formatados com `formatPhone`.
- CEP consulta a API ViaCEP no `onBlur` para auto-preenchimento de UF e município.
- Senha é hasheada com **SHA-256** antes de enviar para o Fluig.

### TypeScript

- Prefira usar os tipos definidos em `src/types/` em vez de `any`.
- O `FluigCardRaw` usa `any` internamente no parser — isso é intencional para flexibilidade genérica.
- `SendFormData.values` aceita `{ fieldId, value }[]` **ou** `string` para compatibilidade com casos legados.

---

## Autenticação e Segurança

### OAuth 1.0a

Todas as requisições para o Fluig exigem autenticação **OAuth 1.0a com HMAC-SHA1**:
- **Em desenvolvimento**: o interceptor do Axios calcula e injeta o header `Authorization: OAuth ...` dinamicamente.
- **Em produção**: o `proxy.php` calcula a assinatura OAuth no servidor e usa cURL para encaminhar.

### Senha do Usuário

1. No **cadastro**: a senha é hasheada com `SHA-256` no browser e enviada ao Fluig.
2. No **login**: a senha é hasheada com `SHA-256` e concatenada com o CPF (`cpf|hash`), enviada como constraint para o `dsLogin`.
3. O `SecurityService.encryptForTransport` oferece criptografia AES adicional quando necessário.

### Cookies de Sessão

- Cookie `token`: JWT de sessão retornado pelo Fluig.
- Cookie `tokenExp`: timestamp de expiração.
- Funções em `src/lib/cookie.ts`: `setAuthCookie`, `getAuthCookie`, `clearAuthCookies`, `isTokenExpired`.
