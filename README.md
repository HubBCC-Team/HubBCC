# HubBCC

**Plataforma de apoio e desenvolvimento acadêmico** para o curso de Bacharelado em Ciência da Computação.

O HubBCC é uma aplicação web que reúne, em um único ambiente, oportunidades acadêmicas, apoio entre alunos por meio de monitorias e tutorias e o acompanhamento de atividades e horas complementares.

---

## Sumário

1. [O problema e a proposta](#1-o-problema-e-a-proposta)
2. [Tecnologias](#2-tecnologias)
3. [Requisitos da disciplina](#3-requisitos-da-disciplina)
4. [Como executar](#4-como-executar)
5. [Contas de teste](#5-contas-de-teste)
6. [Arquitetura](#6-arquitetura)
7. [Estrutura de pastas](#7-estrutura-de-pastas)
8. [Telas e rotas](#8-telas-e-rotas)
9. [Casos de uso e funcionalidades](#9-casos-de-uso-e-funcionalidades)
10. [Modelo de dados](#10-modelo-de-dados)
11. [Backend mockado com JSON Server](#11-backend-mockado-com-json-server)
12. [TanStack Query](#12-tanstack-query)
13. [Formulários e validação](#13-formulários-e-validação)
14. [Design e responsividade](#14-design-e-responsividade)
15. [Controle de acesso](#15-controle-de-acesso)
16. [Convenções de código](#16-convenções-de-código)
17. [Situação atual do projeto](#17-situação-atual-do-projeto)
18. [Documentação](#18-documentação)
19. [Equipe](#19-equipe)

---

## 1. O problema e a proposta

Durante a graduação, os alunos têm acesso a diferentes oportunidades acadêmicas, como iniciação científica, projetos de extensão, monitorias, eventos e grupos de pesquisa.

Entretanto, essas informações costumam estar distribuídas entre diversos canais, como e-mails, grupos de mensagens, redes sociais e páginas de departamentos.

Além disso:

- nem todas as disciplinas possuem monitoria oficial;
- alunos podem precisar de apoio em horários diferentes dos oferecidos pela instituição;
- estudantes que já cursaram determinadas disciplinas podem oferecer auxílio a outros alunos;
- certificados e horas complementares normalmente precisam ser controlados separadamente.

O **HubBCC** busca centralizar esses recursos.

| Necessidade | Solução no HubBCC |
| --- | --- |
| Encontrar oportunidades acadêmicas | catálogo centralizado com filtros e candidaturas |
| Acompanhar candidaturas | consulta da situação e possibilidade de cancelamento |
| Encontrar ajuda em disciplinas | ofertas de monitoria e tutoria |
| Oferecer apoio acadêmico | criação e gerenciamento de ofertas |
| Reservar atendimento | agendamento de horários disponíveis |
| Acompanhar horas complementares | registro de atividades e cálculo de progresso |
| Gerenciar disciplinas | CRUD administrativo de disciplinas |

### Fluxo geral

```text
Cadastro
   ↓
Login
   ↓
Explorar oportunidades
   ↓
Realizar candidatura
   ↓
Acompanhar situação

Aluno busca apoio
   ↓
Consulta monitorias/tutorias
   ↓
Realiza agendamento
   ↓
Atendimento
   ↓
Registro e avaliação

Aluno participa de atividades
   ↓
Registra atividade complementar
   ↓
Acompanha total de horas
```

---

## 2. Tecnologias

| Camada | Tecnologia | Uso |
| --- | --- | --- |
| Interface | React 19 | componentes funcionais e hooks |
| Linguagem | JavaScript ES6+ | módulos, async/await, destructuring e demais recursos modernos |
| Build | Vite 8 | ambiente de desenvolvimento e build |
| Estilo | Tailwind CSS v4 | layout, componentes e responsividade |
| Roteamento | React Router DOM v7 | navegação e rotas protegidas |
| Requisições HTTP | Axios | comunicação com a API |
| Cache e estado remoto | TanStack Query v5 | consultas, mutations e invalidação de cache |
| Formulários | React Hook Form | gerenciamento dos principais formulários |
| Validação | Zod + @hookform/resolvers | validação de dados dos formulários |
| Backend mockado | JSON Server | API REST e persistência local |
| Ícones | Lucide React / Phosphor Icons | elementos visuais |
| Qualidade | ESLint | análise estática do código |
| Execução paralela | concurrently | inicialização conjunta da API e do frontend |

---

## 3. Requisitos da disciplina

O projeto utiliza as tecnologias solicitadas para a implementação do frontend e integração com backend mockado.

| Requisito | Implementação |
| --- | --- |
| React | componentes funcionais e hooks em `src/` |
| ES6+ | utilizado em toda a aplicação |
| Framework de estilização | Tailwind CSS v4 |
| Responsividade | breakpoints responsivos do Tailwind |
| React Hook Form | formulários estruturados da aplicação |
| Zod | schemas em `src/schemas/` |
| TanStack Query | hooks em `src/queries/` |
| JSON Server | `server/server.js` + `db.json` |
| Dados iniciais | `server/db.seed.json` |
| API HTTP | Axios centralizado em `src/api/axios.js` |

---

## 4. Como executar

### Pré-requisitos

- **Node.js 20.19 ou superior**
- npm

Para verificar as versões:

```bash
node --version
npm --version
```

### Instalação

Na raiz do repositório:

```bash
cd frontend
npm install
```

### Executar frontend e backend juntos

```bash
npm run dev:all
```

Serviços utilizados:

| Serviço | Endereço |
| --- | --- |
| Frontend | `http://localhost:5173` |
| API | `http://localhost:3001` |

### Executar separadamente

Terminal 1:

```bash
npm run server
```

Terminal 2:

```bash
npm run dev
```

### Scripts disponíveis

| Comando | Função |
| --- | --- |
| `npm run dev` | inicia somente o Vite |
| `npm run server` | inicia somente o JSON Server |
| `npm run dev:all` | inicia frontend e backend juntos |
| `npm run db:reset` | restaura os dados iniciais |
| `npm run build` | gera a build de produção |
| `npm run preview` | executa localmente a build |
| `npm run lint` | executa o ESLint |

### Restaurar o banco inicial

```bash
npm run db:reset
```

O comando copia novamente os dados de:

```text
frontend/server/db.seed.json
```

para:

```text
frontend/db.json
```

---

## 5. Contas de teste

O banco inicial possui usuários para os três perfis do sistema.

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Aluno | `aluno@hubbcc.br` | `123456` |
| Monitor | `monitor@hubbcc.br` | `123456` |
| Administrador | `admin@hubbcc.br` | `123456` |

Os dados utilizados durante a execução são persistidos em:

```text
frontend/db.json
```

Portanto, cadastros, alterações e exclusões permanecem salvos enquanto o banco não for restaurado.

---

## 6. Arquitetura

O frontend está organizado em camadas.

```text
PAGES
  ↓
QUERIES
  ↓
SERVICES
  ↓
AXIOS
  ↓
JSON SERVER
  ↓
db.json
```

### Pages

As páginas representam as telas da aplicação.

```text
src/pages/
```

Elas utilizam componentes, hooks e queries para montar a interface.

### Queries

A camada:

```text
src/queries/
```

centraliza os hooks do TanStack Query.

Ela é responsável por:

- buscar dados;
- executar mutations;
- controlar loading e erro;
- manter cache;
- invalidar consultas após alterações.

### Services

A camada:

```text
src/service/
```

contém as funções responsáveis pelas requisições HTTP.

Exemplos:

```text
authService.js
oportunidadeService.js
apoioService.js
agendamentoService.js
atividadeService.js
```

### Axios

A configuração da comunicação HTTP fica centralizada em:

```text
src/api/axios.js
```

As páginas não precisam criar novas instâncias do Axios.

### JSON Server

O backend acadêmico é executado por:

```text
frontend/server/server.js
```

e utiliza:

```text
frontend/db.json
```

como banco persistente.

---

## 7. Estrutura de pastas

```text
frontend/
│
├── server/
│   ├── server.js
│   └── db.seed.json
│
├── db.json
│
├── public/
│
├── src/
│   ├── api/
│   │   └── axios.js
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── rotas/
│   │   └── ui/
│   │
│   ├── contexts/
│   │
│   ├── hooks/
│   │   └── usePermissao.js
│   │
│   ├── lib/
│   │   └── queryClient.js
│   │
│   ├── pages/
│   │   ├── agendamentos/
│   │   ├── apoio/
│   │   ├── atividades/
│   │   ├── cadastro/
│   │   ├── disciplinas/
│   │   ├── home/
│   │   ├── landing/
│   │   ├── login/
│   │   ├── oportunidades/
│   │   ├── perfil/
│   │   └── recuperarSenha/
│   │
│   ├── queries/
│   │
│   ├── schemas/
│   │
│   ├── service/
│   │
│   ├── utils/
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env.example
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

Os mocks antigos em `src/mocks` foram removidos após a migração definitiva para JSON Server.

Arquivos vazios ou não utilizados também foram removidos durante a limpeza final do projeto.

---

## 8. Telas e rotas

### Área pública

| Tela | Rota |
| --- | --- |
| Landing page | `/` |
| Login | `/login` |
| Cadastro | `/cadastro` |
| Recuperar senha | `/recuperar-senha` |
| Nova senha | `/nova-senha` |

### Área autenticada

| Tela | Rota |
| --- | --- |
| Home | `/app` |
| Lista de oportunidades | `/app/oportunidades` |
| Detalhe da oportunidade | `/app/oportunidades/:id` |
| Realizar candidatura | `/app/oportunidades/:id/candidatura` |
| Minhas candidaturas | `/app/candidaturas` |
| Cadastrar oportunidade | `/app/oportunidades/nova` |
| Editar oportunidade | `/app/oportunidades/:id/editar` |
| Avaliar candidaturas | `/app/oportunidades/:id/candidaturas` |
| Lista de apoio acadêmico | `/app/apoio` |
| Criar oferta | `/app/apoio/nova` |
| Detalhe da oferta | `/app/apoio/:id` |
| Agendar atendimento | `/app/apoio/:id/agendar` |
| Editar oferta | `/app/apoio/:id/editar` |
| Meus agendamentos | `/app/agendamentos` |
| Registrar atendimento | `/app/agendamentos/:id/registrar` |
| Atividades complementares | `/app/atividades` |
| Registrar atividade | `/app/atividades/nova` |
| Editar atividade | `/app/atividades/:id/editar` |
| Gerenciar disciplinas | `/app/disciplinas` |
| Perfil | `/app/perfil` |

### Telas de sistema

| Tela | Rota |
| --- | --- |
| Acesso não autorizado | `/sem-acesso` |
| Página não encontrada | demais rotas inválidas |

---

## 9. Casos de uso e funcionalidades

A prototipagem inicial definiu **20 casos de uso**.

Durante o refinamento da prototipagem e a construção da Matriz CRUD, foram identificadas **9 funcionalidades adicionais**, totalizando **29 operações previstas no escopo refinado**.

### Oportunidades acadêmicas

| Funcionalidade | Situação |
| --- | --- |
| Cadastrar oportunidade acadêmica | Implementado |
| Consultar oportunidades acadêmicas | Implementado |
| Filtrar oportunidades | Implementado |
| Alterar oportunidade acadêmica | Implementado |
| Encerrar oportunidade acadêmica | Implementado |
| Excluir oportunidade acadêmica | Implementado |

A exclusão definitiva remove também as candidaturas vinculadas à oportunidade.

### Candidaturas

| Funcionalidade | Situação |
| --- | --- |
| Realizar candidatura | Implementado |
| Consultar candidaturas | Implementado |
| Avaliar candidatura | Implementado |
| Cancelar candidatura | Implementado |

A avaliação permite aprovar ou reprovar candidaturas associadas a uma oportunidade.

### Apoio acadêmico

| Funcionalidade | Situação |
| --- | --- |
| Criar oferta de apoio acadêmico | Implementado |
| Consultar ofertas de apoio | Implementado |
| Filtrar ofertas | Implementado |
| Alterar oferta | Implementado |
| Cancelar oferta | Implementado |

### Agendamentos

| Funcionalidade | Situação |
| --- | --- |
| Realizar agendamento | Implementado |
| Consultar agendamentos | Implementado |
| Reagendar atendimento | Implementado |
| Registrar realização do atendimento | Implementado |
| Avaliar atendimento | Implementado |
| Cancelar agendamento | Implementado |

Ao cancelar um agendamento confirmado, a vaga correspondente volta a ficar disponível.

### Atividades complementares

| Funcionalidade | Situação |
| --- | --- |
| Registrar atividade complementar | Implementado |
| Consultar atividades e horas | Implementado |
| Alterar atividade complementar | Implementado |
| Excluir atividade complementar | Implementado |

### Disciplinas

| Funcionalidade | Situação |
| --- | --- |
| Cadastrar disciplina | Implementado |
| Consultar disciplinas | Implementado |
| Alterar disciplina | Implementado |
| Excluir disciplina | Implementado |

O gerenciamento de disciplinas é disponibilizado ao perfil de administrador.

---

## 10. Modelo de dados

As coleções principais utilizadas no `db.json` são:

```text
usuarios
disciplinas
oportunidades
candidaturas
ofertas
agendamentos
atividades
config
```

### Usuário

```js
{
  id,
  nome,
  email,
  senha,
  perfil,
  matricula,
  curso,
  periodo,
  telefone,
  iniciais
}
```

Perfis disponíveis:

```text
aluno
monitor
admin
```

### Disciplina

```js
{
  id,
  codigo,
  nome,
  periodo
}
```

### Oportunidade

```js
{
  id,
  titulo,
  tipo,
  area,
  departamento,
  responsavel,
  descricao,
  requisitos,
  atividades,
  bolsa,
  cargaHoraria,
  modalidade,
  local,
  vagas,
  prazoInscricao,
  situacao
}
```

### Candidatura

```js
{
  id,
  usuarioId,
  oportunidadeId,
  oportunidadeTitulo,
  tipo,
  dataEnvio,
  carta,
  situacao
}
```

### Oferta de apoio

```js
{
  id,
  disciplinaId,
  disciplina,
  titulo,
  assunto,
  monitorId,
  monitor,
  tipo,
  modalidade,
  local,
  gratuita,
  valor,
  vagas,
  vagasOcupadas,
  descricao,
  horarios
}
```

### Agendamento

```js
{
  id,
  usuarioId,
  ofertaId,
  titulo,
  disciplina,
  monitor,
  data,
  hora,
  modalidade,
  local,
  situacao,
  avaliacao,
  registro
}
```

### Atividade complementar

```js
{
  id,
  usuarioId,
  titulo,
  categoria,
  data,
  horas,
  descricao,
  situacao,
  comprovante,
  comprovanteArquivo
}
```

### Configuração

```js
{
  metaHorasComplementares: 200
}
```

---

## 11. Backend mockado com JSON Server

O projeto utiliza **JSON Server 0.17.4** como backend acadêmico.

O servidor é iniciado por:

```text
frontend/server/server.js
```

O banco utilizado durante a execução é:

```text
frontend/db.json
```

Os dados iniciais ficam em:

```text
frontend/server/db.seed.json
```

### CRUD

O JSON Server fornece operações REST para as principais coleções.

Exemplos:

```text
GET    /oportunidades
GET    /oportunidades/:id
POST   /oportunidades
PUT    /oportunidades/:id
DELETE /oportunidades/:id
```

O mesmo modelo é utilizado para disciplinas, candidaturas, ofertas, agendamentos e atividades.

### Rotas adicionais

O servidor também implementa operações específicas necessárias para o projeto, incluindo autenticação, recuperação de senha, resumo de atividades e restauração dos dados.

### Regras de negócio

Entre as regras tratadas pela aplicação e pelo servidor estão:

- impedir candidatura duplicada;
- impedir candidatura em oportunidade encerrada;
- controlar vagas de ofertas;
- impedir conflitos de agendamento;
- devolver vaga ao cancelar agendamento;
- calcular horas complementares;
- impedir e-mails duplicados;
- restaurar dados de teste;
- remover candidaturas vinculadas ao excluir definitivamente uma oportunidade.

---

## 12. TanStack Query

O projeto utiliza TanStack Query para trabalhar com dados remotos.

A configuração principal fica em:

```text
src/lib/queryClient.js
```

e o provider é carregado em:

```text
src/main.jsx
```

Os hooks ficam em:

```text
src/queries/
```

Exemplos:

```text
useOportunidades.js
useApoio.js
useAgendamentos.js
useAtividades.js
useAcesso.js
```

### Consultas

Exemplo:

```jsx
const {
  data = [],
  isLoading,
  isError,
  error,
  refetch,
} = useOportunidades();
```

### Alterações

Exemplo:

```jsx
const excluir = useExcluirOportunidade();

excluir.mutate(id);
```

### Cache

Depois de cadastros, alterações e exclusões, as consultas relacionadas são invalidadas.

Exemplo:

```js
qc.invalidateQueries({
  queryKey: chaves.oportunidades.todas,
});
```

Isso permite atualizar a interface sem recarregar manualmente a página.

---

## 13. Formulários e validação

Os principais formulários da aplicação utilizam:

- React Hook Form;
- Zod;
- `zodResolver`.

Os schemas ficam em:

```text
src/schemas/
```

Exemplo:

```js
const schema = z.object({
  titulo: z
    .string()
    .min(5, "Informe um titulo valido."),
});
```

Integração com o formulário:

```js
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(schema),
});
```

Entre os fluxos que utilizam essa estrutura estão:

- login;
- cadastro;
- recuperação de senha;
- oportunidades;
- candidaturas;
- ofertas de apoio;
- agendamentos;
- avaliações;
- atividades complementares;
- dados de perfil.

O gerenciamento de disciplinas utiliza um formulário administrativo simples com validação local dos campos.

---

## 14. Design e responsividade

O projeto utiliza **Tailwind CSS v4**.

Os tokens globais e estilos reutilizáveis ficam em:

```text
src/index.css
```

### Classes e componentes reutilizáveis

A aplicação possui componentes compartilhados em:

```text
src/components/ui/
```

Exemplos:

- `Botao`;
- `Campo`;
- `Alerta`;
- `Selo`;
- `Modal`;
- `Estado`;
- `Skeleton`;
- `Progresso`;
- `Estrelas`;
- `GradeHorarios`;
- `VisualizadorArquivo`;
- `Avatar`;
- `Cabecalho`.

### Responsividade

A responsividade utiliza os breakpoints do Tailwind.

Exemplo:

```jsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
```

A navegação lateral também possui comportamento adaptado para dispositivos móveis.

Em telas menores:

- o menu fica recolhido;
- um botão na barra superior abre a navegação;
- há uma camada de fundo para fechamento;
- o menu pode ser fechado ao selecionar uma opção.

---

## 15. Controle de acesso

O sistema possui autenticação e rotas privadas.

O componente utilizado é:

```text
src/components/rotas/RotaPrivada.jsx
```

Todas as rotas em:

```text
/app
```

exigem autenticação.

Algumas áreas também possuem restrição específica de perfil.

### Oportunidades gerenciais

As rotas de:

- cadastrar oportunidade;
- editar oportunidade;
- avaliar candidaturas;

são protegidas para:

```text
monitor
admin
```

### Disciplinas

A rota:

```text
/app/disciplinas
```

é restrita ao perfil:

```text
admin
```

O item correspondente no menu também é exibido apenas para administradores.

---

## 16. Convenções de código

### Componentes

Utilizar PascalCase:

```text
DetalheOportunidade.jsx
RealizarAgendamento.jsx
Disciplinas.jsx
```

### Funções e variáveis

Utilizar camelCase:

```js
buscarOportunidade
aoSalvar
usuarioLogado
```

### Hooks

Hooks React devem começar com `use`:

```js
useOportunidades
useDisciplinas
usePermissao
```

### Requisições

O fluxo preferencial é:

```text
Página
  ↓
Query
  ↓
Service
  ↓
Axios
```

As páginas devem evitar realizar requisições diretamente com Axios.

### Dados remotos

Utilizar TanStack Query para:

- consultas;
- mutations;
- carregamento;
- tratamento de erro;
- cache;
- invalidação.

### Estilização

Utilizar Tailwind CSS e os componentes reutilizáveis existentes.

### Commits

Os commits devem possuir mensagens claras.

Exemplos:

```text
feat: add discipline management page
feat: add opportunity deletion action
docs: update installation and user manual
chore: remove obsolete mocks
```

---

## 17. Situação atual do projeto

A versão atual possui:

- frontend em React;
- layout com Tailwind CSS;
- navegação responsiva;
- autenticação;
- rotas privadas;
- perfis de aluno, monitor e administrador;
- backend mockado com JSON Server;
- persistência em `db.json`;
- dados iniciais para demonstração;
- TanStack Query para dados remotos;
- React Hook Form e Zod nos principais formulários;
- oportunidades acadêmicas;
- candidaturas;
- avaliação de candidaturas;
- apoio acadêmico;
- agendamentos;
- registro e avaliação de atendimentos;
- atividades complementares;
- acompanhamento de horas;
- CRUD de disciplinas;
- exclusão de oportunidades com remoção de candidaturas vinculadas;
- componentes reutilizáveis;
- navegação adaptada para dispositivos móveis;
- manual de instalação e utilização atualizado;
- documento de arquitetura e boas práticas atualizado.

O escopo funcional registrado na **Matriz CRUD refinada** está representado na aplicação.

Antes de uma entrega ou demonstração, recomenda-se executar o sistema com os dados iniciais e percorrer os principais fluxos para validação final.

---

## 18. Documentação

A documentação principal está em:

```text
documents/
```

### Prototipagem inicial

```text
documents/doc/initial-prototyping/01-prototipagem.md
```

Contém:

- propósito do sistema;
- business case;
- processo de negócio;
- casos de uso iniciais;
- entidades de domínio.

### Refinamento da prototipagem

```text
documents/doc/diagrams-and-matrices/02-refinamento-prototipagem.md
```

Contém:

- Matriz CRUD;
- Matriz Perfil x Funcionalidade;
- funcionalidades adicionadas durante o refinamento;
- priorização;
- divisão de responsabilidades entre os integrantes.

### Manual

```text
documents/doc/manual.md
```

Contém:

- pré-requisitos;
- instalação;
- execução;
- contas de teste;
- perfis;
- instruções de utilização;
- problemas comuns.

### Boas práticas

```text
documents/doc/boasPraticas.md
```

Contém:

- arquitetura;
- organização de pastas;
- padrão das queries e services;
- formulários;
- responsividade;
- nomenclatura;
- padrões de desenvolvimento.

---

## 19. Equipe

| Integrante |
| --- |
| Geovanne Gomes de Souza |
| Marina Motta Sampaio |
| Mina Iura Mathias Monteiro |
| Samuel Trindade Sabino da Silva |

---

## HubBCC

**Centralizando oportunidades, apoio acadêmico e desenvolvimento dos alunos de Ciência da Computação em um único ambiente.**
