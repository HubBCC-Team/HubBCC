import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import {
  useDisciplinas,
  useCadastrarDisciplina,
  useAlterarDisciplina,
  useExcluirDisciplina,
} from "../../queries";
import { useToast } from "../../contexts/useToast";
import Cabecalho from "../../components/ui/Cabecalho";
import Campo from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";
import { Carregando, Erro, Vazio } from "../../components/ui/Estado";

export default function Disciplinas() {
  const toast = useToast();

  const {
    data: disciplinas = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useDisciplinas();

  const cadastrar = useCadastrarDisciplina();
  const alterar = useAlterarDisciplina();
  const excluir = useExcluirDisciplina();

  const [editando, setEditando] = useState(null);
  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [erroFormulario, setErroFormulario] = useState("");

  function limparFormulario() {
    setEditando(null);
    setCodigo("");
    setNome("");
    setPeriodo("");
    setErroFormulario("");
  }

  function aoEditar(item) {
    setEditando(item);
    setCodigo(item.codigo ?? "");
    setNome(item.nome ?? "");
    setPeriodo(String(item.periodo ?? ""));
    setErroFormulario("");
  }

  function aoSalvar(evento) {
    evento.preventDefault();

    const codigoLimpo = codigo.trim();
    const nomeLimpo = nome.trim();
    const periodoNumero = Number(periodo);

    if (!codigoLimpo || !nomeLimpo || !periodo) {
      setErroFormulario("Preencha todos os campos.");
      return;
    }

    if (
      !Number.isInteger(periodoNumero) ||
      periodoNumero < 1 ||
      periodoNumero > 10
    ) {
      setErroFormulario("Informe um periodo entre 1 e 10.");
      return;
    }

    setErroFormulario("");

    const dados = {
      codigo: codigoLimpo,
      nome: nomeLimpo,
      periodo: periodoNumero,
    };

    if (editando) {
      alterar.mutate(
        {
          id: editando.id,
          dados,
        },
        {
          onSuccess: () => {
            toast.sucesso("Disciplina atualizada com sucesso!");
            limparFormulario();
          },
          onError: (e) =>
            toast.erro(e.message || "Erro ao alterar disciplina."),
        },
      );

      return;
    }

    cadastrar.mutate(dados, {
      onSuccess: () => {
        toast.sucesso("Disciplina cadastrada com sucesso!");
        limparFormulario();
      },
      onError: (e) =>
        toast.erro(e.message || "Erro ao cadastrar disciplina."),
    });
  }

  function aoExcluir(item) {
    if (
      !confirm(
        `Deseja realmente excluir a disciplina "${item.nome}"?`,
      )
    ) {
      return;
    }

    excluir.mutate(item.id, {
      onSuccess: () => {
        toast.sucesso("Disciplina excluida com sucesso!");

        if (editando?.id === item.id) {
          limparFormulario();
        }
      },
      onError: (e) =>
        toast.erro(e.message || "Erro ao excluir disciplina."),
    });
  }

  if (isLoading) {
    return <Carregando />;
  }

  if (isError) {
    return (
      <Erro
        mensagem={error.message}
        aoTentarNovamente={refetch}
      />
    );
  }

  return (
    <>
      <Cabecalho
        titulo="Disciplinas"
        subtitulo="Gerencie as disciplinas utilizadas no HubBCC"
      />

      <form
        onSubmit={aoSalvar}
        className="cartao mb-5 p-5"
        noValidate
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="titulo-secao">
              {editando
                ? "Alterar disciplina"
                : "Cadastrar disciplina"}
            </h2>

            {editando && (
              <p className="mt-1 text-xs text-slate-500">
                Editando {editando.codigo} — {editando.nome}
              </p>
            )}
          </div>

          {editando && (
            <button
              type="button"
              onClick={limparFormulario}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Cancelar edicao"
            >
              <X size={17} />
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Campo
            rotulo="Codigo"
            placeholder="Ex.: BCC101"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />

          <Campo
            rotulo="Nome"
            placeholder="Ex.: Estrutura de Dados"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <Campo
            rotulo="Periodo"
            type="number"
            min="1"
            max="10"
            placeholder="Ex.: 3"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
          />
        </div>

        {erroFormulario && (
          <p className="mt-3 text-xs text-erro">
            {erroFormulario}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Botao
            type="submit"
            carregando={
              cadastrar.isPending || alterar.isPending
            }
          >
            {editando
              ? "Salvar alteracoes"
              : "Cadastrar disciplina"}
          </Botao>

          {editando && (
            <Botao
              type="button"
              variante="contorno"
              onClick={limparFormulario}
            >
              Cancelar
            </Botao>
          )}
        </div>
      </form>

      <div className="cartao overflow-hidden">
        {disciplinas.length === 0 ? (
          <Vazio
            titulo="Nenhuma disciplina cadastrada"
            descricao="Cadastre uma disciplina para ela aparecer aqui."
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">
                      Codigo
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Nome
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Periodo
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Acoes
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {disciplinas.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/60"
                    >
                      <td className="px-5 py-3 font-medium text-slate-800">
                        {item.codigo}
                      </td>

                      <td className="px-5 py-3 text-slate-600">
                        {item.nome}
                      </td>

                      <td className="px-5 py-3 text-slate-500">
                        {item.periodo}
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Botao
                            type="button"
                            variante="contorno"
                            tamanho="pequeno"
                            onClick={() => aoEditar(item)}
                          >
                            <Pencil size={13} />
                            Alterar
                          </Botao>

                          <Botao
                            type="button"
                            variante="perigo"
                            tamanho="pequeno"
                            carregando={
                              excluir.isPending &&
                              excluir.variables === item.id
                            }
                            onClick={() => aoExcluir(item)}
                          >
                            <Trash2 size={13} />
                            Excluir
                          </Botao>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-slate-100 md:hidden">
              {disciplinas.map((item) => (
                <div key={item.id} className="p-4">
                  <div>
                    <p className="font-medium text-slate-800">
                      {item.nome}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.codigo} · {item.periodo}º periodo
                    </p>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Botao
                      type="button"
                      variante="contorno"
                      tamanho="pequeno"
                      onClick={() => aoEditar(item)}
                    >
                      <Pencil size={13} />
                      Alterar
                    </Botao>

                    <Botao
                      type="button"
                      variante="perigo"
                      tamanho="pequeno"
                      carregando={
                        excluir.isPending &&
                        excluir.variables === item.id
                      }
                      onClick={() => aoExcluir(item)}
                    >
                      <Trash2 size={13} />
                      Excluir
                    </Botao>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
