/* ---------------------------------------------------------------------------
   pages/oportunidades/RealizarCandidatura.jsx
   TELA 9 — Realizar candidatura (rota "/app/oportunidades/:id/candidatura").

   Caso de uso 6. Usa um passo a passo visual (3 etapas) apenas como guia;
   o envio acontece na etapa final.
--------------------------------------------------------------------------- */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useRequisicao } from "../../hooks/useRequisicao";
import { buscarOportunidade, realizarCandidatura } from "../../service/oportunidadeService";
import { useAuth } from "../../contexts/useAuth";
import Cabecalho from "../../components/ui/Cabecalho";
import { CampoTexto } from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";
import Selo from "../../components/ui/Selo";
import { Carregando, Erro } from "../../components/ui/Estado";
import { formatarData } from "../../utils/formatadores";

const ETAPAS = ["Dados", "Motivacao", "Confirmacao"];

export default function RealizarCandidatura() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { usuario } = useAuth();

  const { dados: oportunidade, carregando, erro } = useRequisicao(
    () => buscarOportunidade(id),
    [id],
    null
  );

  const [etapa, setEtapa] = useState(1); // 1, 2 ou 3
  const [carta, setCarta] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(null);

  if (carregando) return <Carregando />;
  if (erro) return <Erro mensagem={erro} />;
  if (!oportunidade) return null;

  async function aoConfirmar() {
    setErroEnvio(null);
    setEnviando(true);
    try {
      await realizarCandidatura({
        usuarioId: usuario.id,
        oportunidadeId: oportunidade.id,
        carta,
      });
      navegar("/app/candidaturas");
    } catch (e) {
      setErroEnvio(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <Cabecalho titulo="Realizar candidatura" subtitulo={oportunidade.titulo} />

      {/* --------------------- Indicador de etapas --------------------- */}
      <div className="mb-6 flex items-center gap-2">
        {ETAPAS.map((nome, indice) => {
          const numero = indice + 1;
          const concluida = etapa > numero;
          const atual = etapa === numero;
          return (
            <div key={nome} className="flex items-center gap-2">
              <span
                className={[
                  "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium",
                  concluida ? "bg-sucesso text-white" : atual ? "bg-marca-600 text-white" : "bg-slate-200 text-slate-500",
                ].join(" ")}
              >
                {concluida ? <Check size={12} /> : numero}
              </span>
              <span className={`text-xs ${atual ? "font-medium text-slate-900" : "text-slate-500"}`}>
                {nome}
              </span>
              {numero < ETAPAS.length && <span className="mx-2 h-px w-8 bg-slate-200" />}
            </div>
          );
        })}
      </div>

      {erroEnvio && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-erro">
          {erroEnvio}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="cartao p-6 lg:col-span-2">
          {/* ------------------------- Etapa 1 ------------------------- */}
          {etapa === 1 && (
            <>
              <h2 className="titulo-secao mb-4">Confira seus dados</h2>
              <dl className="grid gap-3 text-xs sm:grid-cols-2">
                <Dado rotulo="Nome" valor={usuario.nome} />
                <Dado rotulo="E-mail" valor={usuario.email} />
                <Dado rotulo="Matricula" valor={usuario.matricula} />
                <Dado rotulo="Periodo" valor={usuario.periodo} />
              </dl>
              <p className="mt-4 text-[11px] text-slate-500">
                Para alterar esses dados, acesse a tela de Perfil.
              </p>
            </>
          )}

          {/* ------------------------- Etapa 2 ------------------------- */}
          {etapa === 2 && (
            <>
              <h2 className="titulo-secao mb-4">Carta de motivacao</h2>
              <CampoTexto
                linhas={9}
                placeholder="Conte por que voce tem interesse nesta oportunidade..."
                value={carta}
                onChange={(e) => setCarta(e.target.value)}
                dica={`${carta.length} caracteres`}
              />
            </>
          )}

          {/* ------------------------- Etapa 3 ------------------------- */}
          {etapa === 3 && (
            <>
              <h2 className="titulo-secao mb-4">Confirme sua candidatura</h2>
              <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
                <p>
                  <strong className="text-slate-800">Oportunidade:</strong> {oportunidade.titulo}
                </p>
                <p className="mt-1">
                  <strong className="text-slate-800">Candidato:</strong> {usuario.nome}
                </p>
                <p className="mt-3 whitespace-pre-wrap">{carta || "(sem carta de motivacao)"}</p>
              </div>
              <p className="mt-4 text-[11px] text-slate-500">
                Ao confirmar, sua candidatura sera enviada com a situacao "Em analise".
              </p>
            </>
          )}

          {/* ------------------- Navegacao entre etapas ------------------- */}
          <div className="mt-6 flex justify-between gap-2 border-t border-slate-100 pt-4">
            <Botao
              variante="contorno"
              onClick={() => (etapa === 1 ? navegar(-1) : setEtapa(etapa - 1))}
            >
              {etapa === 1 ? "Cancelar" : "Voltar"}
            </Botao>

            {etapa < 3 ? (
              <Botao onClick={() => setEtapa(etapa + 1)}>Continuar</Botao>
            ) : (
              <Botao onClick={aoConfirmar} carregando={enviando}>
                Confirmar candidatura
              </Botao>
            )}
          </div>
        </div>

        {/* ----------------------- Resumo lateral ----------------------- */}
        <aside className="cartao h-fit p-5">
          <Selo tom="marca">{oportunidade.tipo}</Selo>
          <h3 className="mt-2 text-sm font-semibold text-slate-900">{oportunidade.titulo}</h3>
          <p className="mt-1 text-[11px] text-slate-500">{oportunidade.departamento}</p>
          <dl className="mt-4 space-y-2 text-[11px]">
            <Dado rotulo="Modalidade" valor={oportunidade.modalidade} />
            <Dado rotulo="Carga horaria" valor={oportunidade.cargaHoraria} />
            <Dado rotulo="Bolsa" valor={oportunidade.bolsa} />
            <Dado rotulo="Inscricoes ate" valor={formatarData(oportunidade.prazoInscricao)} />
          </dl>
        </aside>
      </div>
    </>
  );
}

function Dado({ rotulo, valor }) {
  return (
    <div>
      <dt className="text-[11px] text-slate-500">{rotulo}</dt>
      <dd className="font-medium text-slate-800">{valor || "-"}</dd>
    </div>
  );
}
