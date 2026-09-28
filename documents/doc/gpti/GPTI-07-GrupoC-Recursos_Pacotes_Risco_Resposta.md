# Recursos nos pacotes e riscos com resposta - HubBCC

## 1. Decisão fazer-ou-comprar

O projeto será completamente gerenciado e desenvolvido internamente, sem a aquisição de componentes de terceiros. Após o fim do desenvolvimento, o sistema será configurado em uma máquina que roda na rede da instituição para ser disponibilizado às partes interessadas, não sendo necessário contratar serviços como provedores de nuvem.

| Item | Decisão | Justificativa e risco associado |
|---|---|---|
| Código do sistema (front-end, back-end, API e persistência) | **Fazer** (equipe de desenvolvimento) | Competência interna e custo já contemplado nos pacotes 5.1 e 5.2. Risco: RR-01. |
| Hospedagem e publicação em produção | **Fazer com recurso interno** (máquina na rede da instituição) | Evita custo recorrente de nuvem. Depende da instituição ceder e configurar a máquina. Riscos: RO-01 e RC-02. |
| Treinamento e material de apoio (5.4.1) | **Fazer** (equipe do projeto) | Conhecimento do sistema está com a equipe. |
| Pagamento entre aluno e tutor | **Nem fazer, nem comprar** | Fora do escopo (REQ-19). Risco de expectativa: RS-02. |
| Componentes e serviços de terceiros | **Não adquirir** | Alternativa externa só entra se um recurso interno faltar, e com o risco declarado (RO-01). |

## 2. Recursos necessários

Os recursos nascem dos mesmos pacotes da EAP. Nenhum recurso externo é necessário.

| Tipo | Recurso | Onde é usado |
|---|---|---|
| Humano | 4 gerentes do projeto | Pacotes 1.1 a 1.3, 5.3 e 5.4 |
| Humano | 4 desenvolvedores | Pacotes dos módulos 2, 3, 4 e 5.1 a 5.4 |
| Humano | Patrocinador, secretaria, professores, coordenação e alunos | Como consultados, informados ou validadores (ver RAM) |
| Físico | Máquina na rede da instituição | Publicação em produção (5.2.1) |
| Físico | Dispositivos desktop e mobile | Testes de responsividade (5.1.1) |
| Virtual | Repositório de código e banco de dados | Módulos 2 a 4 e 5.2.1 |

## 3. Matriz de atribuição de responsabilidades (RAM/RACI)

| Pacote-Folha da EAP | Descrição do Pacote | Gerente Designado | Desenvolvedores | Patrocinador | Secretaria Acadêmica | Professores | Coordenação | Alunos (inclui monitores e tutores) |
|---|---|---|---|---|---|---|---|---|
| 1.1 | Planejamento e monitoramento | R | C | C | I | I | I | I |
| 1.2 | Gestão de riscos | R | C | C | I | I | I | I |
| 1.3 | Comunicação com Partes Interessadas e Atas | A | R | C | I | I | I | I |
| 2.1.1 | Cadastrar oportunidade acadêmica | A | R | I | C | C | C | I |
| 2.1.2 | Alterar oportunidade acadêmica | A | R | I | C | C | C | I |
| 2.1.3 | Encerrar oportunidade acadêmica | A | R | I | C | C | C | I |
| 2.2.1 | Listar oportunidades | A | R | I | I | I | I | C |
| 2.2.2 | Filtrar oportunidades por categoria/requisitos | A | R | I | I | I | I | C |
| 2.3.1 | Realizar candidatura | A | R | I | I | C | I | C |
| 2.3.2 | Consultar candidaturas | A | R | I | I | I | I | C |
| 2.4.1 | Avaliar candidatura | A | R | I | I | C | I | I |
| 3.1.1 | Criar oferta de monitoria/tutoria | A | R | I | I | I | I | C |
| 3.1.2 | Alterar oferta | A | R | I | I | I | I | C |
| 3.1.3 | Cancelar oferta | A | R | I | I | I | I | C |
| 3.1.4 | Consultar/filtrar ofertas | A | R | I | I | I | I | C |
| 3.2.1 | Realizar agendamento de apoio | A | R | I | I | I | I | C |
| 3.2.2 | Consultar agendamentos | A | R | I | I | I | I | C |
| 3.2.3 | Cancelar ou reagendar | A | R | I | I | I | I | C |
| 3.3.1 | Registrar realização do atendimento | A | R | I | I | I | I | C |
| 3.3.2 | Avaliar atendimento | A | R | I | I | I | I | C |
| 4.1.1 | Registrar atividade com comprovante | A | R | I | C | I | I | C |
| 4.2.1 | Consultar total de horas | A | R | I | C | I | I | C |
| 5.1.1 | Desenvolver interface responsiva | A | R | I | I | I | I | C |
| 5.2.1 | Desenvolver API e integrações | A | R | C | I | I | I | I |
| 5.3.1 | Testar e validar com usuários | R | R | A | C | C | C | C |
| 5.4.1 | Treinar secretaria e professores | A | R | I | C | C | I | I |

## 4. Riscos e oportunidades com resposta

**Escalas:** Probabilidade e Impacto em Baixa, Média ou Alta. Respostas a ameaças: Evitar, Mitigar, Transferir, Aceitar, Escalar. Respostas a oportunidades: Explorar, Melhorar, Compartilhar, Aceitar, Escalar.

**Conversão de dias em R$:** ≈ R$ 500/dia (R$ 34.000 ÷ ~71 dias de caminho crítico), usada só para estimar o consumo de contingência. Prazos, folgas e reservas seguem o documento de Rede, Prazo e Orçamento.

### 4.1 Engajamento e comunicação (RE)

| ID | Tipo | Risco em causa e efeito | Probabilidade | Impacto | Estratégia de resposta e ação | Consumo do plano de contingência |
|---|---|---|---|---|---|---|
| RE-01 | Ameaça | **SE** professores, secretaria, coordenação e alunos não publicarem ou atualizarem oportunidades, **ENTÃO** a listagem perde utilidade e credibilidade, reduzindo o interesse dos alunos. | Média | Alta | **Mitigar:** validar o cadastro com todos os perfis que publicam, obter oportunidades piloto e acompanhar publicações após o Marco 2. Bloqueios persistentes: escalar ao patrocinador. | Cenário já contemplado na implantação do hub (pacotes 2.1 e 5.4), portanto já previsto para ser mitigado ao longo da vida do projeto. |
| RE-02 | Ameaça | **SE** alunos não compreenderem candidatura e registro de horas, **ENTÃO** a adesão será baixa e a dispersão de informações permanecerá. | Média | Alta | **Mitigar:** demonstrações por tarefa, perguntas frequentes e coleta de obstáculos para correção (campanhas conforme o plano de comunicação). | Cenário já contemplado na implantação do hub, portanto já incluído para ser mitigado ao longo da vida do projeto. |
| RE-03 | Ameaça | **SE** poucos monitores e tutores criarem ofertas, **ENTÃO** busca e agendamento terão pouca utilidade e desestimularão novos usuários. | Média | Média | **Mitigar:** convidar prestadores para testes, simplificar instruções de criação e acompanhar ofertas ativas. | Os testes já fazem parte do plano de implantação do hub. Simplificar as instruções pode exigir 3 dias de refatoração e melhora da experiência do monitor (≈ R$ 1.500). O acompanhamento de ofertas é periódico e necessário à manutenção, mas não está previsto no escopo do projeto (ver RO-02). |
| RE-04 | Ameaça | **SE** decisões forem comunicadas tarde ou sem destinatário claro, **ENTÃO** professores, secretaria e equipe atuarão com regras diferentes e atrasarão a validação. | Média | Alta | **Mitigar:** registrar decisão, responsável e próximo passo (pacote 1.3) e confirmar recebimento quando houver ação requerida. | Em caso de falta de informações por imprevistos, o consumo é variável e depende do prazo ligado àquela informação. |
| RE-05 | Ameaça | **SE** a secretaria perceber aumento de validações manuais ou indefinição sobre comprovantes, **ENTÃO** poderá deixar de apoiar a implantação e a operação. | Média | Alta | **Mitigar:** mapear com a secretaria o fluxo atual e o proposto, demonstrar tarefas antes do Marco 2 e levar decisões de autoridade pendentes ao patrocinador. | Em caso de desuso pela secretaria, o consumo é variável conforme os dias para retomar o uso e atualizar os dados. Estimativa: 3 dias (≈ R$ 1.500). |
| RE-06 | Oportunidade | **SE** alunos participantes das validações relatarem utilidade do HubBCC a seus pares, **ENTÃO** a divulgação poderá ampliar o uso e revelar melhorias mais cedo. | Média | Média | **Escalar:** apresentar ao patrocinador as evidências e a proposta de convidar voluntários; divulgar após acordo sobre canal e mensagem. | Não consome reserva. |
| RE-07 | Ameaça | **SE** alunos e professores não participarem das entrevistas e validações dos protótipos (premissa do Termo de Abertura), **ENTÃO** o pacote 5.3.1 terá feedback pouco representativo e o sistema não atenderá às necessidades reais das partes interessadas. | Média | Alta | **Mitigar:** agendar validações com antecedência, usar sessões curtas em horário de aula ou na reunião de departamento, contar com representantes de turma e registrar a participação em ata. | Reagendar rodadas de validação consome até 3 dias da folga do pacote 5.3.1 (≈ R$ 1.500 se exigir esforço extra). |
| RE-08 | Ameaça | **SE** forem cadastradas oportunidades irreais ou desatualizadas, **ENTÃO** a plataforma perde credibilidade e os usuários deixam de usá-la. | Média | Alta | **Mitigar:** como todos os perfis podem publicar (REQ-09), exigir data de encerramento no cadastro (2.1.1), identificar o autor de cada publicação, permitir a sinalização de oportunidades incorretas e usar o encerramento de oportunidade (2.1.3) para retirar itens vencidos da listagem. | Ação prevista nos pacotes 2.1.1 e 2.1.3, sem consumo adicional. |
| RE-09 | Ameaça | **SE** o Marco 2 (01/12/2026) ocorrer perto do fim do semestre e não houver linha de base do semestre anterior (e-mails enviados, alunos em projetos, oportunidades divulgadas), **ENTÃO** os critérios de sucesso do Termo (80% de oportunidades cadastradas, redução de 75% dos envios em massa e aumento de 25% de alunos em projetos) não poderão ser medidos dentro do projeto. | Alta | Média | **Mitigar:** levantar agora com a secretaria e o patrocinador os números do semestre anterior. **Escalar:** acordar com o patrocinador a janela de medição após o encerramento, já que o benefício se realiza depois da entrega. | Não consome reserva; exige uma decisão do patrocinador. |
| RE-10 | Oportunidade | **SE** a coordenação endossar o HubBCC e divulgar oportunidades e comunicados do curso pela plataforma e pelos canais oficiais, **ENTÃO** a adesão de alunos e professores tende a crescer mais rápido, apoiando os critérios de sucesso. | Média | Média | **Compartilhar:** pedir à coordenação, via patrocinador, apoio à divulgação dos Marcos 1 e 2 e a publicação de oportunidades no HubBCC. | Não consome reserva. |

### 4.2 Prazo e cronograma (RP)

| ID | Tipo | Risco em causa e efeito | Probabilidade | Impacto | Estratégia de resposta e ação | Consumo do plano de contingência |
|---|---|---|---|---|---|---|
| RP-01 | Ameaça | **SE** as atividades do módulo 3 (A3.1 → A3.4 → A3.5 → A3.8 → A3.9), que formam o caminho crítico até o Marco 1, atrasarem, **ENTÃO** A5.1 atrasa e o Marco 1 (06/10/2026) escorrega, pois a folga é de apenas 2 dias. | Média | Alta | **Mitigar:** começar o módulo 3 primeiro, acompanhar o ramo com atenção especial no status semanal e realocar desenvolvedores dos módulos 2 e 4, que têm 2 e 7 dias de folga. | Até 2 dias da folga do Marco 1 (sem custo adicional). Acima disso, desvio de até 1 semana com aprovação do patrocinador, reduzindo a folga do Marco 2. |
| RP-02 | Ameaça | **SE** A5.2 (back-end, 16 dias, pessimista de 24) demorar mais que o previsto, **ENTÃO** o caminho crítico até o Marco 2 se alonga e a folga diminui. | Média | Média | **Mitigar:** iniciar modelagem do banco e esqueleto da API durante o front-end, com testes precoces de persistência. | Até 8 dias (24 − 16) da folga de 14 dias do Marco 2, sem custo adicional. |
| RP-03 | Ameaça | **SE** os testes e a homologação (A5.3, 10 dias, pessimista de 16) encontrarem defeitos ou exigirem nova rodada com usuários, **ENTÃO** A5.4 e o Marco 2 são empurrados. | Média | Média | **Mitigar:** testes contínuos a cada módulo integrado e critérios de aceite claros por pacote, para reduzir o volume de correção no fim. | Até 6 dias (16 − 10) da folga do Marco 2. Com RP-02, o pior caso soma 14 dias e esgota toda a folga; excedente vira mudança aprovada pelo patrocinador. |
| RP-04 | Ameaça | **SE** as 16 atividades estimadas por opinião especializada ou por analogia (sem três pontos) estiverem subestimadas (falácia do planejamento), **ENTÃO** os desvios se acumulam ao longo dos módulos. | Média | Média | **Mitigar:** revisar as estimativas ao fim de cada incremento com o real medido e registrar a premissa de cada número. | 1 a 3 dias distribuídos, absorvidos pelas folgas. |
| RP-05 | Ameaça | **SE** houver semanas de provas e entregas de outras disciplinas dentro do período (07/09 a 01/12/2026), e o calendário do cronograma não prevê pausas, **ENTÃO** a disponibilidade da equipe cai e as atividades atrasam. | Alta | Média | **Mitigar:** mapear as datas de provas da equipe no início do projeto, antecipar entregas antes dessas semanas e usar a folga dos ramos não críticos. | 2 a 4 dias da folga. |
| RP-06 | Oportunidade | **SE** os módulos 2 e 4 terminarem antes do módulo 3 (folgas de 2 e 7 dias no Marco 1), **ENTÃO** os desenvolvedores liberados podem antecipar a persistência e a API (A5.2), reduzindo RP-02. | Média | Média | **Explorar:** redirecionar os desenvolvedores liberados para o back-end ou para apoiar o módulo 3. | Não consome; libera até 7 dias de folga. |
| RP-07 | Oportunidade | **SE** os componentes de listagem, filtro e consulta forem reutilizados entre os módulos 2, 3 e 4 (A2.4/A2.5, A3.4, A4.2), **ENTÃO** o esforço de front-end cai e o caminho crítico se alivia. | Média | Média | **Melhorar:** projetar componentes comuns logo no início do desenvolvimento. | Não consome; economia estimada de 1 a 2 dias. |

### 4.3 Custo (RC)

| ID | Tipo | Risco em causa e efeito | Probabilidade | Impacto | Estratégia de resposta e ação | Consumo do plano de contingência |
|---|---|---|---|---|---|---|
| RC-01 | Ameaça | **SE** o retrabalho ou os atrasos consumirem mais horas de equipe que o estimado nos pacotes, **ENTÃO** o custo dos pacotes estoura a linha de base de R$ 34.000. | Média | Média | **Mitigar:** consolidar o custo por pacote da EAP e reportá-lo junto ao status semanal, com alerta precoce quando um pacote consumir a maior parte do valor sem entregar. | Conforme a regra de estouro do documento de Rede, Prazo e Orçamento (seção 1.2). |
| RC-02 | Ameaça | **SE** for necessário um custo não previsto (licença de ferramenta, hospedagem alternativa ou sessão extra de treinamento), **ENTÃO** surge uma despesa fora dos pacotes. | Baixa | Média | **Aceitar:** absorver na contingência, sem ação preventiva, dado o baixo valor esperado. | R$ 500 a R$ 1.000 da contingência. Se a causa for hospedagem, tratar em RO-01. |

### 4.4 Escopo e requisitos (RS)

| ID | Tipo | Risco em causa e efeito | Probabilidade | Impacto | Estratégia de resposta e ação | Consumo do plano de contingência |
|---|---|---|---|---|---|---|
| RS-01 | Ameaça | **SE** surgirem novas demandas nas validações (outros cursos, aplicativo móvel, controle de estágios, pagamento), **ENTÃO** o escopo cresce e ameaça os Marcos 1 e 2. | Média | Alta | **Evitar:** exibir a lista "Fora do escopo" nas validações e registrar as demandas para depois do projeto. Mudança só entra pelo gerente e, se afetar prazo ou custo, pelo patrocinador. | Nenhum se evitado. Se aceita, entra como mudança formal com estimativa própria, sem uso automático da contingência. |
| RS-02 | Ameaça | **SE** alunos esperarem que a plataforma processe o pagamento de tutorias remuneradas (o valor cobrado aparece na oferta), **ENTÃO** haverá frustração e conflitos, pois REQ-19 exclui o pagamento. | Média | Baixa | **Evitar:** deixar claro na tela que o valor é informativo e o acerto é direto entre as partes, e reforçar isso na campanha e no treinamento. | ≈ 1 dia de ajuste de texto e tela (≈ R$ 500). |
| RS-03 | Ameaça | **SE** as regras das atividades complementares (categorias, comprovantes válidos, limites de horas) não forem formalizadas com a secretaria e a coordenação antes de A4.1, **ENTÃO** haverá retrabalho no registro e na consulta de horas. | Média | Média | **Mitigar:** validar as regras com a secretaria antes de iniciar A4.1 e registrar a decisão em ata. | 2 dias de retrabalho (≈ R$ 1.000), absorvidos pela folga do módulo 4. |
| RS-04 | Ameaça | **SE** autenticação e perfis de acesso (aluno, professor, secretaria) não estiverem explícitos na EAP, **ENTÃO** surgirão como trabalho não planejado dentro de A5.2. | Alta | Média | **Mitigar:** definir com o patrocinador como será o acesso e incluí-lo de forma explícita na atividade A5.2, ainda antes do Marco 1. | 3 dias de A5.2, da folga do Marco 2 (≈ R$ 1.500 se exigir esforço extra). |

### 4.5 Técnico e qualidade (RT)

| ID | Tipo | Risco em causa e efeito | Probabilidade | Impacto | Estratégia de resposta e ação | Consumo do plano de contingência |
|---|---|---|---|---|---|---|
| RT-01 | Ameaça | **SE** a integração com o back-end (A5.2) revelar incompatibilidades com o front-end entregue no Marco 1 (dados simulados), **ENTÃO** haverá retrabalho de interface. | Média | Alta | **Mitigar:** definir o contrato da API (endpoints e formatos) durante o front-end e construir os dados simulados conforme esse contrato. | 3 a 5 dias da folga do Marco 2 (≈ R$ 1.500 a R$ 2.500). |
| RT-02 | Ameaça | **SE** as consultas não atenderem o critério de 3 segundos (REQ-16 e aceite de 5.2.1) com volume real de dados, **ENTÃO** o pacote reprova no aceite. | Baixa | Média | **Mitigar:** usar índices e paginação e testar com massa de dados realista antes da homologação. | 2 dias (≈ R$ 1.000). |
| RT-03 | Ameaça | **SE** a interface responsiva falhar em navegadores ou dispositivos diversos, **ENTÃO** o pacote 5.1.1 (testado em desktop e mobile) não é aceito. | Média | Média | **Mitigar:** desenvolver com foco em mobile e testar em matriz de navegadores e dispositivos a cada módulo. | 2 dias do Marco 1. Disputa a mesma folga de 2 dias de RP-01: se ambos ocorrerem, escalar ao patrocinador. |
| RT-04 | Ameaça | **SE** os comprovantes de atividades complementares (documentos com dados pessoais) forem armazenados sem controle de acesso adequado, **ENTÃO** haverá exposição de dados de alunos (LGPD) e perda de confiança. | Baixa | Alta | **Mitigar:** restringir o acesso ao próprio aluno e à secretaria, guardar apenas o necessário e validar a política com o patrocinador. | 2 dias em A4.1 (≈ R$ 1.000). |

### 4.6 Infraestrutura e operação (RO)

| ID | Tipo | Risco em causa e efeito | Probabilidade | Impacto | Estratégia de resposta e ação | Consumo do plano de contingência |
|---|---|---|---|---|---|---|
| RO-01 | Ameaça | **SE** a máquina na rede da instituição não for cedida ou configurada a tempo (dependência da instituição), **ENTÃO** A5.2 e A5.3 atrasam e a publicação em produção, parte do escopo do projeto, fica inviável. | Média | Alta | **Escalar:** solicitar ao patrocinador a máquina, a rede e os acessos até o Marco 1, com confirmação em ata. Como plano alternativo, usar ambiente de homologação local ou, com o risco declarado, uma hospedagem externa. | Uma hospedagem alternativa seria autorizada pelo patrocinador com a reserva de gestão (até R$ 3.000, valor a validar). |
| RO-02 | Ameaça | **SE** ninguém assumir manutenção, suporte e acompanhamento das ofertas após o Marco 2 (a operação está fora do escopo do projeto), **ENTÃO** o sistema se degrada e a adesão cai. | Média | Alta | **Transferir e Escalar:** definir com o patrocinador o responsável pela operação e transferir código, documentação e conhecimento no encerramento (a documentação já é critério de aceite do Marco 2). | Não consome; a operação fica fora do projeto. |

### 4.7 Equipe e recursos (RR)

| ID | Tipo | Risco em causa e efeito | Probabilidade | Impacto | Estratégia de resposta e ação | Consumo do plano de contingência |
|---|---|---|---|---|---|---|
| RR-01 | Ameaça | **SE** um desenvolvedor-chave ficar indisponível (doença, sobrecarga com outras disciplinas), **ENTÃO** pacotes do caminho crítico (módulo 3 e A5.2) atrasam. | Média | Alta | **Mitigar:** ter dois desenvolvedores conhecendo cada pacote crítico, com revisão de código e documentação contínua. | 3 a 5 dias das folgas (≈ R$ 1.500 a R$ 2.500). |
| RR-02 | Ameaça | **SE** os gerentes acumularem gestão e desenvolvimento, **ENTÃO** status semanal, atas (1.3) e riscos (1.2) deixam de ser feitos, agravando RE-04. | Média | Média | **Mitigar:** designar o gerente de comunicação entre a equipe, revezar as tarefas de gestão e proteger o horário do status semanal. | 1 a 2 dias (≈ R$ 500 a R$ 1.000). |

## 5. Matriz de probabilidade × impacto

Ameaças em texto simples; oportunidades marcadas com (O).

| Probabilidade \ Impacto | Baixa | Média | Alta |
|---|---|---|---|
| **Alta** | — | RE-09, RP-05, RS-04 | — |
| **Média** | RS-02 | RE-03, RP-02, RP-03, RP-04, RC-01, RS-03, RT-03, RR-02, RE-06 (O), RE-10 (O), RP-06 (O), RP-07 (O) | RE-01, RE-02, RE-04, RE-05, RE-07, RE-08, RP-01, RS-01, RT-01, RO-01, RO-02, RR-01 |
| **Baixa** | — | RC-02, RT-02 | RT-04 |

Os itens de probabilidade Média e impacto Alto são os primeiros a receber resposta e acompanhamento no status semanal.

## 6. Contingência ligada a eventos

A contingência de custo (R$ 3.400), as folgas de prazo (2 dias no Marco 1 e 14 dias no Marco 2) e a reserva de gestão (R$ 3.000) são as definidas no documento de Rede, Prazo e Orçamento. Abaixo, eventos nomeados que as consomem.

| Cenário | Eventos | Consumo de prazo | Consumo de custo | Tratamento |
|---|---|---|---|---|
| A: dois eventos | RT-01 (3 dias) + RE-05 (3 dias) | 6 dias, dentro da folga de 14 dias do Marco 2 | R$ 1.500 + R$ 1.500 = R$ 3.000 | Cabe na contingência de R$ 3.400, sobrando R$ 400. |
| B: três eventos | Cenário A + RR-01 (3 dias) | 9 dias, ainda dentro da folga de 14 dias | R$ 4.500, ou R$ 1.100 acima da contingência | O excedente exige aprovação do patrocinador para usar a reserva de gestão (saldo restante de R$ 1.900). |
| C: pior caso de prazo | RP-02 (8 dias) + RP-03 (6 dias) | 14 dias, esgota toda a folga do Marco 2 | Sem custo adicional se absorvido | Qualquer dia além disso é mudança aprovada pelo patrocinador, respeitando o limite de variação de 1 semana. |

Somando todas as ameaças com consumo estimado em R$, o valor potencial supera a contingência. Isso é esperado: ela cobre os eventos mais prováveis, não a ocorrência simultânea de todos.

## 7. Risco geral do projeto e revisão

O nível geral de risco é **médio a alto**, puxado por duas frentes: a adesão (RE-01, RE-02, RE-07, RE-08), que decide o valor entregue, e a infraestrutura e a operação (RO-01, RO-02), que dependem de decisões da instituição. Nenhum item, isoladamente, justifica cancelar o projeto.

O registro de riscos é revisado por incremento (pacote 1.2) e sempre que o plano mudar. As premissas do Termo de Abertura viram risco se falharem, e os riscos novos são identificados e acrescentados ao registro na reunião semanal.

## 8. Aprovações

**Patrocinador:** Diogo Silveira Mendonça

**Data:** __ / __ / ____

**Gerentes do Projeto:**
- Erick Martins Silva
- Gabriel Centeio Freitas
- Guilherme Andrade Taveira
- Rafael Penela Grande Ferreira

**Data:** 28 / 09 / 2026