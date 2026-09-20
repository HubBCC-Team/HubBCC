/* ---------------------------------------------------------------------------
   pages/oportunidades/CadastrarOportunidade.jsx
   TELA 10 — Cadastrar oportunidade (rota "/app/oportunidades/nova").

   Caso de uso 1. Formulario completo com pre-visualizacao ao lado.
   Requisitos e atividades sao digitados um por linha e convertidos em array
   antes de enviar ao service.
--------------------------------------------------------------------------- */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormulario } from "../../hooks/useFormulario";
import { cadastrarOportunidade } from "../../service/oportunidadeService";
import Cabecalho from "../../components/ui/Cabecalho";
import Campo, { CampoSelecao, CampoTexto } from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";
import Selo from "../../components/ui/Selo";

const TIPOS = ["Iniciacao Cientifica", "Extensao", "Evento", "Estagio", "Monitoria"];
const MODALIDADES = ["Presencial", "Remoto", "Hibrido"];

export default function CadastrarOportunidade() {
  const navegar = useNavigate();

  const { valores, aoMudar } = useFormulario({
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
  });

  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      await cadastrarOportunidade({
        ...valores,
        vagas: Number(valores.vagas),
        // Texto com quebras de linha -> array, ignorando linhas vazias.
        requisitos: valores.requisitos.split("\n").map((l) => l.trim()).filter(Boolean),
        atividades: valores.atividades.split("\n").map((l) => l.trim()).filter(Boolean),
      });
      navegar("/app/oportunidades");
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <Cabecalho
        titulo="Cadastrar oportunidade"
        subtitulo="Publique uma nova oportunidade academica para o curso"
      />

      {erro && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-erro">
          {erro}
        </div>
      )}

      <form onSubmit={aoEnviar} className="grid gap-4 lg:grid-cols-3">
        {/* -------------------------- Formulario -------------------------- */}
        <div className="cartao space-y-4 p-6 lg:col-span-2">
          <h2 className="titulo-secao">Informacoes da oportunidade</h2>

          <Campo rotulo="Titulo" name="titulo" required value={valores.titulo} onChange={aoMudar} />

          <div className="grid gap-3 sm:grid-cols-2">
            <CampoSelecao rotulo="Tipo" name="tipo" required placeholder="Selecione" opcoes={TIPOS} value={valores.tipo} onChange={aoMudar} />
            <Campo rotulo="Area" name="area" required value={valores.area} onChange={aoMudar} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Campo rotulo="Departamento" name="departamento" required value={valores.departamento} onChange={aoMudar} />
            <Campo rotulo="Responsavel" name="responsavel" required value={valores.responsavel} onChange={aoMudar} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <CampoSelecao rotulo="Modalidade" name="modalidade" required placeholder="Selecione" opcoes={MODALIDADES} value={valores.modalidade} onChange={aoMudar} />
            <Campo rotulo="Local" name="local" required value={valores.local} onChange={aoMudar} />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Campo rotulo="Bolsa" name="bolsa" placeholder="R$ 700,00 ou Nao remunerada" value={valores.bolsa} onChange={aoMudar} />
            <Campo rotulo="Carga horaria" name="cargaHoraria" placeholder="12h/semana" value={valores.cargaHoraria} onChange={aoMudar} />
            <Campo rotulo="Vagas" name="vagas" type="number" min="1" value={valores.vagas} onChange={aoMudar} />
          </div>

          <Campo rotulo="Prazo de inscricao" name="prazoInscricao" type="date" required value={valores.prazoInscricao} onChange={aoMudar} />

          <CampoTexto rotulo="Descricao" name="descricao" required linhas={4} value={valores.descricao} onChange={aoMudar} />

          <CampoTexto
            rotulo="Requisitos"
            name="requisitos"
            linhas={4}
            dica="Escreva um requisito por linha."
            value={valores.requisitos}
            onChange={aoMudar}
          />

          <CampoTexto
            rotulo="Atividades previstas"
            name="atividades"
            linhas={4}
            dica="Escreva uma atividade por linha."
            value={valores.atividades}
            onChange={aoMudar}
          />
        </div>

        {/* ----------------------- Pre-visualizacao ----------------------- */}
        <aside className="space-y-4">
          <div className="cartao p-5">
            <h2 className="titulo-secao mb-3">Pre-visualizacao</h2>
            <div className="rounded-xl border border-slate-200 p-4">
              {valores.tipo && <Selo tom="marca">{valores.tipo}</Selo>}
              <h3 className="mt-2 text-sm font-semibold text-slate-900">
                {valores.titulo || "Titulo da oportunidade"}
              </h3>
              <p className="mt-1 text-[11px] text-slate-500">
                {valores.departamento || "Departamento"}
              </p>
              <p className="mt-2 line-clamp-3 text-xs text-slate-600">
                {valores.descricao || "A descricao aparece aqui conforme voce digita."}
              </p>
            </div>
          </div>

          <div className="cartao space-y-2 p-5">
            <Botao type="submit" larguraTotal carregando={enviando}>
              Publicar oportunidade
            </Botao>
            <Botao type="button" variante="contorno" larguraTotal onClick={() => navegar(-1)}>
              Cancelar
            </Botao>
          </div>
        </aside>
      </form>
    </>
  );
}
