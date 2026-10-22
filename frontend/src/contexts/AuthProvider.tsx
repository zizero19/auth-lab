import { useState, type ReactNode } from "react"
import { AuthContext, type Usuario } from "./AuthContext"

type AuthProviderProps = {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [usuario, setUsuario] = useState<Usuario | null>(null)
    const [token, setToken] = useState<string | null>(null)

    function entrar(token: string, usuario: Usuario) {
        setToken(token)
        setUsuario(usuario)
    }

    function sair() {
        setToken(null)
        setUsuario(null)
    }

    return (
        <AuthContext.Provider value={{ usuario, token, entrar, sair }}>
            {children}
        </AuthContext.Provider>
    )
}