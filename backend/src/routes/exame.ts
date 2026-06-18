import { Router } from "express";
import { exameController } from "../controllers/ExameController";
import { roleMiddleware } from "../middleware/role";
import { Role } from "../prisma/generated/prisma/enums";

export const exameRouter = Router();
exameRouter.use(roleMiddleware([Role.ADMIN]))

exameRouter.get('/exame/:id', async (req, res) => {
    return exameController.buscarExameId(req, res)
})

exameRouter.post('/exame', async (req, res) => {
    return exameController.criarExame(req, res)
})

exameRouter.put('/exame/:id', async (req, res) => {
    return exameController.atualizarExame(req, res)
})


exameRouter.delete('/exame/:id', async (req, res) => {
    return exameController.deletarExame(req, res)
})

