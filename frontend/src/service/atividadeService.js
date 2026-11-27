import api from "../api/axios";

function montarFormData(dados) {
  const formData = new FormData();
  Object.entries(dados).forEach(([chave, valor]) => {
    if (valor === undefined || valor === null || chave === "comprovanteArquivo")
      return;
    formData.append(chave, valor);
  });
  if (dados.arquivo instanceof File) {
    formData.append("arquivo", dados.arquivo);
  }
  return formData;
}

export async function listarAtividades(usuarioId, filtros = {}) {
  const { data } = await api.get("/atividades", {
    params: { usuarioId, ...filtros },
  });
  return data;
}

export async function resumoHoras(usuarioId) {
  const { data } = await api.get("/atividades/resumo", {
    params: { usuarioId },
  });
  return data;
}

export async function registrarAtividade(dados) {
  const payload = dados.arquivo instanceof File ? montarFormData(dados) : dados;
  const { data } = await api.post("/atividades", payload);
  return data;
}

export async function alterarAtividade(id, dados) {
  const payload = dados.arquivo instanceof File ? montarFormData(dados) : dados;
  const { data } = await api.put(`/atividades/${id}`, payload);
  return data;
}

export async function excluirAtividade(id) {
  await api.delete(`/atividades/${id}`);
}
