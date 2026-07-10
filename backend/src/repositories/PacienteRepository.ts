import type { PrismaClient } from "@prisma/client/extension";
import { prisma } from "../prisma/prisma";
import type { Paciente } from "../prisma/generated/prisma/client";

export class PacienteRepository {

    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }
    async listarPacientes(pagina?: number, limite?: number ) {
        const existePaginacao = pagina! && limite!
        if (!existePaginacao) return await prisma.paciente.findMany()
        const paciente = await prisma.paciente.findMany({
            skip: (pagina - 1) * limite,
            take: limite
    })
    const total = await prisma.paciente.count()
    const totalPaginas = Math.ceil(total/ limite)
    return {
        paciente,
        total,
        totalPaginas
    }
}

    async buscarPaciente(dadosPaciente: Partial<Paciente>) {
        const pacientes = await prisma.paciente.findMany()
        await this.prisma.paciente.get({
        })
        return (pacientes)
    }

    async buscarPacienteId(idPaciente: number) {
        const paciente = await prisma.paciente.findUnique({
            where: {
                id: idPaciente
            }
        })
        return paciente
    }

    async criarPaciente(dadosPaciente: Partial<Paciente>) {
        return await this.prisma.paciente.create({
            data: {
                nome: dadosPaciente.nome || "",
                cpf: dadosPaciente.cpf || "",
                telefone: dadosPaciente.telefone || "",
                email: dadosPaciente.email || "",
                data_nascimento: dadosPaciente.data_nascimento ? new Date(dadosPaciente.data_nascimento) : new Date(),
                sexo: dadosPaciente.sexo || "",
                responsavel: dadosPaciente.responsavel || "",
                rg: dadosPaciente.rg || null,
                estado_civil: dadosPaciente.estado_civil || null,
                naturalidade: dadosPaciente.naturalidade || null,
                contato_emergencia: dadosPaciente.contato_emergencia || null,
                alergias: dadosPaciente.alergias || null,
                cuidados_especiais: dadosPaciente.cuidados_especiais || null,
                convenio: dadosPaciente.convenio || null,
                numero_convenio: dadosPaciente.numero_convenio || null,
                validade_convenio: dadosPaciente.validade_convenio ? new Date(dadosPaciente.validade_convenio) : null,
                endereco: dadosPaciente.endereco ?? undefined
            }
        })
    }


    async atualizarPaciente(idPaciente: number, dadosParaAtualizar: Partial<Paciente>) {
        const dados = { ...dadosParaAtualizar }
        if (dados.data_nascimento) dados.data_nascimento = new Date(dados.data_nascimento)
        if (dados.validade_convenio) dados.validade_convenio = new Date(dados.validade_convenio)

        await this.prisma.paciente.update({
            data: {
                ...dados
            },
            where: {
                id: idPaciente
            }
        })
        const pacienteAtualizado = await prisma.paciente.findUnique({
            where: {
                id: idPaciente
            }
        })
        return pacienteAtualizado
    }
    async deletarPaciente(idPaciente: number) {
        return await prisma.paciente.delete({
            where: {
                id: idPaciente
            }
        })
    }
}

export const pacienteRepository = new PacienteRepository(prisma)