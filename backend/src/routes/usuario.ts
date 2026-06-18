import { Router } from "express";
import { usuarioController } from "../controllers/UsuárioController";


export const usuarioRouter = Router();

usuarioRouter.get('/usuarios', async (_, res) => {
    return usuarioController.listarUsuarios(_, res)
})

usuarioRouter.get('/usuarios/:id', async (req, res) => {
    return usuarioController.buscarUserId(req, res)
})


usuarioRouter.post("/usuarios", async (req, res) => {
    return usuarioController.criarUsuario(req, res)
})


usuarioRouter.put('/usuarios/:id', async (req, res) => {
    return usuarioController.atualizarUser(req, res)
})


usuarioRouter.delete('/usuarios/:id', async (req, res) => {
    return usuarioController.deletarUser(req, res)
})