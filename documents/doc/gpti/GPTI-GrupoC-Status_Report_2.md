# Status Report 2 — HubBCC

**Versão:** 1.0  
**Data de status:** 02/11/2026  
**Período coberto:** 06/10/2026 a 02/11/2026  
**Marco em foco:** M2 — Sistema integrado ao backend próprio
**Semanas no período:** S8 (06/10), S9 (13/10 PSW / 26/10 GPTI) e S10 (27/10 PSW). S11 (03/11 PSW) e S12 (10/11 PSW / 30/11 GPTI) não iniciadas no corte.
**Início da medição de horas:** S8 (06/10/2026)
**Semanas reconstituídas:** S1 a S7. O desempenho anterior à S8 foi exatamente o planejado: VP = VA = CR em todas as atividades até a S7.

## 2. Situação geral

| Dimensão | Cor | Métrica e valor | Limites usados para a cor | Justificativa / evidência |
|---|---|---|---|---|
| Escopo | 🔴 Vermelho | 0 de 16 pacotes verificados (7 do M1, 9 do M2); 2 de 7 entidades com CRUD completo, 2 com create não funcional, 3 não iniciadas | Vermelho: < 80% verificado ou pacote crítico não demonstrado | Nada do SR1 foi resolvido (Q-01 a Q-04 abertas); D13 incompleto: Ofertas, Atividades e Disciplinas não existem em memória; Agendamento e Atendimento têm create não funcional porque depende de Ofertas; D13.5 não começou. Fonte: seção 3. |
| Prazo | 🔴 Vermelho | IDP = 0,36 | Vermelho: IDP < 0,85 | VA de 23,93 h contra VP de 67 h. D13.5 deveria estar concluída desde 13/10 e não começou. Fonte: seção 7. |
| Custo | 🟡 Amarelo | IDC = 0,92 | Verde: IDC ≥ 0,95. Amarelo: 0,85–0,95. Vermelho: < 0,85. | O valor agregado é 23,93 h porque Ofertas, Atividades e Disciplinas não existem em memória e Agendamento e Atendimento têm create não funcional. O gasto está acima do valor entregue (VC = −2,07 h). O ENT de 360,87 h confirma o estouro. Fonte: seções 5, 7 e 8. |

**Respostas às três perguntas do relatório:**

1. **O caminho crítico ainda entrega o M2 na data planejada?**
   **Não.** D13.5 (migração MongoDB) deveria ter terminado em 13/10 e não começou. D14, D15, D16, D17 e D18 estão paradas. O caminho crítico real está travado em D13, e o M2 de 10/11 não é alcançável sem recuperação.

2. **O valor agregado mostra trabalho feito no ritmo e no custo planejados?**
   **No custo, não** (IDC = 0,92, amarelo). **No ritmo, não** (IDP = 0,36). A equipe gasta mais do que entrega e entrega muito menos do que deveria.

3. **As horas que faltam cabem na capacidade que resta até o M2?**
   **Não.** Esforço restante estimado em ~88 h. Capacidade restante até o M2: PSW 36 h (S11 + S12) e GPTI 30 h. Déficit de ~36 h concentrado em PSW.

## 3. Escopo desde o Status Report 1

| ID do pacote | Pacote / entrega | Critério de verificação | Situação | Evidência ou pendência | Responsável |
|---|---|---|---|---|---|
| 1.4.1 | Interface de oportunidades | Criar, consultar, editar e encerrar oportunidade. | Pendente | Nada feito desde o SR1 | Geovanne |
| 1.4.2 | Interface de candidaturas | Aluno se candidata e consulta status. | Pendente | Q-02 aberta | Marina |
| 1.4.3 | Interface de apoio acadêmico | Criar oferta, consultar, filtrar e agendar. | Pendente | Q-03, Q-04 abertas | Mina |
| 1.4.4 | Interface de atividades complementares | Registrar atividade com comprovante e consultar total de horas. | Pendente | Q-01 aberta | Samuel |
| 1.4.5 | Interface de disciplinas (administrador) | Administrador cadastra, consulta, altera e exclui disciplina. | Pendente | Nada feito desde o SR1 | Samuel |
| 1.4.6 | Fluxo integrado do M1 | Os fluxos de 1.4.1 a 1.4.5 funcionam em conjunto. | Pendente | Depende de 1.4.3 e 1.4.4 | Geovanne |
| 1.4.7 | Demonstração do M1 | A demonstração da semana 8 executa o roteiro. | Não demonstrado | Nada feito desde o SR1 | Gabriel |
| 1.5.1 | API de oportunidades | CRUD persiste no MongoDB e rejeita oportunidade sem data de encerramento. | Pendente | Rota em memória criada; MongoDB não | Marina |
| 1.5.2 | API de candidaturas | Candidatura registrada e visível para o aluno. | Pendente | Rota em memória criada; MongoDB não | Marina |
| 1.5.3 | API de apoio acadêmico | Oferta sem disciplina ou horário não é gravada. | Não demonstrado | Entidade Ofertas de Apoio não iniciada | Mina |
| 1.5.4 | API de agendamento | Agendamento confirmado para aluno e monitor. | Não demonstrado | Create não funciona: depende de Ofertas (não implementada em memória). Atendimento depende de Agendamento. | Geovanne |
| 1.5.5 | API de atividades complementares | Atividade salva com comprovante e horas. | Não demonstrado | Entidade Atividades não iniciada | Samuel |
| 1.5.6 | API de disciplinas | CRUD de disciplinas restrito ao perfil administrador. | Não demonstrado | Entidade Disciplinas não iniciada | Samuel |
| 1.5.7 | Cálculo de horas complementares | Total de horas exibido corretamente. | Não demonstrado | Depende de 1.5.5 | Samuel |
| 1.5.8 | Autenticação e perfis | Rota protegida recusa chamada sem usuário e diferencia aluno, monitor e administrador. | Não demonstrado | D15.1 e D15.2 não iniciadas | Mina |
| 1.5.9 | Persistência de domínio | Oportunidades, agendamentos, disciplinas e atividades continuam após reiniciar a API. | Não demonstrado | D13.5 não iniciada | Samuel |

**Resumo:** verificados 0; pendentes 8; não demonstrados 8.

**Nota sobre D13:** Oportunidades e Candidaturas têm CRUD completo e funcional em memória. Agendamento e Atendimento têm a rota criada, mas o create não funciona porque depende de Ofertas (não implementada em memória). Atividades e Disciplinas não foram iniciadas. O CRUD real é **2 completos + 2 com create não funcional + 3 não iniciados**.

**Controle do escopo — três perguntas:**

1. **O que está na EAP deste marco foi entregue?**
   **Não.** D13 incompleto (2 completos, 2 com create não funcional, 3 não iniciados), D13.5 não iniciada, D14–D19 não iniciadas.

2. **O que foi entregue está na EAP?**
   **Sim**, dentro de D12 e D13. Nada fora da EAP foi entregue.

3. **O que foi entregue atende ao aceite do dicionário?**
   **Não em 1.5.1, 1.5.2, 1.5.4 e 1.5.9.** As rotas em memória não persistem no MongoDB. Agendamento e Atendimento têm create não funcional por dependência.

## 4. Cronograma

### 4.1 Atividades do período

> **Nota:** o G10 (Status 2) foi adiantado em uma semana pelo patrocinador. O Plano v1.2 o previa para 09/11 (S10 GPTI); na prática, começou em 02/11. O VP, VA e CR deste relatório continuam medindo contra a linha de base original; o G10 será incluído no próximo corte (MUD-05).

| ID | Atividade | Responsável | Início plan. | Fim plan. | Início real | Fim real | Dur. rest. (h) | Situação |
|---|---|---|---|---|---|---|---|---|
| D12.1–D12.4 | Base backend (Express) | Marina, Geovanne, Mina e Samuel | 06/10 (S8) | 06/10 (S8) | 06/10 | 06/10 | 4 | Em andamento |
| D13.1–D13.4 | API CRUD por entidade (memória) | Marina, Geovanne, Mina e Samuel | 06/10 (S8) | 06/10 (S8) | 06/10 | 02/11 | 6 | Em andamento (2 completos, 2 com create não funcional) |
| D13.5.1–D13.5.4 | Migração para MongoDB | Marina, Geovanne, Mina e Samuel | 13/10 (S9) | 13/10 (S9) | — | — | 8 | Não iniciada |
| D14.1 | API fluxo — Candidatura | Marina | 13/10 (S9) | 27/10 (S10) | — | — | 3,5 | Não iniciada |
| D14.2 | API fluxo — Agendamento e Atendimento | Geovanne | 13/10 (S9) | 13/10 (S9) | — | — | 2,5 | Não iniciada |
| D14.3 | API fluxo — Oferta de Apoio | Mina | 13/10 (S9) | 13/10 (S9) | — | — | 2 | Não iniciada |
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
| D19.3 | Integração e testes M2 — Oferta de Apoio | Mina | 03/11 (S11) | 10/11 (S12) | — | — | 3 | Não iniciada |
| D19.4 | Integração e testes M2 — Atividade/Disciplina | Samuel | 03/11 (S11) | 10/11 (S12) | — | — | 1,5 | Não iniciada |
| G09 | Status 1 — escopo e tempo | Erick, Gabriel, Guilherme e Rafael | 26/10 (S9) | 26/10 (S9) | 26/10 | 26/10 | 0 | Concluída |
| G10 | Status 2 — custos e recursos | Erick, Gabriel, Guilherme e Rafael | 09/11 (S10) | 09/11 (S10) | 02/11 | — | 16 | Em andamento (adiantado) |

### 4.2 Caminho crítico e data prevista do M2

- **Caminho crítico planejado:** D03 → D04 → D05 → D08 → D10 → D11 → M1 → D12/D13 → D13.5 → D14 → D16 → D17 → D18 → D19 → M2
- **Caminho crítico atualizado em 02/11:** D13 (2 completos, 2 com create não funcional) → D13.5 (não iniciada) → D14 → D16 → D17 → D18 → D19 → M2
- **Dependências e calendários considerados:** término-início padrão; PSW 4,5 h/semana; GPTI 4 h/semana a partir da S4; S11 e S12 restantes.
- **Atividades que entraram no crítico no período:** D13 (por atraso e dependência), D13.5 (por não ter começado).
- **Data prevista do M2 pelo caminho crítico:** **não é possível calcular com os dados de 02/11.** D13.5 ainda não começou e o restante do caminho crítico soma 72 h de esforço em PSW, contra capacidade restante de 36 h (S11 + S12). Sem corte de escopo, o M2 de 10/11 não é alcançável.
- **Data planejada do M2:** 10/11/2026 (PSW) e 30/11/2026 (aceite GPTI)
- **Base do cálculo e alterações desde o SR1:** o caminho crítico real não avança além de D13. Atraso de D13.5 desde 13/10. Create de Agendamento depende de Ofertas, que não existe em memória.

## 5. Valor agregado por atividade

**Unidade de esforço:** horas-pessoa (h). **Data-base:** 02/11/2026.

**Regra de crédito adotada:** 50/50 (metade ao começar, metade ao concluir) para atividades em andamento; 100% para concluídas; 0% para não iniciadas.
**Justificativa da escolha:** as atividades deste período atravessam mais de uma semana e têm entregas intermediárias observáveis (entidades, rotas, testes). A regra 50/50 captura o avanço parcial sem exigir que a atividade inteira esteja concluída.
**Atividade concluída e aceita:** 100% em qualquer regra, desde que o critério do dicionário tenha sido verificado.  
**Atividade não iniciada:** 0.  
**Percentual estimado de cabeça:** não serve. O VA vem da regra de crédito declarada.

| ID | Atividade | Responsável | Esf. plan. (h) | Horas gastas (h) | Esf. rest. (h) | Regra / % | VA (h) | CR (h) | Fonte / cálculo do VA |
|---|---|---|---|---:|---:|---:|---|---:|---:|---|
| D12 | Base backend (Express) | Marina, Geovanne, Mina e Samuel | 8 | 4 | 4 | 50/50 | 4 | 4 | Backend startado; Marina 2h + Geovanne 2h |
| D13 | API CRUD por entidade (memória) | Marina, Geovanne, Mina e Samuel | 10 | 4 | 6 | 2 completos + 2 com create não funcional | 3,93 | 4 | Oportunidades (1,43) + Candidaturas (1,43) + Agendamento 50% (0,71) + Atendimento 25% (0,36) |
| D13.5 | Migração para MongoDB | Marina, Geovanne, Mina e Samuel | 8 | 0 | 8 | 0/100 | 0 | 0 | Não iniciada |
| D14.1 | API fluxo — Candidatura | Marina | 3,5 | 0 | 3,5 | 0/100 | 0 | 0 | Não iniciada |
| D14.2 | API fluxo — Agendamento e Atendimento | Geovanne | 2,5 | 0 | 2,5 | 0/100 | 0 | 0 | Não iniciada |
| D14.3 | API fluxo — Oferta de Apoio | Mina | 2 | 0 | 2 | 0/100 | 0 | 0 | Não iniciada |
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
| G10 | Status 2 — custos e recursos | Erick, Gabriel, Guilherme e Rafael | 16 | 0 | 16 | 0/100 | 0 | 0 | Não iniciada (adiantada, mas sem apontamento no corte) |
| **Total** | | | **332** | **26** | **88** | | **23,93** | **26** | |

**Atividade concluída só conta como concluída se o critério do dicionário da EAP foi verificado.** D12 está parcialmente concluída: o backend responde, mas a base em memória não é a entrega final. D13 está parcialmente concluída: 2 completos, 2 com create não funcional, 3 não iniciados. G10 foi adiantada, mas não há apontamento de horas até o corte.

## 6. Totais de VP, VA e CR

**Medição de horas:** iniciada na S8 (06/10/2026). O período de S1 a S7 foi reconstituído como exatamente igual ao planejado: VP = VA = CR em todas as atividades até a S7. Para S8 a S11, os valores de CR vêm do apontamento real combinado com a PSW no SR1.

### 6.1 Em horas

| Medida | Total (h) | Atividades / dados de origem | Regra e cálculo |
|---|---:|---|---|
| **VP** — Valor Planejado | 67 | D12 (8) + D13 (10) + D13.5 (8) + D14.1 (3,5) + D14.2 (2,5) + D14.3 (2) + D15.2 (5,5) + 50% de D15.1 (1,75) + 50% de D16.1 (1,25) + 50% de D16.2 (1,75) + 50% de D17.1 (2,25) + 50% de D17.2 (1,75) + 50% de D18.1 (2,75) + G09 (16) | Soma do esforço planejado das atividades que deveriam estar concluídas (100%) ou em andamento (50/50) até 02/11 |
| **VA** — Valor Agregado | 23,93 | D12 (4) + D13 (3,93) + G09 (16) | Soma do VA por atividade, com regra 50/50 para D12 e 2 completos + 2 com create não funcional para D13 |
| **CR** — Custo Real | 26 | D12 (4) + D13 (4) + G09 (18) | Soma das horas apontadas no período (S8 a S11) |
| **ONT** — Orçamento no término | 332 | Soma do esforço planejado de todas as atividades | Plano v1.2: 188 h PSW + 144 h GPTI |

### 6.2 Em reais (taxa-sombra R$ 18,8461538/h)

| Medida | Valor (R$) | Cálculo |
|---|---:|---|
| **VP** | R$ 1.262,69 | 67 h × R$ 18,8461538 |
| **VA** | R$ 450,99 | 23,93 h × R$ 18,8461538 |
| **CR** | R$ 490,00 | 26 h × R$ 18,8461538 |
| **ONT** | R$ 6.256,92 | 332 h × R$ 18,8461538 |

## 7. Variações e índices

| Indicador | Fórmula | Substituição dos valores | Resultado | Interpretação |
|---|---|---|---|---|
| **VPr** — Variação de prazo | VA − VP | 23,93 − 67 | **−43,07 h** | Faltam 43,07 h de trabalho feito. Negativo é ruim. |
| **VC** — Variação de custo | VA − CR | 23,93 − 26 | **−2,07 h** | Negativo. A equipe gastou mais do que o valor entregue. |
| **IDP** — Índice de desempenho de prazo | VA ÷ VP | 23,93 ÷ 67 | **0,36** | Muito abaixo de 1. Ritmo de 36% do planejado. |
| **IDC** — Índice de desempenho de custo | VA ÷ CR | 23,93 ÷ 26 | **0,92** | Abaixo de 1. O custo está acima do valor entregue. |

**Leitura geral:** o projeto está travado em D13. D13.5 (migração MongoDB) deveria ter terminado em 13/10 e não começou. D14 a D18 estão paradas. O IDC de 0,92 mostra que o gasto está acima do valor entregue — o valor agregado é 23,93 h porque Ofertas, Atividades e Disciplinas não existem em memória e Agendamento e Atendimento têm create não funcional. O IDP de 0,36 mostra que a equipe fez 36% do que deveria ter feito até a data.

## 8. Previsão

| Medida | Fórmula aplicada | Valores usados | Premissa da conta | Resultado e unidade |
|---|---|---|---|---|
| **ENT** — Estimativa no término | ONT ÷ IDC | 332 ÷ 0,92 | O IDC atual continua | 360,87 h |
| **EPT** — Estimativa para terminar | ENT − CR | 360,87 − 26 | Esforço restante pelo IDC | 334,87 h |
| **VNT** — Variação no término | ONT − ENT | 332 − 360,87 | Negativo | −28,87 h |

**Premissa da conta:** a fórmula ONT ÷ IDC é **pouco informativa neste caso**, porque o CR de 26 h ainda é pequeno em relação ao ONT de 332 h. A previsão mais realista é pela soma do esforço restante por atividade: **~88 h** (coluna "Esf. rest." da seção 5). Desse total, 72 h são de PSW e 16 h são de G10.

**Leitura:** a previsão por IDC (360,87 h) está inflada. A previsão por esforço restante (~88 h) é mais confiável. Mas mesmo 88 h não cabem na capacidade restante de PSW (36 h). O M2 de 10/11 não é alcançável sem corte de escopo.

## 9. Recursos e capacidade até o marco 2

| Pessoa | Função | Horas planejadas até 02/11 | Horas apontadas até 02/11 | Saldo até 02/11 | Capacidade restante até o M2 (h) | Fonte / observação |
|---|---|---:|---:|---:|---:|---|
| Marina | PSW | 14 | 4 | 10 | 9 | D12 (2h) + D13 (2h) |
| Geovanne | PSW | 12,5 | 4 | 8,5 | 9 | D12 (2h) + D13 (2h) |
| Mina | PSW | 14 | 0 | 14 | 9 | Não apontou |
| Samuel | PSW | 13 | 0 | 13 | 9 | Não apontou |
| Erick | GPTI | 4 | 4,5 | −0,5 | 8 | G09 18h ÷ 4 = 4,5h |
| Gabriel | GPTI | 4 | 4,5 | −0,5 | 8 | G09 18h ÷ 4 = 4,5h |
| Guilherme | GPTI | 4 | 4,5 | −0,5 | 8 | G09 18h ÷ 4 = 4,5h |
| Rafael | GPTI | 4 | 4,5 | −0,5 | 8 | G09 18h ÷ 4 = 4,5h |

| Equipe | Horas planejadas | Horas apontadas | Capacidade restante até o M2 | Fonte / período |
|---|---:|---:|---:|---|
| PSW | 53,5 | 8 | 36 | S8–S10 apontadas; S11–S12 restantes |
| GPTI | 16 | 18 | 30 | S9 apontada; S10–S12 restantes |
| **Total** | **69,5** | **26** | **66** | |

**Premissas de disponibilidade, férias, outras alocações e cálculo da capacidade:**
- **PSW:** S11 (03/11) = 4,5 h × 4 alunos = 18 h. S12 (10/11) = 18 h. Total: 36 h.
- **GPTI:** S10 (09/11), S11 (16/11) e S12 (30/11) = 4 h × 4 alunos × 3 semanas = 48 h. Já usadas 18 h em G09. Restante: 30 h.
- **Total:** 66 h.
- **Esforço restante (seção 5):** 88 h.
- **Saldo:** **−22 h** no total, mas **−36 h em PSW** (GPTI tem sobra de 14 h).

**Leitura:** as horas que faltam **não cabem** na capacidade que resta. Déficit de 36 h em PSW. Sem corte de escopo, o M2 não fecha. A sobra de GPTI (14 h) não cobre o déficit de PSW, porque são trabalhos diferentes.

## 10. Questões e mudanças

### 10.1 Questões

| ID | Questão | Pacote / REQ | Dono | Data | Impacto em escopo, prazo e custo | Status |
|---|---|---|---|---|---|---|
| Q-01 | Regra das horas (atividades em análise e total por categoria) | 1.4.4 / REQ-06 | Samuel | 02/11 | Bloqueia 1.5.7 e 1.4.4 | Aberta |
| Q-02 | Botão "Candidatar-se" em oportunidade já candidatada | 1.4.2 / REQ-02 | Marina | 02/11 | Baixo impacto em escopo | Aberta |
| Q-03 | Botão "Criar oferta" visível para aluno | 1.4.3 / REQ-07 | Mina | 02/11 | Baixo impacto em escopo | Aberta |
| Q-04 | Perfis de acesso em Apoio Acadêmico (monitor agenda) | 1.4.3 / REQ-04 e REQ-07 | Mina | 02/11 | Bloqueia 1.5.8 | Aberta |
| Q-05 | **D13.5 (migração MongoDB) não iniciada** | 1.5.9 / REQ-01 a REQ-09 | Marina | 02/11 | **Bloqueia todo o M2** | Aberta |
| Q-06 | **D13 incompleto: Ofertas, Atividades e Disciplinas não iniciadas** | 1.5.3, 1.5.5, 1.5.6 | Mina, Samuel | 02/11 | Bloqueia D13.5, D14, D16; Agendamento e Atendimento dependem de Ofertas | Aberta |
| Q-07 | **D14 a D18 não iniciadas** | 1.5.4, 1.5.7, 1.5.8 | Marina, Geovanne, Mina, Samuel | 02/11 | Bloqueia o M2 | Aberta |
| Q-08 | **Nada do SR1 foi resolvido** | 1.4.1 a 1.4.7 | Todos | 02/11 | Escopo do M1 continua pendente | Aberta |
| Q-09 | **Agendamento e Atendimento com create não funcional** | 1.5.4 / REQ-04 | Geovanne | 02/11 | Create de Agendamento depende de Ofertas; Atendimento depende de Agendamento; agrava o déficit de PSW | Aberta |

### 10.2 Mudanças

| ID | Mudança | Motivo | Impacto em escopo, prazo e custo | Decisão | Status |
|---|---|---|---|---|---|
| MUD-01 | Regra de horas só com aprovadas | Q-01 | Altera semântica de REQ-06 | Pendente | Em elaboração |
| MUD-02 | Fluxo de aprovação de horas complementares | Q-01 | Novo fluxo ou tela; afeta REQ-06 e 1.4.4 | Pendente | Em elaboração |
| MUD-03 | Recuperação de senha | Funcionalidade fora da EAP original | Amplia escopo declarado do M1 | Pendente | Em elaboração |
| MUD-04 | **Corte de escopo do M2 para caber na capacidade restante** | Déficit de 36 h em PSW (seção 9) | Reduz D18.2, D19.4 e parte de D19.1/D19.2 | Pendente | Em elaboração |
| MUD-05 | **Adiantamento do cronograma em 1 semana (decisão do patrocinador)** | G10 adiantado | VP do G10 (16 h) entra no próximo corte; caminho crítico de gestão desloca 1 semana | Aprovada (decisão do patrocinador) | Aprovada |

**Nota:** se uma mudança foi aprovada pelo patrocinador, citar o ID e usar a nova linha de base naquela parte. Enquanto a mudança espera decisão, vale o plano original.

## 11. Decisões pedidas ao patrocinador

| ID | Decisão necessária | Opção | Efeito em horas | Efeito em prazo | Efeito em custo | Recomendação / consequência | Decisor e prazo |
|---|---|---|---:|---|---|---|---|
| D-01 | Como fechar o M2 diante do déficit de 36 h em PSW | A: Manter escopo e estender prazo | +36 h | M2 desloca para ~17/11 | +R$ 678,46 | Não recomendada: fere o prazo fixo do Termo | Diogo; 05/11 |
| D-01 | Como fechar o M2 diante do déficit de 36 h em PSW | B: Cortar escopo do M2 | −36 h | Mantém 10/11 | −R$ 678,46 | **Recomendada**: cortar D18.2 (1,5 h), D19.4 (1,5 h) e reduzir D19.1/D19.2 | Diogo; 05/11 |
| D-01 | Como fechar o M2 diante do déficit de 36 h em PSW | C: Paralelismo + compressão | −12 h | 13/11 (2 dias de atraso) | +R$ 226,15 | Parcial: reduz o déficit, mas não zera | Diogo; 05/11 |
| D-02 | Como tratar as 3 entidades em memória faltando | A: Incluir no escopo do M2 | +6 h (D13) | +1 dia | +R$ 113,08 | Recomendada: sem elas, 1.5.3, 1.5.5, 1.5.6 e 1.5.7 não fecham; Agendamento e Atendimento passam a ter create funcional | Diogo; 05/11 |
| D-02 | Como tratar as 3 entidades em memória faltando | B: Excluir do escopo do M2 | 0 h | 0 | 0 | Não recomendada: o M2 perde o núcleo do produto | Diogo; 05/11 |

**Decisão principal:** D-01, opção B (corte de escopo). O déficit de 36 h em PSW não se resolve com paralelismo nem compressão sem comprometer qualidade. O corte mais seguro é D18.2 (1,5 h), D19.4 (1,5 h) e redução de D19.1/D19.2, aceitando que Disciplinas e parte da integração de Oportunidades fiquem para etapa futura.

**Alavancas consideradas (aula 9):**
- **Paralelismo:** D14 + D15 podem rodar em paralelo em S11, economizando 1 dia. Risco: retrabalho se o contrato de API mudar.
- **Compressão:** alocar Marina e Geovanne em D16.1/D16.2 junto com Mina e Samuel. Custo: +4 h de coordenação.
- **Escopo:** cortar D18.2, D19.4 e parte de D19.1. Economia: −36 h. Impacto: Disciplinas e integração de Oportunidades ficam para etapa futura.
- **Reserva:** a reserva gerencial de 7% (R$ 511,86) não cobre o déficit; só o patrocinador pode liberar.

## 12. Próximas ações

| ID | Ação | Responsável | Prazo | Resultado esperado / critério de conclusão | Estado |
|---|---|---|---|---|---|
| A-01 | Decidir D-01 (corte de escopo) | Diogo | 05/11 | Escopo do M2 fechado | Bloqueada |
| A-02 | Completar D13 (Ofertas, Atividades e Disciplinas em memória) | Mina, Samuel | 06/11 | 7 de 7 entidades em memória; Agendamento e Atendimento terão create funcional sem alteração de código | Não iniciada |
| A-03 | Iniciar D13.5 (migração MongoDB) | Marina, Geovanne, Mina, Samuel | 07/11 | Persistência validada por entidade | Não iniciada |
| A-04 | Resolver Q-01 a Q-04 e Q-09 | Samuel, Marina, Mina, Geovanne | 05/11 | Questões fechadas ou convertidas em mudança | Não iniciada |
| A-05 | Revisar cronograma com a PSW após decisão D-01 | Gabriel | 06/11 | Novo caminho crítico e data do M2 | Não iniciada |
| A-06 | Atualizar apontamento de horas | PSW + GPTI | Semanal | CR atualizado por aluno e atividade | Não iniciada |

## 13. Aprovações

**Patrocinador:** Diogo Silveira Mendonça

**Data:** __ / __ / ____

**Gerentes do Projeto:**
- Erick Martins Silva
- Gabriel Centeio Freitas
- Guilherme Andrade Taveira
- Rafael Penela Grande Ferreira

**Data:** 02 / 11 / 2026