# Business Case — HubBCC

**Versão:** 1.0
**Data:** 07/09/2026

## 1. Resumo executivo

Propõe-se desenvolver o **HubBCC**, uma plataforma para centralizar oportunidades acadêmicas, monitorias, tutorias, disciplinas do curso e atividades complementares dos alunos do BCC. Hoje, essas informações estão dispersas em e-mails, grupos, murais e páginas departamentais; o controle de horas complementares é individual; e a divulgação de oportunidades depende de vários canais manuais. A plataforma demonstrará como um ambiente único reduz a dispersão, facilita o acesso dos alunos e organiza a divulgação e o acompanhamento das atividades acadêmicas. Nesta etapa, não haverá integração institucional efetiva nem uso de dados reais. A integração e a implantação em produção ficam para etapa futura.

## 2. Problema e oportunidade

**Problema:** as informações acadêmicas estão dispersas, o que dificulta o acesso dos alunos às oportunidades e a descoberta de monitorias e tutorias. O controle de horas complementares é feito caso a caso, sem um ambiente único de consulta, e a divulgação depende de canais manuais pouco rastreáveis.

**Oportunidade:** centralizar esses serviços em uma plataforma única, reduzindo retrabalho, tornando a informação mais acessível e ampliando o engajamento dos alunos em projetos, eventos e atividades complementares.

## 3. Objetivos

- Centralizar oportunidades acadêmicas, monitorias, tutorias, disciplinas e atividades complementares.
- Reduzir a dispersão de informações.
- Tornar a divulgação e o acompanhamento mais simples e rastreáveis.
- Aumentar o acesso dos alunos a oportunidades e apoio acadêmico.
- Oferecer ao administrador um cadastro único de disciplinas.

Os objetivos só se realizam plenamente em uma implantação futura. O projeto de 12 semanas entrega a primeira versão.

## 4. Solução proposta

Desenvolver o HubBCC, uma plataforma web que reúne, em um único ambiente, oportunidades acadêmicas, ofertas de apoio (monitorias e tutorias), disciplinas do curso e o registro de atividades complementares dos alunos do BCC, com o objetivo de reduzir a dispersão atual e dar aos alunos um ponto único de consulta e acompanhamento. A solução será construída com frontend em React/JavaScript e backend em JavaScript com Express e MongoDB, organizada em módulos de oportunidades, candidaturas, apoio acadêmico, disciplinas e atividades complementares, de modo que cada parte possa evoluir de forma independente sem comprometer o restante.

O acesso será segmentado por três perfis (aluno, monitor/tutor e administrador), de modo que cada usuário enxergue as funções que lhe cabem e o administrador seja responsável pela manutenção do cadastro de disciplinas. A plataforma será construída de forma incremental ao longo de 12 semanas, com entregas parciais que permitem validar cada fluxo antes de avançar para o próximo.

## 5. Escopo inicial

### Incluído

- Gerenciamento de oportunidades acadêmicas.
- Sistema de candidatura.
- Ofertas de apoio acadêmico (monitorias e tutorias).
- Agendamento de atendimentos.
- Gerenciamento de disciplinas pelo administrador (cadastro, consulta, alteração e exclusão).
- Registro e consulta de atividades complementares.
- Testes, documentação e demonstração.

### Fora do escopo inicial

- Outros cursos além do BCC.
- Plataforma própria de atendimento.
- Estágios.
- Processamento de pagamento aluno-tutor.
- Aplicativo móvel nativo.
- Integração real com autenticação e sistema acadêmico.
- Uso de dados reais e produção.

## 6. Benefícios esperados

- Menos trabalho manual e menor redigitação.
- Redução de retrabalho e inconsistências.
- Processo mais rastreável para alunos e para a operação da plataforma.
- Mais clareza para consultar oportunidades, disciplinas e acompanhar horas complementares.
- Base para futuras automações e integrações.
- Potencial de aumento do engajamento em projetos e atividades.

## 7. Alternativas consideradas

1. **Manter o processo atual:** sem desenvolvimento, mas mantém dispersão e retrabalho.
2. **Melhorar planilhas e formulários:** organiza parte do fluxo, mas mantém fragmentação.
3. **Desenvolver o HubBCC:** demonstra centralização e automação, com esforço acadêmico. Não substitui decisão institucional futura.

A recomendação é desenvolver o HubBCC.

## 8. Custos e recursos

A estimativa econômica simulada do projeto é de **R$ 8.388,80**, incluindo contingência e reserva gerencial. Não é orçamento aprovado nem custo de solução em produção.

Uma futura integração e implantação deverá considerar:

- Levantamento e validação de regras.
- Integração real com autenticação e sistema acadêmico.
- Infraestrutura, segurança, testes e implantação.
- Treinamento, comunicação e suporte.
- Manutenção e evolução.

## 9. Riscos e dependências

| Risco ou dependência | Possível impacto | Ação inicial |
|---|---|---|
| Regras incompletas ou divergentes | Escopo inadequado ou retrabalho | Registrar como hipóteses e validar em etapa futura |
| Dados fictícios divergentes dos reais | Retrabalho futuro | Documentar contratos |
| Baixa adesão de alunos e professores | Manutenção de processos paralelos | Envolver representantes e planejar comunicação |
| Requisitos de segurança e privacidade | Exposição de dados ou bloqueio | Tratar segurança como condição futura |
| Dados inconsistentes nos controles atuais | Dificuldade de transição | Definir critérios de validação se houver carga futura |

## 10. Indicadores de sucesso

- Percentual de oportunidades cadastradas na plataforma.
- Número de alunos usando consulta e candidatura.
- Número de ofertas de monitoria/tutoria ativas.
- Número de disciplinas cadastradas pelo administrador.
- Quantidade de atividades complementares registradas.
- Redução de comunicações manuais paralelas à plataforma.
- Satisfação de alunos e equipes.

## 11. Recomendação e próximos passos

Recomenda-se autorizar o projeto acadêmico de 12 semanas. O projeto deve:

1. Mapear o processo atual e pontos de retrabalho.
2. Levantar e validar regras e exceções.
3. Identificar usuários, responsáveis e requisitos de acesso.
4. Registrar que integração real está fora desta etapa.
5. Definir requisitos priorizados, critérios de sucesso e cronograma.
6. Planejar validação institucional futura.

**Decisão solicitada:** autorizar o projeto descrito neste caso, formalizado no termo de abertura.

## 12. Análise econômica preliminar (24 meses)

### 12.1 Premissas

- Investimento no projeto: **R$ 8.388,80**, distribuído nos meses 1 a 3.
- Benefícios simulados a partir do mês 6, a cada 6 meses.
- Taxa de desconto: Selic 13,75% a.a. → 1,0794% a.m.
- Cenário: redução de 75% do esforço administrativo gasto com divulgação manual de oportunidades e acompanhamento de horas complementares.
- Custo mensal carregado de um técnico administrativo: **R$ 5.321,85**.
- Economia simulada: 0,75 funcionário-mês por semestre = **R$ 3.991,39**.
- Papel evitado: **R$ 23,09** por semestre.
- Benefício total por semestre: **R$ 4.014,48**.
- Quatro semestres em 24 meses: **R$ 16.057,92**.

### 12.2 Fluxo de caixa

| Mês/período | Investimento | Benefício | Fluxo líquido |
|---|---:|---:|---:|
| 1, 2 e 3 (cada mês) | -R$ 2.796,27 | R$ 0,00 | -R$ 2.796,27 |
| 6, 12, 18 e 24 (cada período) | R$ 0,00 | R$ 4.014,48 | R$ 4.014,48 |
| **Total nominal em 24 meses** | **-R$ 8.388,80** | **R$ 16.057,92** | **R$ 7.669,12** |

### 12.3 Indicadores financeiros

| Indicador | Resultado-base | Interpretação |
|---|---:|---|
| VPL, à taxa mensal da Selic | **R$ 5.492,80** | Positivo: benefícios descontados superam o investimento. |
| TIR | **superior a 1,0794% a.m.** | Atrai retorno acima da taxa de desconto. |
| ROI simples em 24 meses | **91,42%** | (benefícios − investimento) ÷ investimento. |
| Payback simples | **Mês 18** | Investimento recuperado no terceiro benefício semestral. |
| Índice benefício-custo | **1,669** | VP benefícios ÷ VP custos > 1. |

Fórmulas utilizadas:

$$
VPL = \sum_{t=1}^{24}\frac{FC_t}{(1+i_m)^t},\qquad
ROI = \frac{\text{benefícios nominais} - \text{custos nominais}}{\text{custos nominais}},\qquad
IBC = \frac{VP(\text{benefícios})}{VP(\text{custos})}
$$

A taxa mensal equivalente usada é $i_m = (1+0,1375)^{1/12} - 1 = 0,0107939$, ou aproximadamente **1,0794% ao mês**. A TIR é a taxa mensal que zera o VPL do fluxo de caixa. A taxa anual efetiva correspondente é calculada por $(1+\text{TIR mensal})^{12} - 1$.

### 12.4 Benefícios intangíveis

Além do custo administrativo evitado e do papel economizado, o HubBCC produz benefícios que não foram monetizados no fluxo de caixa, mas que fazem parte do valor esperado da iniciativa:

- **Para os alunos:** um ponto único de consulta para oportunidades, apoio acadêmico e horas complementares, com menos dependência de canais dispersos; mais clareza sobre prazos e requisitos; e maior facilidade para encontrar monitorias e tutorias alinhadas às disciplinas que estão cursando.
- **Para monitores e tutores:** um canal estruturado para oferecer atendimento, controlar agendamentos e registrar a realização dos atendimentos, sem depender de comunicação informal.
- **Para a operação da plataforma:** informações centralizadas, com histórico de oportunidades, ofertas e atividades, o que facilita auditoria, correção e evolução do sistema em etapas futuras.
- **Para o curso:** mais visibilidade sobre a participação dos alunos em projetos, eventos e atividades complementares, o que pode apoiar decisões pedagógicas e de acompanhamento acadêmico.

Esses efeitos são benefícios esperados, não entram nos cálculos de VPL, TIR, ROI ou índice benefício-custo e devem ser avaliados após a implantação com dados de uso, volume de correções, tempo de atendimento e satisfação dos alunos e das equipes envolvidas.

### 12.5 Sensibilidade e conclusão

Os indicadores são favoráveis sob as hipóteses simplificadas do modelo, inclusive a redução de esforço administrativo. Como o escopo atual entrega a primeira versão da plataforma, esses indicadores **não representam retorno financeiro deste projeto acadêmico**. Antes de investimento em produção, será necessário estimar integração, infraestrutura, segurança, implantação, suporte e manutenção; validar a economia real; e recalcular os indicadores.

## 13. Aprovações

**Patrocinador:** Diogo Silveira Mendonça

**Data:** __ / __ / ____

**Gerentes do Projeto:**
- Erick Martins Silva
- Gabriel Centeio Freitas
- Guilherme Andrade Taveira
- Rafael Penela Grande Ferreira

**Data:** 07 / 09 / 2026