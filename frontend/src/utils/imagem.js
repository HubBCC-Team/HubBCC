/* ---------------------------------------------------------------------------
   utils/imagem.js
   Funcoes utilitarias para lidar com arquivos (imagens e PDFs).
--------------------------------------------------------------------------- */

/**
 * Converte um arquivo (File/Blob) capturado num <input type="file">
 * para uma string Base64. Utilizado para pre-visualizacao e envio
 * simulado no db.js.
 *
 * @param {File} arquivo - O ficheiro selecionado pelo utilizador.
 * @returns {Promise<string>} - A string em Base64 pronta a ser lida.
 */
export function arquivoParaBase64(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();

    leitor.readAsDataURL(arquivo);

    leitor.onload = () => resolve(leitor.result);
    leitor.onerror = (erro) => reject(erro);
  });
}
