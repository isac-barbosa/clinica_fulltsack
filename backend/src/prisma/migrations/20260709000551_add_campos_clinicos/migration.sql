-- AlterTable
ALTER TABLE "consulta" ADD COLUMN     "medicamento" TEXT,
ADD COLUMN     "precaucoes_dosagem" TEXT;

-- AlterTable
ALTER TABLE "exame" ADD COLUMN     "documento_url" TEXT,
ADD COLUMN     "laboratorio" TEXT,
ALTER COLUMN "valor" DROP NOT NULL;

-- AlterTable
ALTER TABLE "paciente" ADD COLUMN     "alergias" TEXT,
ADD COLUMN     "contato_emergencia" TEXT,
ADD COLUMN     "convenio" TEXT,
ADD COLUMN     "cuidados_especiais" TEXT,
ADD COLUMN     "endereco" JSONB,
ADD COLUMN     "estado_civil" TEXT,
ADD COLUMN     "naturalidade" TEXT,
ADD COLUMN     "numero_convenio" TEXT,
ADD COLUMN     "rg" TEXT,
ADD COLUMN     "validade_convenio" TIMESTAMP(3);
