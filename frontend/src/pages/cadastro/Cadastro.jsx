import { User, AtSign, Image, Lock, Target, BookOpen, Check } from "lucide-react";

function Cadastro() {
  return (
    <div className="grid lg:grid-cols-3 min-h-screen overflow-auto font-sans">
      {/* Coluna esquerda (azul) */}
      <div className="bg-blue-800 p-12 text-white flex-col justify-between relative overflow-hidden hidden lg:flex">
        {/* Elementos de fundo */}
        <div className="absolute top-20 left-10 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-3xl z-0"></div>
        <div className="absolute -bottom-40 right-10 w-[500px] h-[500px] bg-blue-700/50 rounded-full blur-3xl z-0"></div>

        <div className="z-10 relative">
          {/* Logo */}
          <div className="flex items-start gap-4 mb-20">
            <Target className="w-12 h-12 text-blue-100" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">IEEE Forum</h1>
              <p className="text-blue-100 text-sm">Connecting Students</p>
            </div>
          </div>

          {/* Texto principal */}
          <h2 className="text-5xl font-extrabold leading-tight mb-8">
            Sua jornada<br />acadêmica em<br />um só lugar.
          </h2>
          <p className="text-blue-100 text-lg mb-12 max-w-lg">
            Oportunidades, workshops, mentorias e tutorias acadêmicas - tudo integrado no IEEE Forum,
            a plataforma da sua comunidade técnica.
          </p>

          {/* Lista de features */}
          <div className="space-y-6">
            {[
              { icon: BookOpen, text: "Encontre oportunidades acadêmicas e técnicas" },
              { icon: Target, text: "Agende workshops, mentorias e tutorias" },
              { icon: Check, text: "Acompanhe suas atividades complementares e projetos" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="bg-blue-100/20 p-3 rounded-full">
                  <item.icon className="w-6 h-6 text-blue-50" />
                </div>
                <span className="text-blue-50 text-md font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coluna direita (branca) */}
      <div className="bg-white px-6 py-12 sm:p-16 flex flex-col items-center justify-center lg:col-span-2">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-950 mb-3">Cadastrar</h2>
            <p className="text-lg text-gray-500 font-medium">Crie sua conta para começar</p>
          </div>

          <form className="space-y-6">
            {/* Nome */}
            <div>
              <label htmlFor="nome" className="text-gray-600 font-semibold mb-2 block">
                Nome
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  placeholder="Nome"
                  className="w-full border border-gray-200 rounded-lg p-4 pl-12 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
              </div>
            </div>

            {/* Usuário */}
            <div>
              <label htmlFor="usuario" className="text-gray-600 font-semibold mb-2 block">
                Usuário
              </label>
              <div className="relative">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="usuario"
                  name="usuario"
                  placeholder="Usuário"
                  className="w-full border border-gray-200 rounded-lg p-4 pl-12 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
              </div>
            </div>

            {/* Foto */}
            <div>
              <label htmlFor="foto" className="text-gray-600 font-semibold mb-2 block">
                Foto
              </label>
              <div className="relative">
                <Image className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="foto"
                  name="foto"
                  placeholder="URL da foto"
                  className="w-full border border-gray-200 rounded-lg p-4 pl-12 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
              </div>
            </div>

            {/* Senha / Confirmar senha */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="senha" className="text-gray-600 font-semibold mb-2 block">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    id="senha"
                    name="senha"
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-lg p-4 pl-12 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="confirmarSenha" className="text-gray-600 font-semibold mb-2 block">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    id="confirmarSenha"
                    name="confirmarSenha"
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-lg p-4 pl-12 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  />
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="reset"
                className="w-full sm:w-1/2 border border-gray-300 text-gray-600 font-semibold text-lg p-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-1/2 bg-blue-600 text-white font-semibold text-lg p-4 rounded-xl hover:bg-blue-700 transition duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
