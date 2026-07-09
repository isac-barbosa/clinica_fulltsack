import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcrypt";
import { prisma } from "./prisma";

// __dirname não existe em ESM (o projeto usa "type": "module"), então recriamos aqui.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Caminho do db.json que hoje é usado pelo json-server no frontend.
// Ajuste este caminho se você mover o arquivo antes de rodar o script.
const DB_JSON_PATH = path.resolve(
  __dirname,
  "../../../frontend/clinica/src/services/db.json"
);

type DbJson = {
  users?: Array<{ id: string; email: string; password: string }>;
  patients?: Array<Record<string, any>>;
  consults?: Array<Record<string, any>>;
  exams?: Array<Record<string, any>>;
};

// Converte datas em vários formatos usados no db.json para Date:
// "1980-11-10" (ISO), "11/12/1980" (dd/mm/aaaa), "20-03-2026" (dd-mm-aaaa)
function parseData(valor?: string): Date | null {
  if (!valor) return null;

  // ISO: aaaa-mm-dd (com ou sem hora)
  if (/^\d{4}-\d{2}-\d{2}/.test(valor)) {
    const d = new Date(valor);
    return isNaN(d.getTime()) ? null : d;
  }

  // dd/mm/aaaa ou dd-mm-aaaa
  const match = valor.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);
  if (match) {
    const [, dia, mes, ano] = match;
    const d = new Date(`${ano}-${mes}-${dia}`);
    return isNaN(d.getTime()) ? null : d;
  }

  const fallback = new Date(valor);
  return isNaN(fallback.getTime()) ? null : fallback;
}

function combinarDataHora(data?: string, hora?: string): Date {
  const dataBase = parseData(data) ?? new Date();
  if (hora && /^\d{2}:\d{2}$/.test(hora)) {
    const [h, m] = hora.split(":").map(Number);
    dataBase.setHours(h ?? 0, m ?? 0, 0, 0);
  }
  return dataBase;
}

async function main() {
  if (!fs.existsSync(DB_JSON_PATH)) {
    throw new Error(`db.json não encontrado em: ${DB_JSON_PATH}`);
  }

  const raw = fs.readFileSync(DB_JSON_PATH, "utf-8");
  const dbJson: DbJson = JSON.parse(raw);

  console.log("Iniciando importação do db.json para o Postgres...");

  // ---------- USUÁRIOS ----------
  // Mapa do id antigo (string, do json-server) -> novo id (int, do Postgres)
  const mapaUsuarios = new Map<string, number>();

  for (const user of dbJson.users ?? []) {
    const senhaHash = await bcrypt.hash(user.password, 10);

    const existente = await prisma.usuario.findUnique({
      where: { email: user.email },
    });

    const usuarioCriado =
      existente ??
      (await prisma.usuario.create({
        data: {
          email: user.email,
          senha: senhaHash,
          nome: null,
          role: "USER",
        },
      }));

    mapaUsuarios.set(user.id, usuarioCriado.id);
    console.log(`Usuário importado: ${user.email} -> id ${usuarioCriado.id}`);
  }

  // Consulta e Prontuário exigem um "médico responsável" (medico_responsavel_id),
  // que não existe nos dados do db.json. Usamos o primeiro usuário migrado
  // como responsável padrão para não perder os registros.
  const primeiroUsuarioId = [...mapaUsuarios.values()][0] ?? null;
  if (!primeiroUsuarioId) {
    console.warn(
      "Nenhum usuário encontrado no db.json — consultas não terão médico responsável válido e serão puladas."
    );
  }

  // ---------- PACIENTES ----------
  const mapaPacientes = new Map<string, number>();

  for (const patient of dbJson.patients ?? []) {
    const dataNascimento = parseData(patient.birthdate) ?? new Date("1900-01-01");
    const validadeConvenio = parseData(patient.insuranceValidity);

    const pacienteCriado = await prisma.paciente.create({
      data: {
        nome: patient.fullName ?? "",
        cpf: patient.cpf ?? "",
        telefone: patient.phone ?? "",
        email: patient.email ?? "",
        data_nascimento: dataNascimento,
        sexo: patient.gender ?? "",
        rg: patient.rg ?? null,
        estado_civil: patient.maritalStatus ?? null,
        naturalidade: patient.birthplace ?? null,
        contato_emergencia: patient.emergencyContact ?? null,
        alergias: patient.allergies ?? null,
        cuidados_especiais: patient.specialCare ?? null,
        convenio: patient.healthInsurance ?? null,
        numero_convenio: patient.insuranceNumber ?? null,
        validade_convenio: validadeConvenio,
        endereco: patient.address ?? undefined,
      },
    });

    mapaPacientes.set(patient.id, pacienteCriado.id);
    console.log(`Paciente importado: ${patient.fullName} -> id ${pacienteCriado.id}`);
  }

  // ---------- CONSULTAS ----------
  for (const consult of dbJson.consults ?? []) {
    const pacienteId = mapaPacientes.get(consult.patientId);

    if (!pacienteId || !primeiroUsuarioId) {
      console.warn(
        `Consulta ${consult.id} pulada: paciente ou usuário responsável não encontrado.`
      );
      continue;
    }

    await prisma.consulta.create({
      data: {
        motivo: consult.reason ?? "",
        data_consulta: combinarDataHora(consult.date, consult.time),
        observacoes: consult.description ?? "",
        medicamento: consult.medication ?? null,
        precaucoes_dosagem: consult.dosagePrecautions ?? null,
        medico_responsavel_id: primeiroUsuarioId,
        paciente_id: pacienteId,
      },
    });

    console.log(`Consulta importada: ${consult.reason} (paciente id ${pacienteId})`);
  }

  // ---------- EXAMES ----------
  for (const exam of dbJson.exams ?? []) {
    await prisma.exame.create({
      data: {
        tipo_exame: exam.type ?? "",
        descricao: exam.name ?? "",
        resultado: exam.results ?? "",
        laboratorio: exam.laboratory ?? null,
        documento_url: exam.documentUrl ?? null,
        data_exame: combinarDataHora(exam.date, exam.time),
      },
    });

    console.log(`Exame importado: ${exam.name}`);
  }

  console.log("Importação concluída com sucesso!");
}

main()
  .catch((erro) => {
    console.error("Erro durante a importação:", erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
