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
                data_consulta: dadosConsulta.data_consulta || "",
                observacoes: dadosConsulta.observacoes || "",
                medico_responsavel_id: dadosConsulta.medico_responsavel_id || "",
                paciente_id: dadosConsulta.paciente_id || ""
            }
        })
    }


    async atualizarConsulta() {
        const idConsulta = Number(this.prisma.id)
        const dadosParaAtualizar = prisma.consulta as Partial<Consulta>
        await this.prisma.consulta.update({
            data: {
                ...dadosParaAtualizar
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
    async deletarConsulta() {
        const idConsulta = Number(this.prisma.id)
        return await prisma.consulta.delete({
            where: {
                id: idConsulta
            }
        })
    }
}

export const consultaRepository = new ConsultaRepository(prisma)