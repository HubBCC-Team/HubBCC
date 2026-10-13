# Correção da AV1 — GPTI — HubBCC

Repositório: https://github.com/HubBCC-Team/HubBCC na branch `chore/docs-gpti`.

Artefatos: `documents/doc/gpti/GPTI-GrupoC-Business_Case.md`, `GPTI-GrupoC-Termo_de_Abertura.md`, `GPTI-GrupoC-Plano_de_Projeto.md`, `GPTI-GrupoC-Dicionario_EAP.md`, com as figuras em `documents/doc/gpti/img/`.

A nota é do Grupo C de GPTI e vale para cada aluno do grupo. Nesta etapa, a ausência de commit não zera ninguém. O nome na atividade do cronograma é o contrato da etapa seguinte. A especificação de referência é a do HubBCC já corrigida na AV1 de PSW: disciplina, oportunidade, agendamento, apoio, candidatura e atividade complementar, com o JSON Server como backend do marco 1 (`documents/doc/boasPraticas.md`).

| Aluno | Nota |
| --- | ---: |
| Erick Martins Silva | 93 |
| Gabriel Centeio Freitas | 93 |
| Guilherme Andrade Taveira | 93 |
| Rafael Penela Grande Ferreira | 93 |

## Parte comum — 93/100

| Parte | Nota |
| --- | ---: |
| Business case | 10/10 |
| Termo de abertura | 15/15 |
| Escopo e EAP | 14/15 |
| Cronograma com nomes | 23/25 |
| Custo, partes e riscos | 13/15 |
| Dicionário da EAP | 13/15 |
| Um projeto só | 5/5 |

### Business case — 10/10

O caso inclui oportunidade, candidatura, monitoria, agendamento, disciplina e atividade complementar, com três alternativas e a recomendação do HubBCC. A seção 12 fecha dizendo que os indicadores "não representam retorno financeiro deste projeto acadêmico" e que a produção exige recalcular. É o produto da especificação, com a análise de 24 meses marcada como futura.

### Termo de abertura — 15/15

A seção 2 diz que quem mede é a equipe GPTI, com ciência do patrocinador, na semana 12. Incluído e fora cabem no HubBCC; há marcos, premissas, restrições, governança, riscos iniciais e aprovação.

### Escopo e EAP — 14/15

A declaração (seção 4) lista o que o aluno fictício e o administrador fazem, e a matriz liga REQ-01 a REQ-08 aos pacotes. A EAP tem 1.4 interfaces por módulo, 1.5 uma API por módulo e 1.6 o frontend na API Express.

Desconto:

- 1 ponto. O marco 1 aparece como "dados fictícios" (1.3.4, REQ-08). O JSON Server, que a especificação de PSW fixa como backend do marco 1 e que a AV1 de PSW usou, não está nomeado no plano nem no dicionário.

### Cronograma com nomes — 23/25

As linhas D06 a D09 trazem Geovanne, Marina, Mina e Samuel, um por módulo. As linhas G01 a G12 trazem Erick, Gabriel, Guilherme e Rafael. A figura `GPTI-cronograma-alocacao-individual.png` é a alocação semanal: cada célula tem o código, a tarefa e as horas, por pessoa, da semana 3 à 12 em PSW e da 4 à 12 em GPTI. O caminho crítico e a cadeia de gestão estão na seção 5.4.

Descontos:

- 1 ponto. Em D03 a D05 e de D12 em diante, o responsável da linha é "Geovanne, Marina, Mina e Samuel"; em G02, G03, G05 e G06, dois ou quatro nomes. A divisão por pessoa fica só na figura.
- 1 ponto. A alocação individual está só na imagem. Várias células empilham duas tarefas na mesma semana (D06 e D11 para Geovanne na S8, por exemplo), e a tabela em texto que o molde pede nas seções 5.5 e 5.6 não existe.

### Custo, partes e riscos — 13/15

Taxa-sombra, contingência de 56 h separada da reserva gerencial, e engajamento com estratégia por parte interessada.

Descontos:

- 1 ponto. O registro de riscos (RT01 a RT05, RG01 a RG05) tem probabilidade, impacto e mitigação em uma palavra ou duas. Não há causa escrita, gatilho nem responsável por risco.
- 1 ponto. Os dez riscos são ameaças. Não há uma oportunidade registrada com resposta.

### Dicionário da EAP — 13/15

O A é um nome em todos os pacotes. O aceite é observável e é o do HubBCC: "CRUD persiste no MongoDB e rejeita oportunidade sem data de encerramento"; "Um registro gravado é lido depois de reiniciar a API"; "Criar, consultar, editar e encerrar oportunidade".

Descontos:

- 2 pontos. Nos pacotes de gestão e nos compartilhados, o R lista os quatro nomes juntos ("Geovanne, Marina, Mina e Samuel"; os quatro de GPTI). A tarefa de cada um está na figura, não na linha.

### Um projeto só — 5/5

Caso, termo, plano e dicionário descrevem o mesmo HubBCC, com os mesmos códigos, as mesmas exclusões e as mesmas oito pessoas.

## O que esta nota deixa para a etapa seguinte

A figura de alocação individual põe Geovanne em oportunidades, Marina em candidaturas, Mina no apoio acadêmico e Samuel em atividades complementares. Erick, Gabriel, Guilherme e Rafael estão cada um numa atividade de gestão da semana, com as horas. A etapa seguinte cobra essa célula. Onde a linha do Markdown junta os quatro, vale a figura.
