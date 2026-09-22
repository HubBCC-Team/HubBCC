# 📘 Manual de Boas Práticas Front-end - Projeto HubBCC

Este documento define os padrões, regras e arquitetura do front-end do projeto **HubBCC**. Como a equipe está em fase de aprendizado com React, seguir este manual é essencial para evitar conflitos de código, manter o projeto organizado e garantir a entrega da etapa de **Componentização e Variáveis Locais**.# 📘 Manual de Arquitetura e Boas Práticas Front-end: Projeto HubBCC

## 1. Stack Tecnológica, Ferramentas e Extensões
Para garantir a paridade de ambiente entre todos os membros da equipe (Geovanne, Marina, Mina e Samuel), os seguintes softwares e bibliotecas devem ser utilizados.

### Softwares Base
* **Node.js (Versão LTS):** Ambiente de execução necessário para rodar o servidor de desenvolvimento.
* **Visual Studio Code (VS Code):** Editor de código padrão da equipe.
* **Git:** Ferramenta para versionamento local do código.

### Extensões Obrigatórias no VS Code
* **ESLint:** Analisador de código estático. Apontará erros de sintaxe e violações de regras do React em tempo real.
* **Prettier - Code Formatter:** Formatador automático de código. Deve ser configurado para rodar ao salvar o arquivo (`Format on Save`), garantindo recuos, espaçamentos e aspas padronizadas.
* **ES7+ React/Redux/React-Native snippets:** Permite a criação imediata da estrutura de um componente digitando o comando `rfce` (React Functional Component com Export).
* **Auto Rename Tag:** Atualiza a tag de fechamento automaticamente quando a tag de abertura é alterada no JSX.

### Bibliotecas e Frameworks da Aplicação
* **Vite:** Ferramenta de build de alta performance que gerencia a aplicação React.
* **React (com JSX):** Biblioteca principal para a construção das interfaces de usuário.
* **React Router DOM:** Biblioteca responsável pelo roteamento (navegação) entre as páginas da aplicação (ex: transição de "Consultar Monitoria" para "Realizar Agendamento") sem recarregar o navegador.
* **CSS Modules:** Metodologia de estilização onde o CSS é escopado localmente para o componente, prevenindo que estilos de uma página afetem outras acidentalmente.

HubBCC/frontend/
│
├── public/                 # Arquivos estáticos que não passam pelo Vite (Favicon, logos).
├── src/
│   ├── assets/             # Arquivos de mídia e estilos globais (variáveis CSS de cor e reset).
│   │
│   ├── components/         # Componentes de interface reaproveitáveis (DRY).
│   │   ├── BotaoPrincipal/
│   │   │   ├── BotaoPrincipal.jsx
│   │   │   └── BotaoPrincipal.module.css
│   │   └── CardSessao/
│   │
│   ├── pages/              # Páginas completas que representam as rotas da aplicação.
│   │   ├── RealizarAgendamento/
│   │   │   ├── RealizarAgendamento.jsx
│   │   │   └── RealizarAgendamento.module.css
│   │   └── ConsultarMonitoria/
│   │
│   ├── mocks/              # Arquivos de variáveis locais simulando o Banco de Dados.
│   │   ├── agendamentos.js
│   │   ├── disciplinas.js
│   │   └── sessoes.js
│   │
│   ├── App.jsx             # Componente raiz responsável por renderizar o React Router.
│   └── main.jsx            # Ponto de entrada do React (renderiza o App no index.html).
│
├── index.html              # Estrutura HTML base.
├── vite.config.js          # Arquivo de configuração do Vite.
└── package.json            # Gerenciador de dependências e scripts (npm run dev).
