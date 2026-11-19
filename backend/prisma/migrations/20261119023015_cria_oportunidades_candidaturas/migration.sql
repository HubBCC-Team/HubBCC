-- CreateTable
CREATE TABLE "Oportunidade" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "modalidade" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "bolsa" TEXT NOT NULL DEFAULT '',
    "cargaHoraria" TEXT NOT NULL DEFAULT '',
    "vagas" INTEGER NOT NULL,
    "prazoInscricao" DATE NOT NULL,
    "descricao" TEXT NOT NULL,
    "requisitos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "atividades" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "situacao" TEXT NOT NULL DEFAULT 'Aberta',

    CONSTRAINT "Oportunidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidatura" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "oportunidadeId" INTEGER NOT NULL,
    "carta" TEXT NOT NULL,
    "situacao" TEXT NOT NULL DEFAULT 'Em analise',
    "dataEnvio" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Candidatura_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidatura_usuarioId_oportunidadeId_key" ON "Candidatura"("usuarioId", "oportunidadeId");

-- AddForeignKey
ALTER TABLE "Candidatura" ADD CONSTRAINT "Candidatura_oportunidadeId_fkey" FOREIGN KEY ("oportunidadeId") REFERENCES "Oportunidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
