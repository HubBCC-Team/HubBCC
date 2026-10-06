# HubBCC

**Plataforma de apoio e desenvolvimento acadêmico** para o curso de Bacharelado em Ciência da Computação.

Sistema web que reúne, em um único ambiente, as oportunidades acadêmicas do curso, o apoio entre alunos (monitorias e tutorias) e o controle de horas complementares.

## Sumário

1. [O problema e a proposta](#1-o-problema-e-a-proposta)
2. [Tecnologias](#2-tecnologias)
3. [Requisitos da disciplina](#3-requisitos-da-disciplina)
4. [Como executar](#4-como-executar)
5. [Contas de teste](#5-contas-de-teste)
6. [Arquitetura](#6-arquitetura)
7. [Estrutura de pastas](#7-estrutura-de-pastas)
8. [Telas implementadas](#8-telas-implementadas)
9. [Casos de uso](#9-casos-de-uso)
10. [Modelo de dados](#10-modelo-de-dados)
11. [Backend mockado (JSON Server)](#11-backend-mockado-json-server)
12. [Requisições com TanStack Query](#12-requisições-com-tanstack-query)
13. [Formulários com React Hook Form + Zod](#13-formulários-com-react-hook-form--zod)
14. [Design system](#14-design-system)
15. [Convenções de código](#15-convenções-de-código)
16. [Situação atual do projeto](#16-situação-atual-do-projeto)
17. [Ligando um backend real](#17-ligando-um-backend-real)
18. [Equipe](#18-equipe)

---

## 1. O problema e a proposta

Hoje o aluno de BCC precisa recorrer a canais dispersos — murais, grupos de mensagem, e-mails de departamento, planilhas pessoais — para três coisas centrais na graduação:

| Necessidade | Como é hoje | Como fica no HubBCC |
| --- | --- | --- |
| Descobrir oportunidades (IC, extensão, monitoria, eventos) | avisos espalhados, prazos perdidos | catálogo único com filtro e candidatura pelo sistema |
| Conseguir ajuda em uma disciplina | busca informal, "quem sabe fazer isso?" | ofertas de monitoria/tutoria com horários e agendamento |
| Controlar horas complementares | planilha pessoal, contagem manual | registro com comprovante e progresso automático |

A proposta é integrar os três fluxos, de modo que a mesma pessoa que hoje **busca** ajuda possa amanhã **oferecer** ajuda, e que toda participação vire registro de horas sem retrabalho.

### Fluxo principal do sistema

```
cadastro → login → explorar oportunidades → candidatar-se → aprovação
                                                                ↓
                                                        virar monitor
                                                                ↓
                                                     criar oferta de apoio
                                                                ↓
outro aluno busca apoio → agenda horário → atendimento → registro → avaliação
                                                                ↓
                                                    horas complementares
```

---

## 2. Tecnologias

| Camada | Tecnologia | Papel no projeto |
| --- | --- | --- |
| Biblioteca de UI | **React 19** (ES6+) | construção das interfaces por componentes funcionais e hooks |
| Build e dev server | **Vite** | compilação rápida e recarregamento instantâneo |
| Estilo | **Tailwind CSS v4** | estilização por classes utilitárias e tokens de tema |
| Roteamento | **React Router DOM v7** | navegação entre telas sem recarregar a página |
| Requisições e cache | **TanStack Query v5** | `useQuery` / `useMutation`, cache, estados de carregamento/erro e invalidação |
| Formulários | **React Hook Form** | controle dos campos, envio e estado dos formulários |
| Validação | **Zod** + **@hookform/resolvers** | schemas de validação integrados ao formulário via `zodResolver` |
| HTTP | **Axios** | instância única com URL base, token e tratamento de erro |
| Backend mockado | **JSON Server** | API REST com dados persistidos no arquivo `db.json` |
| Ícones | **lucide-react** / **Phosphor Icons** | bibliotecas de ícones |
| Qualidade | **ESLint** | padronização e detecção de erros |
| Execução paralela | **concurrently** | sobe backend e frontend com um único comando |

**Por que Tailwind v4:** dispensa o `tailwind.config.js`. Todo o tema (cores, fontes) é declarado em CSS dentro de `@theme`, o que reduz a configuração a um único arquivo.

**Por que JSON Server:** permite que o frontend seja desenvolvido, demonstrado e avaliado com uma API REST de verdade (GET, POST, PUT/PATCH, DELETE), sem depender de banco de dados ou infraestrutura. Tudo que o sistema grava fica no arquivo `db.json`.

---

## 3. Requisitos da disciplina

Como cada tecnologia exigida está atendida no projeto:

| Requisito | Onde está | Como é usado |
| --- | --- | --- |
| React | todo o `src/` | componentes funcionais e hooks |
| ES6+ | todo o `src/` | módulos `import/export`, arrow functions, desestruturação, spread, `async/await`, template strings |
| Framework de estilo | `src/index.css` + classes nas telas | Tailwind CSS v4 com tokens de tema |
| `react-hook-form` | todos os formulários (ver [seção 13](#13-formulários-com-react-hook-form--zod)) | `useForm`, `register`, `useWatch`, `setValue`, `formState.errors` |
| `zod` | `src/schemas/` | um schema por área do sistema |
| `@hookform/resolvers` | todos os formulários | `zodResolver(schema)` liga o Zod ao React Hook Form |
| TanStack Query | `src/lib/queryClient.js`, `src/main.jsx`, `src/queries/` | `QueryClientProvider`, `useQuery`, `useMutation` e `invalidateQueries` em todas as telas com dados |
| JSON Server | `server/server.js`, `db.json`, `server/db.seed.json` | backend mockado com dados iniciais e persistência em arquivo |

---

## 4. Como executar

### Pré-requisitos

- **Node.js 20.19 ou superior** (exigência do Vite 8)
- npm

### Passos

```bash
cd frontend
npm install
npm run dev:all
```

| Serviço | Endereço |
| --- | --- |
| Frontend (Vite) | http://localhost:5173 |
| API (JSON Server) | http://localhost:3001 |

Se preferir, use dois terminais: `npm run server` em um e `npm run dev` no outro.

> **Importante:** o frontend depende da API. Se o JSON Server não estiver rodando, as telas mostram a mensagem *"Não foi possível conectar ao servidor"* com o botão **Tentar novamente**.

### Scripts disponíveis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | sobe apenas o frontend (Vite) |
| `npm run server` | sobe apenas o backend mockado (JSON Server) na porta 3001 |
| `npm run dev:all` | sobe backend e frontend juntos |
| `npm run db:reset` | restaura o `db.json` com os dados iniciais de `server/db.seed.json` |
| `npm run build` | gera a versão de produção na pasta `dist` |
| `npm run preview` | testa localmente a versão de produção |
| `npm run lint` | verifica o padrão do código |

### Variáveis de ambiente (opcional)

Sem um arquivo `.env`, o sistema já usa os valores padrão. Para mudar, copie o `.env.example` para `.env`:

```env
VITE_API_URL=http://localhost:3001
PORTA_API=3001
```

---

## 5. Contas de teste

O `db.json` já vem com três usuários, um para cada perfil:

| E-mail | Senha | Perfil | Para que serve |
| --- | --- | --- | --- |
| `aluno@hubbcc.br` | `123456` | aluno | visão de quem busca oportunidades e agenda monitorias |
| `monitor@hubbcc.br` | `123456` | monitor | visão de quem oferece apoio e gerencia atendimentos |
| `admin@hubbcc.br` | `123456` | admin | visão de gestão do curso |

**Persistência:** os dados ficam no arquivo `frontend/db.json`. Tudo que você criar, alterar ou excluir pelo sistema é gravado nesse arquivo e continua lá depois de reiniciar o servidor.

**Para voltar ao estado inicial**, use uma das opções:

- no sistema: **Perfil → Resetar dados de teste**;
- no terminal: `npm run db:reset`.

---

## 6. Arquitetura

O projeto segue uma separação em camadas. Cada camada só conversa com a vizinha:

```
┌─────────────────────────────────────────────────────────┐
│  PAGES          telas que o usuário vê                  │
│                 React Hook Form + Zod nos formulários   │
└────────────────────────┬────────────────────────────────┘
                         │ usa hooks de consulta/alteração
┌────────────────────────▼────────────────────────────────┐
│  QUERIES        TanStack Query: useQuery / useMutation  │
│                 cache, carregando, erro, invalidação    │
└────────────────────────┬────────────────────────────────┘
                         │ chama funções de negócio
┌────────────────────────▼────────────────────────────────┐
│  SERVICE        uma função por caso de uso              │
│                 ex.: realizarAgendamento(dados)         │
└────────────────────────┬────────────────────────────────┘
                         │ faz a requisição HTTP
┌────────────────────────▼────────────────────────────────┐
│  API/AXIOS      instância única: token, erros, timeout  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP (localhost:3001)
┌────────────────────────▼────────────────────────────────┐
│  JSON SERVER    server/server.js: regras de negócio     │
│                 + CRUD automático do JSON Server        │
└────────────────────────┬────────────────────────────────┘
                         │ lê e grava
┌────────────────────────▼────────────────────────────────┐
│  db.json        dados persistidos em arquivo            │
└─────────────────────────────────────────────────────────┘
```

### A regra de ouro

**Nenhuma tela chama o Axios diretamente.** A tela usa um hook de `src/queries/`, que chama uma função de `src/service/`, que faz a requisição.

Essa regra permite trocar o backend mockado por um real **sem alterar nenhuma tela**, e mantém a lógica de negócio fora dos componentes visuais.

### Decisões de projeto

| Decisão | Motivo |
| --- | --- |
| Camada `service` separada | isola as telas das rotas da API; se um endpoint mudar, muda em um arquivo só |
| Camada `queries` (TanStack Query) | centraliza cache, carregamento, erro e atualização automática depois de cada alteração |
| Schemas Zod em `src/schemas/` | regras de validação reutilizáveis e separadas da interface |
| Formulários compartilhados | cadastro e edição usam o mesmo componente (`FormularioOportunidade`, `FormularioOferta`, `FormularioAtividade`) |
| Contexto de autenticação | o usuário logado fica acessível em qualquer componente sem passar props em cascata |
| Regras de negócio no `server.js` | o JSON Server puro só faz CRUD; validações como vagas e conflito de horário ficam antes dele |
| Componentes de UI reutilizáveis | consistência visual e menos código em cada tela |
| Atraso artificial de 350 ms na API | força o tratamento correto dos estados de carregamento |

---

## 7. Estrutura de pastas

```
frontend/
├── server/
│   ├── server.js               JSON Server + regras de negócio + rotas /auth
│   └── db.seed.json            dados iniciais (usados pelo reset)
│
├── db.json                     banco de dados do JSON Server (persistência)
│
├── public/
├── src/
│   ├── api/
│   │   └── axios.js            instância do axios: baseURL, token, tratamento de erro
│   │
│   ├── lib/
│   │   └── queryClient.js      configuração do TanStack Query
│   │
│   ├── service/                uma função por caso de uso — a ponte entre queries e API
│   │   ├── authService.js          login, cadastro, senha, perfil, reset
│   │   ├── oportunidadeService.js  oportunidades e candidaturas
│   │   ├── apoioService.js         disciplinas e ofertas de monitoria
│   │   ├── agendamentoService.js   agendar, reagendar, registrar, avaliar
│   │   └── atividadeService.js     atividades complementares e horas
│   │
│   ├── queries/                hooks do TanStack Query
│   │   ├── chaves.js               chaves do cache (query keys)
│   │   ├── useOportunidades.js     oportunidades e candidaturas
│   │   ├── useApoio.js             disciplinas e ofertas
│   │   ├── useAgendamentos.js      agendamentos
│   │   ├── useAtividades.js        atividades e resumo de horas
│   │   ├── useAcesso.js            login, cadastro, senha, perfil, reset
│   │   └── index.js                ponto único de importação
│   │
│   ├── schemas/                schemas Zod
│   │   ├── authSchemas.js          login, cadastro, recuperar e nova senha
│   │   ├── oportunidadeSchemas.js  oportunidade e candidatura
│   │   ├── apoioSchemas.js         oferta de apoio
│   │   ├── agendamentoSchemas.js   agendamento, reagendamento, avaliação, registro
│   │   ├── atividadeSchemas.js     atividade complementar
│   │   └── perfilSchemas.js        contato do perfil
│   │
│   ├── contexts/
│   │   ├── AuthContext.jsx     usuário logado para toda a aplicação
│   │   ├── useAuth.js          atalho de leitura do contexto
│   │   ├── ToastContext.jsx    avisos de sucesso/erro
│   │   └── useToast.js         atalho de leitura dos avisos
│   │
│   ├── hooks/
│   │   └── usePermissao.js     regras de permissão por perfil
│   │
│   ├── components/
│   │   ├── ui/                 peças reutilizáveis de interface
│   │   │   ├── Botao.jsx           5 variantes, 3 tamanhos, estado de carregando
│   │   │   ├── Campo.jsx           input, select e textarea com rótulo e erro
│   │   │   ├── Alerta.jsx          mensagens de erro, aviso e sucesso
│   │   │   ├── Selo.jsx            etiquetas coloridas por situação
│   │   │   ├── Modal.jsx           janela flutuante com fechamento por ESC
│   │   │   ├── Estado.jsx          telas de carregando, erro e lista vazia
│   │   │   ├── Skeleton.jsx        blocos de carregamento
│   │   │   ├── Progresso.jsx       anel e barra de progresso
│   │   │   ├── Estrelas.jsx        avaliação por estrelas
│   │   │   ├── GradeHorarios.jsx   grade semanal de disponibilidade
│   │   │   ├── VisualizadorArquivo.jsx  visualização de comprovantes
│   │   │   ├── Toast.jsx           aviso flutuante
│   │   │   ├── Avatar.jsx          círculo com iniciais
│   │   │   └── Cabecalho.jsx       título de página padronizado
│   │   │
│   │   ├── layout/             esqueletos de página
│   │   │   ├── LayoutApp.jsx       menu lateral + barra superior (telas internas)
│   │   │   ├── LayoutAcesso.jsx    painel azul + formulário (login/cadastro)
│   │   │   ├── MenuLateral.jsx     navegação principal
│   │   │   ├── BarraSuperior.jsx   busca, notificações, avatar
│   │   │   └── Logo.jsx
│   │   │
│   │   └── rotas/
│   │       └── RotaPrivada.jsx     bloqueia acesso de quem não está logado
│   │
│   ├── pages/                  uma pasta por área do sistema
│   │   ├── landing/            página pública de apresentação
│   │   ├── login/
│   │   ├── cadastro/
│   │   ├── recuperarSenha/     recuperar senha e nova senha
│   │   ├── home/               dashboard
│   │   ├── oportunidades/      lista, detalhe, cadastro, edição, candidatura
│   │   ├── apoio/              ofertas: lista, detalhe, criação, edição
│   │   ├── agendamentos/       agendar, listar, registrar
│   │   ├── atividades/         horas complementares: lista, registro, edição
│   │   ├── perfil/
│   │   ├── NotFound.jsx
│   │   └── Unauthorized.jsx
│   │
│   ├── utils/
│   │   └── formatadores.js     data, moeda, iniciais
│   │
│   ├── App.jsx                 MAPA DE ROTAS — comece a leitura por aqui
│   ├── main.jsx                ponto de entrada + QueryClientProvider
│   └── index.css               Tailwind + tokens do tema + classes utilitárias
│
├── .env.example
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

### Por onde começar a ler o código

| Ordem | Arquivo | O que você entende |
| --- | --- | --- |
| 1 | `src/App.jsx` | todas as telas que existem e seus endereços |
| 2 | `db.json` | o formato de todos os dados do sistema |
| 3 | `server/server.js` | os endpoints e as regras de negócio |
| 4 | `src/queries/useOportunidades.js` | como as consultas e alterações usam o TanStack Query |
| 5 | `src/pages/oportunidades/FormularioOportunidade.jsx` | o padrão de um formulário com React Hook Form + Zod |

Todos os arquivos começam com um bloco de comentário explicando o que fazem e como alterá-los.

---

## 8. Telas implementadas

### Área pública

| # | Tela | Rota | Descrição |
| --- | --- | --- | --- |
| 1 | Abertura / Landing | `/` | apresentação do sistema e chamadas para cadastro |
| 2 | Login | `/login` | autenticação com e-mail institucional |
| 3 | Cadastro | `/cadastro` | criação de conta com validação completa |
| 4 | Recuperar senha | `/recuperar-senha` | envio de link de redefinição |
| — | Nova senha | segunda etapa da recuperação | criação da nova senha com indicador de força |

### Área autenticada

| # | Tela | Rota | Descrição |
| --- | --- | --- | --- |
| 5 | Home / Dashboard | `/app` | indicadores, próximos agendamentos e progresso de horas |
| 6 | Oportunidades — lista | `/app/oportunidades` | catálogo com busca e abas por tipo |
| 7 | Oportunidades — filtros | modal na lista | filtro por tipo, modalidade e situação |
| 8 | Oportunidade — detalhe | `/app/oportunidades/:id` | descrição, requisitos, atividades, inscrição e encerramento |
| 9 | Realizar candidatura | `/app/oportunidades/:id/candidatura` | formulário em 3 etapas com carta de motivação |
| 10 | Cadastrar oportunidade | `/app/oportunidades/nova` | publicação com pré-visualização ao vivo |
| — | Editar oportunidade | `/app/oportunidades/:id/editar` | alteração dos dados publicados |
| 11 | Minhas candidaturas | `/app/candidaturas` | acompanhamento por situação e cancelamento |
| 12 | Apoio acadêmico — lista | `/app/apoio` | ofertas de monitoria e tutoria com filtros |
| 13 | Apoio — detalhe | `/app/apoio/:id` | horários, avaliações e vagas |
| 14 | Criar oferta de apoio | `/app/apoio/nova` | cadastro com grade de disponibilidade semanal |
| — | Editar oferta de apoio | `/app/apoio/:id/editar` | alteração e cancelamento da oferta |
| 15 | Realizar agendamento | `/app/apoio/:id/agendar` | calendário mensal com horários disponíveis |
| 16 | Reagendar / cancelar | modal em agendamentos | alteração de data e hora |
| 17 | Meus agendamentos | `/app/agendamentos` | listagem por situação com ações |
| 18 | Registrar atendimento | `/app/agendamentos/:id/registrar` | presença, duração e observações |
| 19 | Avaliar atendimento | modal em agendamentos | nota, etiquetas e comentário |
| 20 | Registrar atividade | `/app/atividades/nova` | categoria, horas e comprovante |
| — | Editar atividade | `/app/atividades/:id/editar` | alteração de atividade ainda não aprovada |
| 21 | Atividades e horas | `/app/atividades` | progresso, distribuição e histórico |
| 22 | Perfil | `/app/perfil` | dados, contato, banner, estatísticas e reset |

### Telas de sistema

| Tela | Rota | Quando aparece |
| --- | --- | --- |
| Acesso não autorizado | `/sem-acesso` | perfil sem permissão para a rota |
| Página não encontrada | qualquer outra | endereço inexistente |

---

## 9. Casos de uso

Os 20 casos de uso do levantamento de requisitos e onde cada um está implementado.

### Oportunidades acadêmicas

| # | Caso de uso | Situação | Onde |
| --- | --- | --- | --- |
| 1 | Cadastrar oportunidade | ✅ | `CadastrarOportunidade.jsx` |
| 2 | Consultar oportunidades | ✅ | `ListaOportunidades.jsx` |
| 3 | Filtrar oportunidades | ✅ | modal de filtros na lista |
| 4 | Alterar oportunidade | ✅ | `EditarOportunidade.jsx` |
| 5 | Encerrar oportunidade | ✅ | `DetalheOportunidade.jsx` |
| 6 | Realizar candidatura | ✅ | `RealizarCandidatura.jsx` |
| 7 | Consultar candidaturas | ✅ | `MinhasCandidaturas.jsx` |
| 8 | Avaliar candidatura | ⚠️ lógica pronta, falta tela | `useAvaliarCandidatura()` |

### Apoio acadêmico

| # | Caso de uso | Situação | Onde |
| --- | --- | --- | --- |
| 9 | Criar oferta de apoio | ✅ | `CriarOferta.jsx` |
| 10 | Consultar ofertas | ✅ | `ListaApoio.jsx` |
| 11 | Filtrar ofertas | ✅ | filtros da lista de apoio |
| 12 | Alterar oferta | ✅ | `EditarOferta.jsx` |
| 13 | Cancelar oferta | ✅ | `EditarOferta.jsx` |

### Agendamentos

| # | Caso de uso | Situação | Onde |
| --- | --- | --- | --- |
| 14 | Realizar agendamento | ✅ | `RealizarAgendamento.jsx` |
| 15 | Consultar agendamentos | ✅ | `MeusAgendamentos.jsx` |
| 16 | Reagendar / cancelar | ✅ | modal em `MeusAgendamentos.jsx` |
| 17 | Registrar atendimento | ✅ | `RegistrarAtendimento.jsx` |
| 18 | Avaliar atendimento | ✅ | modal em `MeusAgendamentos.jsx` |

### Atividades complementares

| # | Caso de uso | Situação | Onde |
| --- | --- | --- | --- |
| 19 | Registrar atividade | ✅ | `RegistrarAtividade.jsx` |
| 20 | Consultar atividades e horas | ✅ | `AtividadesHoras.jsx` |

**Cobertura: 19 de 20 casos de uso com interface completa.** O caso 8 tem a lógica pronta (service, rota e hook), faltando apenas a tela.

---

## 10. Modelo de dados

Definido em `db.json` (dados iniciais em `server/db.seed.json`). Este é o contrato que um backend real deverá respeitar.

### Usuário

```js
{
  id, nome, email, senha, perfil,     // "aluno" | "monitor" | "admin"
  matricula, curso, periodo, telefone, iniciais,
  banner                              // opcional: gradiente escolhido no Perfil
}
```

### Disciplina

```js
{ id, codigo, nome, periodo }
```

### Oportunidade

```js
{
  id, titulo, tipo, area, departamento, responsavel,
  descricao, requisitos[], atividades[],
  bolsa, cargaHoraria, modalidade, local, vagas,
  prazoInscricao, situacao            // "Aberta" | "Encerrada"
}
```

### Candidatura

```js
{
  id, usuarioId, oportunidadeId, oportunidadeTitulo,
  tipo, dataEnvio, carta,
  situacao    // "Em analise" | "Aprovada" | "Reprovada" | "Cancelada"
}
```

### Oferta de apoio

```js
{
  id, disciplinaId, disciplina, titulo, assunto,
  monitorId, monitor, iniciais,
  tipo,                               // "Monitoria" | "Tutoria"
  modalidade, local,
  gratuita, valor, vagas, vagasOcupadas,
  nota, totalAvaliacoes, descricao,
  horarios: [{ id, dia, inicio, fim }]
}
```

### Agendamento

```js
{
  id, usuarioId, ofertaId, titulo, disciplina, monitor,
  data, hora, modalidade, local,
  situacao,                           // "Confirmado" | "Realizado" | "Cancelado"
  avaliacao: { nota, comentario, tags[] } | null,
  registro: { compareceu, duracao, observacoes, registradoEm } | null
}
```

### Atividade complementar

```js
{
  id, usuarioId, titulo, categoria, data, horas, descricao,
  situacao,                           // "Aprovada" | "Em analise" | "Recusada"
  comprovante,                        // nome do arquivo
  comprovanteArquivo                  // conteúdo em base64 (visualização)
}
```

### Configuração

```js
config: { metaHorasComplementares: 200 }
```

### Dados iniciais

| Coleção | Registros |
| --- | --- |
| usuarios | 3 |
| disciplinas | 6 |
| oportunidades | 6 |
| candidaturas | 3 |
| ofertas | 6 |
| agendamentos | 3 |
| atividades | 4 |

---

## 11. Backend mockado (JSON Server)

O backend é o **JSON Server**, iniciado por `server/server.js`. Ele cria automaticamente o CRUD de cada coleção do `db.json` e grava toda alteração no arquivo.

### Por que um `server.js` e não só `json-server db.json`

O JSON Server puro só faz CRUD. O `server.js` usa o próprio JSON Server como base e adiciona, **antes** do CRUD automático:

- as rotas de autenticação (`/auth/*`), que o JSON Server não tem;
- as regras de negócio do sistema (vagas, conflito de horário, candidatura duplicada etc.);
- o resumo de horas (`/atividades/resumo`);
- o reset dos dados (`/dev/reset`).

As rotas de CRUD e a persistência no `db.json` continuam sendo as do JSON Server.

### Endpoints

#### CRUD automático

| Recurso | Métodos |
| --- | --- |
| `/usuarios`, `/disciplinas`, `/oportunidades`, `/candidaturas`, `/ofertas`, `/agendamentos`, `/atividades` | `GET`, `GET /:id`, `POST`, `PUT`, `PATCH`, `DELETE` |

Filtros por query string, por exemplo: `/agendamentos?usuarioId=1&situacao=Confirmado`.

#### Autenticação

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/auth/login` | autentica e devolve token + usuário |
| POST | `/auth/cadastro` | cria conta de aluno |
| POST | `/auth/recuperar-senha` | simula o envio do e-mail de redefinição |
| POST | `/auth/nova-senha` | simula a troca de senha |

#### Rotas especiais

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/atividades/resumo?usuarioId=` | total de horas aprovadas, meta, percentual e horas por categoria |
| DELETE | `/agendamentos/:id` | cancelamento lógico (mantém histórico) e devolução da vaga |
| POST | `/dev/reset` | restaura o `db.json` a partir de `server/db.seed.json` |

### Regras de negócio implementadas no servidor

| Regra | Comportamento |
| --- | --- |
| Candidatura duplicada | bloqueia se já existe candidatura ativa para a mesma oportunidade |
| Oportunidade encerrada | bloqueia novas candidaturas |
| Agendamento sem vaga | bloqueia quando `vagasOcupadas >= vagas` |
| Conflito de horário | bloqueia se o aluno já tem agendamento confirmado na mesma data e hora |
| Agendar | ocupa uma vaga da oferta automaticamente |
| Cancelamento | devolve a vaga à oferta automaticamente |
| Horas complementares | somam apenas atividades com situação "Aprovada" |
| Nova atividade | entra sempre como "Em analise" |
| Cadastro duplicado | bloqueia e-mail já registrado |
| Senha | nunca é devolvida nas respostas da API |
| `PUT` parcial | convertido em `PATCH`, para não apagar campos não enviados |

> **Simulação acadêmica:** a senha fica em texto puro no `db.json` e o token é fictício. Em produção, senhas devem ser armazenadas com hash e a autenticação deve usar tokens assinados.

---

## 12. Requisições com TanStack Query

O `QueryClientProvider` envolve a aplicação em `src/main.jsx`, com a configuração em `src/lib/queryClient.js`. Em desenvolvimento, o **React Query Devtools** aparece no canto da tela para inspecionar o cache.

### Consultas (`useQuery`)

```jsx
const { data: ofertas = [], isLoading, isError, error, refetch } = useOfertas(filtros);

if (isLoading) return <Carregando />;
if (isError) return <Erro mensagem={error.message} aoTentarNovamente={refetch} />;
```

- Os filtros fazem parte da chave da consulta: ao mudar um filtro, a busca é refeita automaticamente.
- Nas listas, a lista anterior continua na tela enquanto a nova carrega (`keepPreviousData`), sem "piscar".
- Os dados ficam em cache e são compartilhados entre telas.

### Alterações (`useMutation`)

```jsx
const cancelar = useCancelarAgendamento();

cancelar.mutate(id, {
  onSuccess: () => toast.sucesso("Agendamento cancelado."),
  onError: (e) => toast.erro(e.message),
});

<Botao carregando={cancelar.isPending}>Cancelar</Botao>
```

### Invalidação automática

Depois de cada alteração, as consultas afetadas são invalidadas e o TanStack Query busca os dados novos sozinho:

| Alteração | Consultas atualizadas |
| --- | --- |
| Oportunidade (criar, alterar, encerrar, excluir) | oportunidades (e candidaturas, ao excluir) |
| Candidatura (realizar, avaliar, cancelar) | candidaturas |
| Oferta (criar, alterar, cancelar) | ofertas |
| Agendar ou cancelar agendamento | agendamentos **e** ofertas (as vagas mudam) |
| Reagendar, registrar, avaliar | agendamentos |
| Atividade (registrar, alterar, excluir) | lista de atividades **e** resumo de horas |
| Login, cadastro, sair | todo o cache é limpo (um usuário nunca vê dados de outro) |
| Reset dos dados de teste | todas as consultas |

---

## 13. Formulários com React Hook Form + Zod

Todos os formulários usam `useForm` com `zodResolver`. As mensagens de validação aparecem embaixo de cada campo, e os erros de envio vindos do servidor aparecem no componente `<Alerta>`.

### Padrão

```jsx
const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm({
  resolver: zodResolver(loginSchema),
  defaultValues: { email: "", senha: "" },
  mode: "onTouched",
});

<form onSubmit={handleSubmit(aoEnviar)} noValidate>
  <Campo rotulo="E-mail" erro={errors.email?.message} {...register("email")} />
</form>
```

Campos que não são `<input>` (grade de horários, calendário, estrelas, categorias, upload) atualizam o formulário com `setValue`, e a tela lê os valores com `useWatch`.

### Formulários e validações

| Formulário | Schema | Principais regras |
| --- | --- | --- |
| Login | `loginSchema` | e-mail válido, senha preenchida |
| Cadastro | `cadastroSchema` | matrícula com 6 a 12 números, período, telefone opcional com DDD, senha ≥ 6, confirmação igual, aceite dos termos |
| Recuperar senha | `recuperarSenhaSchema` | e-mail válido |
| Nova senha | `novaSenhaSchema` | 8+ caracteres, letra maiúscula, número ou símbolo, confirmação igual |
| Cadastrar / editar oportunidade | `cadastroOportunidadeSchema` / `oportunidadeSchema` | título, tipo, área, vagas, descrição ≥ 20; no cadastro, prazo não pode ser passado |
| Candidatura | `candidaturaSchema` | carta de motivação com 30 a 2000 caracteres |
| Criar / editar oferta | `ofertaSchema` | disciplina, assuntos, local, vagas de 1 a 50, ao menos um horário, valor > 0 se não for gratuita |
| Agendamento | `agendamentoSchema` | dia e horário escolhidos, data não passada |
| Reagendamento | `reagendamentoSchema` | nova data (não passada) e novo horário |
| Avaliação | `avaliacaoSchema` | nota de 1 a 5, comentário até 500 caracteres |
| Registro de atendimento | `registroAtendimentoSchema` | se compareceu, duração ≥ 15 minutos |
| Registrar / editar atividade | `atividadeSchema` | categoria, data não futura, 1 a 200 horas, comprovante obrigatório |
| Contato do perfil | `contatoSchema` | telefone opcional com DDD |

---

## 14. Design system

### Paleta

Declarada em `@theme` no topo de `src/index.css`. Alterar ali muda o sistema inteiro.

| Token | Uso |
| --- | --- |
| `marca-50` … `marca-900` | azul principal: botões, links, destaques |
| `noite-700` … `noite-900` | azul escuro: menu lateral e painéis de acesso |
| `sucesso` / `alerta` / `erro` | situações e mensagens |
| `slate-*` | textos, bordas e fundos neutros |

### Classes utilitárias do projeto

| Classe | O que aplica |
| --- | --- |
| `.cartao` | cartão branco com borda, cantos arredondados e sombra |
| `.campo` | estilo padrão de input, select e textarea |
| `.rotulo` | rótulo de formulário |
| `.titulo-secao` | título interno de cartão |
| `.anim-surgir` | animação de entrada |

### Componentes de interface

| Componente | Variações |
| --- | --- |
| `<Botao>` | primário, secundário, contorno, perigo, texto · 3 tamanhos · estado de carregando |
| `<Campo>` `<CampoSelecao>` `<CampoTexto>` | rótulo, dica, mensagem de erro · compatíveis com `register` |
| `<Alerta>` | erro, aviso, sucesso |
| `<Selo>` `<SeloSituacao>` | 5 tons · cor automática por situação |
| `<Modal>` | fecha por ESC, clique no fundo ou botão |
| `<Carregando>` `<Erro>` `<Vazio>` | os três estados de qualquer tela com dados |
| `<Skeleton>` | texto, cartão, linha de tabela |
| `<ProgressoCircular>` `<BarraProgresso>` | indicadores de horas |
| `<Estrelas>` | leitura ou seleção interativa |
| `<GradeHorarios>` | seleção de disponibilidade semanal |
| `<VisualizadorArquivo>` | visualização de comprovantes |
| `<Avatar>` | 3 tamanhos |
| `<Cabecalho>` | título, subtítulo e área de ações |

---

## 15. Convenções de código

| Assunto | Padrão | Exemplo |
| --- | --- | --- |
| Componente e página | PascalCase | `RealizarAgendamento.jsx` |
| Função e variável | português, camelCase | `aoSalvar`, `vagasLivres` |
| Handler de evento | prefixo `ao` | `aoEnviar`, `aoFechar` |
| Buscar dados | sempre um hook de `src/queries/` (`useQuery`) | nunca `useEffect` + requisição manual |
| Criar, alterar, excluir | sempre um hook de `src/queries/` (`useMutation`) | nunca chamar o service direto na tela |
| Formulário | sempre `useForm` + `zodResolver` | nunca vários `useState` soltos |
| Validação | sempre um schema em `src/schemas/` | nunca `if` de validação espalhado na tela |
| Cor | apenas tokens do tema | `bg-marca-600`, nunca `bg-[#2447eb]` |
| Cartão | classe `.cartao` | nunca repetir as classes completas |
| Campo | componente `<Campo>` | nunca `<input>` cru |

**Todo arquivo começa com um bloco de comentário** explicando o que faz e como alterá-lo.

### Padrão de uma tela que busca dados

```jsx
const { data = [], isLoading, isError, error, refetch } = useMeusDados(filtros);

if (isLoading) return <Carregando />;
if (isError) return <Erro mensagem={error.message} aoTentarNovamente={refetch} />;
if (!data.length) return <Vazio titulo="Nada por aqui" />;

return ( /* conteúdo */ );
```

---

## 16. Situação atual do projeto

### Concluído

- 22 telas principais navegáveis, mais as telas de edição de oportunidade, oferta e atividade e a tela de nova senha
- 19 dos 20 casos de uso com interface completa
- Backend mockado com JSON Server, dados iniciais e persistência no `db.json`
- Regras de negócio aplicadas no servidor
- TanStack Query em todas as telas que buscam ou alteram dados
- React Hook Form + Zod em todos os formulários
- Autenticação com sessão persistente e proteção de rotas
- Sistema de avisos (toast) e telas de carregamento (skeleton)
- Anexo e visualização de comprovantes de atividades
- Banner e telefone do perfil salvos no banco
- Documentação em todos os arquivos

### Em aberto

| Item | Prioridade |
| --- | --- |
| Tela de avaliar candidaturas (aprovar/reprovar) | alta — fecha o fluxo principal |
| Lista de atendimentos do monitor (acesso ao "Registrar atendimento" pelo monitor) | alta |
| Revisão de permissões por perfil nas rotas | alta |
| Avaliações dinâmicas no detalhe da monitoria (hoje são exemplos fixos) | média |
| Revisão geral de responsividade | média |
| Foto de perfil | diferencial |
| Notificações | diferencial |

---

## 17. Ligando um backend real

Não é necessário alterar nenhuma tela. Crie um arquivo `.env` na pasta `frontend`, usando o `.env.example` como base, e aponte para o novo servidor:

```env
VITE_API_URL=http://localhost:8080/api
```

O backend deve implementar os endpoints da [seção 11](#11-backend-mockado-json-server), respeitando o modelo de dados da [seção 10](#10-modelo-de-dados) e devolvendo os erros no formato `{ "mensagem": "..." }`, que o `axios.js` já exibe nas telas.

Depois que o backend real estiver estável, a pasta `server/` e o arquivo `db.json` podem ser removidos, junto com os scripts `server`, `dev:all` e `db:reset`.

---

## 18. Equipe

| Integrante |
| --- |
| Geovanne Gomes de Souza |
| Marina Motta Sampaio |
| Mina Iura Mathias Monteiro |
| Samuel Trindade Sabino da Silva |

### Documentos do repositório

| Arquivo | Conteúdo |
| --- | --- |
| `README.md` | este documento |
| `boasPraticas.md` | padrões de ambiente e arquitetura acordados pela equipe |
| `documents/` | documentação de requisitos e casos de uso |
