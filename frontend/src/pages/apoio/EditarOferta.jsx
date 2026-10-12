/* ---------------------------------------------------------------------------
   pages/apoio/EditarOferta.jsx
   TELA - Editar oferta de apoio (rota "/app/apoio/:id/editar").
   Casos de uso 12 (alterar) e 13 (cancelar oferta).

   - useOferta(id)       (useQuery) busca a oferta; se veio do detalhe, ja
                         esta em cache e a tela abre na hora.
   - useAlterarOferta()  (useMutation) salva.
   - useCancelarOferta() (useMutation) exclui a oferta.

   Apenas o monitor responsavel pela oferta pode editar ou cancelar.
--------------------------------------------------------------------------- */

import {
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";
import {
  useOferta,
  useAlterarOferta,
  useCancelarOferta,
} from "../../queries";
import { useAuth } from "../../contexts/useAuth";
import { useToast } from "../../contexts/useToast";
import Botao from "../../components/ui/Botao";
import {
  Carregando,
  Erro,
} from "../../components/ui/Estado";
import FormularioOferta from "./FormularioOferta";

export default function EditarOferta() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { usuario } = useAuth();
  const toast = useToast();

  const {
    data: oferta,
    isLoading,
    isError,
    error,
    refetch,
  } = useOferta(id);

  const alterar = useAlterarOferta();
  const cancelar = useCancelarOferta();

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

  if (!oferta) {
    return null;
  }

  const ehDono =
    String(oferta.monitorId) === String(usuario?.id);

  if (!ehDono) {
    return (
      <Navigate
        to="/sem-acesso"
        replace
      />
    );
  }

  const valoresIniciais = {
    titulo: oferta.titulo ?? "",
    disciplinaId: oferta.disciplinaId ?? "",
    assunto: oferta.assunto ?? "",
    tipo: oferta.tipo ?? "Tutoria",
    modalidade: oferta.modalidade ?? "Presencial",
    local: oferta.local ?? "",
    vagas: oferta.vagas ?? 1,
    gratuita: Boolean(oferta.gratuita),
    valor: oferta.valor ?? 0,
    descricao: oferta.descricao ?? "",
    horarios: oferta.horarios ?? [],
  };

  async function aoSalvar(dados) {
    await alterar.mutateAsync({
      id,
      dados,
    });

    toast.sucesso("Oferta atualizada!");
    navegar(`/app/apoio/${id}`);
  }

  function aoCancelarOferta() {
    if (
      !confirm(
        "Deseja realmente cancelar esta oferta? Essa acao nao pode ser desfeita.",
      )
    ) {
      return;
    }

    cancelar.mutate(id, {
      onSuccess: () => {
        toast.sucesso("Oferta cancelada.");
        navegar("/app/apoio");
      },
      onError: (e) => {
        toast.erro(e.message);
      },
    });
  }

  return (
    <FormularioOferta
      key={id}
      valoresIniciais={valoresIniciais}
      aoSalvar={aoSalvar}
      titulo="Editar oferta de apoio"
      subtitulo="Atualize os dados e a disponibilidade desta oferta"
      rotuloBotao="Salvar alteracoes"
      acoesExtras={
        <Botao
          type="button"
          variante="perigo"
          larguraTotal
          onClick={aoCancelarOferta}
          carregando={cancelar.isPending}
        >
          Cancelar oferta
        </Botao>
      }
    />
  );
}
