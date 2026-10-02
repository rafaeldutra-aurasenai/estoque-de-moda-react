const TOKEN_KEY = "estoque_moda_token";
const USER_KEY = "estoque_moda_usuario";

export function getToken() {
return localStorage.getItem(TOKEN_KEY);
}

export function getUsuario() {
try {
return JSON.parse(localStorage.getItem(USER_KEY) || "null");
} catch {
return null;
}
}

export function salvarSessao({ token, usuario }) {
if (!token) {
throw new Error("Token JWT não recebido.");
}

localStorage.setItem(TOKEN_KEY, token);
localStorage.setItem(USER_KEY, JSON.stringify(usuario));
}

export function limparSessao() {
localStorage.removeItem(TOKEN_KEY);
localStorage.removeItem(USER_KEY);
}

export function estaAutenticado() {
return Boolean(getToken());
}

export async function apiFetch(url, options = {}) {
const token = getToken();

const headers = new Headers(options.headers || {});

if (token) {
headers.set("Authorization", `Bearer ${token}`);
}

const resposta = await fetch(url, {
...options,
headers,
});

if (resposta.status === 401) {
limparSessao();

```
if (window.location.pathname.startsWith("/app")) {
  window.location.href = "/";
}
```

}

return resposta;
}
