import type { Usuario } from "../prisma/generated/prisma/client";
import { createHash } from "../utils/createHash";
import bcrypt from "bcrypt";
import { signTokenAcesso, signTokenRefresh } from "../utils/jwt";
import { usuarioRepository, type UsuarioRepository } from "../repositories/UsuárioRepository";

export class UsuarioServices {
    constructor(private readonly repository: UsuarioRepository) { // TO-DO TIPAR SERVICE
    }

    async listarUsuarios(){
        const usuarios = await this.repository.listarUsuarios()
        return usuarios
    }

    async criarUsuario(dadosUsuario: Usuario) {
        const hash = await createHash(dadosUsuario.senha);

        const usuarioCriado = await this.repository.criarUsuario({
            email: dadosUsuario.email,
            nome: dadosUsuario.nome || null,
            role: dadosUsuario.role || null,
            senha: hash
        })
        return usuarioCriado
    }

     async buscarUserId(idUsuario: number) {
        const usuario = await this.repository.buscarUserId(idUsuario);
        return usuario;
    }

      async atualizarUser(idUsuario: number, dadosParaAtualizar: Omit<Usuario, 'id'>) {
        const usuarioAtualizado = await this.repository.atualizarUser()
        return usuarioAtualizado;
    }
       
       async deletarUser(idUsuario: number) {
        const usuario = await this.repository.deletarUser();
        return usuario;
    }

}


export const usuarioServices = new UsuarioServices(usuarioRepository)