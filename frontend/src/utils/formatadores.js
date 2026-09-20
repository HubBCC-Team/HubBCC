/* ---------------------------------------------------------------------------
   utils/formatadores.js
   Funcoes pequenas de formatacao usadas em varias telas.
   Se precisar formatar algo em mais de um lugar, coloque aqui.
--------------------------------------------------------------------------- */

// "2026-09-22" -> "22/09/2026"
export function formatarData(iso) {
  if (!iso) return "-";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

// 40 -> "R$ 40,00"   |   0 -> "Gratuito"
export function formatarValor(valor) {
  if (!valor) return "Gratuito";
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Data de hoje no formato aceito por <input type="date">: "2026-09-19"
export function hojeISO() {
  return new Date().toISOString().slice(0, 10);
}

// Nome completo -> iniciais. "Mina Monteiro" -> "MM"
export function iniciaisDe(nome = "") {
  const partes = nome.trim().split(" ").filter(Boolean);
  if (!partes.length) return "?";
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}
