import type { Request, Response } from "express";
import type { Consulta } from "../prisma/generated/prisma/client"
import { consultaServices, type ConsultaServices } from "../services/ConsultaServices";

class ConsultaController {
    constructor(private readonly service: ConsultaServices) {
    }

    async listarConsultas(req: Request, res: Response){
        try{
            const pagina = req.query.pagina ? Number(req.query.pagina) : undefined
            const limite = req.query.limite ? Number(req.query.limite) : undefined
            
            const consulta = await this.service.listarConsultas(pagina, limite);
            return res.status(200).json(consulta)
        }catch (error){
            console.log(error)
            return res.status(404).json({
                error
            })
        }        
    }

    async criarConsulta(req: Request, res: Response) {
        try {
            const dadosconsulta = req.body as Consulta
            const consultaCriado = await this.service.criarConsulta(dadosconsulta);
            return res.status(201).json(consultaCriado)
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }

    async buscarConsultaId(req: Request, res: Response) {
        try {
            const idConsulta = Number(req.params.id)
            const consulta = await this.service.buscarConsultaId(idConsulta);
            return res.status(200).json(consulta)
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }


    async atualizarConsulta(req: Request, res: Response){
        try{
            const idconsulta = Number(req.params.id)
            const dadosParaAtualizar = req.body as Omit<Consulta, 'id'>
            const consultaAtualizado = await this.service.atualizarConsulta(idconsulta, dadosParaAtualizar)
            return res.status(200).json(consultaAtualizado)
        }catch (error){
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }

    async deletarConsulta(req: Request, res: Response){
        try{
            const idconsulta = Number(req.params.id)
            const consulta = await this.service.deletarConsulta(idconsulta)
            return res.status(200).json({
                mensagem: "Usuário deletado com sucesso",
                data: consulta
            });
        }catch(error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }
}
export const consultaController = new ConsultaController(consultaServices)
