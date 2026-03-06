# 🌐 Portal Congresso Nacional APAE Brasil 2026

Este repositório contém a aplicação oficial para acesso, inscrição e gerenciamento da programação do **Congresso Nacional da APAE Brasil 2026**. A aplicação serve tanto como um site institucional dinâmico para promover o evento, quanto como uma plataforma segura para cadastros de participantes com forte integração à estrutura backend do ecossistema da TOTVS (Fluig).

---

## 🚀 Tecnologias e Ferramentas Definidas

- **Framework**: `Vite` com `React 19` e `TypeScript`.
- **Roteamento**: `TanStack Router` focado em type-safety estrito e _file-based routing_.
- **Gerenciamento de Estado de Autenticação**: Contexto nativo (`AuthContext`) com persistência em `localStorage`.
- **Gerenciamento de Estado Server-Side e Cache**: `TanStack Query v4` administrando as chamadas a APIs e datasets.
- **Estilização e Componentes UI**:
  - `Tailwind CSS v4`
  - [shadcn/ui](https://ui.shadcn.com/) utilizando base do Radix para acessibilidade (Botões, Inputs, Cards, etc.)
  - `Material UI (MUI)` introduzido pontualmente para o sub-componente genérico de _Autocomplete_.
- **Gerenciamento de Formulários e Validação**: `React Hook Form` integrado ao esquema analítico de segurança do `Zod`.
- **Comunicação de Rede**: `Axios` utilizando a especificação de assinatura criptografada **OAuth 1.0a** customizada em interceptadores de requisição.

---

## 🏗️ Estrutura Arquitetural do Código

O repositório está subdividido para manter a responsabilidade única por cada núcleo:

```text
src/
├── assets/        ← (Potencial para assets globais isolados visuais)
├── components/    ← Peças visuais como Header, Footer, seções para painel e UI kit de base (shadcn/ui).
├── constants/     ← Coleções estáticas divididas entre form-options, disability-options, e gallery-data.
├── context/       ← Estados globais fundamentais (ex: auth-context.tsx).
├── hooks/         ← Módulos isolados acoplando o fetching do React Query aos retornos do Fluig.
├── lib/           ← Utilitários auxiliares sever-agnostic (ex: logger de execução limpa).
├── routes/        ← Sistema de Rotas Baseado em Arquivos (File-Based) integrado ao __root.
├── services/      ← API Root, config Fluig OAuth, abstração CRUD Form Services e Parsers.
├── types/         ← Tipologias unificadas da Plataforma e do Negócio (FluigEntity, LoteFields).
└── utils/         ← Máscaras e manipuladores (format-cpf, format-cep, manipulação de período/ranges).
```

---

## 🛣️ Entendendo as Rotas (TanStack Router)

A malha do portal tem duas partições funcionais vitais (pública e privada).

- `__root.tsx`: Container englobando todas as renderizações, fornecendo o escopo do Auth, e instanciando o `React QueryClientProvider` em conjunto das notificações globais do `<Toaster>`.
- **Rotas Públicas**:
  - `/ (index.tsx)`: Landing Page principal, instanciando os clusters hero, patrocinadores (Sponsors), palestrantes famosos, cronograma da galeria etc. Inicia o fetching basal pela hook `useEvents()`.
  - `/quem-somos`: Disposição informativa corporativa renderizando histórico com layouts dinâmicos usando acordeões sem chamadas externas.
  - `/galeria`, `/palestras`, `/palestrantes`: Exibição visual da base do congresso.
- **Rotas de Ação e Entrada**:
  - `/inscricao`: Maior fluxo do projeto e core da coleta de formulários. Integra validação com Zod (Verificação de idade, contatos, cep), acessos à Autocomplete do fluig com `dsConsultaApaesFeapaes` e valida o cpf contra registros da base antes de fazer `handlePostFormParticipant()`.
  - `/login`: Compara entrada do respectivo CPF validando a existência do usuário via Dataset do Fluig e estabelece o cookie/sessão assíncrona autenticada do state global (o login usa base encriptada contra retorno plain object no contexto).
- **Rotas Privadas (Pós-login)**:
  - `/painel/*`: Central do Participante sub-dividido em 4 módulos acessíveis após verificação (protegidos via flag `isAuthenticated` no `beforeLoad`):
    - `evento`: Mercado de venda, lotes e ingressos (Busca id_lote local em base).
    - `data`: Relatórios customizados e dados próprios da Inscrição.
    - `historico`: Rota de exibições regressas de consumo do usuário.
    - `ingresso`: Ticket digital individual configurado após finalização.

---

## ⚙️ Configuração, API e TOTVS Fluig

Esta aplicação não usa uma API REST convencional direta e simples. Em contrapartida, orquestra todas as requisições primárias interligadas por **TOTVS Fluig e OAuth 1.0A**, necessitando de cuidados na hora de depuração de instâncias ou comunicação.

### 1. Interceptações de Axios e Proxy Fluig

Localizado em `src/services/api-root.ts`:

- Em **Desenvolvimento**, a requisição original enviada ao servidor é intermediada pelo `Vite Proxy` (Configurado em `vite.config.ts`), passando as assinaturas e a geração nativa na camada OAuth (`CryptoJs.HmacSHA1`) a partir das chaves `CONSUMER_KEY`, `ACCESS_TOKEN` diretamente pelo front-end para facilitar testes imediatos.
- Em **Produção**, o cliente React envia a chamada básica direcionando `axiosApi.baseURL` para o utilitário em `proxy.php`. Toda a responsabilidade OAuth recai exclusivamente sobre a infraestrutura backend para proteção completa das _tokens_ Fluig no bundle.

### 2. Acesso à Datasets (Banco de Instâncias Fluig)

O `fetch-dataset.ts` viabiliza manipulação paramétrica `GET` sobre `/dataset/api/v2/dataset-handle/search`.
A aplicação mapeia variados nomes de datasets da seguinte forma para montagem dos módulos dinâmicos:

- `cadParticipanteCN`: Validação para login da plataforma e histórico completo.
- `dsConsultaCpfCadastrado`: Apoio na página de Inscrição para resgate antecipado dos campos e barramentos duplos.
- `ds_buscaParceirosVinculados_CN`: Prospecção visual de empresas atreladas (`useQuery` cacheado pelo Tanstack).
- `cadAtividadeCN`: Retorna dados profundos sobre pauta do congresso.
- `dsConsultaApaesFeapaes`: Lista integral de Autocomplete do campo APAEs e vinculadas de cada formulário.

### 3. Formulários ECM (Criação e Atualizações)

A biblioteca envia comandos diretamente ao Form Provider de Processos ECM (API REST):

- Modifica as instâncias com o corpo padronizado via a chamada HTTP `POST/PUT /ecm-forms/api/v2/cardindex/`.
- Cada payload passa pela camada de filtragem/encadernamento do `fluig-parser.ts`, transformando objetos simples Javascript nos tradicionais `[ { "fieldId": "x", "value": "y" } ]` (Fields tipados mapeados no documento).

---

## 🧩 Componentes Vitais

- **Seções Genéricas de Marketing (Home) `src/components/home`**: `hero`, `sponsor-section`, `speakers-section` e `featured-schedule` utilizam dados que intercalam retornos JSON de hooks `useVinculo` (que concatena palestras com atividades) ou renderiza Mockups (como arquivos fotográficos em `gallery-data.ts`).
- **UI Components (shadcn/ui) `src/components/ui`**: O portal concentra todo estilo, tipagem Radix/Tailwind na base `ui/`, abrigando botões, tooltips, switches customizados, modais (`Dialog`), formulários limpos (`Field/Input`).
- **Layout (Header e Footer)**: Componentização coesa com `header.tsx` servindo o responsivo (`header-mobile-menu.tsx`), os atalhos estáticos e checagem de renderização limpa do SVG padrão da Empresa.

---

## 🛠️ Utils, Hooks e Constants

- **Constantes (`constants/`)**: Totalmente descentralizadas em múltiplos arquivos de exportação via barrel index (`index.ts`). A base detém:
  - `form-options`: Dropdowns de unidade federativa, escolaridade, e porte de camisetas.
  - `disability-options`: Tipificação para formulário com necessidades especiais.
  - `gallery-data` e `navigation`: Informações de imagens e URLs de links do Navbar.
- **Utilitários (`utils/`)**:
  - `format-cep`, `format-cpf`, `format-phone`: Camada final interativa onde os regex controlam a digitação visual de campos.
  - `formatThreeDayRange`: Script dinâmico em `date-fns` adaptado com _fallback_ que compreende ranges distantes do cronograma da agenda.
- **Hooks Dedicados (`hooks/`)**: Repositório de abstração do React Query para cache longo, incluindo `useAtividade.ts`, `useEvents.ts`, `usePalestrantes.ts` acoplados sempre às contraints montadas pela chave da API do Dataset.

---

## 🚀 Como Executar Localmente

### Pré-requisitos

- **Node.js**: `v20+` recomendado
- **NPM** ou **Pnpm**.

### Instalação e Execução

1. Faça o clone do projeto:

   ```bash
   git clone <repo-url>
   cd site-congresso-prod
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie e configure o ambiente (Base `.env.local` configurado com base de dev):

   ```bash
   VITE_CONSUMER_KEY_BASE_TESTE="XXXXXXX"
   VITE_CONSUMER_SECRET_BASE_TESTE="XXXXXX"
   VITE_ACCESS_TOKEN_BASE_TESTE="XXXX_XXXX"
   VITE_TOKEN_SECRET_BASE_TESTE="XXXX_XXXX"
   VITE_FORM_PARTICIPANTE="123"
   VITE_FORM_EVENTO="124"
   VITE_FORM_LOTES="125"
   ```

4. Execute o ambiente de Dev (A porta padrão é a `5125` conforme configurado no vite.config.ts Proxy!):

   ```bash
   npm run dev
   ```

5. O _Vite Dev Server_ já fará _spin up_ do proxy nativo internamente encaminhando os pings OAuth das URLs estáticas do TOTVS, suplantando os problemas habituais de permissão de CORS!

---

Desenvolvido em nomevação das implementações institucionais.
