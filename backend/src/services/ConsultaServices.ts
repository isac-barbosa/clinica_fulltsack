import type { Consulta } from "../prisma/generated/prisma/client";
import { consultaRepository, ConsultaRepository } from "../repositories/ConsultaRepository";



export class ConsultaServices {
    constructor(private readonly repository: ConsultaRepository) { // TO-DO TIPAR SERVICE
    }

    async listarConsultas(pagina?: number, limite?: number) {
        const consultas = await this.repository.listarConsultas(pagina, limite)
        return consultas
    }

    async criarConsulta(dadosConsulta: Consulta) {
        const consultaCriado = await this.repository.criarConsulta({
            motivo: dadosConsulta.motivo,
            data_consulta: dadosConsulta.data_consulta,
            observacoes: dadosConsulta.observacoes,
            medico_responsavel_id: dadosConsulta.medico_responsavel_id,
            paciente_id: dadosConsulta.paciente_id   
        })
        return consultaCriado
    }

    async buscarConsultaId(idConsulta: number) {
        const consulta = await this.repository.buscarConsultaId(idConsulta);
        return consulta;
    }

    async atualizarConsulta(idConsulta: number, dadosParaAtualizar: Omit<Consulta, 'id'>) {
        const consultaAtualizado = await this.repository.atualizarConsulta()
        return consultaAtualizado;
    }

    async deletarConsulta(idConsulta: number) {
        const consulta = await this.repository.deletarConsulta();
        return consulta;
    }

}


export const consultaServices = new ConsultaServices(consultaRepository)