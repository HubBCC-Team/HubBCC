# HubBCC — Frontend

Plataforma de apoio e desenvolvimento academico para alunos do Bacharelado em Ciencia da Computacao.

Projeto **React + Vite + Tailwind v4 + axios**, com **backend simulado (mock)**: nao e preciso servidor para rodar e testar todas as telas.

---

## 1. Como rodar

```bash
cd frontend
npm install
npm run dev
```

Abra `http://localhost:5173`.

> **Sem o Node no PATH?** Se voce usa a versao portatil, chame os executaveis pelo caminho completo:
> ```
> C:\Users\SEU_USUARIO\node-portable\npm.cmd install
> C:\Users\SEU_USUARIO\node-portable\npm.cmd run dev
> ```
> Se o `vite` reclamar que `node` nao e reconhecido, adicione a pasta ao PATH da sessao antes:
> ```
> $env:Path = "C:\Users\SEU_USUARIO\node-portable;" + $env:Path
> ```

### Contas de teste

| E-mail | Senha | Perfil |
|---|---|---|
| aluno@hubbcc.br | 123456 | aluno |
| monitor@hubbcc.br | 123456 | monitor |
| admin@hubbcc.br | 123456 | admin |

Os dados ficam no `localStorage`, entao o que voce criar continua la depois do F5.
Para voltar ao estado inicial: **Perfil → Resetar dados de teste**.

---

## 2. Estrutura de pastas

```
src/
├── api/
│   ├── axios.js          instancia unica do axios (interceptors, token, erros)
│   └── mockAdapter.js    servidor falso: todas as rotas da API
├── mocks/
│   └── db.js             banco de dados falso (usuarios, ofertas, agendamentos...)
├── service/              uma funcao por caso de uso — as telas chamam SO isto
│   ├── authService.js
│   ├── oportunidadeService.js
│   ├── apoioService.js
│   ├── agendamentoService.js
│   └── atividadeService.js
├── contexts/
│   ├── AuthContext.jsx   usuario logado disponivel em toda a aplicacao
│   └── useAuth.js        atalho: const { usuario } = useAuth()
├── hooks/
│   ├── useRequisicao.js  busca dados + carregando + erro (usado em toda tela)
│   └── useFormulario.js  controla campos de formulario
├── components/
│   ├── ui/               Botao, Campo, Selo, Modal, Estrelas, Progresso...
│   ├── layout/           MenuLateral, BarraSuperior, LayoutApp, LayoutAcesso
│   └── rotas/            RotaPrivada (bloqueia quem nao esta logado)
├── pages/                uma pasta por area do sistema
├── utils/formatadores.js data, moeda, iniciais
├── App.jsx               MAPA DE ROTAS — comece a ler por aqui
├── main.jsx              ponto de entrada
└── index.css             Tailwind + cores da marca + classes .cartao/.campo
```

### A regra de ouro

```
Tela  →  service  →  axios  →  mockAdapter  →  db.js
```

Nenhuma tela chama o axios direto. Quando o backend real existir, muda **apenas** a camada `service/api` — nenhuma tela precisa ser alterada.

---

## 3. Telas implementadas

| # | Tela | Rota | Caso de uso |
|---|---|---|---|
| 1 | Abertura / Landing | `/` | — |
| 2 | Login | `/login` | — |
| 3 | Cadastro | `/cadastro` | — |
| 4 | Recuperar senha | `/recuperar-senha` | — |
| 5 | Home / Dashboard | `/app` | — |
| 6 | Oportunidades — lista | `/app/oportunidades` | 2 |
| 7 | Oportunidades — filtros | modal na lista | 3 |
| 8 | Oportunidade — detalhe | `/app/oportunidades/:id` | 2, 5 |
| 9 | Realizar candidatura | `/app/oportunidades/:id/candidatura` | 6 |
| 10 | Cadastrar oportunidade | `/app/oportunidades/nova` | 1 |
| 11 | Minhas candidaturas | `/app/candidaturas` | 7, cancelar |
| 12 | Apoio — lista de monitorias | `/app/apoio` | 10, 11 |
| 13 | Apoio — detalhe | `/app/apoio/:id` | 10 |
| 14 | Criar oferta de apoio | `/app/apoio/nova` | 9 |
| 15 | Realizar agendamento | `/app/apoio/:id/agendar` | 14 |
| 16 | Reagendar / cancelar | modal em agendamentos | 16 |
| 17 | Meus agendamentos | `/app/agendamentos` | 15 |
| 18 | Registrar atendimento | `/app/agendamentos/:id/registrar` | 17 |
| 19 | Avaliar atendimento | modal em agendamentos | 18 |
| 20 | Registrar atividade | `/app/atividades/nova` | 19 |
| 21 | Atividades & Horas | `/app/atividades` | 20 |
| 22 | Perfil | `/app/perfil` | — |

Extras: `/sem-acesso` (perfil sem permissao) e `404` para rotas inexistentes.

---

## 4. Tarefas comuns de manutencao

**Adicionar uma tela**
1. crie o arquivo em `src/pages/area/MinhaTela.jsx`;
2. importe e registre a rota em `src/App.jsx`;
3. se precisar aparecer no menu, adicione um item em `src/components/layout/MenuLateral.jsx`.

**Adicionar um campo em um formulario**
1. inclua a chave no objeto de `useFormulario({ ... })`;
2. adicione um `<Campo name="chave" value={valores.chave} onChange={aoMudar} />`;
3. se o campo precisa ser salvo, inclua-o no objeto enviado ao service.

**Adicionar um endpoint**
1. crie/ajuste o array em `src/mocks/db.js`;
2. copie um bloco `mock.onGet(...)` em `src/api/mockAdapter.js`;
3. crie a funcao correspondente em `src/service/`.

**Mudar as cores do sistema**
Tudo esta em `@theme` no topo de `src/index.css` (`--color-marca-*`, `--color-noite-*`).

---

## 5. Ligando o backend real

Crie um arquivo `.env` na pasta `frontend` (use o `.env.example` como base):

```
VITE_API_URL=http://localhost:8080/api
VITE_USAR_MOCK=false
```

Com `VITE_USAR_MOCK=false`, o `mockAdapter.js` nem e carregado e o axios passa a chamar o servidor real. Os caminhos esperados sao exatamente os que estao no `mockAdapter.js` (`/auth/login`, `/oportunidades`, `/ofertas`, `/agendamentos`, `/atividades`...).

Depois que o backend estiver estavel, as pastas `src/mocks/` e o arquivo `src/api/mockAdapter.js` podem ser apagados.

---

## 6. Equipe

Geovanne Gomes de Souza · Marina Motta Sampaio · Mina Iura Mathias Monteiro · Samuel Trindade Sabino da Silva
