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
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      {/* min-w-[200px] garante que o texto nao fica esmagado pelos botoes antes da quebra */}
      <div className="min-w-[200px] flex-1">
        <h1 className="text-xl font-semibold text-slate-900">{titulo}</h1>
        {subtitulo && (
          <p className="mt-0.5 text-sm text-slate-500 leading-snug">
            {subtitulo}
          </p>
        )}
      </div>
      {/* Se quebrar linha, o flex-wrap vai jogar os botoes para baixo. 
          A classe sm:w-auto mt-2 empurra-os gentilmente. */}
      {children && (
        <div className="flex w-full sm:w-auto items-center sm:justify-end gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
