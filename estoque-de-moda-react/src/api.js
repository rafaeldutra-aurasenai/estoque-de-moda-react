import { apiFetch } from "./auth.js";

const API_URL = "http://localhost:3001/api";

const BASE_URL = `${API_URL}/produtos`;

async function tratarResposta(resposta, mensagem) {
if (!resposta.ok) {
let erro = mensagem;


try {
  const dados = await resposta.json();

  erro =
    dados.erro ||
    dados.mensagem ||
    dados.error ||
    mensagem;

} catch {
  // Mantém a mensagem original.
}

throw new Error(erro);


}

return resposta.json();
}

export async function listarProdutos() {
const resposta = await apiFetch(BASE_URL);

return tratarResposta(
resposta,
"Erro ao buscar produtos"
);
}

export async function buscarProduto(sku) {
const resposta = await apiFetch(
`${BASE_URL}/${encodeURIComponent(sku)}`
);

if (resposta.status === 404) {
return null;
}

return tratarResposta(
resposta,
"Erro ao buscar produto"
);
}

export async function criarProduto(produto) {
const resposta = await apiFetch(
BASE_URL,
{
method: "POST",


  headers: {
    "Content-Type": "application/json",
  },

  body: JSON.stringify(produto),
}


);

return tratarResposta(
resposta,
"Erro ao criar produto"
);
}

export async function atualizarProduto(
sku,
produto
) {
const resposta = await apiFetch(
`${BASE_URL}/${encodeURIComponent(sku)}`,
{
method: "PUT",


  headers: {
    "Content-Type": "application/json",
  },

  body: JSON.stringify(produto),
}


);

return tratarResposta(
resposta,
"Erro ao atualizar produto"
);
}

export async function excluirProduto(sku) {
const resposta = await apiFetch(
`${BASE_URL}/${encodeURIComponent(sku)}`,
{
method: "DELETE",
}
);

if (!resposta.ok) {
throw new Error(
"Erro ao excluir produto"
);
}

return true;
}

export async function listarMovimentacoes() {
const resposta = await apiFetch(
`${API_URL}/movimentacoes`
);

return tratarResposta(
resposta,
"Erro ao buscar movimentações"
);
}

export async function listarPedidos() {
const resposta = await apiFetch(
`${API_URL}/pedidos`
);

return tratarResposta(
resposta,
"Erro ao buscar pedidos"
);
}

export async function listarCategorias() {
const resposta = await apiFetch(
`${API_URL}/categorias`
);

return tratarResposta(
resposta,
"Erro ao buscar categorias"
);
}
