# Status Report 1: Escopo do Marco 1 — HubBCC

**Versão:** 1.0   
**Data de status:** 06/10/2026  
**Período coberto:** 03/08/2026 a 06/10/2026

## 1. Situação geral

Situação geral: Amarelo, parecer baseado na análise estática e dinâmica da aplicação.

Os cinco módulos previstos em 1.4.1 a 1.4.5 possuem telas, rotas, consultas e operações de alteração conectadas ao simulador JSON Server. No entanto, durante os testes realizados foi possível notar diversas lacunas nestes pacotes. Por sua vez, foi possível observar problemas de permissionamento, UI/UX e requisitos incompletos.

O módulo 1.4.6 foi atendido integralmente. O módulo 1.4.7 não foi demonstrado e sua análise está pendente, pois não há registros de demonstração da entrega atual para o patrocinador.

## 2. Escopo do Marco 1

Pacotes diretamente no escopo do M1: **1.4.1 a 1.4.7**.

| Pacote | Entrega | Critério observável do dicionário | Status da verificação | Resultado da análise | Recomendação do item | Observação |
|---|---|---|---|---|---|---|
| 1.4.1 | Interface de oportunidades | Criar, consultar, editar e encerrar oportunidade. | Verificado | Passou | Aceitar | -- |
| 1.4.2 | Interface de candidaturas | Aluno se candidata e consulta status. | Verificado | Passou | Aceitar com ressalvas | Botão "Candidatar-se" aparece mesmo para oportunidades que o usuário já se candidatou. |
| 1.4.3 | Interface de apoio acadêmico | Criar oferta, consultar, filtrar e agendar. | Verificado | Falhou | Rejeitar | Interface permite com que monitor possa agendar horários de monitorias/tutorias pela página "Apoio acadêmico". Botão "Criar oferta" aparece para o nível Aluno, porém ao interagir, um erro de "Acesso não autorizado" é renderizado. |
| 1.4.4 | Interface de atividades complementares | Registrar atividade com comprovante e consultar total de horas. | Verificado | Falhou | Rejeitar | Não há possibilidade de aprovar as horas em análise de um usuário. Contagem de horas por categoria soma comprovantes que ainda não foram aprovados. |
| 1.4.5 | Interface de disciplinas (administrador) | Administrador cadastra, consulta, altera e exclui disciplina. | Verificado | Passou | Aceitar | -- |
| 1.4.6 | Fluxo integrado do M1 | Os fluxos de 1.4.1 a 1.4.5 funcionam em conjunto. | Verificado | Passou | Aceitar | -- |
| 1.4.7 | Demonstração do M1 | A demonstração da semana 8 executa o roteiro. | Não demonstrado | Pendente | Pendente | Aguardando avaliação do marco 1 por parte do patrocinador. |

## 3. Requisitos do Marco 1 e rastreabilidade

O M1 entrega frontend com backend simulado. A presença de regras no simulador não comprova a entrega do backend definitivo, da persistência MongoDB ou dos controles de acesso da API previstos no M2.

A tabela abaixo corrige o alinhamento das colunas do rascunho: REQ-07 está associado a 1.3.5 e 1.5.8; REQ-08, a 1.3.4. Esses pacotes da base técnica apoiam o M1, mas não pertencem ao grupo 1.4.

| ID | Requisito | Pacotes no M1 | Pacotes no M2 | Status no M1 | Observação |
|---|---|---|---|---|---|
| REQ-01 | Centralizar oportunidades acadêmicas | 1.4.1 | 1.5.1 | Atendido | Catálogo, detalhe, cadastro, edição e encerramento ligados ao simulador. |
| REQ-02 | Permitir candidatura e acompanhamento | 1.4.2 | 1.5.2 | Atendido | Envio e consulta da situação vinculados ao usuário. |
| REQ-03 | Ofertar monitorias e tutorias | 1.4.3 | 1.5.3 | Atendido | Renderizar botão "Criar oferta" para Aluno fere a experiência de usuário. |
| REQ-04 | Agendar atendimentos | 1.4.3 | 1.5.4 | Atendido | Calendário, horários e confirmação implementados; validação em navegador pendente. |
| REQ-05 | Registrar atividades complementares | 1.4.4 | 1.5.5 | Atendido | — |
| REQ-06 | Consultar total de horas | 1.4.4 | 1.5.7 | Pendente | Verificar regras de negócio para aprovação de horas e a entidade responsável. |
| REQ-07 | Controlar perfis de acesso | 1.3.5 — apoio ao M1 | 1.5.8 | Pendente | Revisar perfis de acesso implementados, especialmente para Apoio Acadêmico. |
| REQ-08 | Demonstrar sem sistemas reais | 1.3.4 — apoio ao M1 | — | Atendido | JSON Server, arquivo seed e serviços locais. |  
| REQ-09 | Manter cadastro de disciplinas | 1.4.5 | 1.5.6 | Atendido | — |

## 4. Questões e mudanças solicitadas

### 4.1 Questões

Os responsáveis abaixo seguem a prestação de contas do dicionário da EAP. Os prazos são **propostas para pactuação**, não compromissos já assumidos pela equipe de desenvolvimento.

| ID | Questão | Pacote / REQ | Responsável proposto | Prazo proposto | Status |
|---|---|---|---|---|---|
| Q-01 | Alinhar o total de horas à regra 8. Atividades novas entram como “Em análise”, não incrementam as horas aprovadas, mas entram no somatório por categoria, e não há como aprovar horas em análise. Definir se o requisito exige horas registradas ou apenas aprovadas, e nesse caso, definir também quem aprova, para ajustar a implementação ou registrar a mudança da regra. | 1.4.4 / REQ-06 | Samuel | 15/10/2026 | Aberta |
| Q-02 | O botão “Candidatar-se” continua aparecendo para oportunidades em que o usuário já se candidatou. Definir o comportamento esperado (ocultar, desabilitar ou trocar por “Consultar status”/“Cancelar candidatura”) e ajustar a interface. | 1.4.2 / REQ-02 | Mina | 15/10/2026 | Aberta |
| Q-03 | Definir se o botão "Criar oferta", na listagem de Apoio Acadêmico, deve ficar oculto para alunos ou apenas desabilitado com aviso explicativo. | 1.4.3 / REQ-07 | Mina | 15/10/2026 | Aberta |
| Q-04 | Revisar a implementação dos perfis de acesso especialmente em Apoio Acadêmico: quem pode criar oferta, quem pode agendar e quem pode visualizar botões/rotas. A interface permite que monitor agende horários, confirmar se isso é regra ou falha. | 1.4.3 / REQ-04 e REQ-07 | Mina | 15/10/2026 | Aberta |

### 4.2 Mudanças solicitadas

| ID | Mudança Proposta | Motivo | Impacto | Efeito se não Aprovar | Status |
|---|---|---|---|---|---|
| MUD-01 | Caso a regra passe a contabilizar somente horas aprovadas, registrar a alteração em relação ao texto atual da regra 8. | Q-01, a implementação atual soma comprovantes “Em análise” ao total por categoria. | Altera semântica de REQ-06. | Total de horas continua divergente da regra 8 e pacote 1.4.4 permanece em não conformidade. | Em elaboração, pois depende da decisão da Q-01. |
| MUD-02 | Caso seja exigido fluxo de aprovação de horas complementares, formalizar a inclusão desse fluxo no escopo do M1. | Q-01, não há como aprovar horas em análise e a entidade responsável não está definida. | Novo fluxo ou tela, afeta REQ-06 e o pacote 1.4.4. | Horas permanecem sem aprovação, REQ-06 não fecha e 1.4.4 segue rejeitado. | Em elaboração, pois depende da decisão da Q-01. |
| MUD-03 | Confirmar enquadramento de recuperação de senha. | Funcionalidade já implementada, mas não prevista como critério explícito de 1.4.1 a 1.4.7. | Amplia o escopo declarado do M1. | Funcionalidades ficam sem registro formal de escopo e podem ser questionadas no aceite. | Em elaboração, se formalizada e submetida, passa para Em análise. |

## 5. Próximas ações e decisões pedidas ao patrocinador, com prazo

**Datas propostas, sujeitas à pactuação com a equipe e o patrocinador.**

| Ação | Responsável | Prazo proposto | Decisão / observação |
|---|---|---|---|
| Resolver a regra das horas e as pendências Q-02, Q-03 e Q-04. | PSW + GPTI | 15/10/2026 | Registrar correção ou decisão de mudança, conforme o caso. |
| Pactuar apontamento de horas por aluno/atividade e esforço restante. | GPTI + PSW | 16/10/2026 | Subsídio ao Status Report 2 |
| Deliberar sobre o aceite do M1 e registrar ressalvas ou recusa. | Patrocinador | 20/10/2026 | Decisão formal distinta da recomendação deste relatório. |

**Decisão solicitada ao patrocinador:** ciência do parecer amarelo e avaliação do relatório, com deliberação final após o tratamento de Q-01 e Q-04. Não há aceite formal registrado neste documento.

## 6. Aprovações

**Patrocinador:** Diogo Silveira Mendonça

**Data:** __ / __ / ____

**Gerentes do Projeto:**
- Erick Martins Silva
- Gabriel Centeio Freitas
- Guilherme Andrade Taveira
- Rafael Penela Grande Ferreira

**Data:** 12 / 10 / 2026