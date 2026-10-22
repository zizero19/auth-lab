import { createContext } from "react"

export type Usuario = {
    nome: string
    login: string
}

type AuthContextData = {
    usuario: Usuario | null
    token: string | null
    entrar: (token: string, usuario: Usuario) => void
    sair: () => void
}

export const AuthContext = createContext<AuthContextData | null>(null)