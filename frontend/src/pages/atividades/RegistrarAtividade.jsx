/* ---------------------------------------------------------------------------
   pages/atividades/RegistrarAtividade.jsx
   TELA 20 - Registrar atividade complementar ("/app/atividades/nova").
   Caso de uso 19. Formulario (React Hook Form + Zod) no FormularioAtividade;
   aqui so montamos os valores vazios e salvamos com useRegistrarAtividade.
   O comprovante vai em base64 para o db.json (visualizado depois).
--------------------------------------------------------------------------- */
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { useToast } from "../../contexts/useToast";
import { useRegistrarAtividade } from "../../queries";
import FormularioAtividade from "./FormularioAtividade";

const valoresVazios = {
  categoria: "Ensino",
  titulo: "",
  data: "",
  horas: "",
  descricao: "",
  comprovante: "",
  comprovanteArquivo: "",
};

export default function RegistrarAtividade() {
  const navegar = useNavigate();
  const { usuario } = useAuth();
  const toast = useToast();
  const registrar = useRegistrarAtividade();

  async function aoSalvar(dados) {
    await registrar.mutateAsync({ ...dados, usuarioId: usuario.id });
    toast.sucesso("Atividade registrada com sucesso!");
    navegar("/app/atividades");
  }

  return (
    <FormularioAtividade
      valoresIniciais={valoresVazios}
      aoSalvar={aoSalvar}
      titulo="Registrar atividade complementar"
      subtitulo="Informe os dados e anexe o certificado para validacao"
      rotuloBotao="Registrar atividade"
    />
  );
}
