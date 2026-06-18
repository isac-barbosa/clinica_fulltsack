import type { PrismaClient } from "@prisma/client/extension";
import { prisma } from "../prisma/prisma";
import type { Prontuario } from "../prisma/generated/prisma/client";

export class ProntuarioRepository {

    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }
    async listarProntuarios(pagina?: number | undefined, limite?: number | undefined) {
         const existePaginacao = pagina! && limite!
        if (!existePaginacao) return await prisma.prontuario.findMany()
             const prontuario = await prisma.prontuario.findMany({
            skip: (pagina - 1) * limite,
            take: limite
    })
    const total = await prisma.prontuario.count()
    const totalPaginas = Math.ceil(total/ limite)
    return {
        prontuario,
        total,
        totalPaginas
    }    }

    async buscarProntuario(dadosProntuario: Partial<Prontuario>) {
        const prontuario = await prisma.prontuario.findMany()
        await this.prisma.prontuario.get({
        })
        return (prontuario)
    }

    async buscarProntuarioId(idProntuario: number) {
        const prontuario = await prisma.prontuario.findUnique({
            where: {
                id: idProntuario
            }
        })
        return prontuario
    }

    async criarProntuario(dadosProntuario: Partial<Prontuario>) {
        return await this.prisma.prontuario.create({
            data: {
                descricao: dadosProntuario.descricao || "",
                data: dadosProntuario.data || "",
                medico_responsavel_id: dadosProntuario.medico_responsavel_id || "",
                paciente_id: dadosProntuario.paciente_id || ""
            }
        })
    }


    async atualizarProntuario() {
        const idProntuario = Number(this.prisma.id)
        const dadosParaAtualizar = prisma.prontuario as Partial<Prontuario>
        await this.prisma.prontuario.update({
            data: {
                ...dadosParaAtualizar
            },
            where: {
                id: idProntuario
            }
        })
        const prontuarioAtualizado = await prisma.prontuario.findUnique({
            where: {
                id: idProntuario
            }
        })
        return prontuarioAtualizado
    }
    async deletarProntuario() {
        const idProntuario = Number(this.prisma.id)
        return await prisma.prontuario.delete({
            where: {
                id: idProntuario
            }
        })
    }
}

export const prontuarioRepository = new ProntuarioRepository(prisma)