/* ---------------------------------------------------------------------------
   pages/atividades/EditarAtividade.jsx
   TELA - Editar atividade complementar ("/app/atividades/:id/editar").

   CORRECOES em relacao a versao anterior:
   - os campos agora CHEGAM PREENCHIDOS com a atividade salva (antes abriam
     vazios, porque a tela nunca buscava a atividade);
   - nao e mais obrigatorio anexar o comprovante de novo: o arquivo atual
     e mantido ate o usuario remover/trocar;
   - atividades "Aprovada" nao podem ser editadas.

   - useAtividade(usuarioId, id)  (TanStack Query) busca a atividade.
   - useAlterarAtividade()        (useMutation) salva e volta para "Em analise".
--------------------------------------------------------------------------- */
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { useToast } from "../../contexts/useToast";
import { useAtividade, useAlterarAtividade } from "../../queries";
import Cabecalho from "../../components/ui/Cabecalho";
import Botao from "../../components/ui/Botao";
import Alerta from "../../components/ui/Alerta";
import { Carregando, Erro } from "../../components/ui/Estado";
import FormularioAtividade from "./FormularioAtividade";

export default function EditarAtividade() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { usuario } = useAuth();
  const toast = useToast();

  const { data: atividade, isLoading, isError, error, refetch } = useAtividade(usuario?.id, id);
  const alterar = useAlterarAtividade();

  if (isLoading) return <Carregando />;
  if (isError) return <Erro mensagem={error.message} aoTentarNovamente={refetch} />;
  if (!atividade) return <Erro mensagem="Atividade nao encontrada." />;

  if (atividade.situacao === "Aprovada") {
    return (
      <>
        <Cabecalho titulo="Editar atividade complementar" subtitulo={atividade.titulo} />
        <Alerta variante="aviso">Atividades aprovadas nao podem ser editadas.</Alerta>
        <Botao variante="contorno" className="mt-4" onClick={() => navegar("/app/atividades")}>
          Voltar
        </Botao>
      </>
    );
  }

  const valoresIniciais = {
    categoria: atividade.categoria ?? "Ensino",
    titulo: atividade.titulo ?? "",
    data: atividade.data ?? "",
    horas: atividade.horas ?? "",
    descricao: atividade.descricao ?? "",
    comprovante: atividade.comprovante ?? "",
    comprovanteArquivo: atividade.comprovanteArquivo ?? "",
  };

  async function aoSalvar(dados) {
    // Toda alteracao volta para conferencia da coordenacao.
    await alterar.mutateAsync({ id, dados: { ...dados, situacao: "Em analise" } });
    toast.sucesso("Atividade atualizada! Ela voltou para analise.");
    navegar("/app/atividades");
  }

  return (
    <FormularioAtividade
      key={id}
      valoresIniciais={valoresIniciais}
      aoSalvar={aoSalvar}
      titulo="Editar atividade complementar"
      subtitulo="Atualize os dados e, se necessario, troque o certificado"
      rotuloBotao="Salvar alteracoes"
    />
  );
}
