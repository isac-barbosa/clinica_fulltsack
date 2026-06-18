import type { Request, Response } from "express";
import type { Usuario } from "../prisma/generated/prisma/client"
import { usuarioServices, type UsuarioServices } from "../services/UsuárioService";

class UsuarioController {
    constructor(private readonly service: UsuarioServices) {
    }

    async listarUsuarios(_: Request, res: Response){
        try{
            const usuarios = await this.service.listarUsuarios();
            return res.status(200).json(usuarios)
        }catch (error){
            console.log(error)
            return res.status(404).json({
                error
            })
        }        
    }

    async criarUsuario(req: Request, res: Response) {
        try {
            const dadosUsuario = req.body as Usuario
            const usuarioCriado = await this.service.criarUsuario(dadosUsuario);
            return res.status(201).json(usuarioCriado)
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }

    async buscarUserId(req: Request, res: Response) {
        try {
            const idUsuario = Number(req.params.id)
            const usuario = await this.service.buscarUserId(idUsuario);
            return res.status(200).json(usuario)
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }


    async atualizarUser(req: Request, res: Response){
        try{
            const idUsuario = Number(req.params.id)
            const dadosParaAtualizar = req.body as Omit<Usuario, 'id'>
            const usuarioAtualizado = await this.service.atualizarUser(idUsuario, dadosParaAtualizar)
            return res.status(200).json(usuarioAtualizado)
        }catch (error){
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }

    async deletarUser(req: Request, res: Response){
        try{
            const idUsuario = Number(req.params.id)
            const usuario = await this.service.deletarUser(idUsuario)
            return res.status(200).json({
                mensagem: "Usuário deletado com sucesso",
                data: usuario
            });
        }catch(error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }
}
export const usuarioController = new UsuarioController(usuarioServices)
