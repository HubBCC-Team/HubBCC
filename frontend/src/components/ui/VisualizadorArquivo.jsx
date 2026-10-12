/* ---------------------------------------------------------------------------
   components/ui/VisualizadorArquivo.jsx
   MODAL DE VISUALIZACAO DE COMPROVANTES.

   Recebe a string base64 do banco e renderiza um PDF ou uma Imagem.
--------------------------------------------------------------------------- */
import Modal from "./Modal";

export default function VisualizadorArquivo({
  aberto,
  aoFechar,
  base64,
  nome,
}) {
  if (!aberto || !base64) return null;

  // Verifica pelo cabecalho do base64 se e um PDF
  const ehPdf = base64.startsWith("data:application/pdf");

  return (
    <Modal aberto={aberto} aoFechar={aoFechar} titulo={nome || "Comprovante"}>
      <div className="flex w-full items-center justify-center overflow-hidden rounded-lg bg-slate-100 p-2">
        {ehPdf ? (
          <object
            data={base64}
            type="application/pdf"
            className="h-[60vh] w-full min-w-[280px] sm:min-w-[500px]"
          >
            <p className="p-4 text-center text-sm text-slate-500">
              Seu navegador não suporta visualização direta de PDF.{" "}
              <a
                href={base64}
                download={nome}
                className="font-semibold text-marca-600 hover:underline"
              >
                Baixe o arquivo aqui
              </a>
              .
            </p>
          </object>
        ) : (
          <img
            src={base64}
            alt={nome || "Comprovante da atividade"}
            className="max-h-[60vh] max-w-full object-contain shadow-sm"
          />
        )}
      </div>
    </Modal>
  );
}
