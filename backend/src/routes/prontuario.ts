import { Router } from "express";
import { createHash } from "../utils/createHash";
import { prisma } from "../prisma/prisma";
import type { Prontuario } from "../prisma/generated/prisma/client";
import bcrypt from "bcrypt";


export const prontuarioRouter = Router();

prontuarioRouter.get('/prontuario', async (_, res) => {
    const prontuario = await prisma.prontuario.findMany();
    res.json(prontuario);
})

prontuarioRouter.get('/prontuario/:id', async (req, res) => {
    const idProntuario = Number(req.params.id)
    const prontuario = await prisma.prontuario.findUnique({
        where: {
            id: idProntuario
        }
    })
    return res.status(200).json(prontuario)
})


prontuarioRouter.post("/prontuario", async (req, res) => {
    console.log(req.body)
    const dadosProntuario = req.body as Prontuario
    const prontuarioCriado = await prisma.prontuario.create({
        data: {
            descricao: dadosProntuario.descricao,
            data: dadosProntuario.data,
            medico_responsavel_id: dadosProntuario.medico_responsavel_id,
            paciente_id: dadosProntuario.paciente_id   
        }
    })
    return res.status(201).json(prontuarioCriado)
})


prontuarioRouter.put('/prontuario/:id', async (req, res) => {
    const idProntuario = Number(req.params.id)
    const dadosParaAtualizar = req.body as Omit<Prontuario, 'id'>
    await prisma.prontuario.update({
        data: {
            ...dadosParaAtualizar
        },
        where: {
            id: idProntuario
        }
    })
    const prontuarioAtualizado = await prisma.prontuario.findUnique({
        where: {
            id: idProntuario
        }
    })
    return res.status(200).json(prontuarioAtualizado)
})


prontuarioRouter.delete('/prontuario/:id', async (req, res) => {
    const idProntuario = Number(req.params.id)
    const deletarProntuario = await prisma.prontuario.delete({
        where: {
            id: idProntuario
        }
    })
    return res.status(200).json({
        message: "Usuário deletado com sucesso",
        data: deletarProntuario
    })
})