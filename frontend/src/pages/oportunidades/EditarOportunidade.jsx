/* ---------------------------------------------------------------------------
   pages/oportunidades/EditarOportunidade.jsx
   TELA — Editar oportunidade (rota "/app/oportunidades/:id/editar").

   Caso de uso 4. Busca a oportunidade pelo id, converte os arrays
   (requisitos/atividades) de volta para texto (o formulario usa textarea),
   e reaproveita o mesmo FormularioOportunidade do cadastro.
--------------------------------------------------------------------------- */
import { useParams, useNavigate } from "react-router-dom";
import { useRequisicao } from "../../hooks/useRequisicao";
import { buscarOportunidade, alterarOportunidade } from "../../service/oportunidadeService";
import { Carregando, Erro } from "../../components/ui/Estado";
import FormularioOportunidade from "./FormularioOportunidade";

export default function EditarOportunidade() {
  const { id } = useParams();
  const navegar = useNavigate();

  const { dados: oportunidade, carregando, erro, recarregar } = useRequisicao(
    () => buscarOportunidade(id),
    [id],
    null
  );

  if (carregando) return <Carregando />;
  if (erro) return <Erro mensagem={erro} aoTentarNovamente={recarregar} />;
  if (!oportunidade) return null;

  // Arrays no banco -> texto (uma linha por item) para preencher o formulario.
  const valoresIniciais = {
    ...oportunidade,
    requisitos: oportunidade.requisitos.join("\n"),
    atividades: oportunidade.atividades.join("\n"),
  };

  async function aoSalvar(dados) {
    await alterarOportunidade(id, dados);
    navegar(`/app/oportunidades/${id}`);
  }

  return (
    <FormularioOportunidade
      valoresIniciais={valoresIniciais}
      aoSalvar={aoSalvar}
      titulo="Editar oportunidade"
      subtitulo="Atualize as informacoes desta oportunidade"
      rotuloBotao="Salvar alteracoes"
    />
  );
}
