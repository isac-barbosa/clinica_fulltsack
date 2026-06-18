import type { Paciente } from "../prisma/generated/prisma/client";
import { createHash } from "../utils/createHash";
import bcrypt from "bcrypt";
import { signTokenAcesso, signTokenRefresh } from "../utils/jwt";
import { pacienteRepository, PacienteRepository } from "../repositories/PacienteRepository";


export class PacienteServices {
    constructor(private readonly repository: PacienteRepository) { // TO-DO TIPAR SERVICE
    }

    async listarPacientes(pagina?: number, limite?: number) {
        const pacientes = await this.repository.listarPacientes(pagina, limite)
        return pacientes
    }

    async criarPaciente(dadosPaciente: Paciente) {
        const pacienteCriado = await this.repository.criarPaciente({
            nome: dadosPaciente.nome,
            cpf: dadosPaciente.cpf,
            telefone: dadosPaciente.telefone,
            email: dadosPaciente.email,
            data_nascimento: dadosPaciente.data_nascimento,
            sexo: dadosPaciente.sexo,
            responsavel: dadosPaciente.responsavel
        })
        return pacienteCriado
    }

    async buscarPacienteId(idPaciente: number) {
        const paciente = await this.repository.buscarPacienteId(idPaciente);
        return paciente;
    }

    async atualizarPaciente(idPaciente: number, dadosParaAtualizar: Omit<Paciente, 'id'>) {
        const pacienteAtualizado = await this.repository.atualizarPaciente()
        return pacienteAtualizado;
    }

    async deletarPaciente(idPaciente: number) {
        const paciente = await this.repository.deletarPaciente();
        return paciente;
    }

}


export const pacienteServices = new PacienteServices(pacienteRepository)