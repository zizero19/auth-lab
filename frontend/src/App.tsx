import type { SubmitEvent } from "react"
import { useState } from "react"

type Usuario = {
  nome: string
  login: string
}

function App() {
  const [carregando, setCarregando] = useState(false)
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [erro, setErro] = useState('')
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (carregando) return

    setErro('')

    if (login.trim() === '' || senha === '') {
      setErro('Preencha login e senha')
      return
    }

    setCarregando(true)

    try {
      const resposta = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, senha })
      })

      if (!resposta.ok) {
        if (resposta.status === 401 || resposta.status === 403) {
          setErro('Login ou senha inválidos')
        } else {
          setErro('Não foi possível entrar. Tente novamente.')
        }

        return
      }

      const dados = await resposta.json()

      if (typeof dados.token !== 'string' || dados.token === '') {
        setErro('O servidor não retornou um token válido')
        return
      }

      const respostaUsuario = await fetch('/api/usuarios/me', {
        headers: {
          Authorization: `Bearer ${dados.token}`,
        },
      })

      if (!respostaUsuario.ok) {
        setErro('Não foi possível consultar o usuário')
        return
      }

      const dadosUsuario: Usuario = await respostaUsuario.json()

      setUsuario(dadosUsuario)
      setSenha('')
    } catch {
      setErro('Não foi possível conectar à API')
    } finally {
      setCarregando(false)
    }

    console.log('Formulário enviado')
  }

  if (usuario !== null) {
    return (
      <main>
        <h1>Olá, {usuario.nome}!</h1>
        <p>Seu login: {usuario.login}</p>

        <button
          type="button"
          onClick={() => {
            setUsuario(null)
            setLogin('')
            setSenha('')
          }}
        >
          Sair
        </button>
      </main>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>Entrar</h1>

        <label htmlFor="login">Login</label>
        <input
          id="login"
          type="text"
          autoComplete="username"
          value={login}
          onChange={(event) => setLogin(event.target.value)}
        />

        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          type="password"
          autoComplete="current-password"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
        />

        {erro !== '' && <p role="alert">{erro}</p>}

        <button type="submit" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </>
  )
}

export default App
