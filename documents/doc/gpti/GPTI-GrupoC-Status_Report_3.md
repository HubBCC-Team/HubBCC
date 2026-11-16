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

**Data-base:** 16/11/2026. **Unidade de duração restante:** horas-pessoa (h).  
**Situação:** "Concluída" = critério do dicionário verificado; "Concluída em memória" = funcionalidade pronta no simulador, sem MongoDB; "Não iniciada" = 0 h apontadas.

### 3.1 Atividades

| ID | Atividade | Responsável | Início plan. | Fim plan. | Início real | Fim real | Dur. rest. (h) | Situação |
|---|---|---|---|---|---|---|---|---|
| D12.1–D12.4 | Base backend (Express) | Marina, Geovanne, Mina e Samuel | 06/10 (S8) | 06/10 (S8) | 06/10 | 16/11 | 0 | Concluída em memória |
| D13.1–D13.4 | API CRUD por entidade (memória) | Marina, Geovanne, Mina e Samuel | 06/10 (S8) | 06/10 (S8) | 06/10 | 16/11 | 0 | Concluída em memória (7 de 7 entidades) |
| D13.5.1–D13.5.4 | Migração para MongoDB | Marina, Geovanne, Mina e Samuel | 13/10 (S9) | 13/10 (S9) | — | — | 8 | Não iniciada |
| D14.1 | API fluxo — Candidatura | Marina | 13/10 (S9) | 27/10 (S10) | 27/10 | 16/11 | 0 | Concluída em memória (atrasada) |
| D14.2 | API fluxo — Agendamento e Atendimento | Geovanne | 13/10 (S9) | 13/10 (S9) | 13/10 | 16/11 | 0 | Concluída em memória (atrasada) |
| D14.3 | API fluxo — Oferta de Apoio | Mina | 13/10 (S9) | 13/10 (S9) | 13/10 | 16/11 | 0 | Concluída em memória (atrasada) |
| D15.1 | Autenticação — aluno e monitor | Mina | 27/10 (S10) | 03/11 (S11) | — | — | 3,5 | Não iniciada |
| D15.2 | Autenticação — administrador | Samuel | 13/10 (S9) | 27/10 (S10) | — | — | 5,5 | Não iniciada |
| D16.1 | Lógica de Oferta de Apoio | Mina | 27/10 (S10) | 03/11 (S11) | — | — | 2,5 | Não iniciada |
| D16.2 | Lógica de Atividade Complementar | Samuel | 27/10 (S10) | 03/11 (S11) | — | — | 3,5 | Não iniciada |
| D17.1 | Validações — Oportunidade e Candidatura | Marina | 27/10 (S10) | 03/11 (S11) | — | — | 4,5 | Não iniciada |
| D17.2 | Validações — Agendamento e Atendimento | Geovanne | 27/10 (S10) | 03/11 (S11) | — | — | 3,5 | Não iniciada |
| D17.3 | Validações — Oferta de Apoio | Mina | 03/11 (S11) | 03/11 (S11) | — | — | 2,5 | Não iniciada |
| D17.4 | Validações — Atividade e Disciplina | Samuel | 03/11 (S11) | 03/11 (S11) | — | — | 1,5 | Não iniciada |
| D18.1 | Integrações e regras de Atendimento | Geovanne | 27/10 (S10) | 03/11 (S11) | — | — | 5,5 | Não iniciada |
| D18.2 | Integrações e regras de Disciplina | Samuel | 03/11 (S11) | 10/11 (S12) | — | — | 1,5 | Não iniciada |
| D19.1 | Integração e testes M2 — Oportunidade/Candidatura | Marina | 03/11 (S11) | 10/11 (S12) | — | — | 5,5 | Não iniciada |
| D19.2 | Integração e testes M2 — Agendamento/Atendimento | Geovanne | 03/11 (S11) | 10/11 (S12) | — | — | 2 | Não iniciada |
| D19.3 | Integração e testes M2 — Oferta de Apoio | Mina | 10/11 (S12) | 10/11 (S12) | — | — | 3 | Não iniciada |
| D19.4 | Integração e testes M2 — Atividade/Disciplina | Samuel | 10/11 (S12) | 10/11 (S12) | — | — | 1,5 | Não iniciada |
| G09 | Status 1 — escopo e tempo | Erick, Gabriel, Guilherme e Rafael | 26/10 (S9) | 26/10 (S9) | 26/10 | 26/10 | 0 | Concluída |
| G10 | Status 2 — custos e recursos | Erick, Gabriel, Guilherme e Rafael | 09/11 (S10) | 09/11 (S10) | 02/11 | 16/11 | 0 | Concluída |
| G11 | Status 3 — stakeholders e riscos | Erick, Gabriel, Guilherme e Rafael | 16/11 (S11) | 16/11 (S11) | 16/11 | — | 0 | Em andamento (horas completas) |
| G12 | Encerramento e lições aprendidas | Erick, Gabriel, Guilherme e Rafael | 30/11 (S12) | 30/11 (S12) | — | — | 16 | Não iniciada |

**Total de duração restante:** 54 h de PSW + 16 h de G12 = **70 h**.

### 3.2 Caminho crítico e data prevista do M2

- **Caminho crítico planejado:** D03 → D04 → D05 → D08 → D10 → D11 → M1 → D12/D13 → D13.5 → D14 → D16 → D17 → D18 → D19 → M2.
- **Caminho crítico atualizado em 16/11:** D12/D13 concluídas em memória → D14 concluída em memória → **D13.5 não iniciada** → D16 → D17 → D18 → D19 → M2.
- **Dependências e calendários considerados:** término-início padrão; PSW 4,5 h/semana por aluno; GPTI 4 h/semana por aluno a partir da S4.
- **Atividades que entraram no crítico no período:** D13.5 (por não ter começado) e D14 (por ter concluído em memória, mas fora do prazo planejado).
- **Data planejada do M2:** PSW em 10/11/2026; aceite GPTI em 30/11/2026.
- **Data prevista do M2 pelo caminho crítico:** **não alcançável na data planejada.** D13.5 não começou; restam 54 h de PSW e a capacidade PSW após 16/11 é 0 h (a S12 PSW era 10/11). Sem extensão de prazo ou corte de escopo, o M2 não fecha em 10/11.
- **Base do cálculo:** o caminho crítico real avança até D14 em memória; a próxima atividade do caminho é D13.5, que não foi iniciada. D16, D17, D18 e D19 estão paradas atrás de D13.5.

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

**Data-base:** 16/11/2026. **Unidade:** horas-pessoa (h).  
**Fontes:** horas planejadas do Plano (v1.1); horas apontadas do acompanhamento semanal e da alocação individual; esforço restante da seção 4.

### 8.1 Horas por pessoa

| Pessoa | Grupo | Horas planejadas até 16/11 | Horas apontadas até 16/11 | Saldo | Capacidade restante até o M2 (h) | Observação |
|---|---|---:|---:|---:|---:|---|
| Marina | PSW | 51,5 | 38,5 | 13 | 0 | D12/D13 rateados em 4,5 h; D14.1 3,5 h; S11–S12 apontadas conforme alocação individual |
| Geovanne | PSW | 50,5 | 38,5 | 12 | 0 | D12/D13 rateados em 4,5 h; D14.2 2,5 h; S11–S12 apontadas conforme alocação individual |
| Mina | PSW | 50 | 38,5 | 11,5 | 0 | D12/D13 rateados em 4,5 h; D14.3 2 h; S11–S12 apontadas conforme alocação individual |
| Samuel | PSW | 49,5 | 38,5 | 11 | 0 | D12/D13 rateados em 4,5 h; S11–S12 apontadas conforme alocação individual |
| Erick | GPTI | 32 | 32,5 | −0,5 | 4 | G09 4,5 h; G10 4 h; G11 4 h |
| Gabriel | GPTI | 32 | 32,5 | −0,5 | 4 | G09 4,5 h; G10 4 h; G11 4 h |
| Guilherme | GPTI | 32 | 32,5 | −0,5 | 4 | G09 4,5 h; G10 4 h; G11 4 h |
| Rafael | GPTI | 32 | 32,5 | −0,5 | 4 | G09 4,5 h; G10 4 h; G11 4 h |

### 8.2 Totais por grupo

| Grupo | Horas planejadas até 16/11 | Horas apontadas | Capacidade restante até o M2 | Esforço restante | Saldo |
|---|---:|---:|---:|---:|---:|
| PSW | 201,5 | 154 | 0 | 54 | **−54 h** |
| GPTI | 128 | 130 | 16 | 16 | 0 |
| **Total** | **329,5** | **284** | **16** | **70** | **−54 h em PSW** |

### 8.3 Premissas de capacidade

- **PSW:** 4,5 h/semana por aluno. A S12 PSW era 10/11 e já passou no corte. **Capacidade restante após 16/11: 0 h.**
- **GPTI:** 4 h/semana por aluno. A S12 GPTI é 30/11 e ainda está disponível para G12. **Capacidade restante: 16 h.**
- **Total:** 16 h, todas de GPTI. O esforço restante de 54 h em PSW não cabe nessa capacidade e não pode ser absorvido pela GPTI, porque são trabalhos diferentes.
- **Saldo:** −54 h em PSW. Sem extensão de prazo ou corte de escopo, o M2 não fecha.

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

**Data-base:** 16/11/2026. **Fonte:** registro de riscos do Plano (seção 6.3) e questões Q-01 a Q-12 do acompanhamento.

| ID | Risco | Prob. | Impacto | Status em 16/11 | Evidência / resposta | Dono |
|---|---|---:|---:|---|---|---|
| RT02 | Defeitos em regras de negócio | Média | Alto | **Materializado** | Q-01, Q-03 e Q-04 abertas; regras de horas e perfis sem fechamento. Resposta: fechar Q-01 a Q-04 antes de iniciar D15–D19 | Samuel / Mina |
| RT03 | Contratos divergentes entre frontend e API | Média | Médio | Monitorado | D13 e D14 em memória concluídas; falta contrato com MongoDB. Resposta: validar contrato no início de D13.5 | Marina |
| RT04 | Falha de persistência | Média | Médio | **Não testado** | D13.5 não iniciada; nenhum teste de persistência executado. Resposta: incluir teste de reinício da API como critério de D13.5 | Samuel |
| RG02 | Indisponibilidade de aluno | Média | Alto | **Materializado** | PSW sem capacidade restante após 16/11; S12 PSW já passou. Resposta: decisão D-01 (corte ou extensão) | Gabriel |
| RG03 | Escopo fora da EAP | Média | Médio | Controlado | Nada novo fora da EAP no período. Resposta: manter controle de mudanças | Guilherme |
| RG05 | Decisão de marco atrasa | Baixa | Médio | **Materializado** | D-01 e MUD-04 pendentes; M2 vencido em 10/11. Resposta: escalar ao patrocinador com prazo de 19/11 | Erick / Gabriel |

**Riscos novos identificados no período:**

| ID | Risco | Prob. | Impacto | Status | Evidência / resposta | Dono |
|---|---|---:|---:|---|---|---|
| RG06 | Déficit de capacidade PSW até o M2 | Alta | Alto | **Materializado** | 54 h de PSW restantes contra 0 h de capacidade após 16/11. Resposta: decisão D-01 do patrocinador | Gabriel |
| RG07 | Atraso em cascata de D13.5 sobre D16–D19 | Alta | Alto | **Materializado** | D13.5 não iniciada; D16–D19 paradas atrás dela. Resposta: priorizar D13.5 assim que D-01 for decidida | Gabriel |

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