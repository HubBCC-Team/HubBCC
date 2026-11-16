# Status Report 3 — HubBCC

**Versão:** 1.0  
**Data de status:** 16/11/2026  
**Período coberto:** 02/11/2026 a 16/11/2026  
**Marco em foco:** M2 — Sistema integrado ao backend próprio  
**Semanas no período:** S10 GPTI (09/11), S11 PSW (03/11), S12 PSW (10/11) e S11 GPTI (16/11). A S12 GPTI (30/11) ainda não ocorreu no corte.  
**Início da medição de horas:** S8 (06/10/2026)  
**Semanas reconstituídas:** S1 a S7. O desempenho anterior à S8 foi reconstituído como exatamente o planejado: VP = VA = CR = 188 h no acumulado S1–S7.

**Avanço desde o SR2:** a PSW concluiu as rotas em memória que faltavam (Ofertas, Atividades e Disciplinas) e concluiu D14 (APIs de fluxo em memória). O MongoDB (D13.5) continua não iniciado. No SR2, D12 tinha 4 h restantes e D13 tinha 6 h restantes (3 entidades faltando), totalizando 10 h adicionais. D14 (8 h) foi concluída no período. D13.5 (8 h) permanece não iniciada.

## 1. Situação geral

*A preencher por Rafael (G11 — Status Report 3), com base nos números das seções 4, 5, 6, 7 e 8.*

## 2. Escopo desde o Status Report 2

**Pacotes diretamente no escopo do M1 e do M2:** 1.4.1 a 1.4.7 e 1.5.1 a 1.5.9.

**Resumo:** verificados 0; pendentes 13; não demonstrados 3.

| ID do pacote | Pacote / entrega | Critério observável do dicionário | Situação em 16/11 | Evidência ou pendência | Responsável |
|---|---|---|---|---|---|
| 1.4.1 | Interface de oportunidades | Criar, consultar, editar e encerrar oportunidade. | Pendente | Nada feito desde o SR1 | Geovanne |
| 1.4.2 | Interface de candidaturas | Aluno se candidata e consulta status. | Pendente | Q-02 aberta | Marina |
| 1.4.3 | Interface de apoio acadêmico | Criar oferta, consultar, filtrar e agendar. | Pendente | Q-03 e Q-04 abertas | Mina |
| 1.4.4 | Interface de atividades complementares | Registrar atividade com comprovante e consultar total de horas. | Pendente | Q-01 aberta | Samuel |
| 1.4.5 | Interface de disciplinas (administrador) | Administrador cadastra, consulta, altera e exclui disciplina. | Pendente | Nada feito desde o SR1 | Samuel |
| 1.4.6 | Fluxo integrado do M1 | Os fluxos de 1.4.1 a 1.4.5 funcionam em conjunto. | Pendente | Depende de 1.4.3 e 1.4.4 | Geovanne |
| 1.4.7 | Demonstração do M1 | A demonstração da semana 8 executa o roteiro. | Não demonstrado | Sem registro de demonstração/aceite | Gabriel |
| 1.5.1 | API de oportunidades | CRUD persiste no MongoDB e rejeita oportunidade sem data de encerramento. | Pendente | CRUD em memória concluído; MongoDB não iniciado | Marina |
| 1.5.2 | API de candidaturas | Candidatura registrada e visível para o aluno. | Pendente | CRUD e fluxo em memória concluídos; MongoDB não iniciado | Marina |
| 1.5.3 | API de apoio acadêmico | Oferta sem disciplina ou horário não é gravada. | Pendente | CRUD e fluxo em memória concluídos; MongoDB não iniciado | Mina |
| 1.5.4 | API de agendamento | Agendamento confirmado para aluno e monitor. | Pendente | CRUD e fluxo em memória concluídos; MongoDB não iniciado | Geovanne |
| 1.5.5 | API de atividades complementares | Atividade salva com comprovante e horas. | Pendente | CRUD em memória concluído; MongoDB não iniciado | Samuel |
| 1.5.6 | API de disciplinas | CRUD de disciplinas restrito ao perfil administrador. | Pendente | CRUD em memória concluído; falta MongoDB e verificação de perfil | Samuel |
| 1.5.7 | Cálculo de horas complementares | Total de horas exibido corretamente. | Pendente | Depende de 1.5.5 e da decisão Q-01 | Samuel |
| 1.5.8 | Autenticação e perfis | Rota protegida recusa chamada sem usuário e diferencia aluno, monitor e administrador. | Não demonstrado | D15.1 e D15.2 não iniciadas | Mina |
| 1.5.9 | Persistência de domínio | Oportunidades, agendamentos, disciplinas e atividades continuam após reiniciar a API. | Não demonstrado | D13.5 não iniciada | Samuel |

**Controle do escopo — três perguntas:**

1. **O que está na EAP deste marco foi entregue?**  
   **Não.** D12, D13 e D14 foram concluídas em memória, mas D13.5, D15, D16, D17, D18 e D19 não foram entregues. O M2 não fecha.

2. **O que foi entregue está na EAP?**  
   **Sim.** O avanço desde o SR2 está dentro de D12, D13 e D14. Não foi identificado trabalho novo fora da EAP neste período.

3. **O que foi entregue atende ao aceite do dicionário?**  
   **Não.** O critério de 1.5.9 exige persistência após reiniciar a API; o MongoDB não foi iniciado. Os pacotes 1.5.1 a 1.5.7 permanecem pendentes de verificação com banco. 1.5.8 e 1.5.9 não foram demonstrados.

## 3. Cronograma

*A preencher por Gabriel (G09 — Atualização do cronograma), com base no esforço restante das seções 4 e 5.*

## 4. Valor agregado por atividade

**Unidade:** horas-pessoa (h). **Data-base:** 16/11/2026.  
**Regra de crédito adotada:** 100% para atividades concluídas e verificadas; 50/50 para atividades em andamento com entregas parciais observáveis; 0% para não iniciadas. G11 recebe 100% porque sua entrega é este próprio relatório.  
**Justificativa:** D12, D13 e D14 foram concluídas em memória e recebem 100% nesta tabela, mas **não contam como aceite do M2** porque a persistência MongoDB não foi entregue. Atividades não iniciadas recebem 0%.

| ID | Atividade | Responsável | Esf. plan. (h) | Horas gastas (h) | Esf. rest. (h) | Regra / % | VA (h) | CR (h) | Fonte / cálculo do VA |
|---|---|---|---:|---:|---:|---|---:|---:|---|
| D12 | Base backend (Express) | Marina, Geovanne, Mina e Samuel | 8 | 8 | 0 | 100% | 8 | 8 | Concluída em memória (4 h no SR2 + 4 h no período) |
| D13 | API CRUD por entidade (memória) | Marina, Geovanne, Mina e Samuel | 10 | 10 | 0 | 100% | 10 | 10 | 7 de 7 entidades em memória (4 h no SR2 + 6 h no período) |
| D13.5 | Migração para MongoDB | Marina, Geovanne, Mina e Samuel | 8 | 0 | 8 | 0/100 | 0 | 0 | Não iniciada |
| D14.1 | API fluxo — Candidatura | Marina | 3,5 | 3,5 | 0 | 100% | 3,5 | 3,5 | Concluída em memória (atrasada) |
| D14.2 | API fluxo — Agendamento e Atendimento | Geovanne | 2,5 | 2,5 | 0 | 100% | 2,5 | 2,5 | Concluída em memória (atrasada) |
| D14.3 | API fluxo — Oferta de Apoio | Mina | 2 | 2 | 0 | 100% | 2 | 2 | Concluída em memória (atrasada) |
| D15.1 | Autenticação — aluno e monitor | Mina | 3,5 | 0 | 3,5 | 0/100 | 0 | 0 | Não iniciada |
| D15.2 | Autenticação — administrador | Samuel | 5,5 | 0 | 5,5 | 0/100 | 0 | 0 | Não iniciada |
| D16.1 | Lógica de Oferta de Apoio | Mina | 2,5 | 0 | 2,5 | 0/100 | 0 | 0 | Não iniciada |
| D16.2 | Lógica de Atividade Complementar | Samuel | 3,5 | 0 | 3,5 | 0/100 | 0 | 0 | Não iniciada |
| D17.1 | Validações — Oportunidade e Candidatura | Marina | 4,5 | 0 | 4,5 | 0/100 | 0 | 0 | Não iniciada |
| D17.2 | Validações — Agendamento e Atendimento | Geovanne | 3,5 | 0 | 3,5 | 0/100 | 0 | 0 | Não iniciada |
| D17.3 | Validações — Oferta de Apoio | Mina | 2,5 | 0 | 2,5 | 0/100 | 0 | 0 | Não iniciada |
| D17.4 | Validações — Atividade e Disciplina | Samuel | 1,5 | 0 | 1,5 | 0/100 | 0 | 0 | Não iniciada |
| D18.1 | Integrações e regras de Atendimento | Geovanne | 5,5 | 0 | 5,5 | 0/100 | 0 | 0 | Não iniciada |
| D18.2 | Integrações e regras de Disciplina | Samuel | 1,5 | 0 | 1,5 | 0/100 | 0 | 0 | Não iniciada |
| D19.1 | Integração e testes M2 — Oportunidade/Candidatura | Marina | 5,5 | 0 | 5,5 | 0/100 | 0 | 0 | Não iniciada |
| D19.2 | Integração e testes M2 — Agendamento/Atendimento | Geovanne | 2 | 0 | 2 | 0/100 | 0 | 0 | Não iniciada |
| D19.3 | Integração e testes M2 — Oferta de Apoio | Mina | 3 | 0 | 3 | 0/100 | 0 | 0 | Não iniciada |
| D19.4 | Integração e testes M2 — Atividade/Disciplina | Samuel | 1,5 | 0 | 1,5 | 0/100 | 0 | 0 | Não iniciada |
| G09 | Status 1 — escopo e tempo | Erick, Gabriel, Guilherme e Rafael | 16 | 18 | 0 | 100% | 16 | 18 | Concluída em 26/10 |
| G10 | Status 2 — custos e recursos | Erick, Gabriel, Guilherme e Rafael | 16 | 16 | 0 | 100% | 16 | 16 | Concluída em 16/11 |
| G11 | Status 3 — stakeholders e riscos | Erick, Gabriel, Guilherme e Rafael | 16 | 16 | 0 | 100% | 16 | 16 | Entrega é este relatório |
| **Total S8–S11** |  |  | **128** | **76** | **54** |  | **74** | **76** |  |

> **Nota sobre D13:** no SR2, D13 recebeu VA parcial de 3,93 h (crédito fracionado: 1,43 + 1,43 + 0,71 + 0,36). Neste SR3, D13 recebe 10 h (100%) porque as 7 entidades foram concluídas em memória. A diferença de 6,07 h no VA acumulado reflete o avanço real do período, não uma reestimativa.

> **G12:** planejada para 30/11, não iniciada. Esforço restante de 16 h. Não entra no VP de 16/11 porque ainda não venceu.

## 5. Totais de VP, VA e CR

### 5.1 Acumulado do projeto

| Medida | Total (h) | Origem / cálculo |
|---|---:|---|
| **VP** — Valor Planejado | **316** | S1–S7 reconstituído: 188 h + S8–S11: 128 h |
| **VA** — Valor Agregado | **262** | S1–S7: 188 h + S8–S11: 74 h |
| **CR** — Custo Real | **264** | S1–S7: 188 h + S8–S11: 76 h |
| **ONT** — Orçamento no Término | **332** | 188 h PSW + 144 h GPTI |
| **Esforço restante bottom-up** | **70** | 54 h PSW + 16 h G12 |

### 5.2 Em reais — taxa-sombra R$ 18,8461538/h

| Medida | Valor (R$) | Cálculo |
|---|---:|---|
| **VP** | R$ 5.955,38 | 316 h × R$ 18,8461538 |
| **VA** | R$ 4.937,69 | 262 h × R$ 18,8461538 |
| **CR** | R$ 4.975,38 | 264 h × R$ 18,8461538 |
| **ONT** | R$ 6.256,92 | 332 h × R$ 18,8461538 |

## 6. Variações e índices

*A preencher por Guilherme (G09 — Análise de variações), a partir dos totais da seção 5.*

## 7. Previsão

*A preencher por Guilherme (G10 — Projeções e reservas), a partir dos índices da seção 6.*

## 8. Recursos e capacidade até o marco 2

*A preencher por Gabriel (G10 — Recursos e capacidade), a partir do esforço restante de 54 h PSW + 16 h G12 da seção 5.*

## 9. Engajamento da equipe GPTI e apontamento de horas

**Preenchimento parcial:** esta seção tem a parte de engajamento/commits, apontamento de horas e stakeholders da GPTI, sob responsabilidade de Erick (G11 — Stakeholders e G10 — Custo realizado). A evidência de commits no repositório fica para Rafael complementar.

### 9.1 Engajamento da equipe GPTI

- Até o Status Report 2, todos os quatro integrantes da GPTI participaram das atividades de gestão (G01 a G10), mas os commits no repositório ficaram concentrados em **Erick** como responsável por commitar.
- A partir do Status Report 3, **todos os integrantes da GPTI passam a commitar diretamente no repositório do projeto**. A evidência é o histórico de commits do repositório.

**Pendente (Rafael):** link/ID dos commits no repositório e confirmação de autoria distribuída.

### 9.2 Apontamento de horas da GPTI

| Atividade | Esforço plan. (h) | Horas por pessoa | Total apontado (h) |
|---|---:|---|---:|
| G09 — Status 1 | 16 | 4,5 h por pessoa | 18 |
| G10 — Status 2 | 16 | 4 h por pessoa | 16 |
| G11 — Status 3 | 16 | 4 h por pessoa | 16 |
| **Total** | **48** | | **50** |

O apontamento individual segue a alocação do Plano: G09 com 4,5 h por pessoa, G10 e G11 com 4 h por pessoa. As horas de S1–S7 foram reconstituídas como planejadas.

### 9.3 Stakeholders

| Stakeholder | Papel | Ação de engajamento no período | Responsável |
|---|---|---|---|
| Patrocinador (Diogo) | Decide e aceita marcos | Decisões D-01 e D-02 pendentes | Erick |
| Equipe PSW | Executa o produto | Alinhamento de escopo e capacidade; apontamento de horas | Rafael |
| Equipe GPTI | Gere o projeto | Reunião semanal; status report | Erick |
| Áreas administrativas e TI | Fora do escopo desta etapa | Nenhum contato operacional; pendências institucionais registradas | Guilherme |

## 10. Controle de qualidade e verificação

*A preencher por Guilherme (G07 — Qualidade), com base nas verificações do M2 e nas questões abertas.*

## 11. Riscos monitorados

*A preencher por Gabriel (G11 — Riscos e respostas), com base no registro de riscos e nas questões da seção 12.*

## 12. Questões

*A preencher por Guilherme (G11 — Pendências e decisões), com base nas questões Q-01 a Q-12 do acompanhamento.*

## 13. Mudanças solicitadas

*A preencher por Guilherme (G05 — Requisitos e mudanças), com base nas MUD-01 a MUD-06.*

## 14. Decisões pedidas ao patrocinador

*A preencher por Guilherme (G11 — Pendências e decisões), com validação de Gabriel em prazo/custo e Erick em escopo/custo.*

## 15. Próximas ações

*A preencher por Rafael (G11 — Status Report 3), com base nas decisões da seção 14.*

## 16. Aprovações

*A preencher por Rafael (G11 — Status Report 3).*