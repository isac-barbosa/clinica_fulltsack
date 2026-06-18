import type { PrismaClient } from "@prisma/client/extension";
import { prisma } from "../prisma/prisma";
import type { Usuario } from "../prisma/generated/prisma/client";

export class UsuarioRepository {

    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }
    async listarUsuarios() {
        const usuarios = await prisma.usuario.findMany()
        return usuarios
    }

    async buscarUser(dadosUsuario: Partial<Usuario>) {
        const usuarios = await prisma.usuario.findMany()
        await this.prisma.usuario.get({
        })
        return (usuarios)
    }

    async buscarUserId(idUsuario: number) {
        const usuario = await prisma.usuario.findUnique({
            where: {
                id: idUsuario
            }
        })
        return usuario
    }

    async criarUsuario(dadosUsuario: Partial<Usuario>) {
        return await this.prisma.usuario.create({
            data: {
                email: dadosUsuario.email || "",
                senha: dadosUsuario.senha || "",
                nome: dadosUsuario.nome || "",
                role: dadosUsuario.role || "USER"
            }
        })
    }


    async atualizarUser() {
        const idUsuario = Number(this.prisma.id)
        const dadosParaAtualizar = prisma.usuario as Partial<Usuario>
        await this.prisma.usuario.update({
            data: {
                ...dadosParaAtualizar
            },
            where: {
                id: idUsuario
            }
        })
        const usuarioAtualizado = await prisma.usuario.findUnique({
            where: {
                id: idUsuario
            }
        })
        return usuarioAtualizado
    }
    async deletarUser() {
        const idUsuario = Number(this.prisma.id)
        return await prisma.usuario.delete({
            where: {
                id: idUsuario
            }
        })
    }
}

export const usuarioRepository = new UsuarioRepository(prisma)