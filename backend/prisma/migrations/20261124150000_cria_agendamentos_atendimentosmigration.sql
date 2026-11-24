-- CreateTable
CREATE TABLE "Agendamento" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "ofertaId" INTEGER NOT NULL,
    "monitorId" INTEGER,
    "titulo" TEXT NOT NULL,
    "disciplina" TEXT NOT NULL,
    "monitor" TEXT NOT NULL,
    "modalidade" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "data" DATE NOT NULL,
    "hora" TEXT NOT NULL,
    "situacao" TEXT NOT NULL DEFAULT 'Confirmado',
    "idempotencyKey" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Atendimento" (
    "id" SERIAL NOT NULL,
    "agendamentoId" INTEGER NOT NULL,
    "registro" JSONB NOT NULL,
    "avaliacao" JSONB,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Atendimento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Agendamento_ofertaId_situacao_idx" ON "Agendamento"("ofertaId", "situacao");

-- CreateIndex
CREATE INDEX "Agendamento_monitorId_idx" ON "Agendamento"("monitorId");

-- CreateIndex
CREATE UNIQUE INDEX "Agendamento_usuarioId_idempotencyKey_key" ON "Agendamento"("usuarioId", "idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "Atendimento_agendamentoId_key" ON "Atendimento"("agendamentoId");

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_agendamentoId_fkey" FOREIGN KEY ("agendamentoId") REFERENCES "Agendamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
