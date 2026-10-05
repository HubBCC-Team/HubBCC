# Dicionário da EAP — HubBCC

**Versão:** 1.0   
**Data:** 14/09/2026  
**Linha de base do escopo:** este dicionário, a declaração do escopo e a EAP do plano de projeto.

Cada linha é um pacote de trabalho. **A** é quem presta contas do aceite. **R** é quem executa.

## 1.1 Gestão e coordenação

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.1.1 | Termo e plano mantidos | Erick | Erick, Gabriel, Guilherme e Rafael | A versão citada na AV1 é a mesma usada no controle das semanas 9 a 12, ou a mudança está registrada. |
| 1.1.2 | Decisões, riscos e mudanças | Gabriel | Erick, Gabriel, Guilherme e Rafael | Cada mudança de escopo, prazo ou custo tem pedido, decisão e efeito nas linhas de base. |
| 1.1.3 | Aceites dos marcos | Rafael | Rafael | Há registro de aceite ou recusa do M1 na semana 8 e do M2 na semana 12, com ciência do patrocinador. |
| 1.1.4 | Revisão técnica organizada | Geovanne | Geovanne, Marina, Mina e Samuel | Nenhum incremento entra na demonstração sem revisão de outro aluno e sem o autor explicar o trecho. |

## 1.2 Requisitos e desenho

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.2.1 | Escopo funcional inicial | Guilherme | Geovanne, Marina, Mina e Samuel (propõem); Erick, Gabriel, Guilherme e Rafael (validam) | A declaração do escopo cabe em uma leitura e lista o que está fora. |
| 1.2.2 | Atores e fluxos | Guilherme | Geovanne, Marina, Mina e Samuel | Aluno, monitor/tutor e administrador têm ações distintas. |
| 1.2.3 | Modelo e contratos | Marina | Geovanne, Marina, Mina e Samuel | O mesmo exemplo de payload serve ao frontend e à API. |
| 1.2.4 | Dados acadêmicos necessários | Marina | Marina | Disciplina, oferta, agendamento e comprovante aparecem no contrato. |
| 1.2.5 | Hipóteses e limitações | Guilherme | Guilherme | Cada regra sem validação institucional está marcada como hipótese. |
| 1.2.6 | Navegação revisada | Geovanne | Geovanne, Marina, Mina e Samuel | Um roteiro percorre consulta, candidatura, agendamento e registro sem passo oral não representado. |

## 1.3 Base técnica e ambientes

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.3.1 | Aplicação React inicial | Geovanne | Geovanne, Marina, Mina e Samuel | Outro aluno executa a aplicação seguindo a instrução do repositório. |
| 1.3.2 | API Express inicial | Mina | Mina | A API responde uma rota de verificação sem o frontend acessar o MongoDB. |
| 1.3.3 | MongoDB de desenvolvimento | Samuel | Samuel | Um registro gravado é lido depois de reiniciar a API. |
| 1.3.4 | Dados fictícios de disciplinas e alunos | Marina | Marina | Disciplinas, alunos e ofertas fictícias são lidos nos campos combinados. |
| 1.3.5 | Autenticação | Mina | Mina | O fluxo de login termina sem chamada externa. |
| 1.3.6 | Perfil de administrador | Samuel | Samuel | O perfil de aluno não abre a tela de configuração de disciplinas. |

## 1.4 Frontend do marco 1

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.4.1 | Interface de oportunidades | Geovanne | Geovanne | Criar, consultar, editar e encerrar oportunidade. |
| 1.4.2 | Interface de candidaturas | Marina | Marina | Aluno se candidata e consulta status. |
| 1.4.3 | Interface de apoio acadêmico | Mina | Mina | Criar oferta, consultar, filtrar e agendar. |
| 1.4.4 | Interface de atividades complementares | Samuel | Samuel | Registrar atividade com comprovante e consultar total de horas. |
| 1.4.5 | Interface de disciplinas (administrador) | Samuel | Samuel | Administrador cadastra, consulta, altera e exclui disciplina. |
| 1.4.6 | Fluxo integrado do M1 | Geovanne | Geovanne, Marina, Mina e Samuel | Os fluxos de 1.4.1 a 1.4.5 funcionam em conjunto. |
| 1.4.7 | Demonstração do M1 | Gabriel | Geovanne | A demonstração da semana 8 executa o roteiro. |

## 1.5 Backend e regras de negócio

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.5.1 | API de oportunidades | Geovanne | Geovanne | CRUD persiste no MongoDB e rejeita oportunidade sem data de encerramento. |
| 1.5.2 | API de candidaturas | Marina | Marina | Candidatura registrada e visível para o aluno. |
| 1.5.3 | API de apoio acadêmico | Mina | Mina | Oferta sem disciplina ou horário não é gravada. |
| 1.5.4 | API de agendamento | Mina | Mina | Agendamento confirmado para aluno e monitor. |
| 1.5.5 | API de atividades complementares | Samuel | Samuel | Atividade salva com comprovante e horas. |
| 1.5.6 | API de disciplinas | Samuel | Samuel | CRUD de disciplinas restrito ao perfil administrador. |
| 1.5.7 | Cálculo de horas complementares | Samuel | Samuel | Total de horas exibido corretamente. |
| 1.5.8 | Autenticação e perfis | Mina | Geovanne, Marina, Mina e Samuel | Rota protegida recusa chamada sem usuário e diferencia aluno, monitor e administrador. |
| 1.5.9 | Persistência de domínio | Samuel | Geovanne, Marina, Mina e Samuel | Oportunidades, agendamentos, disciplinas e atividades continuam após reiniciar a API. |

## 1.6 Integração do marco 2

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.6.1 | Frontend na API Express | Geovanne | Geovanne, Marina, Mina e Samuel | Fluxos do M1 executam contra Express. |
| 1.6.2 | Fluxos persistidos | Samuel | Geovanne, Marina, Mina e Samuel | Candidatura, agendamento e disciplina sobrevivem a novo acesso. |
| 1.6.3 | Regras demonstradas | Mina | Geovanne, Marina, Mina e Samuel | Avaliação, cancelamento e registro de realização funcionam. |
| 1.6.4 | Erros dos fluxos prioritários | Geovanne | Geovanne, Marina, Mina e Samuel | Vaga esgotada, comprovante inválido e acesso indevido produzem mensagem identificável. |
| 1.6.5 | Demonstração final | Rafael | Geovanne | A semana 12 executa o roteiro de 1.6.1 a 1.6.4, ou registra o caso que falhou. |

## 1.7 Verificação e encerramento

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.7.1 | Testes dos fluxos prioritários | Marina | Geovanne, Marina, Mina e Samuel | Há resultado passado ou falho para consulta, candidatura, agendamento, disciplina e horas. |
| 1.7.2 | Testes das regras de negócio | Mina | Mina | Os casos cobrem cancelamento, avaliação, limites de horas e acesso por perfil. |
| 1.7.3 | Defeitos tratados | Geovanne | Geovanne, Marina, Mina e Samuel | Defeito que viola aceite está corrigido ou listado como limitação. |
| 1.7.4 | Instruções de execução | Samuel | Samuel | Outro aluno sobe o sistema só com o texto do repositório. |
| 1.7.5 | Encerramento e lições | Rafael | Erick, Gabriel, Guilherme e Rafael | O termo de encerramento diz o que foi aceito, o que ficou de fora e o que não repetir. |
| 1.7.6 | Pendências institucionais | Guilherme | Guilherme | A lista separa integração, validação institucional e produção como trabalho futuro. |

## 1.8 Aprovações

**Patrocinador:** Diogo Silveira Mendonça

**Data:** __ / __ / ____

**Gerentes do Projeto:**
- Erick Martins Silva
- Gabriel Centeio Freitas
- Guilherme Andrade Taveira
- Rafael Penela Grande Ferreira

**Data:** 14 / 09 / 2026