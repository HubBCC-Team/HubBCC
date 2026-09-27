/* ---------------------------------------------------------------------------
   pages/oportunidades/CadastrarOportunidade.jsx
   TELA 10 — Cadastrar oportunidade (rota "/app/oportunidades/nova").

   Caso de uso 1. Agora so monta os valores vazios e diz o que fazer ao
   salvar; quem desenha o formulario e o FormularioOportunidade (reaproveitado
   tambem pela EditarOportunidade).
--------------------------------------------------------------------------- */
import { useNavigate } from "react-router-dom";
import FormularioOportunidade from "./FormularioOportunidade";
import { cadastrarOportunidade } from "../../service/oportunidadeService";

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

  async function aoSalvar(dados) {
    await cadastrarOportunidade(dados);
    navegar("/app/oportunidades");
  }

  return (
    <FormularioOportunidade
      valoresIniciais={valoresVazios}
      aoSalvar={aoSalvar}
      titulo="Cadastrar oportunidade"
      subtitulo="Publique uma nova oportunidade academica para o curso"
      rotuloBotao="Publicar oportunidade"
    />
  );
}
