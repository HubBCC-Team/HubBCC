# Refinamento da Prototipagem – Semana 5

**Disciplina:** PSW  
**Equipe:** Geovanne Gomes de Souza, Marina Motta Sampaio, Mina Iura Mathias Monteiro e Samuel Trindade Sabino da Silva  
**Data de entrega:** 29/09/2026

## Sumário

- [1. Matriz CRUD](#1-matriz-crud)
- [2. Matriz Perfil x Funcionalidade](#2-matriz-perfil-x-funcionalidade)
- [3. Priorização dos Requisitos de Apoio Acadêmico e Disciplinas e definição de responsáveis](#3-priorização-dos-requisitos-de-apoio-acadêmico-e-disciplinas-e-definição-de-responsáveis)

---

## 1. Matriz CRUD

C = criadas, R = lidas, U = atualizadas, D = excluídas.

| Funcionalidade | Oportunidade Acadêmica | Candidatura | Oferta de Apoio | Agendamento | Atividade Complementar | Disciplina |
|---|---|---|---|---|---|---|
| Cadastrar oportunidade acadêmica | C |  |  |  |  |  |
| Consultar oportunidades acadêmicas | R |  |  |  |  |  |
| Filtrar oportunidades | R |  |  |  |  |  |
| Alterar oportunidade acadêmica | U |  |  |  |  |  |
| Encerrar oportunidade acadêmica | U |  |  |  |  |  |
| Excluir oportunidade acadêmica | D |  |  |  |  |  |
| Realizar candidatura | R | C |  |  |  |  |
| Consultar candidaturas | R | R |  |  |  |  |
| Avaliar candidatura |  | U |  |  |  |  |
| Cancelar candidatura |  | D |  |  |  |  |
| Criar oferta de apoio acadêmico |  |  | C |  |  |  |
| Consultar ofertas de apoio |  |  | R |  |  |  |
| Filtrar ofertas de apoio |  |  | R |  |  |  |
| Alterar oferta de apoio |  |  | U |  |  |  |
| Cancelar oferta de apoio |  |  | D |  |  |  |
| Realizar agendamento |  |  | R | C |  |  |
| Consultar agendamentos |  |  | R | R |  |  |
| Reagendar atendimento |  |  | R | U |  |  |
| Registrar realização do atendimento |  |  |  | U |  |  |
| Avaliar atendimento |  |  |  | U |  |  |
| Cancelar agendamento |  |  |  | D |  |  |
| Registrar atividade complementar |  |  |  |  | C |  |
| Consultar atividades e horas complementares |  |  |  |  | R |  |
| Alterar atividade complementar |  |  |  |  | U |  |
| Excluir atividade complementar |  |  |  |  | D |  |
| Cadastrar disciplina |  |  |  |  |  | C |
| Consultar disciplina |  |  |  |  |  | R |
| Alterar disciplina |  |  |  |  |  | U |
| Excluir disciplina |  |  |  |  |  | D |

Casos de uso adicionados a partir da análise da Matriz CRUD: excluir oportunidade acadêmica, cancelar candidatura, cancelar agendamento, alterar atividade complementar, excluir atividade complementar, cadastrar disciplina, consultar disciplina, alterar disciplina e excluir disciplina.

## 2. Matriz Perfil x Funcionalidade

A matriz relaciona os perfis de usuário às funcionalidades previstas para cada um no sistema.

- **X:** possui acesso à funcionalidade
- **Aluno:** utiliza os recursos de consulta, agendamento e acompanhamento
- **Monitor:** gerencia as ofertas/sessões de apoio e registra os atendimentos
- **Administrador:** gerencia dados de suporte do sistema, como as disciplinas

| Funcionalidade | Aluno | Monitor | Administrador |
|---|---|---|---|
| Consultar monitoria | X |  |  |
| Filtrar disciplina | X |  |  |
| Realizar agendamento | X |  |  |
| Consultar agendamento | X |  |  |
| Reagendar agendamento | X |  |  |
| Cancelar agendamento | X |  |  |
| Criar sessão de apoio |  | X |  |
| Consultar sessão |  | X |  |
| Registrar realização do atendimento |  | X |  |
| Alterar sessão |  | X |  |
| Cancelar sessão |  | X |  |
| Cadastrar disciplina |  |  | X |
| Consultar disciplina |  |  | X |
| Alterar disciplina |  |  | X |
| Excluir disciplina |  |  | X |

A separação por perfil permite controlar quais ações cada usuário pode executar e também orienta a implementação das permissões e rotas protegidas do sistema.

## 3. Priorização dos Requisitos de Apoio Acadêmico e Disciplinas e definição de responsáveis
A priorização apresentada nesta seção corresponde às funcionalidades relacionadas ao módulo de Apoio Acadêmico, seus agendamentos e ao gerenciamento de disciplinas. Os demais módulos do HubBCC, como Oportunidades Acadêmicas, Candidaturas e Atividades Complementares, permanecem definidos no documento de prototipagem inicial e na Matriz CRUD apresentada anteriormente.

| Prioridade | Caso de Uso | Ator | Responsável | O que o responsável deve fazer |
|---|---|---|---|---|
| 1 | Realizar agendamento | Aluno | Mina | Desenvolver e acompanhar o fluxo principal de agendamento de vagas pelo aluno. |
| 2 | Consultar monitoria | Aluno | Marina | Implementar a listagem de sessões de monitoria disponíveis para visualização. |
| 3 | Filtrar disciplina | Aluno | Geovanne | Desenvolver o recurso de filtro por disciplina nas consultas de monitoria. |
| 4 | Criar sessão | Monitor | Samuel | Permitir ao monitor cadastrar novas sessões de monitoria no sistema. |
| 5 | Consultar sessão | Monitor | Mina | Possibilitar ao monitor visualizar as sessões criadas ou sob sua responsabilidade. |
| 6 | Consultar agendamento | Aluno | Marina | Permitir ao aluno acompanhar e visualizar seus agendamentos realizados. |
| 7 | Reagendar agendamento | Aluno | Geovanne | Desenvolver a alteração de horário ou sessão de um agendamento pré-existente. |
| 8 | Cancelar agendamento | Aluno | Samuel | Permitir ao aluno cancelar agendamentos anteriores, liberando a vaga. |
| 9 | Registrar aula | Monitor | Mina | Implementar o registro de realização da aula ou atendimento pelo monitor. |
| 10 | Alterar sessão | Monitor | Marina | Permitir a edição de dados (data, horário e vagas) de sessões já criadas. |
| 11 | Cancelar sessão | Monitor | Geovanne | Desenvolver a exclusão ou cancelamento de sessões de monitoria criadas. |
| 12 | Cadastrar disciplina | Administrador | Samuel | Permitir ao administrador a inclusão de novas disciplinas no sistema. |
| 13 | Consultar disciplina | Administrador | Mina | Possibilitar a listagem e visualização das disciplinas cadastradas. |
| 14 | Alterar disciplina | Administrador | Marina | Permitir a atualização de dados das disciplinas já cadastradas. |
| 15 | Excluir disciplina | Administrador | Geovanne | Desenvolver a remoção de disciplinas do sistema de forma segura. |

### Resumo da divisão entre os integrantes

| Integrante | Prioridades | Quantidade de funcionalidades | Responsabilidades principais |
|---|---|---|---|
| Mina | 1, 5, 9, 13 | 4 | Agendamento, consulta de sessões, registro de aulas e consulta de disciplinas. |
| Marina | 2, 6, 10, 14 | 4 | Consulta de monitorias/agendamentos e alterações de sessões e disciplinas. |
| Geovanne | 3, 7, 11, 15 | 4 | Filtros, reagendamentos, cancelamentos de sessões e exclusão de disciplinas. |
| Samuel | 4, 8, 12 | 3 | Criação de sessões, cancelamento de agendamentos e cadastro de disciplinas. |

### Como interpretar a prioridade

A ordem foi definida pensando no fluxo principal do módulo de Apoio Acadêmico:

**Criar sessão de apoio → Consultar ofertas de apoio → Filtrar por disciplina → Escolher uma oferta → Realizar agendamento → Consultar/gerenciar agendamento → Realizar atendimento**

Por isso:

- **Prioridade 1 – Realizar agendamento:** representa o momento em que o aluno efetivamente solicita uma vaga em uma oferta de apoio.
- **Prioridades 2 e 3 – Consultar monitoria e Filtrar disciplina:** permitem ao aluno localizar o apoio acadêmico adequado à sua necessidade.
- **Prioridade 4 – Criar sessão:** é necessária para que existam ofertas disponíveis para agendamento.
- **Prioridades 5 a 11:** dão suporte ao funcionamento e ao acompanhamento das sessões e dos agendamentos.
- **Prioridades 12 a 15:** correspondem ao gerenciamento das disciplinas pelo administrador e possuem prioridade posterior por serem funcionalidades de suporte ao restante do módulo.

Assim, a coluna "Responsável" significa que aquela pessoa fica encarregada de acompanhar e desenvolver aquele caso de uso no trabalho, incluindo sua especificação, implementação/prototipação e verificação de que a funcionalidade está de acordo com os requisitos definidos.

## Referências

O documento de prototipagem inicial pode ser consultado em [01-prototipagem.md](../initial-prototyping/01-prototipagem.md).
