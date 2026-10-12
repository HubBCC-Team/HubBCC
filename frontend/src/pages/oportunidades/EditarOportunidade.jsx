/* ---------------------------------------------------------------------------
   pages/oportunidades/EditarOportunidade.jsx
   TELA - Editar oportunidade (rota "/app/oportunidades/:id/editar").

   Caso de uso 4.
   - useOportunidade(id) (useQuery) busca os dados. Se o usuario veio do
     detalhe, eles ja estao em cache e a tela abre na hora.
   - useAlterarOportunidade (useMutation) salva e atualiza o cache.
   - Os arrays requisitos/atividades viram texto (uma linha por item) para o
     textarea; o Zod converte de volta para array ao salvar.
--------------------------------------------------------------------------- */
import { useParams, useNavigate } from "react-router-dom";
import { useOportunidade, useAlterarOportunidade } from "../../queries";
import { oportunidadeSchema } from "../../schemas/oportunidadeSchemas";
import { useToast } from "../../contexts/useToast";
import { Carregando, Erro } from "../../components/ui/Estado";
import FormularioOportunidade from "./FormularioOportunidade";

export default function EditarOportunidade() {
  const { id } = useParams();
  const navegar = useNavigate();
  const toast = useToast();

  const { data: oportunidade, isLoading, isError, error, refetch } = useOportunidade(id);
  const alterar = useAlterarOportunidade();

  if (isLoading) return <Carregando />;
  if (isError) return <Erro mensagem={error.message} aoTentarNovamente={refetch} />;
  if (!oportunidade) return null;

  // Banco -> formato do formulario. "?? ''" evita campos undefined
  // (o React Hook Form trabalha melhor com strings vazias).
  const valoresIniciais = {
    titulo: oportunidade.titulo ?? "",
    tipo: oportunidade.tipo ?? "",
    area: oportunidade.area ?? "",
    departamento: oportunidade.departamento ?? "",
    responsavel: oportunidade.responsavel ?? "",
    modalidade: oportunidade.modalidade ?? "",
    local: oportunidade.local ?? "",
    bolsa: oportunidade.bolsa ?? "",
    cargaHoraria: oportunidade.cargaHoraria ?? "",
    vagas: oportunidade.vagas ?? 1,
    prazoInscricao: oportunidade.prazoInscricao ?? "",
    descricao: oportunidade.descricao ?? "",
    requisitos: (oportunidade.requisitos ?? []).join("\n"),
    atividades: (oportunidade.atividades ?? []).join("\n"),
  };

  async function aoSalvar(dados) {
    await alterar.mutateAsync({ id, dados });
    toast.sucesso("Oportunidade atualizada!");
    navegar(`/app/oportunidades/${id}`);
  }

  return (
    <FormularioOportunidade
      // key: se o id mudar, o formulario e recriado com os novos valores
      key={id}
      valoresIniciais={valoresIniciais}
      schema={oportunidadeSchema}
      aoSalvar={aoSalvar}
      titulo="Editar oportunidade"
      subtitulo="Atualize as informacoes desta oportunidade"
      rotuloBotao="Salvar alteracoes"
    />
  );
}
