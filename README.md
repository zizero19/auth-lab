# AuthLab

**Laboratório acadêmico de autenticação com Java, Spring Boot e React.**

O AuthLab reúne backend e frontend em um único repositório para estudar a construção de uma aplicação web com autenticação. O foco é compreender o fluxo de cadastro e login, a proteção de APIs com **JWT** e a futura integração com provedores externos por meio de **OAuth 2.0**.

> Projeto com finalidade acadêmica, em desenvolvimento, criado para aprendizado prático e demonstração de conhecimentos. A implementação atual não representa uma solução pronta para produção.

## Visão geral

| Parte | Responsabilidade | Estado atual |
| --- | --- | --- |
| **Backend** | API REST, persistência de usuários, autenticação e validação de tokens. | Cadastro, login com JWT e consulta do usuário autenticado implementados. |
| **Frontend** | Interface web e futura integração com a API. | Estrutura inicial React + Vite; telas e integração de autenticação pendentes. |
| **OAuth 2.0** | Estudo de integração com provedores externos. | Dependência no backend; login externo ainda não configurado. |

## Conhecimentos aplicados

- Organização de uma API em controllers, services, repositories, entidades e DTOs.
- Persistência relacional com Spring Data JPA e PostgreSQL.
- Validação de dados de entrada e tratamento de situações como login duplicado.
- Autenticação de credenciais com Spring Security e armazenamento de senhas com BCrypt.
- Emissão e validação de JWT para acesso a recursos protegidos.
- Preparação de uma interface com React e TypeScript para integração com a API.

## Tecnologias

### Backend

| Tecnologia | Aplicação |
| --- | --- |
| **Java — JDK 25** | Ambiente indicado para desenvolvimento e execução. |
| **Spring Boot 4.1.1** | Configuração e inicialização da aplicação. |
| **Spring Web MVC** | Endpoints REST. |
| **Spring Security** | Autenticação e regras de acesso. |
| **OAuth2 Resource Server e Nimbus JOSE/JWT** | Validação e manipulação de tokens JWT. |
| **OAuth2 Client** | Base para a futura integração com provedores externos. |
| **BCrypt** | Hash de senhas. |
| **Spring Data JPA e PostgreSQL** | Persistência e consultas ao banco de dados. |
| **Jakarta Validation** | Validação das requisições. |
| **Lombok** | Redução de código repetitivo. |
| **Springdoc OpenAPI** | Documentação da API e Swagger UI. |
| **Maven e Spring Boot Test** | Build, dependências e suporte a testes. |

O ambiente indicado é o JDK 25, conforme adotado no estudo. Atualmente, a propriedade `java.version` do `backend/pom.xml` ainda declara 21 como alvo de compilação.

### Frontend

| Tecnologia | Aplicação |
| --- | --- |
| **React 19 e TypeScript** | Construção da interface com componentes e tipagem estática. |
| **Vite 8** | Desenvolvimento local e geração do build. |
| **Chakra UI 3 e Emotion** | Dependências para a construção e estilização da interface. |
| **React Router DOM 7** | Dependência para navegação entre páginas. |
| **Axios** | Dependência para comunicação HTTP com a API. |
| **ESLint e npm** | Análise estática, dependências e scripts. |

Chakra UI, React Router e Axios estão declarados nas dependências, mas ainda não foram integrados ao fluxo de autenticação.

## Como funciona a autenticação

O fluxo implementado está concentrado no backend:

1. O usuário envia nome, login e senha para cadastro.
2. A API valida os dados e persiste a senha como hash BCrypt.
3. No login, o Spring Security verifica as credenciais.
4. A API retorna um JWT assinado com HS256, emissor `auth-lab` e validade de uma hora.
5. O cliente envia `Authorization: Bearer <token>` nas requisições protegidas.
6. O backend valida o token e permite consultar os dados do usuário autenticado.

A configuração é **stateless**: cada requisição protegida precisa apresentar um token válido.

**JWT e OAuth 2.0 têm papéis diferentes.** JWT é um formato de token; OAuth 2.0 é um protocolo de autorização. A integração com provedores externos é uma etapa futura do estudo e poderá incluir OpenID Connect (OIDC) para autenticação de identidade. A validação JWT pelo Resource Server já existe; o login social ainda não.

## Endpoints disponíveis

| Método | Rota | Acesso | Função |
| --- | --- | --- | --- |
| `POST` | `/auth/registrar` | Público | Cadastrar um usuário. |
| `POST` | `/auth/login` | Público | Autenticar credenciais e obter o token. |
| `GET` | `/api/usuarios/me` | JWT obrigatório | Consultar o usuário autenticado. |

Exemplo de cadastro:

```json
{
  "nome": "Usuário de estudo",
  "login": "estudante",
  "senha": "senha-de-estudo-123"
}
```

Para login, envie apenas `login` e `senha`. O cadastro exige os três campos preenchidos e senha com pelo menos oito caracteres.

## Executar localmente

### Pré-requisitos

- JDK 25.
- PostgreSQL com o banco `authlab` criado.
- Node.js compatível com o Vite instalado: `^20.19.0` ou `>=22.12.0`.
- npm e acesso às dependências na primeira execução.

### 1. Backend

Em um terminal PowerShell, a partir da raiz do repositório:

```powershell
cd backend

$env:SPRING_DATASOURCE_URL = 'jdbc:postgresql://localhost:5432/authlab'
$env:SPRING_DATASOURCE_USERNAME = 'postgres'
$env:SPRING_DATASOURCE_PASSWORD = '<senha-do-seu-banco>'

# Gera uma chave aleatória em Base64 para assinar os tokens.
$jwtBytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($jwtBytes)
$rng.Dispose()
$env:JWT_SECRET = [Convert]::ToBase64String($jwtBytes)

.\mvnw.cmd spring-boot:run
```

A API utiliza a porta padrão `8080`. `JWT_SECRET` é obrigatória e deve representar pelo menos 32 bytes após decodificação Base64. Preserve a chave entre execuções para continuar validando tokens já emitidos e mantenha-a fora do versionamento.

O banco precisa existir; as tabelas são atualizadas pelo Hibernate conforme `ddl-auto=update`. No Linux ou macOS, utilize `./mvnw spring-boot:run` e configure as mesmas variáveis no shell correspondente.

### 2. Frontend

Em outro terminal, a partir da raiz do repositório:

```bash
cd frontend
npm ci
npm run dev
```

Abra o endereço informado pelo Vite. Atualmente, a página exibida é a inicial do template; a comunicação com o backend ainda será implementada.

## Validação e documentação

| Pasta | Comando | Finalidade |
| --- | --- | --- |
| `backend/` | `.\mvnw.cmd test` | Executar os testes. |
| `backend/` | `.\mvnw.cmd package` | Executar o ciclo de build e gerar o pacote em `target/`. |
| `frontend/` | `npm run lint` | Analisar o código com ESLint. |
| `frontend/` | `npm run build` | Verificar TypeScript e gerar o build em `dist/`. |
| `frontend/` | `npm run preview` | Conferir localmente o build gerado. |

No Linux ou macOS, substitua `.\mvnw.cmd` por `./mvnw`. Os testes que carregam o contexto do backend dependem do banco e de `JWT_SECRET` configurados.

O backend configura Swagger UI em `/swagger-ui.html` e OpenAPI em `/api-docs`. Esses caminhos exigem autenticação pelas regras atuais de segurança.

## Estrutura do repositório

```text
AuthLab/
├── backend/          # API Java/Spring Boot e persistência
│   ├── src/main/     # Código e configuração da aplicação
│   ├── src/test/     # Testes do backend
│   ├── pom.xml       # Dependências e build Maven
│   └── README.md     # Detalhes do backend
├── frontend/         # Interface React/TypeScript
│   ├── src/          # Componentes, estilos e recursos
│   └── package.json  # Dependências e scripts npm
└── README.md         # Apresentação geral do AuthLab
```

Consulte o [README do backend](./backend/README.md) para detalhes adicionais da API.

## Próximas etapas do estudo

- Desenvolver as telas de cadastro e login no frontend.
- Integrar a interface aos endpoints da API.
- Implementar navegação protegida e tratamento da expiração da sessão.
- Configurar login externo com OAuth 2.0/OIDC.
- Ampliar testes dos fluxos de autenticação e integração.
- Estudar renovação e revogação de tokens, ainda não implementadas.

O projeto evolui como exercício acadêmico de desenvolvimento web, com foco em compreender e demonstrar as decisões envolvidas na autenticação de aplicações.
