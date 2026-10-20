# AuthLab — Backend

Projeto de estudo para demonstrar e praticar autenticação com **JWT** e integração com **OAuth 2.0**, utilizando Java e Spring Boot. O objetivo é compreender o cadastro de usuários, a validação de credenciais, a emissão de tokens e a proteção de uma API REST.

## Tecnologias

| Tecnologia | Utilização |
| --- | --- |
| Java 25 | Versão do Java utilizada para compilação e execução do projeto. |
| Spring Boot 4.1.1 | Configuração e execução da aplicação. |
| Spring Web MVC | Construção dos endpoints REST. |
| Spring Security | Autenticação, regras de acesso e proteção dos endpoints. |
| OAuth2 Resource Server | Validação de tokens JWT enviados nas requisições. |
| OAuth2 Client | Dependência para o estudo de integração com provedores externos; fluxo ainda não configurado. |
| Nimbus JOSE/JWT | Codificação e decodificação dos tokens pela integração do Spring Security. |
| BCrypt | Geração de hashes das senhas dos usuários. |
| Spring Data JPA | Persistência e acesso aos dados por repositórios. |
| PostgreSQL | Banco de dados relacional. |
| Jakarta Validation | Validação dos dados de entrada. |
| Springdoc OpenAPI 3.1.0 | Documentação da API e interface Swagger UI. |
| Lombok | Redução de código repetitivo nos modelos. |
| Maven e Maven Wrapper | Gerenciamento de dependências, build e execução. |
| Spring Boot Test e módulos de teste | Dependências de suporte aos testes. |

As dependências estão declaradas no [`pom.xml`](./pom.xml).

## Autenticação e objetivo do estudo

### JWT: fluxo implementado

1. O usuário se cadastra com nome, login e senha.
2. A senha é armazenada como hash BCrypt, e o cadastro recebe o perfil `USER` e o provedor `LOCAL`.
3. No login, o Spring Security autentica as credenciais.
4. A API emite um JWT assinado com HS256, com emissor `auth-lab`, login como subject e validade de uma hora.
5. Nas chamadas protegidas, o cliente envia o token no cabeçalho `Authorization: Bearer <token>`.
6. O Resource Server valida o token antes de permitir o acesso.

A configuração utiliza sessões stateless: o cliente apresenta o token em cada requisição protegida. Atualmente, apenas `/auth/login` e `/auth/registrar` são públicos; os demais caminhos exigem autenticação.

### OAuth 2.0: integração planejada

O projeto também tem como objetivo estudar a integração com provedores externos usando OAuth 2.0. A dependência OAuth2 Client já está presente, mas ainda não há configuração de provedor nem fluxo de login externo implementado.

JWT é um formato de token; OAuth 2.0 é um protocolo de autorização. Para autenticação de identidade com provedores compatíveis, o estudo pode incluir OpenID Connect (OIDC), uma camada construída sobre OAuth 2.0. A utilização do Resource Server para validar JWT não significa que o login social já esteja disponível.

## Como executar

### Pré-requisitos

- JDK 25.
- PostgreSQL em execução, com o banco `authlab` criado.
- Acesso às dependências Maven na primeira execução.

Execute os comandos a partir da pasta `backend`.

### Configuração

O arquivo `src/main/resources/application.properties` aponta para o PostgreSQL em `localhost:5432/authlab`. Ajuste a conexão para o seu ambiente. Você também pode sobrescrever as propriedades por variáveis de ambiente, sem editar o arquivo.

Exemplo em PowerShell:

```powershell
$env:SPRING_DATASOURCE_URL = 'jdbc:postgresql://localhost:5432/authlab'
$env:SPRING_DATASOURCE_USERNAME = 'postgres'
$env:SPRING_DATASOURCE_PASSWORD = '<senha-do-seu-banco>'

# Gera uma chave aleatória de 32 bytes e a codifica em Base64.
$jwtBytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($jwtBytes)
$rng.Dispose()
$env:JWT_SECRET = [Convert]::ToBase64String($jwtBytes)
```

`JWT_SECRET` é obrigatória e deve conter uma chave em Base64 que, após decodificação, tenha pelo menos 32 bytes. Preserve a mesma chave entre execuções caso precise continuar validando tokens já emitidos. Não versione a chave.

O Hibernate está configurado com `ddl-auto=update`, permitindo atualizar o esquema a partir das entidades. O banco precisa existir antes da inicialização.

### Iniciar a aplicação

No Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

No Linux ou macOS:

```bash
./mvnw spring-boot:run
```

Sem alteração da porta padrão, a API fica em `http://localhost:8080`.

## Endpoints implementados

| Método | Caminho | Acesso | Descrição |
| --- | --- | --- | --- |
| POST | `/auth/registrar` | Público | Cadastra um usuário; retorna HTTP 201. |
| POST | `/auth/login` | Público | Autentica as credenciais e retorna o token. |
| GET | `/api/usuarios/me` | JWT obrigatório | Retorna os dados do usuário identificado pelo token. |

Exemplo de corpo para cadastro:

```json
{
  "nome": "Usuário de estudo",
  "login": "estudante",
  "senha": "senha-de-estudo-123"
}
```

Os três campos são obrigatórios, e a senha deve ter pelo menos oito caracteres. Um login já cadastrado resulta em HTTP 409.

Exemplo de corpo para login:

```json
{
  "login": "estudante",
  "senha": "senha-de-estudo-123"
}
```

Para consultar o usuário autenticado, envie o token retornado pelo login:

```http
GET /api/usuarios/me HTTP/1.1
Host: localhost:8080
Authorization: Bearer <token>
```

## Documentação da API

Os caminhos configurados são:

- Swagger UI: `/swagger-ui.html`.
- OpenAPI: `/api-docs`.

Esses caminhos também exigem autenticação pela configuração atual de segurança. Abrir a interface no navegador sem credenciais não garante acesso; a disponibilização pública da documentação ainda não foi configurada.

## Build e testes

No Windows:

```powershell
.\mvnw.cmd test
.\mvnw.cmd package
```

No Linux ou macOS:

```bash
./mvnw test
./mvnw package
```

O build é gerado em `target/`. O teste que carrega o contexto da aplicação depende das configurações necessárias à inicialização, incluindo o banco e `JWT_SECRET`.

## Organização do código

```text
src/main/java/com/cicero/login_duplo/
├── config/       # Configuração de segurança e JWT
├── controller/   # Endpoints de autenticação e consulta do usuário
├── dto/          # Dados de entrada e saída da API
├── model/        # Entidade de usuário e enums
├── repository/   # Acesso aos dados
└── service/      # Cadastro, autenticação e emissão de tokens
```

## Finalidade educacional

O AuthLab é um laboratório de aprendizado e demonstração. O fluxo local com JWT está implementado, e a integração OAuth com provedores externos faz parte da evolução do estudo. O projeto ainda não implementa renovação ou revogação de tokens e não representa uma solução de autenticação pronta para produção.
