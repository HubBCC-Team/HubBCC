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

-- CreateTable
CREATE TABLE "Disciplina" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nome" TEXT NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Disciplina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Atividade" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "disciplinaId" INTEGER,
    "categoria" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "data" DATE NOT NULL,
    "horas" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL DEFAULT '',
    "situacao" TEXT NOT NULL DEFAULT 'Em analise',
    "observacao" TEXT NOT NULL DEFAULT '',
    "comprovante" TEXT NOT NULL DEFAULT '',
    "comprovantePath" TEXT,
    "comprovanteMime" TEXT,
    "comprovanteTamanho" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Atividade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Agendamento_ofertaId_situacao_idx" ON "Agendamento"("ofertaId", "situacao");

-- CreateIndex
CREATE INDEX "Agendamento_monitorId_idx" ON "Agendamento"("monitorId");

-- CreateIndex
CREATE UNIQUE INDEX "Agendamento_usuarioId_idempotencyKey_key" ON "Agendamento"("usuarioId", "idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "Atendimento_agendamentoId_key" ON "Atendimento"("agendamentoId");

-- CreateIndex
CREATE UNIQUE INDEX "Disciplina_codigo_key" ON "Disciplina"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Disciplina_nome_key" ON "Disciplina"("nome");

-- CreateIndex
CREATE INDEX "Atividade_usuarioId_situacao_idx" ON "Atividade"("usuarioId", "situacao");

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_agendamentoId_fkey" FOREIGN KEY ("agendamentoId") REFERENCES "Agendamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atividade" ADD CONSTRAINT "Atividade_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atividade" ADD CONSTRAINT "Atividade_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE SET NULL ON UPDATE CASCADE;
