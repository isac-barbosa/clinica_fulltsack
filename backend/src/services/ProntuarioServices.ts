import type { Prontuario } from "../prisma/generated/prisma/client";
import { createHash } from "../utils/createHash";
import bcrypt from "bcrypt";
import { signTokenAcesso, signTokenRefresh } from "../utils/jwt";
import { prontuarioRepository, ProntuarioRepository } from "../repositories/ProntuarioRepository";


export class ProntuarioServices {
    constructor(private readonly repository: ProntuarioRepository) { // TO-DO TIPAR SERVICE
    }

    async listarProntuarios(pagina?: number, limite?: number) {
        const prontuarios = await this.repository.listarProntuarios(pagina, limite)
        return prontuarios
    }

    async criarProntuario(dadosProntuario: Prontuario) {
        const prontuarioCriado = await this.repository.criarProntuario({
            descricao: dadosProntuario.descricao || "",
            data:new Date(dadosProntuario.data || "") ,
            medico_responsavel_id: dadosProntuario.medico_responsavel_id || 0,
            paciente_id: dadosProntuario.paciente_id || 0
        })
        return prontuarioCriado
    }

    async buscarProntuarioId(idProntuario: number) {
        const prontuario = await this.repository.buscarProntuarioId(idProntuario);
        return prontuario;
    }

    async atualizarProntuario(idProntuario: number, dadosParaAtualizar: Omit<Prontuario, 'id'>) {
        const prontuarioAtualizado = await this.repository.atualizarProntuario()
        return prontuarioAtualizado;
    }

    async deletarProntuario(idProntuario: number) {
        const prontuario = await this.repository.deletarProntuario();
        return prontuario;
    }

}

export const prontuarioServices = new ProntuarioServices(prontuarioRepository)