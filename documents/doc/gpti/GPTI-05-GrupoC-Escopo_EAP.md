# Escopo e EAP - HubBCC

## 1. Escopo do Produto e do Projeto

### 1.1. Escopo do Produto

- Centralizar oportunidades acadêmicas;
- Permitir candidatura a oportunidades;
- Ofertar e agendar monitorias/tutorias;
- Gerenciar atividades complementares.

### 1.2. Escopo do Projeto

- Migrar e cadastrar oportunidades no sistema;
- Treinar alunos, professores e secretaria;
- Homologar o sistema com a coordenação;
- Comunicar o calendário de uso;
- Publicar o sistema em produção.

## 2. Planejamento do Gerenciamento do Escopo

**SUGESTÃO ERICK: Pensar melhor em como escrever isso**

| Item | Definição |
|------|-----------|
| Como o escopo será tratado | Alunos, professores e secretaria validam as regras de negócio |
| Quem aprova mudança | Gerente do projeto; se afetar prazo/custo, patrocinador | !!!
| Como o aceite acontece | Por entrega, não por tela isolada | !!!
| Ciclo de vida | Adaptativo |

## 3. Requisitos

| ID | Tipo | Descrição | Ator | Origem |
|----|------|-----------|------|--------|
| REQ-01 | Usuário | Consultar e filtrar oportunidades acadêmicas | Aluno | Aluno |
| REQ-02 | Usuário | Realizar candidatura em oportunidade | Aluno | Aluno |
| REQ-03 | Usuário | Consultar situação de suas candidaturas | Aluno | Aluno |
| REQ-04 | Usuário | Criar oferta de apoio acadêmico (monitoria/tutoria) | Aluno | Aluno |
| REQ-05 | Usuário | Consultar e filtrar ofertas de apoio | Aluno | Aluno |
| REQ-06 | Usuário | Realizar agendamento de monitoria/tutoria | Aluno | Aluno |
| REQ-07 | Usuário | Registrar atividade complementar com comprovante | Aluno | Aluno |
| REQ-08 | Usuário | Consultar total de horas complementares | Aluno | Aluno |
| REQ-09 | Funcional | Manter oportunidade acadêmica (cadastrar, alterar e encerrar) | Aluno / Professor / Secretaria / Coordenação | Professor |
| REQ-10 | Funcional | Avaliar candidatura | Professor | Professor |
| REQ-11 | Funcional | Cancelar ou reagendar atendimento | Aluno | Aluno |
| REQ-12 | Funcional | Registrar realização do atendimento | Aluno | Aluno |
| REQ-13 | Funcional | Avaliar atendimento | Aluno | Aluno |
| REQ-14 | Funcional | Cancelar oferta de apoio | Aluno | Aluno |
| REQ-15 | Não funcional | Sistema acessível via navegador web | — | Equipe |
| REQ-16 | Não funcional | Consultas com tempo de resposta adequado | — | Equipe |
| REQ-17 | Restrição | Apenas para o curso de Bacharelado em Ciência da Computação | — | Coordenação |
| REQ-18 | Restrição | Não inclui aplicativo móvel nativo | — | Coordenação |
| REQ-19 | Restrição | Não processa pagamento entre aluno e tutor | — | Coordenação |
| REQ-20 | Restrição | Não abrange divulgação e controle de estágios | — | Coordenação |

### 3.1 Matriz de Rastreabilidade dos Requisitos

| ID | Origem | Requisito | EAP | Aceite |
|----|--------|-----------|-----|--------|
| REQ-01 | Prototipagem | Consultar/filtrar oportunidades | 2.2 | Filtros funcionam e retornam resultados |
| REQ-02 | Prototipagem | Realizar candidatura | 2.3 | Candidatura registrada e visível |
| REQ-03 | Prototipagem | Consultar candidaturas | 2.3 | Aluno vê status da candidatura |
| REQ-04 | Prototipagem | Criar oferta de apoio | 3.1 | Oferta criada e listada |
| REQ-05 | Prototipagem | Consultar/filtrar ofertas | 3.1 | Filtros por disciplina e modalidade |
| REQ-06 | Prototipagem | Realizar agendamento | 3.2 | Agendamento confirmado |
| REQ-07 | Prototipagem | Registrar atividade complementar | 4.1 | Atividade salva com comprovante |
| REQ-08 | Prototipagem | Consultar horas complementares | 4.2 | Total de horas exibido |
| REQ-09 | Prototipagem | Manter oportunidade acadêmica | 2.1 | Ciclo de vida da oportunidade |
| REQ-10 | Prototipagem | Avaliar candidatura | 2.4 | Avaliação registrada |
| REQ-11 | Prototipagem | Cancelar/reagendar atendimento | 3.2 | Status atualizado |
| REQ-12 | Prototipagem | Registrar realização | 3.3 | Atendimento marcado como concluído |
| REQ-13 | Prototipagem | Avaliar atendimento | 3.3 | Avaliação registrada |
| REQ-14 | Prototipagem | Cancelar oferta de apoio | 3.1 | Oferta removida da listagem |
| REQ-15 | Prototipagem | Acesso via navegador | 5.2 | Sistema acessível por URL |
| REQ-16 | Equipe | Tempo de resposta | 5.2 | Consultas em até 3 segundos |


## 4. Declaração do Escopo

**Objetivo em uma frase:**  
Centralizar oportunidades acadêmicas, monitorias, tutorias e atividades complementares em uma única plataforma, reduzindo a dispersão de informações e a carga administrativa da secretaria.

**Entregas principais:**

1. Front-end completo;
2. Sistema completo, com front-end e back-end.

**Premissas que ainda valem:**

- Alunos e professores participarão das entrevistas de validação;
- Alunos usarão a plataforma para consultar e gerenciar atividades;
- Professores, secretaria, coordenação e alunos divulgarão oportunidades pela plataforma;

**Critérios de aceite gerais:**

- Front-end responsivo e funcional;
- Sistema completo responsivo e funcional, com suíte de testes e documentação.

### 4.1 Dentro e Fora do Escopo

**Dentro:**
- Gerenciamento de oportunidades acadêmicas;
- Sistema de candidatura a oportunidades;
- Ofertas de apoio acadêmico;
- Agendamento de monitorias/tutorias;
- Registro e consulta de atividades complementares.

**Fora**:
- Outros cursos além do BCC;
- Plataforma própria de atendimento;
- Divulgação e controle de estágios;
- Processamento de pagamento aluno-tutor;
- Aplicativo móvel nativo;
- Gestão de diplomas e histórico escolar.

## 5. Estrutura Analítica do Projeto (EAP)

```
1. HubBCC — Plataforma de apoio e desenvolvimento acadêmico
│
├── 1. Gestão do Projeto
│   ├── 1.1 Planejamento e monitoramento
│   ├── 1.2 Gestão de riscos
│   └── 1.3 Comunicação com partes interessadas
│
├── 2. Oportunidades Acadêmicas
│   ├── 2.1 Cadastro e gestão de oportunidades
│   │   ├── 2.1.1 Cadastrar oportunidade
│   │   ├── 2.1.2 Alterar oportunidade
│   │   └── 2.1.3 Encerrar oportunidade
│   ├── 2.2 Consulta e filtros
│   │   ├── 2.2.1 Listar oportunidades
│   │   └── 2.2.2 Filtrar por categoria/requisitos
│   ├── 2.3 Candidaturas
│   │   ├── 2.3.1 Realizar candidatura
│   │   └── 2.3.2 Consultar candidaturas
│   └── 2.4 Avaliação
│       └── 2.4.1 Avaliar candidatura
│
├── 3. Apoio Acadêmico
│   ├── 3.1 Ofertas de monitoria/tutoria
│   │   ├── 3.1.1 Criar oferta
│   │   ├── 3.1.2 Alterar oferta
│   │   ├── 3.1.3 Cancelar oferta
│   │   └── 3.1.4 Consultar/filtrar ofertas
│   ├── 3.2 Agendamento
│   │   ├── 3.2.1 Realizar agendamento
│   │   ├── 3.2.2 Consultar agendamentos
│   │   └── 3.2.3 Cancelar ou reagendar
│   └── 3.3 Realização e avaliação
│       ├── 3.3.1 Registrar realização
│       └── 3.3.2 Avaliar atendimento
│
├── 4. Atividades Complementares
│   ├── 4.1 Registro
│   │   └── 4.1.1 Registrar atividade com comprovante
│   └── 4.2 Consulta
│       └── 4.2.1 Consultar total de horas
│
└── 5. Implantação e Aceite
    ├── 5.1 Front-end
    │   └── 5.1.1 Desenvolver interface responsiva
    ├── 5.2 Back-end
    │   └── 5.2.1 Desenvolver API e integrações
    ├── 5.3 Testes e homologação
    │   └── 5.3.1 Testar e validar com usuários
    └── 5.4 Treinamento
        └── 5.4.1 Treinar secretaria e professores
```

### 5.1 Dicionário da EAP

| Pacote | Descrição | Aceite |
|--------|-----------|--------|
| 1.1 | Planejamento e monitoramento | Cronograma e status atualizados a cada semana |
| 1.2 | Gestão de riscos | Registro de riscos revisado por incremento |
| 1.3 | Comunicação com partes interessadas | Atas e comunicados enviados nos prazos |
| 2.1.1 | Cadastrar oportunidade | Oportunidade salva e visível na listagem |
| 2.1.2 | Alterar oportunidade | Alteração refletida na listagem |
| 2.1.3 | Encerrar oportunidade | Oportunidade encerrada não aparece para candidatura |
| 2.2.1 | Listar oportunidades | Listagem exibe todas as oportunidades ativas |
| 2.2.2 | Filtrar oportunidades | Filtros retornam resultados corretos |
| 2.3.1 | Realizar candidatura | Candidatura registrada e visível para o aluno |
| 2.3.2 | Consultar candidaturas | Aluno vê status da candidatura |
| 2.4.1 | Avaliar candidatura | Avaliação registrada e visível |
| 3.1.1 | Criar oferta de apoio | Oferta listada com disciplina, horário e modalidade |
| 3.1.2 | Alterar oferta | Alteração refletida na listagem |
| 3.1.3 | Cancelar oferta | Oferta removida da listagem |
| 3.1.4 | Consultar/filtrar ofertas | Filtros por disciplina e modalidade funcionam |
| 3.2.1 | Realizar agendamento | Agendamento confirmado para ambas as partes |
| 3.2.2 | Consultar agendamentos | Aluno e tutor veem seus agendamentos |
| 3.2.3 | Cancelar ou reagendar | Status do agendamento atualizado |
| 3.3.1 | Registrar realização | Atendimento marcado como concluído |
| 3.3.2 | Avaliar atendimento | Avaliação registrada |
| 4.1.1 | Registrar atividade complementar | Atividade salva com comprovante e horas |
| 4.2.1 | Consultar total de horas | Total de horas exibido corretamente |
| 5.1.1 | Desenvolver interface responsiva | Testado em desktop e mobile sem erros |
| 5.2.1 | Desenvolver API e integrações | Consultas em até 3 segundos |
| 5.3.1 | Testar e validar com usuários | Feedback registrado e ajustes feitos |
| 5.4.1 | Treinar secretaria e professores | Treinamento realizado e material entregue |

## 6. Aprovações

**Patrocinador:** Diogo Silveira Mendonça

**Data:** __ / __ / ____

**Gerentes do Projeto:**
- Erick Martins Silva
- Gabriel Centeio Freitas
- Guilherme Andrade Taveira
- Rafael Penela Grande Ferreira

**Data:** 14 / 09 / 2026