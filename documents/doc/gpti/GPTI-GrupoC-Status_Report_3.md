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

| Dimensão | Cor | Métrica e valor | Limites usados | Justificativa / evidência |
|---|---|---|---|---|
| Escopo | 🔴 Vermelho | 0 de 16 pacotes verificados; 13 pendentes; 3 não demonstrados | Vermelho: menos de 80% verificado ou pacote crítico não demonstrado | D12, D13 e D14 foram concluídas em memória, mas D13.5 (MongoDB) não começou. Os pacotes do M1 continuam sem resolução desde o SR1. Nenhum pacote foi aceito formalmente. Fonte: seção 2. |
| Prazo | 🔴 Vermelho | IDP acumulado = 0,83; IDP do período S8–S11 = 0,58 | Vermelho: IDP < 0,85 | O M2 planejado para 10/11 não foi entregue. D13.5 deveria ter terminado em 13/10 e não começou. D14 foi concluída com atraso e em memória. O caminho crítico está travado em D13.5. Fonte: seções 3, 6 e 7. |
| Custo | 🟡 Amarelo | IDC acumulado = 0,99; IDC do período S8–S11 = 0,97 | Verde: IDC ≥ 0,95; Amarelo: 0,85–0,95; Vermelho: < 0,85 | O IDC próximo de 1 é puxado pela conclusão de G09–G11 da GPTI, não pelo avanço do caminho crítico técnico. O custo não é o problema principal; o prazo e o escopo são. Há risco de custo adicional para concluir D13.5–D19. Fonte: seções 6 e 8. |

**Respostas às três perguntas do relatório:**

1. **O caminho crítico ainda entrega o M2 na data planejada?**  
   **Não.** D13.5 (migração MongoDB) não começou. D15 a D19 continuam não iniciadas. A data planejada do M2 PSW era 10/11/2026 e já passou. Sem banco e sem capacidade PSW restante, o M2 não é alcançável na data original.

2. **O valor agregado mostra trabalho feito no ritmo e no custo planejados?**  
   **No ritmo, não.** IDP acumulado = 0,83 e IDP do período S8–S11 = 0,58. **No custo, aproximadamente sim no acumulado**, com IDC = 0,99, mas esse número é mascarado porque a GPTI concluiu suas atividades de gestão enquanto a PSW não avançou no caminho crítico técnico (MongoDB).

3. **As horas que faltam cabem na capacidade que resta até o M2?**  
   **Não.** Restam **70 h** para concluir o ONT: **54 h de PSW** e **16 h de GPTI/G12**. A capacidade PSW restante após 16/11 é **0 h**, porque a S12 PSW era 10/11. A GPTI ainda tem 16 h até 30/11. O déficit de PSW é de **54 h**.

**Recomendação do relatório:** **não recomendar aceite do M2 no estado atual.** D13.5, D15, D16, D17, D18 e D19 não foram entregues; 1.5.7, 1.5.8 e 1.5.9 não atendem ao critério do dicionário. A decisão D-01 (seção 14) precisa ser tomada até 19/11 para preservar a janela até o aceite GPTI de 30/11.

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

**Data-base:** 16/11/2026. **Fonte:** totais da seção 5. **Base de cálculo:** VP = 316 h, VA = 262 h, CR = 264 h, ONT = 332 h; taxa-sombra R$ 18,8461538/h.

| Indicador | Fórmula | Substituição (h) | Resultado (h) | Resultado (R$) | Interpretação |
|---|---|---:|---:|---:|---|
| **VPr** — Variação de prazo | VA − VP | 262 − 316 | **−54 h** | **−R$ 1.017,69** | Faltam 54 h de trabalho feito em relação ao planejado. Negativo é ruim. |
| **VC** — Variação de custo | VA − CR | 262 − 264 | **−2 h** | **−R$ 37,69** | Leve gasto acima do valor entregue. |
| **IDP** — Índice de desempenho de prazo | VA ÷ VP | 262 ÷ 316 | **0,83** | — | Ritmo de 83% do planejado no acumulado. |
| **IDC** — Índice de desempenho de custo | VA ÷ CR | 262 ÷ 264 | **0,99** | — | Custo próximo do valor entregue no acumulado. |

**Leitura dos índices:**

- **IDP = 0,83** está abaixo do limite de controle de 0,85 definido no Plano (seção 8). No período medido S8–S11, o IDP é 0,58 (74 h de VA contra 128 h de VP), mostrando que a PSW entregou pouco do que deveria no caminho crítico técnico.
- **IDC = 0,99** não deve ser lido como saúde do projeto: ele reflete a conclusão das atividades de gestão da GPTI (G09–G11), não o avanço do caminho crítico técnico. O CR de 264 h ainda é pequeno em relação ao ONT de 332 h; um desvio de custo só apareceria com o avanço de D13.5–D19.
- **VPr = −54 h** é o número que importa para a decisão: é o mesmo déficit de capacidade PSW apontado na seção 8, e é o que sustenta as opções da seção 14.
- **VC = −2 h** é ruído estatístico; não há estouro de custo relevante até o corte.

## 7. Previsão

**Data-base:** 16/11/2026. **Fonte:** ONT, CR e IDC da seção 5/6; esforço restante bottom-up da seção 4.

| Medida | Fórmula aplicada | Valores usados | Premissa da conta | Resultado |
|---|---|---|---:|---|
| **ENT** — Estimativa no término | ONT ÷ IDC | 332 ÷ 0,9924 | O IDC acumulado continua | **334,5 h** = **R$ 6.304,72** |
| **EPT** — Estimativa para terminar | ENT − CR | 334,5 − 264 | Esforço restante pelo IDC | **70,5 h** = **R$ 1.329,24** |
| **VNT** — Variação no término | ONT − ENT | 332 − 334,5 | Negativo | **−2,5 h** = **−R$ 47,80** |

**Premissa da conta:** a fórmula ONT ÷ IDC usa o IDC acumulado de 0,9924 (262 ÷ 264). Como o CR de 264 h já inclui a GPTI concluída e a PSW em memória, a previsão por IDC é pouco sensível a variações de custo. O valor de ENT de 334,5 h é **consistente com a previsão bottom-up**: CR (264 h) + esforço restante (70 h) = 334 h. A diferença de 0,5 h é arredondamento.

**Leitura da previsão:**

- **Pelo IDC:** ENT = 334,5 h, ou seja, 2,5 h acima do ONT de 332 h.
- **Pelo bottom-up:** 70 h restantes (54 h PSW + 16 h G12), que resultam em ENT ≈ 334 h.
- **Pelo caminho crítico:** as 54 h de PSW não cabem na capacidade restante após 16/11 (0 h de PSW no calendário original; a S12 PSW era 10/11). Sem extensão de prazo ou corte de escopo, o M2 não fecha.
- **As 16 h de G12** cabem na capacidade GPTI restante (S12 GPTI em 30/11), mas dependem de D19 para a atividade de encerramento. Se o M2 não fechar, G12 fica bloqueada.

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

### 9.1 Engajamento da equipe GPTI

- Até o Status Report 2, todos os quatro integrantes da GPTI participaram das atividades de gestão (G01 a G10), mas os commits no repositório ficaram concentrados em **Erick** como responsável por commitar.
- A partir do Status Report 3, **todos os integrantes da GPTI passam a commitar diretamente no repositório do projeto**. A evidência é o histórico de commits do repositório.

**Evidência de commits:** o repositório do projeto registra a autoria distribuída no SR3, com Erick (seções 2, 4 e 5), Gabriel (seções 3, 8 e 11), Guilherme (seções 6, 7, 10, 12, 13 e 14) e Rafael (seções 1, 9, 15 e 16 e consolidação final).

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
| Patrocinador (Diogo) | Decide e aceita marcos | Decisões D-01, D-02 e D-03 pendentes | Erick |
| Equipe PSW | Executa o produto | Alinhamento de escopo e capacidade; apontamento de horas | Rafael |
| Equipe GPTI | Gere o projeto | Reunião semanal; status report | Erick |
| Áreas administrativas e TI | Fora do escopo desta etapa | Nenhum contato operacional; pendências institucionais registradas | Guilherme |

**Ações de comunicação do período:** reunião semanal da GPTI; alinhamento com a PSW sobre escopo e capacidade; envio do SR3 ao patrocinador para decisão até 19/11.

## 10. Controle de qualidade e verificação

**Data-base:** 16/11/2026. **Método:** verificação estática e dinâmica do repositório com o manual de instalação, complementada pela conferência do critério do dicionário para cada pacote.

### 10.1 O que foi verificado

- **D12 (Express base):** aplicação sobe com o manual; rotas de verificação respondem sem acesso direto ao MongoDB.
- **D13 (APIs CRUD em memória):** as 7 entidades (Oportunidades, Candidaturas, Agendamentos, Atendimentos, Ofertas de Apoio, Atividades e Disciplinas) respondem em memória. O CRUD está completo em memória, mas **não persiste após reiniciar a API** — o critério do dicionário de 1.5.9 não foi atendido.
- **D14 (APIs de fluxo em memória):** Candidatura, Agendamento/Atendimento e Oferta de Apoio têm rota de fluxo funcional em memória. Passou em memória; não passou contra MongoDB.
- **G09, G10 e G11:** entregues.

### 10.2 O que não foi verificado

- **1.5.9 (persistência de domínio):** não demonstrado. Depende de D13.5, que não foi iniciada.
- **1.5.8 (autenticação e perfis):** não demonstrado. D15.1 e D15.2 não foram iniciadas.
- **1.5.7 (cálculo de horas):** não demonstrado. Depende de 1.5.5 com MongoDB e da decisão Q-01.
- **1.4.7 (demonstração do M1):** não demonstrado. Não há registro de demonstração da entrega atual para o patrocinador.
- **Aceite formal do M1:** não existe. O SR1 recomendou rejeição de 1.4.3, 1.4.4 e 1.4.6; nada foi resolvido até o corte.
- **Verificação independente do M2:** não foi realizada. Este relatório é a verificação interna da GPTI e não substitui a verificação do patrocinador.

### 10.3 Defeitos e limitações abertos

- **Q-01** (regra de horas): aberta. Bloqueia 1.5.7 e 1.4.4.
- **Q-02** (botão "Candidatar-se"): aberta. Impacto baixo.
- **Q-03** (botão "Criar oferta" para aluno): aberta. Impacto baixo.
- **Q-04** (perfis de acesso em Apoio Acadêmico): aberta. Bloqueia 1.5.8.
- **Q-05** (MongoDB não iniciado): aberta. Bloqueia todo o M2.
- **Q-06** (D13 faltando 3 entidades): resolvida em memória; falta MongoDB.
- **Q-07** (D15–D18 não iniciadas): parcialmente resolvida (D14 concluída); D15–D18 continuam não iniciadas.
- **Q-09** (create não funcional em Agendamento/Atendimento): resolvida em memória; falta MongoDB.

### 10.4 Recomendação de qualidade

- **Não recomendar aceite do M2 contra o dicionário original.** O critério de 1.5.9 (persistência) não foi atendido, 1.5.8 (autenticação) não foi iniciado e 1.5.7 depende de decisão aberta.
- **Recomendar aceite condicional contra escopo revisado** se o patrocinador aprovar o corte da opção B da seção 14. Nesse caso, o M2 é aceito como "frontend do M1 + API em memória (D12, D13 e D14)", e 1.5.1 a 1.5.9 passam a ser trabalho futuro declarado, com o que existe em memória servindo de protótipo funcional.
- **Aceite pleno contra o dicionário** só seria possível com D13.5, D15, D16, D17, D18 e D19 concluídas e verificadas — o que não cabe na capacidade PSW restante sem extensão de prazo.

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

**Data-base:** 16/11/2026. **Fonte:** acompanhamento semanal da GPTI e verificação do M2.

| ID | Questão | Pacote / REQ | Dono | Data | Impacto em escopo, prazo e custo | Status |
|---|---|---|---|---|---|---|
| Q-01 | Regra das horas: atividades em análise e total por categoria | 1.4.4 / REQ-06 | Samuel | 16/11 | Bloqueia 1.5.7 e 1.4.4 | Aberta |
| Q-02 | Botão "Candidatar-se" em oportunidade já candidatada | 1.4.2 / REQ-02 | Marina | 16/11 | Baixo impacto em escopo | Aberta |
| Q-03 | Botão "Criar oferta" visível para aluno | 1.4.3 / REQ-07 | Mina | 16/11 | Baixo impacto em escopo | Aberta |
| Q-04 | Perfis de acesso em Apoio Acadêmico (monitor agenda) | 1.4.3 / REQ-04 e REQ-07 | Mina | 16/11 | Bloqueia 1.5.8 | Aberta |
| Q-05 | D13.5 (migração MongoDB) não iniciada | 1.5.9 / REQ-01 a REQ-09 | Marina | 16/11 | Bloqueia todo o M2 | Aberta |
| Q-06 | D13 incompleto: Ofertas, Atividades e Disciplinas | 1.5.3, 1.5.5, 1.5.6 | Mina, Samuel | 16/11 | Resolvida em memória; falta MongoDB | Resolvida parcialmente |
| Q-07 | D15 a D18 não iniciadas | 1.5.4, 1.5.7, 1.5.8 | Marina, Geovanne, Mina, Samuel | 16/11 | D15–D18 continuam bloqueando o M2 | Aberta |
| Q-08 | Nada do SR1 foi resolvido | 1.4.1 a 1.4.7 | Todos | 16/11 | Escopo do M1 continua pendente | Aberta |
| Q-09 | Agendamento e Atendimento com create não funcional | 1.5.4 / REQ-04 | Geovanne | 16/11 | Resolvida em memória após Ofertas; falta MongoDB | Resolvida parcialmente |
| Q-10 | M2 não entregue em 10/11 | Cronograma / M2 | Gabriel | 16/11 | Prazo vermelho; exige decisão do patrocinador | Aberta |
| Q-11 | D14 concluída com atraso e em memória | 1.5.2, 1.5.3, 1.5.4 | Marina, Geovanne, Mina | 16/11 | Atraso no caminho crítico; MongoDB pendente | Aberta |
| Q-12 | Commits da GPTI concentrados em Erick até o SR2 | Engajamento / comunicação | Erick | 16/11 | Sem impacto direto em escopo; melhoria de rastreabilidade | Em tratamento: todos passam a commitar |

## 13. Mudanças solicitadas

**Data-base:** 16/11/2026. **Fonte:** registro de mudanças do Plano e decisões pendentes do período.

| ID | Mudança | Motivo | Impacto | Decisão | Status |
|---|---|---|---|---|---|
| MUD-01 | Regra de horas só com aprovadas | Q-01 | Altera semântica de REQ-06 | Pendente | Em elaboração |
| MUD-02 | Fluxo de aprovação de horas complementares | Q-01 | Novo fluxo ou tela; afeta REQ-06 e 1.4.4 | Pendente | Em elaboração |
| MUD-03 | Recuperação de senha | Funcionalidade fora da EAP original | Amplia escopo declarado do M1 | Pendente | Em elaboração |
| MUD-04 | Corte de escopo do M2 para o que está pronto em memória | Déficit de 54 h em PSW sem capacidade restante e sem extensão de prazo | Remove do escopo do M2: D13.5, D15.1, D15.2, D16.1, D16.2, D17.1, D17.2, D17.3, D17.4, D18.1, D18.2, D19.1, D19.2, D19.3 e D19.4 (54 h). Mantém D12, D13 e D14 (26 h de PSW, já executadas). 1.5.1 a 1.5.9 viram trabalho futuro | Pendente | Em elaboração |
| MUD-05 | Adiantamento do cronograma em 1 semana | Decisão do patrocinador para G10 | VP do G10 entra no próximo corte | Aprovada | Aprovada |
| MUD-06 | Replanejamento do M2 após 10/11 sem extensão de prazo | M2 não entregue; D13.5 não iniciada; capacidade PSW zerada após 16/11 | M2 revisado para "frontend do M1 + API em memória"; nova linha de base de escopo do M2; aceite condicional ao escopo revisado | Pendente | Em elaboração |

## 14. Decisões pedidas ao patrocinador

**Data-base:** 16/11/2026. **Contexto:** 54 h de PSW restantes, 0 h de capacidade PSW após 16/11 e M2 vencido em 10/11. **Restrição do termo:** não há extensão de prazo. A decisão precisa sair até 19/11 para que a GPTI registre o aceite condicional e feche o SR4 em 30/11.

| ID | Decisão necessária | Opção | Efeito em horas | Efeito em prazo | Efeito em custo | Recomendação / consequência | Decisor e prazo |
|---|---|---|---:|---|---|---|---|
| D-01 | Como fechar o M2 diante do déficit de 54 h em PSW, sem extensão de prazo | **A: Estender a capacidade PSW por 3 semanas (S13–S15), sem corte** | +54 h PSW | M2 completo em ~01/12/2026 | +R$ 1.017,69 | **Inviável:** contraria a restrição de não estender o prazo | Diogo; 19/11 |
| D-01 |  | **B: Cortar escopo do M2 para o que está pronto em memória, sem extensão** | 0 h adicionais; remove 54 h do escopo do M2 (D13.5, D15–D19) | M2 encerrado em 16/11 contra escopo revisado | 0 | **Recomendada:** é a única opção compatível com a restrição de prazo. O M2 é aceito como "frontend do M1 + API em memória"; 1.5.1 a 1.5.9 viram trabalho futuro declarado | Diogo; 19/11 |
| D-01 |  | **C: Cortar escopo parcial + 2 semanas de extensão (S13–S14)** | Corta D18 e D19 (19 h); mantém D13.5, D15, D16 e D17 (35 h); extensão de +35 h | M2 em ~28/11/2026 | +R$ 659,62 | **Inviável:** também estende o prazo, contrariando a restrição | Diogo; 19/11 |
| D-02 | Como registrar o débito técnico do M2 revisado | **A: Registrar 1.5.1 a 1.5.9 como trabalho futuro no termo de encerramento (G12)** | 0 h | Não altera prazo | 0 | **Recomendada:** o G12 já existe e é o lugar correto para declarar o que ficou de fora | Diogo; 19/11 |
| D-03 | Autorizar apontamento individual retroativo de S11–S12 | **A: Sim** | 0 h | Não altera prazo | 0 | **Recomendada:** sem isso o CR por pessoa fica incompleto e o SR4 perde rastreabilidade | Diogo; 19/11 |

**Decisão principal:** D-01, opção **B**. Com a restrição de não estender o prazo, a capacidade PSW após 16/11 é 0 h e nenhuma das 54 h restantes pode ser executada. O corte possível é reduzir o escopo do M2 ao que já está pronto em memória (D12, D13 e D14) e registrar D13.5, D15, D16, D17, D18 e D19 como trabalho futuro. O aceite do M2 passa a ser contra o escopo revisado (MUD-04/MUD-06), não contra o dicionário original.

**O que sai do escopo do M2 na opção B:**

| Pacote removido | Esforço | Efeito no aceite |
|---|---:|---|
| D13.5 — Migração para MongoDB | 8 h | 1.5.9 não é atendido; persistência fica como trabalho futuro |
| D15.1 — Autenticação aluno/monitor | 3,5 h | 1.5.8 não é atendido |
| D15.2 — Autenticação administrador | 5,5 h | 1.5.8 não é atendido |
| D16.1 — Lógica de Oferta de Apoio | 2,5 h | 1.5.3 fica com CRUD em memória, sem regra verificada |
| D16.2 — Lógica de Atividade Complementar | 3,5 h | 1.5.5 e 1.5.7 ficam sem regra verificada |
| D17.1 — Validações Oportunidade/Candidatura | 4,5 h | 1.5.1 e 1.5.2 ficam sem validação verificada |
| D17.2 — Validações Agendamento/Atendimento | 3,5 h | 1.5.4 fica sem validação verificada |
| D17.3 — Validações Oferta de Apoio | 2,5 h | 1.5.3 fica sem validação verificada |
| D17.4 — Validações Atividade/Disciplina | 1,5 h | 1.5.5 e 1.5.6 ficam sem validação verificada |
| D18.1 — Integrações e regras de Atendimento | 5,5 h | Integração de Atendimento não é entregue |
| D18.2 — Integrações e regras de Disciplina | 1,5 h | Integração de Disciplina não é entregue |
| D19.1 — Integração e testes M2 — Oportunidade/Candidatura | 5,5 h | Teste de integração do M2 não é executado |
| D19.2 — Integração e testes M2 — Agendamento/Atendimento | 2 h | Teste de integração do M2 não é executado |
| D19.3 — Integração e testes M2 — Oferta de Apoio | 3 h | Teste de integração do M2 não é executado |
| D19.4 — Integração e testes M2 — Atividade/Disciplina | 1,5 h | Teste de integração do M2 não é executado |
| **Total removido** | **54 h** | 1.5.1 a 1.5.9 passam a trabalho futuro |

**O que fica no escopo do M2 revisado na opção B:**

| Pacote mantido | Esforço | O que entrega |
|---|---:|---|
| D12 — Base backend (Express) | 8 h | API Express base, sem MongoDB |
| D13 — API CRUD por entidade (memória) | 10 h | CRUD em memória das 7 entidades |
| D14 — APIs de fluxo em memória | 8 h | Candidatura, Agendamento/Atendimento e Oferta de Apoio em memória |
| **Total mantido** | **26 h** | M2 revisado = "frontend do M1 + API em memória", com 1.5.1 a 1.5.9 como trabalho futuro |

**Alavancas consideradas (aula 9):**

- **Escopo:** cortar D13.5, D15, D16, D17, D18 e D19. Economia: 54 h. Impacto: M2 revisado para o que está em memória; 1.5.1 a 1.5.9 viram trabalho futuro.
- **Prazo:** não há extensão. A S12 PSW já passou em 10/11 e a capacidade PSW após 16/11 é 0 h.
- **Custo:** 0 h adicionais. O CR de 264 h já está gasto; o corte não gera custo novo.
- **Reserva:** a reserva gerencial de 7% (R$ 511,86) não é usada, porque não há execução adicional.
- **Recursos:** a GPTI tem 16 h restantes, mas não pode absorver trabalho de PSW por serem competências diferentes.

## 15. Próximas ações

**Data-base:** 16/11/2026. **Referência:** decisões da seção 14 e questões da seção 12. **Restrição:** sem extensão de prazo.

| ID | Ação | Responsável | Prazo | Resultado esperado / critério de conclusão | Estado |
|---|---|---|---|---|---|
| A-01 | Decidir D-01 (opção B), D-02 e D-03 | Diogo (patrocinador) | 19/11 | Escopo do M2 revisado aprovado; débito técnico autorizado a ser registrado no G12 | Bloqueada |
| A-02 | Registrar MUD-04 e MUD-06 no controle de mudanças | Guilherme | 20/11 | Mudança de escopo do M2 formalizada, com nova linha de base de escopo | Não iniciada |
| A-03 | Fechar Q-01 a Q-04 | Samuel, Marina, Mina | 19/11 | Questões fechadas ou convertidas em mudança; Q-01 registrada como trabalho futuro se não fechar | Não iniciada |
| A-04 | Atualizar o cronograma com o M2 revisado | Gabriel | 20/11 | Cronograma sem D13.5–D19; M2 revisado encerrado em 16/11 | Não iniciada |
| A-05 | Completar apontamento individual da PSW em S11–S12 | PSW + Rafael | 19/11 | CR por aluno e por atividade fechado na planilha de acompanhamento | Em andamento |
| A-06 | Registrar commits de todos os integrantes da GPTI | Erick, Gabriel, Guilherme e Rafael | 20/11 | Histórico do repositório com autoria distribuída no SR3 | Em andamento |
| A-07 | Atualizar registro de riscos e mudanças após a decisão D-01 | Guilherme | 20/11 | Riscos RG06/RG07 com resposta; MUD-04 e MUD-06 aprovadas | Não iniciada |
| A-08 | Comunicar a decisão D-01 à PSW | Rafael | 20/11 | PSW ciente de que o M2 revisado encerra em memória e que D13.5–D19 viram trabalho futuro | Não iniciada |
| A-09 | Preparar o SR4 (fechamento) com o M2 revisado | Erick, Gabriel, Guilherme e Rafael | 30/11 | SR4 com escopo revisado verificado, valor agregado final, débito técnico declarado e lições aprendidas | Não iniciada |

## 16. Aprovações

**Patrocinador:** Diogo Silveira Mendonça

**Data:** __ / __ / ____

**Gerentes do Projeto:**
- Erick Martins Silva
- Gabriel Centeio Freitas
- Guilherme Andrade Taveira
- Rafael Penela Grande Ferreira

**Data:** 16 / 11 / 2026