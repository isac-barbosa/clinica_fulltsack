import { Router } from "express";
import { consultaController } from "../controllers/ConsultaController";


export const consultaRouter = Router();

consultaRouter.get('/consulta', async (_, res) => {
    return consultaController.listarConsultas(_, res)
})

consultaRouter.get('/consulta/:id', async (req, res) => {
    return consultaController.buscarConsultaId(req, res)
})


consultaRouter.post("/consulta", async (req, res) => {
    return consultaController.criarConsulta(req, res)
})


consultaRouter.put('/consulta/:id', async (req, res) => {
    return consultaController.atualizarConsulta(req, res)
})


consultaRouter.delete('/consulta/:id', async (req, res) => {
    return consultaController.deletarConsulta(req, res)
})