/* ---------------------------------------------------------------------------
   hooks/useRequisicao.js
   Hook generico para buscar dados de um service.

   POR QUE ELE EXISTE:
   Quase toda tela precisa da mesma sequencia: "esta carregando", "deu erro",
   "chegaram os dados". Em vez de repetir isso em 20 telas, centralizamos aqui.

   USO:
     const { dados, carregando, erro, recarregar } =
       useRequisicao(() => listarOfertas(filtros), [filtros], []);

   PARAMETROS:
   - funcaoBusca : funcao que retorna uma Promise (normalmente um service)
   - dependencias: quando algum item mudar, a busca roda de novo
   - valorInicial: o que "dados" vale antes da resposta chegar (ex.: [] ou null)
--------------------------------------------------------------------------- */
import { useState, useEffect, useCallback } from "react";

export function useRequisicao(funcaoBusca, dependencias = [], valorInicial = null) {
  const [dados, setDados] = useState(valorInicial);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const resultado = await funcaoBusca();
      setDados(resultado);
    } catch (e) {
      setErro(e.message);
    } finally {
      // finally roda com sucesso OU com erro: garante que o "carregando" some.
      setCarregando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencias);

  useEffect(() => {
    buscar();
  }, [buscar]);

  // "recarregar" serve para atualizar a lista depois de criar/excluir algo.
  return { dados, carregando, erro, recarregar: buscar, setDados };
}
