# Manual de Arquitetura e Boas Práticas Front-end — HubBCC

Este documento apresenta os padrões de organização e desenvolvimento adotados no front-end do **HubBCC**.

O objetivo é manter o código organizado, legível e consistente entre os integrantes da equipe, além de facilitar a manutenção e a evolução do projeto.

---

## 1. Tecnologias utilizadas

O front-end do HubBCC utiliza as seguintes tecnologias:

- React;
- JavaScript ES6+;
- Vite;
- React Router DOM;
- Tailwind CSS;
- TanStack Query;
- React Hook Form;
- Zod;
- Axios;
- JSON Server;
- Lucide React e Phosphor Icons;
- ESLint.

O backend utilizado durante o desenvolvimento é mockado com **JSON Server**, permitindo trabalhar com operações REST de consulta, cadastro, alteração e exclusão.

---

## 2. Estrutura geral do projeto

A aplicação segue uma organização por responsabilidade.

```text
frontend/
│
├── server/
│   ├── db.seed.json
│   └── server.js
│
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── queries/
│   ├── schemas/
│   ├── service/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── db.json
├── package.json
└── vite.config.js
```

Cada pasta possui uma responsabilidade específica e deve ser utilizada de acordo com sua finalidade.

---

## 3. Responsabilidade das pastas

### `src/pages`

Contém as páginas completas da aplicação.

As páginas representam as telas acessadas pelas rotas do React Router.

Exemplos:

```text
pages/
├── oportunidades/
├── apoio/
├── agendamentos/
├── atividades/
├── disciplinas/
├── login/
├── cadastro/
└── perfil/
```

Uma página pode utilizar componentes reutilizáveis, hooks, queries e services, mas deve evitar concentrar regras de acesso à API diretamente no componente.

### `src/components`

Contém componentes reutilizáveis utilizados em diferentes telas.

Exemplos:

```text
components/
├── layout/
├── rotas/
└── ui/
```

Componentes como botões, campos, cabeçalhos, estados de carregamento e elementos de layout devem ser reutilizados sempre que possível.

Isso reduz duplicação de código e mantém a interface consistente.

### `src/service`

Contém as funções responsáveis por realizar as requisições HTTP.

Exemplos:

```text
service/
├── authService.js
├── oportunidadeService.js
├── apoioService.js
├── agendamentoService.js
└── atividadeService.js
```

Cada função representa uma operação da aplicação.

Exemplo:

```js
export async function buscarOportunidade(id) {
  const { data } = await api.get(`/oportunidades/${id}`);
  return data;
}
```

As páginas não devem utilizar `axios` diretamente.

O fluxo esperado é:

```text
Página
  ↓
TanStack Query
  ↓
Service
  ↓
Axios
  ↓
JSON Server
```

---

## 4. Requisições com Axios

A aplicação utiliza uma instância centralizada do Axios localizada em:

```text
src/api/
```

Essa abordagem evita repetir configurações de endereço da API e tratamento de erros em cada arquivo.

Não deve ser criado um novo `axios.create()` dentro de cada página ou service.

As requisições devem utilizar a instância já configurada no projeto.

---

## 5. TanStack Query

As consultas e alterações de dados são controladas pelo **TanStack Query**.

Os hooks ficam em:

```text
src/queries/
```

Exemplos:

```text
useOportunidades.js
useApoio.js
useAgendamentos.js
useAtividades.js
```

As páginas devem consumir esses hooks em vez de controlar manualmente estados de carregamento e atualização dos dados.

Exemplo:

```js
const {
  data: oportunidades = [],
  isLoading,
  isError,
} = useOportunidades();
```

Para alterações:

```js
const excluir = useExcluirOportunidade();

excluir.mutate(id);
```

---

## 6. Chaves de cache

As chaves utilizadas pelo TanStack Query ficam centralizadas em:

```text
src/queries/chaves.js
```

Exemplo:

```js
oportunidades: {
  todas: ["oportunidades"],
  lista: (filtros = {}) => [
    "oportunidades",
    "lista",
    filtros,
  ],
}
```

Após operações de cadastro, alteração ou exclusão, as queries relacionadas devem ser invalidadas.

Exemplo:

```js
queryClient.invalidateQueries({
  queryKey: chaves.oportunidades.todas,
});
```

Isso permite atualizar automaticamente os dados exibidos na interface.

---

## 7. Formulários

Os formulários do sistema devem utilizar:

- React Hook Form;
- Zod;
- `zodResolver`.

Os schemas de validação ficam em:

```text
src/schemas/
```

Exemplo de estrutura:

```js
const schema = z.object({
  titulo: z
    .string()
    .min(5, "Informe um titulo valido."),
});
```

No formulário:

```js
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(schema),
});
```

As validações devem ficar preferencialmente no schema e não espalhadas pela página.

---

## 8. Componentes reutilizáveis

Antes de criar um novo componente, deve-se verificar se já existe um componente equivalente em:

```text
src/components/ui/
```

Exemplos de elementos reutilizados pelo projeto:

- `Botao`;
- `Campo`;
- `Cabecalho`;
- `Estado`;
- `Selo`;
- `Avatar`.

Evite criar diferentes versões de componentes com a mesma finalidade.

---

## 9. Estilização

O HubBCC utiliza **Tailwind CSS** como principal ferramenta de estilização.

Os estilos globais e tokens utilizados pela aplicação ficam em:

```text
src/index.css
```

As páginas e componentes utilizam classes Tailwind diretamente no JSX.

Exemplo:

```jsx
<div className="flex items-center gap-3 rounded-lg p-4">
  Conteudo
</div>
```

Não devem ser criados CSS Modules para novas telas, pois esse não é o padrão atual do projeto.

---

## 10. Responsividade

A responsividade deve ser feita utilizando os breakpoints do Tailwind.

Exemplo:

```jsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
```

Outro exemplo:

```jsx
<div className="hidden md:block">
```

Evite criar media queries manuais quando a mesma solução puder ser feita com os recursos responsivos do Tailwind.

A navegação principal também possui comportamento adaptado para dispositivos móveis.

---

## 11. Rotas

As rotas da aplicação ficam centralizadas em:

```text
src/App.jsx
```

Sempre que uma nova página for criada:

1. crie o arquivo dentro de `src/pages`;
2. importe a página em `App.jsx`;
3. adicione a rota;
4. verifique se a rota precisa de controle de acesso;
5. adicione um item no menu apenas quando necessário.

---

## 12. Controle de acesso

O sistema utiliza `RotaPrivada` para controlar quais usuários podem acessar determinadas páginas.

Exemplo:

```jsx
<Route element={<RotaPrivada perfis={["admin"]} />}>
  <Route
    path="disciplinas"
    element={<Disciplinas />}
  />
</Route>
```

Não basta esconder uma opção no menu.

Rotas restritas também devem possuir proteção no roteamento.

---

## 13. Menu lateral

Os itens do menu ficam definidos em:

```text
src/components/layout/MenuLateral.jsx
```

Quando um item for exclusivo de determinado perfil, deve ser utilizado o campo `perfis`.

Exemplo:

```js
{
  rotulo: "Disciplinas",
  caminho: "/app/disciplinas",
  icone: BookOpen,
  perfis: ["admin"],
}
```

Itens sem a propriedade `perfis` podem ser exibidos para todos os usuários autenticados.

---

## 14. Contextos

Estados globais que precisam ser utilizados em diferentes partes da aplicação podem ser controlados por Context API.

Os contextos ficam em:

```text
src/contexts/
```

Exemplos de responsabilidades globais:

- autenticação;
- usuário logado;
- mensagens e notificações.

Não utilize contexto para estados que pertencem somente a uma página específica.

---

## 15. Hooks personalizados

Hooks reutilizáveis ficam em:

```text
src/hooks/
```

Um hook deve ser criado quando uma lógica React precisar ser reutilizada ou isolada da interface.

Exemplo:

```text
usePermissao.js
```

O hook pode centralizar verificações relacionadas ao perfil e às permissões do usuário.

---

## 16. Estados de carregamento e erro

As páginas que consomem dados remotos devem tratar:

- carregamento;
- erro;
- ausência de dados.

Sempre que possível devem ser utilizados os componentes já existentes em:

```text
src/components/ui/Estado.jsx
```

Exemplo:

```jsx
if (isLoading) {
  return <Carregando />;
}
```

E:

```jsx
if (isError) {
  return (
    <Erro
      mensagem={error.message}
      aoTentarNovamente={refetch}
    />
  );
}
```

---

## 17. Nomenclatura

### Componentes e páginas

Utilizar PascalCase:

```text
DetalheOportunidade.jsx
RealizarAgendamento.jsx
MenuLateral.jsx
```

### Funções e variáveis

Utilizar camelCase:

```js
buscarOportunidade
aoSalvar
usuarioLogado
```

### Hooks

Hooks devem começar com `use`:

```js
useOportunidades
useDisciplinas
usePermissao
```

---

## 18. Funções assíncronas

Para requisições HTTP, utilize `async/await`.

Exemplo:

```js
export async function listarDisciplinas() {
  const { data } = await api.get("/disciplinas");
  return data;
}
```

Evite misturar diferentes padrões de Promise sem necessidade.

---

## 19. Tratamento de erros

Erros vindos da API devem ser apresentados de maneira compreensível ao usuário.

Exemplo:

```js
onError: (erro) => {
  toast.erro(
    erro.message || "Nao foi possivel concluir a operacao.",
  );
}
```

Evite utilizar apenas:

```js
console.log(erro);
```

como tratamento final de um erro de operação.

---

## 20. Evitar duplicação de código

Antes de implementar uma nova funcionalidade, verifique se já existe:

- componente semelhante;
- hook semelhante;
- service semelhante;
- schema semelhante;
- função utilitária semelhante.

Não copie grandes blocos de uma página para outra quando a lógica puder ser transformada em componente ou função reutilizável.

---

## 21. JSON Server

O HubBCC utiliza JSON Server como backend mockado.

Os dados utilizados pela aplicação ficam em:

```text
frontend/db.json
```

Os dados iniciais ficam em:

```text
frontend/server/db.seed.json
```

O servidor é configurado em:

```text
frontend/server/server.js
```

Para iniciar frontend e backend:

```bash
npm run dev:all
```

Para executar somente o servidor:

```bash
npm run server
```

Para restaurar os dados iniciais:

```bash
npm run db:reset
```

---

## 22. Dados mockados antigos

Os mocks antigos localizados anteriormente em `src/mocks` foram removidos após a migração para JSON Server.

Não devem ser criados novos arrays locais para substituir dados que pertencem ao backend mockado.

Dados persistentes da aplicação devem ser obtidos pela API.

---

## 23. Git e commits

Cada alteração deve possuir um commit claro e relacionado à funcionalidade desenvolvida.

Exemplos:

```text
feat: add discipline management page
fix: remove candidacies when deleting opportunity
docs: update installation and user manual
chore: remove obsolete mocks
```

Evite commits genéricos como:

```text
alteracoes
coisas
update
teste
```

Quando possível, cada commit deve representar uma alteração coerente e fácil de identificar no histórico.

---

## 24. Boas práticas gerais

Durante o desenvolvimento:

- mantenha funções pequenas e com responsabilidade clara;
- evite código duplicado;
- utilize os componentes existentes;
- não faça requisições HTTP diretamente nas páginas;
- utilize TanStack Query para dados remotos;
- utilize React Hook Form e Zod nos formulários;
- utilize Tailwind para estilização e responsividade;
- mantenha as rotas protegidas de acordo com o perfil;
- remova arquivos antigos quando não forem mais utilizados;
- mantenha documentação e código sincronizados;
- escolha nomes claros para variáveis, componentes e funções.

---

## 25. Fluxo recomendado para novas funcionalidades

Ao desenvolver uma funcionalidade nova, siga preferencialmente esta sequência:

```text
1. identificar o caso de uso
        ↓
2. criar ou revisar o service
        ↓
3. criar ou revisar o hook do TanStack Query
        ↓
4. criar o schema Zod, quando houver formulário
        ↓
5. implementar a página ou componente
        ↓
6. adicionar a rota
        ↓
7. aplicar controle de acesso
        ↓
8. adicionar ao menu, quando necessário
        ↓
9. atualizar a documentação
```

Esse fluxo mantém a arquitetura da aplicação consistente e evita concentrar todas as responsabilidades em um único arquivo.

---

## 26. Execução do projeto

A forma recomendada de iniciar o ambiente é:

```bash
cd frontend
npm install
npm run dev:all
```

Endereços padrão:

```text
Frontend: http://localhost:5173
API:      http://localhost:3001
```

Para detalhes completos de instalação, operação e utilização, consulte:

```text
documents/doc/manual.md
```
