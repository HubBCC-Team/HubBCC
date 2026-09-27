/* ---------------------------------------------------------------------------
   pages/oportunidades/FormularioOportunidade.jsx
   Formulario reaproveitado entre Cadastrar (tela 10) e Editar oportunidade.

   Recebe:
   - valoresIniciais: objeto com os campos já no formato de texto do form
     (requisitos e atividades como string com quebras de linha, não array).
   - aoSalvar: função async que recebe os valores já processados (com
     requisitos/atividades convertidos de volta para array) e faz a
     chamada ao service (cadastrar ou alterar). Se der erro, deve lançar
     (throw) — este componente captura e mostra o Alerta.
--------------------------------------------------------------------------- */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormulario } from "../../hooks/useFormulario";
import Cabecalho from "../../components/ui/Cabecalho";
import Campo, { CampoSelecao, CampoTexto } from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";
import Selo from "../../components/ui/Selo";
import Alerta from "../../components/ui/Alerta";

const TIPOS = ["Iniciacao Cientifica", "Extensao", "Evento", "Estagio", "Monitoria"];
const MODALIDADES = ["Presencial", "Remoto", "Hibrido"];

export default function FormularioOportunidade({
  valoresIniciais,
  aoSalvar,
  titulo,
  subtitulo,
  rotuloBotao = "Salvar",
}) {
  const navegar = useNavigate();
  const { valores, aoMudar } = useFormulario(valoresIniciais);

  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      await aoSalvar({
        ...valores,
        vagas: Number(valores.vagas),
        // Texto com quebras de linha -> array, ignorando linhas vazias.
        requisitos: valores.requisitos.split("\n").map((l) => l.trim()).filter(Boolean),
        atividades: valores.atividades.split("\n").map((l) => l.trim()).filter(Boolean),
      });
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <Cabecalho titulo={titulo} subtitulo={subtitulo} />

      {erro && (
        <Alerta variante="erro" className="mb-4">
          {erro}
        </Alerta>
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
              {rotuloBotao}
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
