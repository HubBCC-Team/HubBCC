# Manual de Instalação, Operação e Usuário — HubBCC

## Sumário

1. [Sobre o HubBCC](#1-sobre-o-hubbcc)
2. [Pré-requisitos](#2-pré-requisitos)
3. [Instalação](#3-instalação)
4. [Execução e operação](#4-execução-e-operação)
5. [Contas de teste](#5-contas-de-teste)
6. [Perfis de usuário](#6-perfis-de-usuário)
7. [Manual do usuário](#7-manual-do-usuário)
8. [Problemas comuns](#8-problemas-comuns)

---

## 1. Sobre o HubBCC

O **HubBCC** é uma plataforma de apoio e desenvolvimento acadêmico voltada para estudantes do curso de Bacharelado em Ciência da Computação.

O sistema reúne em um único ambiente três áreas principais:

- oportunidades acadêmicas;
- apoio acadêmico por meio de monitorias e tutorias;
- registro e acompanhamento de atividades complementares.

O objetivo é facilitar o acesso dos alunos a oportunidades e serviços acadêmicos que normalmente ficam distribuídos entre diferentes canais.

---

## 2. Pré-requisitos

Para executar o HubBCC localmente é necessário possuir:

- Node.js 18 ou superior;
- npm;
- navegador web atualizado;
- acesso ao código-fonte do projeto.

Para verificar se o Node.js e o npm estão instalados corretamente:

```bash
node --version
npm --version
```

---

## 3. Instalação

Após baixar ou clonar o repositório, acesse a pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

A instalação utiliza as dependências declaradas no arquivo `package.json`.

> Esta seção deverá ser atualizada caso a configuração definitiva do JSON Server altere os comandos necessários.

---

## 4. Execução e operação

Para iniciar a aplicação em modo de desenvolvimento:

```bash
npm run dev
```

O Vite exibirá no terminal o endereço utilizado pela aplicação. Normalmente:

```text
http://localhost:5173
```

### Comandos disponíveis

| Comando | Função |
|---|---|
| `npm run dev` | inicia o ambiente de desenvolvimento |
| `npm run build` | gera a versão de produção |
| `npm run preview` | executa localmente a versão de produção |
| `npm run lint` | verifica possíveis problemas no código |

O procedimento de execução do JSON Server deverá ser incluído após a configuração definitiva do backend mockado.

---

## 5. Contas de teste

O sistema possui contas de teste para os diferentes perfis:

| Perfil | E-mail | Senha |
|---|---|---|
| Aluno | `aluno@hubbcc.br` | `123456` |
| Monitor | `monitor@hubbcc.br` | `123456` |
| Administrador | `admin@hubbcc.br` | `123456` |

Essas contas podem ser utilizadas para visualizar as funcionalidades disponíveis para cada perfil.

---

## 6. Perfis de usuário

### Aluno

O aluno pode utilizar o HubBCC para:

- consultar oportunidades acadêmicas;
- realizar e acompanhar candidaturas;
- consultar ofertas de apoio acadêmico;
- realizar e acompanhar agendamentos;
- avaliar atendimentos;
- registrar atividades complementares;
- acompanhar suas horas complementares.

### Monitor

O monitor utiliza principalmente as funcionalidades relacionadas ao apoio acadêmico, podendo:

- criar ofertas de apoio;
- consultar e gerenciar ofertas;
- acompanhar agendamentos;
- registrar a realização de atendimentos.

### Administrador

O administrador possui acesso às funcionalidades de gerenciamento previstas no sistema, incluindo informações acadêmicas e disciplinas.

---

## 7. Manual do usuário

### 7.1 Cadastro

Para criar uma conta:

1. Acesse a página de cadastro.
2. Preencha os dados solicitados.
3. Informe uma senha válida.
4. Confirme o cadastro.
5. Utilize as credenciais cadastradas para entrar no sistema.

---

### 7.2 Login

Para entrar no sistema:

1. Acesse a página de login.
2. Informe o e-mail.
3. Informe a senha.
4. Selecione a opção para entrar.

Após a autenticação, o usuário será direcionado para a área interna do HubBCC.

---

### 7.3 Recuperação de senha

Na tela de login, o usuário pode acessar a opção de recuperação de senha e informar seu e-mail para iniciar o processo de redefinição.

---

### 7.4 Oportunidades acadêmicas

Na área de **Oportunidades**, o usuário pode:

- consultar oportunidades;
- pesquisar e utilizar filtros;
- visualizar os detalhes;
- realizar candidaturas;
- acompanhar suas candidaturas.

Usuários autorizados também podem cadastrar e gerenciar oportunidades.

---

### 7.5 Apoio acadêmico

Na área de **Apoio Acadêmico**, o usuário pode consultar ofertas de monitoria e tutoria.

É possível:

1. consultar as ofertas disponíveis;
2. utilizar filtros;
3. acessar os detalhes de uma oferta;
4. verificar horários e disponibilidade;
5. realizar um agendamento.

Usuários autorizados também podem criar e gerenciar ofertas de apoio.

---

### 7.6 Agendamentos

Na área de **Agendamentos**, o usuário pode acompanhar os atendimentos relacionados ao apoio acadêmico.

Dependendo da situação e do perfil, podem estar disponíveis ações como:

- consultar agendamentos;
- reagendar;
- cancelar;
- registrar a realização do atendimento;
- avaliar o atendimento.

---

### 7.7 Atividades complementares

Na área de **Atividades**, o aluno pode registrar e acompanhar suas atividades complementares.

Para registrar uma atividade:

1. acesse a área de Atividades;
2. selecione a opção de nova atividade;
3. informe os dados solicitados;
4. informe a carga horária;
5. adicione o comprovante quando solicitado;
6. confirme o registro.

O sistema também apresenta o acompanhamento das horas cadastradas.

---

### 7.8 Perfil

Na área de **Perfil**, o usuário pode consultar informações relacionadas à própria conta e utilizar as opções disponíveis de configuração e personalização.

---

### 7.9 Navegação em dispositivos móveis

Em telas menores, o menu principal pode ser acessado pelo botão localizado na barra superior.

O usuário pode abrir o menu, selecionar a área desejada e fechá-lo pelo botão de fechamento ou ao escolher uma opção.

---

### 7.10 Sair do sistema

Para encerrar a sessão:

1. abra o menu principal;
2. selecione **Sair da conta**;
3. o usuário será direcionado novamente para a área de acesso.

---

## 8. Problemas comuns

### `npm` não reconhecido

Verifique se o Node.js está instalado corretamente.

Execute:

```bash
node --version
npm --version
```

Se necessário, feche e abra novamente o terminal após a instalação.

---

### `package.json` não encontrado

Esse erro normalmente acontece quando o terminal está na pasta incorreta.

Acesse:

```bash
cd frontend
```

e execute novamente:

```bash
npm install
```

---

### Porta 5173 ocupada

Caso a porta padrão esteja em uso, o Vite poderá iniciar automaticamente em outra porta.

Utilize o endereço informado no terminal.

---

### Alterações recentes não aparecem

Certifique-se de que a cópia local corresponde à versão mais recente disponível no repositório e reinicie o servidor de desenvolvimento quando necessário.
