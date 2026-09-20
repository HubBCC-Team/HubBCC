/* ---------------------------------------------------------------------------
   components/ui/Cabecalho.jsx
   Cabecalho padrao de cada pagina interna: titulo, subtitulo e acoes a direita.

   USO:
     <Cabecalho titulo="Meus Agendamentos" subtitulo="Acompanhe seus horarios">
       <Botao>Novo agendamento</Botao>
     </Cabecalho>
--------------------------------------------------------------------------- */
export default function Cabecalho({ titulo, subtitulo, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{titulo}</h1>
        {subtitulo && <p className="mt-0.5 text-sm text-slate-500">{subtitulo}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
