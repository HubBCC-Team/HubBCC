/* ---------------------------------------------------------------------------
   components/ui/Campo.jsx
   Campos de formulario com rotulo e mensagem de erro ja embutidos.

   Exporta 3 componentes:
   - <Campo>        -> input de texto/email/senha/data/numero
   - <CampoSelecao> -> select (lista suspensa)
   - <CampoTexto>   -> textarea

   Todos aceitam as mesmas props basicas: rotulo, erro, dica, e qualquer
   atributo HTML nativo (name, value, onChange, required, placeholder...).
--------------------------------------------------------------------------- */

// Envolucro comum: desenha o rotulo em cima e o erro embaixo.
function Envolucro({ rotulo, erro, dica, children, className = "" }) {
  return (
    <div className={className}>
      {rotulo && <label className="rotulo">{rotulo}</label>}
      {children}
      {dica && !erro && <p className="mt-1 text-[11px] text-slate-500">{dica}</p>}
      {erro && <p className="mt-1 text-[11px] text-erro">{erro}</p>}
    </div>
  );
}

export default function Campo({ rotulo, erro, dica, className, ...resto }) {
  return (
    <Envolucro rotulo={rotulo} erro={erro} dica={dica} className={className}>
      <input className={`campo ${erro ? "border-red-400" : ""}`} {...resto} />
    </Envolucro>
  );
}

export function CampoSelecao({ rotulo, erro, dica, opcoes = [], placeholder, className, ...resto }) {
  return (
    <Envolucro rotulo={rotulo} erro={erro} dica={dica} className={className}>
      <select className={`campo ${erro ? "border-red-400" : ""}`} {...resto}>
        {/* value="" representa "nada selecionado" */}
        {placeholder && <option value="">{placeholder}</option>}
        {/* opcoes pode ser ["A","B"] ou [{ valor, texto }] */}
        {opcoes.map((opcao) => {
          const valor = typeof opcao === "object" ? opcao.valor : opcao;
          const texto = typeof opcao === "object" ? opcao.texto : opcao;
          return (
            <option key={valor} value={valor}>
              {texto}
            </option>
          );
        })}
      </select>
    </Envolucro>
  );
}

export function CampoTexto({ rotulo, erro, dica, linhas = 4, className, ...resto }) {
  return (
    <Envolucro rotulo={rotulo} erro={erro} dica={dica} className={className}>
      <textarea rows={linhas} className={`campo resize-none ${erro ? "border-red-400" : ""}`} {...resto} />
    </Envolucro>
  );
}
