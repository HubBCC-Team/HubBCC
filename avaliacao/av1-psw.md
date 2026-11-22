# Correção da AV1 — PSW — HubBCC

Repositório: https://github.com/HubBCC-Team/HubBCC

A nota de cada aluno é a parte comum do grupo mais a qualidade individual. Quem não tem commit no repositório recebe a parte comum do grupo, sem a parte individual. A parte comum vale 60 pontos: stack da disciplina (30) e escopo funcionando (30). Os 40 restantes avaliam a qualidade do que o próprio aluno fez.

| Aluno | Nota |
| --- | ---: |
| Marina Motta Sampaio | 99 |
| Geovanne Gomes de Souza | 97 |
| Mina Iura Mathias Monteiro | 97 |
| Samuel Trindade Sabino da Silva | 97 |

## Parte comum — 59/60

A correção usou a branch `main`. O README pede `cd frontend`, `npm install` e `npm run dev:all`. Subi a API e o Vite em terminais separados, nas portas 3001 e 5173. O `concurrently` avisa que prefere Node 22; nesta máquina, com Node 20, os dois serviços atenderam.

A stack vale 30/30.

- 5 pontos. React com rotas de oportunidades, apoio, agendamentos, atividades, disciplinas e perfil.
- 5 pontos. React Hook Form com `zodResolver` nos formulários de oferta, agendamento e oportunidade.
- 5 pontos. Zod valida esses mesmos formulários.
- 5 pontos. TanStack Query 5 grava com `useMutation` e invalida as consultas. As chamadas passam pelo Axios em `frontend/src/api/axios.js`, que rejeita a resposta quando o servidor falha.
- 5 pontos. O JSON Server sobe com `npm run server`.
- 5 pontos. Tailwind 4 entra pelo plugin do Vite.

O escopo vale 29/30. A régua é a matriz da `documents/doc/diagrams-and-matrices/02-refinamento-prototipagem.md`: seis entidades, 5 pontos cada. Entrei com as contas do README. Candidatura e atividade complementar foram percorridas na revisão da correção, sobre a mesma versão do repositório.

- 4 pontos, oferta de apoio. O monitor criou "Tutoria AV1 de Grafos", que ficou como oferta `7`, e a edição gravou o título "Tutoria AV1 de Grafos Editada". A lista, filtrada por Engenharia de Software, mostrou só essa oferta. O botão de cancelar a oferta apareceu na edição, e eu não o executei.
- 5 pontos, agendamento. A aluna marcou 12/10/2026 às 14:00. O registro `4` ficou `Confirmado`. O reagendamento passou a data para 19/10/2026, e o cancelamento gravou `Cancelado`.
- 5 pontos, disciplina. A administração cadastrou BCC401 "Grafos AV1", período 7. A alteração gravou "Grafos AV1 Editada". A exclusão devolveu 404 para `GET /disciplinas/7`.
- 5 pontos, oportunidade. A administração publicou "Pesquisa AV1 de Grafos", prazo 30/11/2026. A edição gravou "Pesquisa AV1 de Grafos Editada", a ficha mostrou esse título, e a exclusão devolveu 404 para `GET /oportunidades/7`.
- 5 pontos, candidatura. A aluna enviou a carta para a oportunidade `3`, e o registro `4` ficou `Em analise`. A administração abriu as candidaturas dessa oportunidade e aprovou; o registro passou a `Aprovada`. O cancelamento da candidatura `1` pela aluna devolveu 404 para `GET /candidaturas/1`.
- 5 pontos, atividade complementar. A aluna registrou "Atividade AV1 Recorrecao", Evento, 8 horas, com comprovante, e o registro `5` ficou `Em analise`. A edição gravou o título "Atividade AV1 Recorrecao Editada" e 12 horas. A exclusão devolveu 404 para `GET /atividades/5`. As atividades aprovadas ficam com a edição bloqueada, como o aviso da tela descreve.

Os dois commits de Erick Martins Silva só reorganizam documentos de GPTI. A equipe de PSW no refinamento é Geovanne, Marina, Mina e Samuel.

## Marina Motta Sampaio — 99

A maior parte da interface, das permissões e dos ajustes de agendamento está no nome dela. A nota reúne os 59 pontos do grupo e 40 de qualidade.

O login das três contas abriu o painel no nome certo. A oferta, o agendamento e a oportunidade que a correção gravou passaram pelas telas e continuaram na API depois do envio.

## Geovanne Gomes de Souza — 97

A página de disciplinas, a exclusão de oportunidade e a avaliação de candidaturas estão no nome dele. A nota reúne os 59 pontos do grupo e 38 de qualidade.

O filtro de Engenharia de Software na lista de apoio deixou só a tutoria criada nesta correção. O cadastro, a alteração e a exclusão de BCC401 funcionaram.

Desconto na parte individual:

- 2 pontos. `frontend/src/pages/disciplinas/Disciplinas.jsx` guarda código, nome e período em `useState` e mostra uma mensagem única, "Preencha todos os campos." Os outros formulários do projeto usam React Hook Form e Zod, com o erro de cada campo separado do erro do servidor.

## Mina Iura Mathias Monteiro — 97

A estrutura inicial do Vite, a passagem para a stack da disciplina e os ajustes de contexto e ESLint estão no nome dela, também nos autores `0M1n40` e `Seu Nome`, com o mesmo e-mail. A nota reúne os 59 pontos do grupo e 38 de qualidade.

O commit `209260d`, "Bugfix: ajustes finais e transição de stacks", altera 52 arquivos. Vale perguntar a ela como essa transição foi feita.

Desconto na parte individual:

- 2 pontos. Em `frontend/src/pages/recuperarSenha/NovaSenha.jsx`, a barra de força da senha usa estilo direto na largura. O trecho está nesse commit.

## Samuel Trindade Sabino da Silva — 97

A modernização da interface, as animações, a validação da nova senha e as rotas protegidas de edição estão no nome dele. A nota reúne os 59 pontos do grupo e 38 de qualidade.

Desconto na parte individual:

- 2 pontos. O commit `5ff6e6c` coloca estilo direto no atraso da animação dos cartões, em `frontend/src/pages/oportunidades/ListaOportunidades.jsx` e `frontend/src/pages/apoio/ListaApoio.jsx`, e na largura da barra em `frontend/src/components/ui/Progresso.jsx`.
