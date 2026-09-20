# HubBCC

**Plataforma de apoio e desenvolvimento acadêmico**
Bacharelado em Ciência da Computação

Sistema web que reúne, em um único ambiente, as oportunidades acadêmicas do curso, o apoio entre alunos (monitorias e tutorias) e o controle de horas complementares.

---

## Sumário

1. [O problema e a proposta](#1-o-problema-e-a-proposta)
2. [Tecnologias](#2-tecnologias)
3. [Como executar](#3-como-executar)
4. [Contas de teste](#4-contas-de-teste)
5. [Arquitetura](#5-arquitetura)
6. [Estrutura de pastas](#6-estrutura-de-pastas)
7. [Telas implementadas](#7-telas-implementadas)
8. [Casos de uso](#8-casos-de-uso)
9. [Modelo de dados](#9-modelo-de-dados)
10. [API simulada](#10-api-simulada)
11. [Design system](#11-design-system)
12. [Convenções de código](#12-convenções-de-código)
13. [Situação atual do projeto](#13-situação-atual-do-projeto)
14. [Ligando o backend real](#14-ligando-o-backend-real)
15. [Equipe](#15-equipe)

---

## 1. O problema e a proposta

Hoje o aluno de BCC precisa recorrer a canais dispersos — murais, grupos de mensagem, e-mails de departamento, planilhas pessoais — para três coisas que são centrais na graduação:

| Necessidade | Como é hoje | Como fica no HubBCC |
|---|---|---|
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
|---|---|---|
| Biblioteca de UI | **React 19** | construção das interfaces por componentes |
| Build e dev server | **Vite** | compilação rápida e recarregamento instantâneo |
| Estilo | **Tailwind CSS v4** | estilização por classes utilitárias e tokens de tema |
| Roteamento | **React Router DOM v7** | navegação entre telas sem recarregar a página |
| HTTP | **axios** | comunicação com a API |
| API simulada | **axios-mock-adapter** | backend falso para desenvolvimento e testes |
| Ícones | **lucide-react** | biblioteca de ícones |
| Qualidade | **ESLint** | padronização e detecção de erros |

**Por que Tailwind v4:** dispensa o `tailwind.config.js`. Todo o tema (cores, fontes) é declarado em CSS dentro de `@theme`, o que reduz a configuração a um único arquivo.

**Por que mock e não backend:** permite que o frontend seja desenvolvido, demonstrado e avaliado de forma independente, sem depender de servidor, banco de dados ou infraestrutura. A troca pelo backend real é uma mudança de configuração, não de código.

---

## 3. Como executar

### Pré-requisitos

- Node.js 18 ou superior
- npm

### Passos

```bash
cd frontend
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173`.

### Scripts disponíveis

| Comando | O que faz |
|---|---|
| `npm run dev` | sobe o servidor de desenvolvimento |
| `npm run build` | gera a versão de produção na pasta `dist` |
| `npm run preview` | testa localmente a versão de produção |
| `npm run lint` | verifica o padrão do código |


## 4. Contas de teste

O sistema já vem com três usuários cadastrados, um para cada perfil:

| E-mail | Senha | Perfil | Para que serve |
|---|---|---|---|
| `aluno@hubbcc.br` | `123456` | aluno | visão de quem busca oportunidades e agenda monitorias |
| `monitor@hubbcc.br` | `123456` | monitor | visão de quem oferece apoio e gerencia atendimentos |
| `admin@hubbcc.br` | `123456` | admin | visão de gestão do curso |

**Persistência:** os dados ficam no `localStorage` do navegador. Tudo que você criar — uma oferta, um agendamento, uma atividade — continua lá depois de recarregar a página.

**Para voltar ao estado inicial:** acesse **Perfil → Resetar dados de teste**. Útil para demonstrar o sistema do zero.

---

## 5. Arquitetura

O projeto segue uma separação em camadas. Cada camada só conversa com a vizinha, nunca pula etapas:

```
┌─────────────────────────────────────────────────────────┐
│  PAGES          telas que o usuário vê                  │
│                 ex.: RealizarAgendamento.jsx            │
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
                         │ interceptado em modo mock
┌────────────────────────▼────────────────────────────────┐
│  MOCKADAPTER    servidor falso: rotas e regras          │
└────────────────────────┬────────────────────────────────┘
                         │ lê e grava
┌────────────────────────▼────────────────────────────────┐
│  MOCKS/DB       dados em memória + localStorage         │
└─────────────────────────────────────────────────────────┘
```

### A regra de ouro

> **Nenhuma tela chama `axios` diretamente.** Se uma tela precisa de dados, ela chama uma função de `src/service/`.

Essa regra é o que permite trocar o backend simulado pelo real **sem alterar uma única tela**. É também o que mantém a lógica de negócio fora dos componentes visuais.

### Decisões de projeto

| Decisão | Motivo |
|---|---|
| Camada `service` separada | isola as telas das rotas da API; se um endpoint mudar de nome, muda em um arquivo só |
| Contexto de autenticação | o usuário logado fica acessível em qualquer componente sem passar props em cascata |
| Hooks próprios (`useRequisicao`, `useFormulario`) | eliminam a repetição de "carregando / erro / dados" e do controle de formulários em 22 telas |
| Componentes de UI reutilizáveis | garantem consistência visual e reduzem o código de cada tela |
| Persistência em `localStorage` | o estado sobrevive ao recarregamento, tornando a demonstração realista |
| Atraso artificial de 350ms no mock | força o tratamento correto dos estados de carregamento |

---

## 6. Estrutura de pastas

```
frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── axios.js            instância do axios: baseURL, token, tratamento de erro
│   │   └── mockAdapter.js      servidor falso: todos os endpoints e regras de negócio
│   │
│   ├── mocks/
│   │   └── db.js               banco de dados falso + persistência no localStorage
│   │
│   ├── service/                uma função por caso de uso — a ponte entre tela e API
│   │   ├── authService.js          login, cadastro, recuperação de senha
│   │   ├── oportunidadeService.js  oportunidades e candidaturas
│   │   ├── apoioService.js         disciplinas e ofertas de monitoria
│   │   ├── agendamentoService.js   agendar, reagendar, registrar, avaliar
│   │   └── atividadeService.js     atividades complementares e horas
│   │
│   ├── contexts/
│   │   ├── AuthContext.jsx     guarda o usuário logado para toda a aplicação
│   │   └── useAuth.js          atalho de leitura do contexto
│   │
│   ├── hooks/
│   │   ├── useRequisicao.js    busca dados + estados de carregando/erro
│   │   └── useFormulario.js    controle de campos de formulário
│   │
│   ├── components/
│   │   ├── ui/                 peças reutilizáveis de interface
│   │   │   ├── Botao.jsx           5 variantes, 3 tamanhos, estado de carregando
│   │   │   ├── Campo.jsx           input, select e textarea com rótulo e erro
│   │   │   ├── Selo.jsx            etiquetas coloridas por situação
│   │   │   ├── Modal.jsx           janela flutuante com fechamento por ESC
│   │   │   ├── Estado.jsx          telas de carregando, erro e lista vazia
│   │   │   ├── Progresso.jsx       anel e barra de progresso
│   │   │   ├── Estrelas.jsx        avaliação por estrelas
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
│   │       └── RotaPrivada.jsx bloqueia acesso de quem não está logado
│   │
│   ├── pages/                  uma pasta por área do sistema
│   │   ├── landing/            página pública de apresentação
│   │   ├── login/
│   │   ├── cadastro/
│   │   ├── recuperarSenha/
│   │   ├── home/               dashboard
│   │   ├── oportunidades/      lista, detalhe, cadastro, candidatura
│   │   ├── apoio/              ofertas de monitoria e tutoria
│   │   ├── agendamentos/       agendar, listar, registrar
│   │   ├── atividades/         horas complementares
│   │   ├── perfil/
│   │   ├── NotFound.jsx
│   │   └── Unauthorized.jsx
│   │
│   ├── utils/
│   │   └── formatadores.js     data, moeda, iniciais
│   │
│   ├── App.jsx                 MAPA DE ROTAS — comece a leitura por aqui
│   ├── main.jsx                ponto de entrada da aplicação
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
|---|---|---|
| 1 | `src/App.jsx` | todas as telas que existem e seus endereços |
| 2 | `src/mocks/db.js` | o formato de todos os dados do sistema |
| 3 | `src/api/mockAdapter.js` | todos os endpoints e as regras de negócio |
| 4 | `src/pages/oportunidades/MinhasCandidaturas.jsx` | o padrão de uma tela completa |

Todos os arquivos começam com um bloco de comentário explicando o que fazem e como mexer neles.

---

## 7. Telas implementadas

22 telas, todas navegáveis.

### Área pública

| # | Tela | Rota | Descrição |
|---|---|---|---|
| 1 | Abertura / Landing | `/` | apresentação do sistema, indicadores e chamadas para cadastro |
| 2 | Login | `/login` | autenticação com e-mail institucional |
| 3 | Cadastro | `/cadastro` | criação de conta com validação de senha |
| 4 | Recuperar senha | `/recuperar-senha` | envio de link de redefinição |

### Área autenticada

| # | Tela | Rota | Descrição |
|---|---|---|---|
| 5 | Home / Dashboard | `/app` | indicadores, próximos agendamentos e progresso de horas |
| 6 | Oportunidades — lista | `/app/oportunidades` | catálogo com busca e abas por tipo |
| 7 | Oportunidades — filtros | modal na lista | filtro por tipo, modalidade e situação |
| 8 | Oportunidade — detalhe | `/app/oportunidades/:id` | descrição, requisitos, atividades e inscrição |
| 9 | Realizar candidatura | `/app/oportunidades/:id/candidatura` | formulário em 3 etapas com carta de motivação |
| 10 | Cadastrar oportunidade | `/app/oportunidades/nova` | publicação com pré-visualização ao vivo |
| 11 | Minhas candidaturas | `/app/candidaturas` | acompanhamento por situação |
| 12 | Apoio acadêmico — lista | `/app/apoio` | ofertas de monitoria e tutoria com filtros |
| 13 | Apoio — detalhe | `/app/apoio/:id` | horários, avaliações e vagas |
| 14 | Criar oferta de apoio | `/app/apoio/nova` | cadastro com grade de disponibilidade semanal |
| 15 | Realizar agendamento | `/app/apoio/:id/agendar` | calendário mensal com horários disponíveis |
| 16 | Reagendar / cancelar | modal em agendamentos | alteração de data e hora |
| 17 | Meus agendamentos | `/app/agendamentos` | listagem por situação com ações |
| 18 | Registrar atendimento | `/app/agendamentos/:id/registrar` | presença, duração e observações |
| 19 | Avaliar atendimento | modal em agendamentos | nota, etiquetas e comentário |
| 20 | Registrar atividade | `/app/atividades/nova` | categoria, horas e comprovante |
| 21 | Atividades e horas | `/app/atividades` | progresso, distribuição e histórico |
| 22 | Perfil | `/app/perfil` | dados, estatísticas e preferências |

### Telas de sistema

| Tela | Rota | Quando aparece |
|---|---|---|
| Acesso não autorizado | `/sem-acesso` | perfil sem permissão para a rota |
| Página não encontrada | qualquer outra | endereço inexistente |

---

## 8. Casos de uso

Os 20 casos de uso do levantamento de requisitos, e onde cada um está implementado.

### Oportunidades acadêmicas

| # | Caso de uso | Situação | Onde |
|---|---|---|---|
| 1 | Cadastrar oportunidade | ✅ | `CadastrarOportunidade.jsx` |
| 2 | Consultar oportunidades | ✅ | `ListaOportunidades.jsx` |
| 3 | Filtrar oportunidades | ✅ | modal de filtros na lista |
| 4 | Alterar oportunidade | ⚠️ service pronto, falta tela | `alterarOportunidade()` |
| 5 | Encerrar oportunidade | ✅ | `DetalheOportunidade.jsx` |
| 6 | Realizar candidatura | ✅ | `RealizarCandidatura.jsx` |
| 7 | Consultar candidaturas | ✅ | `MinhasCandidaturas.jsx` |
| 8 | Avaliar candidatura | ⚠️ service pronto, falta tela | `avaliarCandidatura()` |

### Apoio acadêmico

| # | Caso de uso | Situação | Onde |
|---|---|---|---|
| 9 | Criar oferta de apoio | ✅ | `CriarOferta.jsx` |
| 10 | Consultar ofertas | ✅ | `ListaApoio.jsx` |
| 11 | Filtrar ofertas | ✅ | filtros da lista de apoio |
| 12 | Alterar oferta | ⚠️ service pronto, falta tela | `alterarOferta()` |
| 13 | Cancelar oferta | ⚠️ service pronto, falta tela | `cancelarOferta()` |

### Agendamentos

| # | Caso de uso | Situação | Onde |
|---|---|---|---|
| 14 | Realizar agendamento | ✅ | `RealizarAgendamento.jsx` |
| 15 | Consultar agendamentos | ✅ | `MeusAgendamentos.jsx` |
| 16 | Reagendar / cancelar | ✅ | modal em `MeusAgendamentos.jsx` |
| 17 | Registrar atendimento | ✅ | `RegistrarAtendimento.jsx` |
| 18 | Avaliar atendimento | ✅ | modal em `MeusAgendamentos.jsx` |

### Atividades complementares

| # | Caso de uso | Situação | Onde |
|---|---|---|---|
| 19 | Registrar atividade | ✅ | `RegistrarAtividade.jsx` |
| 20 | Consultar atividades e horas | ✅ | `AtividadesHoras.jsx` |

**Cobertura: 16 de 20 casos de uso com interface completa.** Os 4 restantes têm a lógica pronta na camada de serviço, faltando apenas a tela — estão mapeados no guia de tarefas.

---

## 9. Modelo de dados

Definido em `src/mocks/db.js`. Este é o contrato que o backend real deverá respeitar.

### Usuário

```js
{
  id, nome, email, senha, perfil,     // "aluno" | "monitor" | "admin"
  matricula, curso, periodo, telefone, iniciais
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
  prazoInscricao, situacao                // "Aberta" | "Encerrada"
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
  tipo, modalidade, local,                // "Monitoria" | "Tutoria"
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
  situacao,                               // "Confirmado" | "Realizado" | "Cancelado"
  avaliacao: { nota, comentario, tags[] } | null,
  registro: { compareceu, duracao, observacoes } | null
}
```

### Atividade complementar

```js
{
  id, usuarioId, titulo, categoria, data, horas,
  situacao,                               // "Aprovada" | "Em analise" | "Recusada"
  comprovante
}
```

---

## 10. API simulada

Definida em `src/api/mockAdapter.js`. São os endpoints que o backend real deverá implementar.

### Autenticação

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/login` | autentica e devolve token + usuário |
| POST | `/auth/cadastro` | cria conta de aluno |
| POST | `/auth/recuperar-senha` | dispara e-mail de redefinição |

### Oportunidades e candidaturas

| Método | Rota | Descrição |
|---|---|---|
| GET | `/oportunidades` | lista com filtros por query string |
| GET | `/oportunidades/:id` | detalhe |
| POST | `/oportunidades` | cadastra |
| PUT | `/oportunidades/:id` | altera ou encerra |
| DELETE | `/oportunidades/:id` | exclui |
| GET | `/candidaturas` | lista por usuário e situação |
| POST | `/candidaturas` | realiza candidatura |
| PUT | `/candidaturas/:id` | aprova ou reprova |
| DELETE | `/candidaturas/:id` | cancela |

### Apoio acadêmico

| Método | Rota | Descrição |
|---|---|---|
| GET | `/disciplinas` | lista de disciplinas |
| GET | `/ofertas` | lista com filtros |
| GET | `/ofertas/:id` | detalhe |
| POST | `/ofertas` | cria oferta |
| PUT | `/ofertas/:id` | altera |
| DELETE | `/ofertas/:id` | cancela |

### Agendamentos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/agendamentos` | lista por usuário e situação |
| POST | `/agendamentos` | agenda |
| PUT | `/agendamentos/:id` | reagenda, registra ou avalia |
| DELETE | `/agendamentos/:id` | cancela e libera a vaga |

### Atividades complementares

| Método | Rota | Descrição |
|---|---|---|
| GET | `/atividades` | lista por usuário e categoria |
| GET | `/atividades/resumo` | totais e percentual de horas |
| POST | `/atividades` | registra |
| PUT | `/atividades/:id` | altera |
| DELETE | `/atividades/:id` | exclui |

### Regras de negócio implementadas no mock

O servidor simulado não apenas devolve dados — ele aplica as validações do sistema:

| Regra | Comportamento |
|---|---|
| Candidatura duplicada | bloqueia se já existe candidatura ativa para a mesma oportunidade |
| Agendamento sem vaga | bloqueia quando `vagasOcupadas >= vagas` |
| Conflito de horário | bloqueia se o aluno já tem agendamento confirmado na mesma data e hora |
| Cancelamento | devolve a vaga à oferta automaticamente |
| Horas complementares | somam apenas atividades com situação "Aprovada" |
| Nova atividade | entra sempre como "Em analise" |
| Cadastro duplicado | bloqueia e-mail já registrado |
| Token expirado | limpa a sessão e redireciona ao login |

---

## 11. Design system

### Paleta

Declarada em `@theme` no topo de `src/index.css`. Alterar ali muda o sistema inteiro.

| Token | Uso |
|---|---|
| `marca-50` … `marca-900` | azul principal: botões, links, destaques |
| `noite-700` … `noite-900` | azul escuro: menu lateral e painéis de acesso |
| `sucesso` / `alerta` / `erro` | situações e mensagens |
| `slate-*` | textos, bordas e fundos neutros |

### Classes utilitárias do projeto

| Classe | O que aplica |
|---|---|
| `.cartao` | cartão branco com borda, cantos arredondados e sombra |
| `.campo` | estilo padrão de input, select e textarea |
| `.rotulo` | rótulo de formulário |
| `.titulo-secao` | título interno de cartão |

### Componentes de interface

| Componente | Variações |
|---|---|
| `<Botao>` | primário, secundário, contorno, perigo, texto · 3 tamanhos · estado de carregando |
| `<Campo>` `<CampoSelecao>` `<CampoTexto>` | rótulo, dica, mensagem de erro |
| `<Selo>` `<SeloSituacao>` | 5 tons · cor automática por situação |
| `<Modal>` | fecha por ESC, clique no fundo ou botão |
| `<Carregando>` `<Erro>` `<Vazio>` | os três estados de qualquer tela com dados |
| `<ProgressoCircular>` `<BarraProgresso>` | indicadores de horas |
| `<Estrelas>` | leitura ou seleção interativa |
| `<Avatar>` | 3 tamanhos |
| `<Cabecalho>` | título, subtítulo e área de ações |

### Hooks próprios

**`useRequisicao`** — elimina a repetição de buscar dados em 22 telas:

```jsx
const { dados, carregando, erro, recarregar } = useRequisicao(
  () => listarOfertas(filtros),
  [filtros],
  []
);
```

**`useFormulario`** — controla todos os campos com um único handler:

```jsx
const { valores, aoMudar } = useFormulario({ email: "", senha: "" });
<Campo name="email" value={valores.email} onChange={aoMudar} />
```

---

## 12. Convenções de código

| Assunto | Padrão | Exemplo |
|---|---|---|
| Componente e página | PascalCase | `RealizarAgendamento.jsx` |
| Função e variável | português, camelCase | `aoSalvar`, `carregando` |
| Handler de evento | prefixo `ao` | `aoEnviar`, `aoFechar` |
| Buscar dados | sempre `useRequisicao` | nunca `useEffect` + `fetch` manual |
| Formulário | sempre `useFormulario` | nunca vários `useState` soltos |
| Cor | apenas tokens do tema | `bg-marca-600`, nunca `bg-[#2447eb]` |
| Cartão | classe `.cartao` | nunca repetir as classes completas |
| Campo | componente `<Campo>` | nunca `<input>` cru |

**Todo arquivo começa com um bloco de comentário** explicando o que faz e como alterá-lo. Nos pontos mais sensíveis — contexto de autenticação, calendário de agendamento, adaptador do mock — os comentários descem a nível de linha.

**Padrão de qualquer tela que busca dados:**

```jsx
const { dados, carregando, erro, recarregar } = useRequisicao(() => meuService(), [], []);

if (carregando) return <Carregando />;
if (erro) return <Erro mensagem={erro} aoTentarNovamente={recarregar} />;
if (!dados.length) return <Vazio titulo="Nada por aqui" />;

return ( /* conteúdo */ );
```

---

## 13. Situação atual do projeto

### Concluído

- 22 telas navegáveis, cobrindo os fluxos principais
- 16 dos 20 casos de uso com interface completa
- Backend simulado com todas as regras de negócio
- Autenticação com sessão persistente e proteção de rotas
- Camada de serviço completa (inclusive para os casos ainda sem tela)
- Biblioteca de componentes e design system
- Documentação em todos os arquivos

### Em aberto

| Item | Prioridade |
|---|---|
| Tela de avaliar candidaturas (aprovar/reprovar) | alta — fecha o fluxo principal |
| Menu lateral no celular | alta — abaixo de 1024px não há navegação |
| Telas de editar oportunidade, oferta e atividade | alta |
| Permissões por perfil aplicadas nas rotas | alta |
| Segunda etapa da recuperação de senha | média |
| Revisão geral de responsividade | média |
| Avaliações dinâmicas no detalhe da monitoria | média |
| Foto de perfil, banner e anexo de PDF | diferencial |
| Animações e microinterações | diferencial |
| Sistema de avisos (toast) e notificações | diferencial |

O detalhamento de cada item, com passo a passo e critérios de conclusão, está no **`GUIA_DE_TAREFAS.md`** (24 tarefas divididas entre a equipe).

---

## 14. Ligando o backend real

Não é necessário alterar nenhuma tela. Crie um arquivo `.env` na pasta `frontend`, usando o `.env.example` como base:

```
VITE_API_URL=http://localhost:8080/api
VITE_USAR_MOCK=false
```

Com `VITE_USAR_MOCK=false`, o `mockAdapter.js` sequer é carregado — o import é dinâmico e fica fora do build de produção. O axios passa a chamar o servidor real.

O backend deve implementar os endpoints listados na [seção 10](#10-api-simulada), respeitando o modelo de dados da [seção 9](#9-modelo-de-dados). Depois que estiver estável, a pasta `src/mocks/` e o arquivo `src/api/mockAdapter.js` podem ser removidos.

---

## 15. Equipe

| Integrante |
|---|---|---|
| Geovanne Gomes de Souza|   
| Marina Motta Sampaio |       
| Mina Iura Mathias Monteiro | 
| Samuel Trindade Sabino da Silva | 

### Documentos do repositório

| Arquivo | Conteúdo |
|---|---|
| `README.md` | este documento |
| `boasPraticas.md` | padrões de ambiente e arquitetura acordados pela equipe |
| `documents/` | documentação de requisitos e casos de uso |

---
