import type { PrismaClient } from "@prisma/client/extension";
import { prisma } from "../prisma/prisma";
import type { Consulta } from "../prisma/generated/prisma/client";

export class ConsultaRepository {

    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }
    async listarConsultas(pagina?: number, limite?: number ) {
         const existePaginacao = pagina! && limite!
        if (!existePaginacao) return await prisma.consulta.findMany()
       const consulta = await prisma.consulta.findMany({
            skip: (pagina - 1) * limite,
            take: limite
    })
    const total = await prisma.paciente.count()
    const totalPaginas = Math.ceil(total/ limite)
    return {
        consulta,
        total,
        totalPaginas
    }}

    async buscarConsulta(dadosConsulta: Partial<Consulta>) {
        const consulta = await prisma.consulta.findMany()
        await this.prisma.consulta.get({
        })
        return (consulta)
    }

    async buscarConsultaId(idConsulta: number) {
        const consulta = await prisma.consulta.findUnique({
            where: {
                id: idConsulta
            }
        })
        return consulta
    }

    async criarConsulta(dadosConsulta: Partial<Consulta>) {
        return await this.prisma.consulta.create({
            data: {
                motivo: dadosConsulta.motivo || "",
                data_consulta: dadosConsulta.data_consulta ? new Date(dadosConsulta.data_consulta) : new Date(),
                observacoes: dadosConsulta.observacoes || "",
                medicamento: dadosConsulta.medicamento || null,
                precaucoes_dosagem: dadosConsulta.precaucoes_dosagem || null,
                medico_responsavel_id: dadosConsulta.medico_responsavel_id || "",
                paciente_id: dadosConsulta.paciente_id || ""
            }
        })
    }


    async atualizarConsulta(idConsulta: number, dadosParaAtualizar: Partial<Consulta>) {
        const dados = { ...dadosParaAtualizar }
        if (dados.data_consulta) dados.data_consulta = new Date(dados.data_consulta)

        await this.prisma.consulta.update({
            data: {
                ...dados
            },
            where: {
                id: idConsulta
            }
        })
        const consultaAtualizado = await prisma.consulta.findUnique({
            where: {
                id: idConsulta
            }
        })
        return consultaAtualizado
    }
    async deletarConsulta(idConsulta: number) {
        return await prisma.consulta.delete({
            where: {
                id: idConsulta
            }
        })
    }
}

export const consultaRepository = new ConsultaRepository(prisma)