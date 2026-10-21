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
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
        <section className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-xl">
          <p className="mb-2 text-sm font-medium text-indigo-400">
            AuthLab
          </p>

          <h1 className="text-3xl font-bold">
            Olá, {usuario.nome}!
          </h1>

          <p className="mt-3 break-words text-slate-300">
            Seu login: {usuario.login}
          </p>

          <button
            type="button"
            onClick={() => {
              setUsuario(null)
              setLogin('')
              setSenha('')
              setErro('')
            }}
            className="mt-8 w-full cursor-pointer rounded-lg border border-slate-600 px-4 py-3 font-semibold transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            Sair
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-xl"
      >
        <h1 className="text-3xl font-bold">Entrar</h1>

        <label htmlFor="login" className="text-sm font-medium text-slate-300">
          Login
        </label>
        <input
          id="login"
          type="text"
          autoComplete="username"
          value={login}
          onChange={(event) => setLogin(event.target.value)}
          className="w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Digite seu login"
        />

        <label htmlFor="senha" className="text-sm font-medium text-slate-300">
          Senha
        </label>
        <input
          id="senha"
          type="password"
          autoComplete="current-password"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          className="w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Digite sua senha"
        />

        {erro !== '' && (
          <p
            role="alert"
            className="rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-200"
          >
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={carregando}
          className="mt-2 w-full cursor-pointer rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  )
}

export default App
