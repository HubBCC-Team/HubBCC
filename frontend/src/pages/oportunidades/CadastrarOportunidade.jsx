/* ---------------------------------------------------------------------------
   pages/oportunidades/CadastrarOportunidade.jsx
   TELA 10 - Cadastrar oportunidade (rota "/app/oportunidades/nova").

   Caso de uso 1. Monta os valores vazios, escolhe o schema de CADASTRO
   (prazo nao pode ser passado) e salva com a mutation do TanStack Query.
   Ao salvar, a lista de oportunidades e invalidada automaticamente
   (ver queries/useOportunidades.js).
--------------------------------------------------------------------------- */
import { useNavigate } from "react-router-dom";
import FormularioOportunidade from "./FormularioOportunidade";
import { useCadastrarOportunidade } from "../../queries";
import { cadastroOportunidadeSchema } from "../../schemas/oportunidadeSchemas";
import { useToast } from "../../contexts/useToast";

const valoresVazios = {
  titulo: "",
  tipo: "",
  area: "",
  departamento: "",
  responsavel: "",
  modalidade: "",
  local: "",
  bolsa: "",
  cargaHoraria: "",
  vagas: 1,
  prazoInscricao: "",
  descricao: "",
  requisitos: "",
  atividades: "",
};

export default function CadastrarOportunidade() {
  const navegar = useNavigate();
  const toast = useToast();
  const cadastrar = useCadastrarOportunidade();

  // mutateAsync devolve uma Promise: se falhar, o erro sobe para o
  // FormularioOportunidade, que mostra o Alerta.
  async function aoSalvar(dados) {
    const nova = await cadastrar.mutateAsync(dados);
    toast.sucesso("Oportunidade publicada!");
    navegar(`/app/oportunidades/${nova.id}`);
  }

  return (
    <FormularioOportunidade
      valoresIniciais={valoresVazios}
      schema={cadastroOportunidadeSchema}
      aoSalvar={aoSalvar}
      titulo="Cadastrar oportunidade"
      subtitulo="Publique uma nova oportunidade academica para o curso"
      rotuloBotao="Publicar oportunidade"
    />
  );
}
