import type { PrismaClient } from "@prisma/client/extension";
import type { Exame } from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma";

export class ExameRepository {
    constructor(private readonly prisma: PrismaClient) {
         this.prisma = prisma
    }

        async listarTodosExames(pagina?: number, limite?: number) {
        const existePaginacao = pagina! && limite!
        if (!existePaginacao) return await prisma.exame.findMany()
        const exames = await prisma.exame.findMany({
            skip: (pagina - 1) * limite,
            take: limite
        })

        const total = await prisma.exame.count();
        const totalPaginas = Math.ceil(total / limite)
        return {
            exames,
            total,
            totalPaginas
        }
    }

    async criarExame(dadosExame: Partial<Exame> & { pacienteId?: number | null }) {
        return await this.prisma.exame.create({
            data: {
            tipo_exame: dadosExame.tipo_exame,
            valor: dadosExame.valor ?? undefined,
            descricao: dadosExame.descricao,
            resultado: dadosExame.resultado,
            laboratorio: dadosExame.laboratorio || null,
            documento_url: dadosExame.documento_url || null,
            data_exame: new Date(dadosExame.data_exame || ""),
            pacienteId: dadosExame.pacienteId ?? undefined
        }
        })
    }
    async buscarExameId( idExame: number){
        const exame = await prisma.exame.findUnique({
            where:{
                id: idExame
            }
        })
       return exame
    }

    async atualizarExame(idExame: number, dadosAtualizados: Partial<Exame>){
        const dados = { ...dadosAtualizados }
        if (dados.data_exame) dados.data_exame = new Date(dados.data_exame)

        await this.prisma.exame.update({
            data:{
                ...dados
            },
            where:{
                id: idExame
            }
        })
        const exameAtualizado = await prisma.exame.findUnique({
            where:{
                id: idExame
            } 
        })
        return exameAtualizado
    }
    async deletarExame(idExame: number){
        return await prisma.exame.delete({
            where: {
                id: idExame
            }
        })
    }
}

export const exameRepository = new ExameRepository(prisma)