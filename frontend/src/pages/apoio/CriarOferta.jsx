/* ---------------------------------------------------------------------------
   pages/apoio/CriarOferta.jsx
   TELA 14 - Criar oferta de apoio ("/app/apoio/nova"). Caso de uso 9.

   Monta os valores vazios e salva com useCriarOferta (TanStack Query).
   O formulario (React Hook Form + Zod) esta no FormularioOferta.
--------------------------------------------------------------------------- */
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { useToast } from "../../contexts/useToast";
import { useCriarOferta } from "../../queries";
import { iniciaisDe } from "../../utils/formatadores";
import FormularioOferta from "./FormularioOferta";

const valoresVazios = {
  titulo: "",
  disciplinaId: "",
  assunto: "",
  tipo: "Tutoria",
  modalidade: "Presencial",
  local: "",
  vagas: 4,
  gratuita: true,
  valor: 0,
  descricao: "",
  horarios: [],
};

export default function CriarOferta() {
  const navegar = useNavigate();
  const { usuario } = useAuth();
  const toast = useToast();
  const criar = useCriarOferta();

  async function aoSalvar(dados) {
    const nova = await criar.mutateAsync({
      ...dados,
      monitorId: usuario.id,
      monitor: usuario.nome,
      iniciais: iniciaisDe(usuario.nome),
    });
    toast.sucesso("Oferta criada com sucesso!");
    navegar(`/app/apoio/${nova.id}`);
  }

  return (
    <FormularioOferta
      valoresIniciais={valoresVazios}
      aoSalvar={aoSalvar}
      titulo="Criar oferta de apoio"
      subtitulo="Ofereca monitoria ou tutoria para outros alunos do curso"
      rotuloBotao="Publicar oferta"
    />
  );
}
