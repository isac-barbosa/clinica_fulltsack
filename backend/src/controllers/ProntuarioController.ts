import type { Request, Response } from "express";
import type { Prontuario } from "../prisma/generated/prisma/client"
import { prontuarioServices, ProntuarioServices } from "../services/ProntuarioServices";

class ProntuarioController {
    constructor(private readonly service: ProntuarioServices) {
    }

    async listarProntuarios(req: Request, res: Response){
        try{
            const pagina = req.query.pagina ? Number(req.query.pagina) : undefined
            const limite = req.query.limite ? Number(req.query.limite) : undefined

            const prontuario = await this.service.listarProntuarios(pagina, limite);
            return res.status(200).json(prontuario)
        }catch (error){
            console.log(error)
            return res.status(404).json({
                error
            })
        }        
    }

    async criarProntuarios(req: Request, res: Response) {
        try {
            const dadosProntuarios = req.body as Prontuario
            const prontuarioCriado = await this.service.criarProntuario(dadosProntuarios);
            return res.status(201).json(prontuarioCriado)
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }

    async buscarprontuarioId(req: Request, res: Response) {
        try {
            const idProntuarios = Number(req.params.id)
            const prontuario = await this.service.buscarProntuarioId(idProntuarios);
            return res.status(200).json(prontuario)
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }


    async atualizarProntuarios(req: Request, res: Response){
        try{
            const idProntuarios = Number(req.params.id)
            const dadosParaAtualizar = req.body as Omit<Prontuario, 'id'>
            const prontuarioAtualizado = await this.service.atualizarProntuario(idProntuarios, dadosParaAtualizar)
            return res.status(200).json(prontuarioAtualizado)
        }catch (error){
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }

    async deletarprontuario(req: Request, res: Response){
        try{
            const idProntuarios = Number(req.params.id)
            const prontuario = await this.service.deletarProntuario(idProntuarios)
            return res.status(200).json({
                mensagem: "Usuário deletado com sucesso",
                data: prontuario
            });
        }catch(error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }
}
export const prontuarioController = new ProntuarioController(prontuarioServices)
