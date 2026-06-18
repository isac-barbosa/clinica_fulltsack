import type { Exame } from "../prisma/generated/prisma/client";
import { exameRepository, type ExameRepository } from "../repositories/ExameRepository";

export class ExameServices {
    constructor(private readonly repository: ExameRepository) { 
    }

        async listarTodosExames(pagina?: number, limite?: number) {
        const exames = await this.repository.listarTodosExames(pagina, limite)
        return exames
    }
    
    async criarExame(dadosExame: Exame) {
        const exameCriado = await this.repository.criarExame({
            tipo_exame: dadosExame.tipo_exame,
            valor: dadosExame.valor,
            descricao: dadosExame.descricao,
            resultado: dadosExame.resultado,
            data_exame: new Date(dadosExame.data_exame || "")
        })
        return exameCriado
    }

    async buscarExameId(idExame: number) {
        const exame = await this.repository.buscarExameId(idExame);
        return exame;
    }

    async atualizarExame(idexame: number, dadosAtualizados: Omit<Exame, 'id'>) {
        const exameAtualizado = await this.repository.atualizarExame()
        return exameAtualizado;
    }

    async deletarExame(idExame: number) {
        const exame = await this.repository.deletarExame();
        return exame;
    }

}


export const exameServices = new ExameServices(exameRepository)