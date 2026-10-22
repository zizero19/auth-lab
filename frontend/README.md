# AuthLab — interface de autenticação

Interface React + TypeScript com visual predominantemente branco com acentos azuis. O layout se adapta a celulares, mantém foco de teclado visível e respeita a preferência por movimento reduzido.

## Executar

```powershell
cd frontend
npm ci
npm run dev
```

Abra o endereço informado pelo Vite (normalmente http://localhost:5173). A API deve estar em http://localhost:8080 para autenticar: o servidor de desenvolvimento encaminha `/auth` e `/api` para ela. Consulte o README da raiz para configurar PostgreSQL e JWT_SECRET.

## Fluxo preservado

O formulário envia `{ login, senha }` para `POST /auth/login`, recebe o token e consulta `GET /api/usuarios/me` com `Authorization: Bearer`. As credenciais continuam em estado local, sem persistência do token no navegador. A tela autenticada exibe nome e login e permite sair. O backend não foi alterado.

## Logo

`public/authlab-logo.svg` é uma marca vetorial transparente provisória em azul, usada como imagem no cartão. O PNG da conversa anterior não estava disponível no workspace nem nos anexos retornados pela conversa; essa marca não é a imagem original.

Para integrar a original, copie o PNG transparente para `public/authlab-logo.png` e substitua a referência `/authlab-logo.svg` em `src/App.tsx` por `/authlab-logo.png`. Ajuste largura/altura à proporção real da imagem. Não converta para JPEG, pois ele não preserva transparência.

## Validar

```powershell
npm run lint
npm run build
npm run preview
```

O preview serve o build estático; a configuração de proxy atual é para desenvolvimento. Para hospedar o build, configure o servidor para encaminhar `/auth` e `/api` à API no mesmo domínio.
