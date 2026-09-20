/* ---------------------------------------------------------------------------
   components/ui/Modal.jsx
   Janela flutuante (dialogo) usada nas telas de reagendar e avaliar.

   PROPS:
   - aberto  : boolean que controla a exibicao
   - aoFechar: funcao chamada ao clicar no fundo, no X ou ao apertar ESC
   - titulo  : texto do cabecalho
   - largura : classe Tailwind de largura maxima (padrao "max-w-md")

   USO:
     const [aberto, setAberto] = useState(false);
     <Modal aberto={aberto} aoFechar={() => setAberto(false)} titulo="Reagendar">
       ...conteudo...
     </Modal>
--------------------------------------------------------------------------- */
import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ aberto, aoFechar, titulo, largura = "max-w-md", children }) {
  // Fecha o modal quando o usuario aperta a tecla ESC.
  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e) => e.key === "Escape" && aoFechar?.();
    window.addEventListener("keydown", aoTeclar);
    // A funcao retornada no useEffect e a "limpeza": remove o listener.
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto, aoFechar]);

  // Se nao esta aberto, nao renderiza nada.
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fundo escurecido: clicar nele fecha o modal */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={aoFechar} />

      {/* Caixa branca do modal */}
      <div className={`relative w-full ${largura} cartao p-6`}>
        <button
          type="button"
          onClick={aoFechar}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>
        {titulo && <h2 className="mb-4 text-base font-semibold text-slate-900">{titulo}</h2>}
        {children}
      </div>
    </div>
  );
}
