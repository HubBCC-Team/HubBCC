# Termo de Abertura do Projeto

**Versão:** 1.0  
**Data:** 07/09/2026  
**Patrocinador:** Diogo Silveira Mendonça  

## HubBCC — Plataforma de apoio e desenvolvimento acadêmico

| Campo | Informação |
|---|---|
| **Gerentes do projeto** | Erick Martins Silva, Gabriel Centeio Freitas, Guilherme Andrade Taveira e Rafael Penela Grande Ferreira |
| **Equipe de desenvolvimento** | Geovanne Gomes de Souza, Marina Motta Sampaio, Mina Iura Mathias Monteiro e Samuel Trindade Sabino da Silva |
| **Duração estimada** | 3 meses (12 semanas letivas) |
| **Equipe prevista** | 8 alunos: 4 de PSW e 4 de GPTI; dedicação estimada de 5 h/semana por pessoa |

## 1. Propósito e justificativa

Este termo autoriza o início do projeto de desenvolvimento do **HubBCC**, uma plataforma para centralizar oportunidades acadêmicas, monitorias, tutorias e atividades complementares dos alunos do Bacharelado em Ciência da Computação.

Hoje, essas informações estão dispersas em e-mails, grupos de mensagens, murais e páginas de departamentos. Isso dificulta o acesso dos alunos às oportunidades e torna o contato com monitorias e tutorias mais fragmentado do que poderia ser. Além disso, o controle de horas complementares é feito individualmente, sem um ambiente único de consulta e acompanhamento.

O projeto será também uma experiência de aprendizagem prática: os quatro alunos de PSW desenvolverão o produto e os quatro alunos de GPTI farão a gestão e a validação interna do escopo. Os oito participantes conhecem o processo de graduação por vivência própria e usarão esse conhecimento para levantar hipóteses de requisitos.

## 2. Objetivos do projeto

Os objetivos abaixo são do sistema. Quem mede é a equipe GPTI, com ciência do patrocinador, na demonstração da semana 12.

- Centralizar, em um único ambiente, oportunidades acadêmicas, ofertas de apoio (monitorias e tutorias), disciplinas do curso e registro de atividades complementares.
- Permitir que o aluno consulte e filtre oportunidades, candidate-se e acompanhe suas candidaturas.
- Permitir que o aluno encontre ofertas de monitoria/tutoria, realize agendamentos e avalie atendimentos.
- Permitir que o aluno registre atividades complementares com comprovante e consulte o total de horas.
- Permitir que o administrador mantenha o cadastro de disciplinas do curso.
- Entregar a AV1 (termo, business case e plano) na semana 8 e o encerramento com lições aprendidas na semana 12.

## 3. Escopo de alto nível

### Incluído

- Gerenciamento de oportunidades acadêmicas.
- Sistema de candidatura a oportunidades.
- Gerenciamento de ofertas de apoio acadêmico (monitorias e tutorias).
- Sistema de agendamento para monitorias/tutorias.
- Gerenciamento de disciplinas (cadastro, consulta, alteração e exclusão pelo perfil administrador).
- Registro e consulta de atividades complementares.
- Frontend em React/JavaScript e backend em JavaScript/Express/MongoDB.
- Testes funcionais, documentação essencial e demonstração das entregas.

### Fora do escopo inicial

- Abranger outros cursos além do BCC.
- Plataforma própria para realização de atendimentos.
- Divulgação e controle de estágios.
- Processamento de pagamento entre aluno e tutor.
- Aplicativo móvel nativo.
- Integração efetiva com o provedor de autenticação institucional e com o sistema acadêmico real.
- Uso de dados reais ou implantação em produção.

## 4. Abordagem técnica e de aprendizagem

O desenvolvimento será incremental:

1. **Frontend:** React e JavaScript.
2. **Backend:** API em JavaScript com Express, regras de negócio e MongoDB.
3. **Integração:** frontend conectado à API própria no marco final.

O sistema possui três perfis de acesso: **aluno**, **monitor/tutor** e **administrador**. O administrador é responsável pelo cadastro e manutenção das disciplinas do curso; monitor e aluno usam os demais módulos.

Como a equipe está aprendendo as tecnologias, o plano reserva tempo para capacitação, pareamento, revisão de código e correção de defeitos. Funcionalidades secundárias podem ser reduzidas se o aprendizado ou as dependências pressionarem o prazo.

## 5. Marcos e entregas

| Marco | Prazo previsto | Entregáveis e critérios de aceite preliminares |
|---|---:|---|
| **M1 — Frontend dos fluxos priorizados** | Semana letiva 8: GPTI em 05/10/2026 e PSW em 06/10/2026 | Escopo inicial definido por PSW e validado por GPTI; fluxos de frontend implementados em React; navegação e validações básicas demonstráveis. Aceite registrado pela equipe GPTI com ciência do patrocinador. |
| **M2 — Sistema integrado ao backend próprio** | Semana letiva 12: PSW em 10/11/2026; aceite de GPTI em 30/11/2026 | Frontend conectado à API Express; persistência em MongoDB; fluxos prioritários ponta a ponta; testes, documentação e demonstração final. Aceite registrado pela equipe GPTI com ciência do patrocinador. |

## 6. Requisitos de alto nível e critérios gerais de sucesso

- O sistema deve demonstrar consulta de oportunidades, candidatura, ofertas de apoio, agendamento, cadastro de disciplinas pelo administrador e registro de atividades complementares.
- Os dados persistidos devem ser validados e acessados pelo backend; o frontend não deve conectar diretamente ao MongoDB.
- A entrega final deve substituir o mock do backend próprio pela API Express/MongoDB do projeto. Deve demonstrar persistência e tratamento dos principais erros dos fluxos implementados.
- O aceite de cada pacote está no dicionário da EAP.
- O êxito será avaliado pela entrega dos marcos, pelo atendimento aos fluxos priorizados, pelo aceite interno da equipe GPTI e pelo aprendizado técnico documentado.

### Critérios de encerramento e cancelamento

O projeto termina na semana 12, quando a equipe GPTI registra o aceite do M2 ou a lista do que não passou, e o patrocinador dá ciência.

O patrocinador cancela o projeto, ou o encerra antes do M2, se ocorrer uma destas condições:

- A demonstração dos fluxos prioritários não cabe nas horas reservadas e o patrocinador não aprova corte de escopo.
- O patrocinador retira a autorização.
- Uma premissa essencial cai e não há substituto dentro do prazo.

## 7. Premissas e restrições

### Premissas

- Os oito participantes são alunos da instituição e conhecem o processo acadêmico.
- O patrocinador acompanhará o projeto e receberá as demonstrações dos marcos.
- Os participantes terão acesso a ferramentas, repositório e ambiente de desenvolvimento.
- As regras de negócio poderão ser reduzidas a um conjunto prioritário que caiba no prazo.

### Restrições

- Duração-alvo de três meses e dedicação parcial de 5 h/semana por participante.
- A equipe está aprendendo React, JavaScript, Express e MongoDB.
- Não haverá envolvimento de áreas administrativas da instituição na definição ou validação inicial do escopo.
- A equipe não está autorizada a acessar sistemas, credenciais, dados ou infraestrutura institucional.
- A implantação real depende de revisão de segurança, privacidade, infraestrutura, acessibilidade, operação e aprovação institucional.

## 8. Governança e responsabilidades

### Stakeholders

| Stakeholder | Interesse ou responsabilidade | Participação nesta etapa |
|---|---|---|
| **Diogo Silveira Mendonça — patrocinador** | Patrocinar o projeto, acompanhar marcos e decidir sobre mudanças relevantes | Ativo: recebe demonstrações e dá ciência dos aceites |
| **Alunos de GPTI** | Planejar e acompanhar o projeto, validar internamente o escopo e registrar decisões e aceites | Ativos: equipe de gestão |
| **Alunos de PSW** | Definir o escopo funcional inicial e desenvolver a solução | Ativos: equipe de produto e desenvolvimento |
| **Estudantes do BCC — usuários potenciais** | Usar a plataforma para oportunidades, apoio e horas complementares | Não serão consultados formalmente nesta fase |
| **Áreas administrativas da instituição** | Conhecem processos que podem dialogar com a plataforma | Sem participação inicial |
| **TI / Autenticação institucional** | Administrar identidade e informar requisitos de integração | Sem participação inicial |
| **Instituição** | Avaliar segurança, privacidade, operação e autorização para implantação | Sem participação inicial |

### Papéis e responsabilidades

| Papel | Responsabilidades principais | Designação |
|---|---|---|
| Patrocinador | Patrocinar, acompanhar e decidir sobre mudanças | Diogo Silveira Mendonça |
| Gerentes do projeto | Prestar contas do plano, conferir mudanças contra a EAP, coordenar a equipe de gestão | Erick Martins Silva, Gabriel Centeio Freitas, Guilherme Andrade Taveira e Rafael Penela Grande Ferreira |
| Equipe de gestão (GPTI) | Planejar e acompanhar prazo, escopo, riscos, comunicação e marcos; validar escopo; registrar aceites | Erick, Gabriel, Guilherme e Rafael |
| Equipe de produto e desenvolvimento (PSW) | Propor escopo funcional e implementar frontend, backend, testes e documentação | Geovanne, Marina, Mina e Samuel |
| Equipe total | Participar das atividades com dedicação estimada de 5 h/semana | 8 alunos |

## 9. Riscos iniciais e respostas

| Risco | Impacto potencial | Resposta inicial |
|---|---|---|
| Curva de aprendizagem maior que a prevista | Atraso ou redução de funcionalidades | Reservar tempo para estudo e revisão; priorizar fluxo mínimo viável |
| Regras inferidas sem validação oficial | Implementação divergente e retrabalho futuro | Registrar como hipóteses; validar institucionalmente em etapa futura |
| Dados fictícios divergentes dos reais | Retrabalho em integração futura | Documentar contratos |
| Requisitos de segurança e privacidade tardios | Retrabalho ou impedimento de implantação | Tratar segurança como condição futura |
| Baixa disponibilidade dos participantes | Entregas incompletas | Monitorar disponibilidade semanal e ajustar escopo antes dos marcos |
| Expectativa de produção ao fim do prazo | Uso prematuro de software não aprovado | Comunicar que é projeto acadêmico e exigir aprovações separadas |

## 10. Estimativa econômica e financiamento

Na iniciação, a ordem de grandeza foi **520 h** e **R$ 9.800**, com faixa de −25% a +75%. O planejamento revisou para **R$ 8.388,80**: 360 h de atividades, 56 h de contingência e reserva gerencial de 7%. A revisão fica 14,4% abaixo do ponto da iniciação e dentro da faixa.

| Marco e gatilho da parcela simulada | Prazo | Parcela simulada | Desembolso efetivo com a equipe |
|---|---:|---:|---:|
| **M1 — Frontend** | Semana 8: GPTI 05/10/2026 e PSW 06/10/2026 | **R$ 4.194,40 (50%)** | **R$ 0,00 — não há pagamento aos alunos** |
| **M2 — Sistema integrado** | Semana 12: PSW 10/11/2026; aceite GPTI 30/11/2026 | **R$ 4.194,40 (50%)** | **R$ 0,00 — não há pagamento aos alunos** |
| **Total do projeto** | **3 meses** | **R$ 8.388,80 (100%)** | **R$ 0,00 de pagamento à equipe** |

Os alunos não serão remunerados. O rateio é convenção didática. A estimativa exclui custos de infraestrutura, licenças, transporte, supervisão, operação ou contratação de terceiros.

## 11. Autoridade e aprovação

A aprovação deste termo autoriza o início do planejamento detalhado, levantamento de requisitos e desenvolvimento da primeira versão dentro das premissas acima. Não autoriza o uso de dados reais em ambientes não aprovados nem a implantação em produção.

## 12. Aprovações

**Patrocinador:** Diogo Silveira Mendonça

**Data:** __ / __ / ____

**Gerentes do Projeto:**
- Erick Martins Silva
- Gabriel Centeio Freitas
- Guilherme Andrade Taveira
- Rafael Penela Grande Ferreira

**Data:** 07 / 09 / 2026