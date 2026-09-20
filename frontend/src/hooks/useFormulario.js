/* ---------------------------------------------------------------------------
   hooks/useFormulario.js
   Hook simples para controlar formularios sem biblioteca externa.

   USO:
     const { valores, aoMudar, definir, limpar } = useFormulario({ email: "" });
     <input name="email" value={valores.email} onChange={aoMudar} />

   O "name" do input precisa ser IGUAL a chave do objeto de valores.
--------------------------------------------------------------------------- */
import { useState, useCallback } from "react";

export function useFormulario(valoresIniciais = {}) {
  const [valores, setValores] = useState(valoresIniciais);

  // Handler unico para todos os campos (input, select, textarea, checkbox).
  const aoMudar = useCallback((evento) => {
    const { name, value, type, checked } = evento.target;
    setValores((anteriores) => ({
      ...anteriores,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  // Define um campo manualmente (util para componentes que nao sao <input>).
  const definir = useCallback((campo, valor) => {
    setValores((anteriores) => ({ ...anteriores, [campo]: valor }));
  }, []);

  // Volta o formulario ao estado inicial.
  const limpar = useCallback(() => setValores(valoresIniciais), [valoresIniciais]);

  return { valores, setValores, aoMudar, definir, limpar };
}
