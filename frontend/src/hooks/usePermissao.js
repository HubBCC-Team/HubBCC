import { useAuth } from "../contexts/useAuth";

export function usePermissao() {
  const { usuario } = useAuth();

  return {
    podeGerenciar: ["monitor", "admin"].includes(usuario?.perfil),
    ehAdmin: usuario?.perfil === "admin",
  };
}
