import type { Request, Response } from "express";
import type { Paciente } from "../prisma/generated/prisma/client"
import { pacienteServices, type PacienteServices } from "../services/PacienteServices";

class PacienteController {
    constructor(private readonly service: PacienteServices) {
    }

    async listarPacientes(req: Request, res: Response){
        try{
            const pagina = req.query.pagina ? Number(req.query.pagina) : undefined
            const limite = req.query.limite ? Number(req.query.limite) : undefined

            const paciente = await this.service.listarPacientes(pagina, limite);
            return res.status(200).json(paciente)
        }catch (error){
            console.log(error)
            return res.status(404).json({
                error
            })
        }        
    }

    async criarPaciente(req: Request, res: Response) {
        try {
            const dadosPaciente = req.body as Paciente
            const pacienteCriado = await this.service.criarPaciente(dadosPaciente);
            return res.status(201).json(pacienteCriado)
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }

    async buscarPacienteId(req: Request, res: Response) {
        try {
            const idPaciente = Number(req.params.id)
            const Paciente = await this.service.buscarPacienteId(idPaciente);
            return res.status(200).json(Paciente)
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }


    async atualizarPaciente(req: Request, res: Response){
        try{
            const idPaciente = Number(req.params.id)
            const dadosParaAtualizar = req.body as Omit<Paciente, 'id'>
            const pacienteAtualizado = await this.service.atualizarPaciente(idPaciente, dadosParaAtualizar)
            return res.status(200).json(pacienteAtualizado)
        }catch (error){
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }

    async deletarPaciente(req: Request, res: Response){
        try{
            const idPaciente = Number(req.params.id)
            const Paciente = await this.service.deletarPaciente(idPaciente)
            return res.status(200).json({
                mensagem: "Usuário deletado com sucesso",
                data: Paciente
            });
        }catch(error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }
}
export const pacienteController = new PacienteController(pacienteServices)
