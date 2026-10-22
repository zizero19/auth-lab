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

  return (
    <main className="auth-shell">
        <section className="access-card" aria-labelledby="access-title">
          <img className="card-logo" src="/authlab-logo.png" alt="AuthLab" width="280" height="64" />
          {usuario !== null ? (
            <div className="session-content">
              <h1 id="access-title">Olá, {usuario.nome}!</h1>
              <p className="card-description">Sua sessão foi autenticada com sucesso.</p>
              <p className="user-login">Seu login: <strong>{usuario.login}</strong></p>
              <button className="primary-button" type="button" onClick={() => {
                setUsuario(null)
                setLogin('')
                setSenha('')
                setErro('')
              }}>Sair</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} aria-busy={carregando}>
              <h1 id="access-title">Entrar</h1>
              <p className="card-description">Entre com suas credenciais para continuar.</p>
              <div className="field">
                <label htmlFor="login">Login</label>
                <input id="login" type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} value={login} onChange={(event) => setLogin(event.target.value)} placeholder="Digite seu login" aria-describedby={erro ? 'login-error' : undefined} />
              </div>
              <div className="field">
                <label htmlFor="senha">Senha</label>
                <input id="senha" type="password" autoComplete="current-password" value={senha} onChange={(event) => setSenha(event.target.value)} placeholder="Digite sua senha" aria-describedby={erro ? 'login-error' : undefined} />
              </div>
              {erro !== '' && <p id="login-error" role="alert" className="error-message">{erro}</p>}
              <button type="submit" disabled={carregando} className="primary-button">{carregando ? 'Entrando...' : 'Entrar'}</button>
            </form>
          )}
        </section>
    </main>
  )
}

export default App

