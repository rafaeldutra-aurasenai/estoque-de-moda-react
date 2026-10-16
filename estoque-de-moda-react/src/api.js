
import { apiFetch } from "./auth.js";

const API_URL = "http://localhost:3001/api";
const BASE_URL = `${API_URL}/produtos`;

async function tratarResposta(resposta, mensagem) {
  if (resposta.status === 204) return null;

  if (!resposta.ok) {
    let erro = mensagem;

    try {
      const dados = await resposta.json();
      erro = dados.erro || dados.mensagem || dados.error || mensagem;
    } catch {
      // Usa a mensagem padrão.
    }

    throw new Error(erro);
  }

  return resposta.json();
}

export async function listarProdutos() {
  return tratarResposta(
    await apiFetch(BASE_URL),
    "Erro ao buscar produtos"
  );
}

export async function buscarProduto(sku) {
  const resposta = await apiFetch(
    `${BASE_URL}/${encodeURIComponent(sku)}`
  );

  if (resposta.status === 404) return null;

  return tratarResposta(resposta, "Erro ao buscar produto");
}

export async function criarProduto(produto) {
  return tratarResposta(
    await apiFetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produto),
    }),
    "Erro ao criar produto"
  );
}

export async function atualizarProduto(sku, produto) {
  return tratarResposta(
    await apiFetch(`${BASE_URL}/${encodeURIComponent(sku)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produto),
    }),
    "Erro ao atualizar produto"
  );
}

export async function excluirProduto(sku) {
  return tratarResposta(
    await apiFetch(`${BASE_URL}/${encodeURIComponent(sku)}`, {
      method: "DELETE",
    }),
    "Erro ao excluir produto"
  );
}

export async function listarMovimentacoes() {
  return tratarResposta(
    await apiFetch(`${API_URL}/movimentacoes`),
    "Erro ao buscar movimentações"
  );
}

export async function listarPedidos() {
  return tratarResposta(
    await apiFetch(`${API_URL}/pedidos`),
    "Erro ao buscar pedidos"
  );
}

export async function listarCategorias() {
  return tratarResposta(
    await apiFetch(`${API_URL}/categorias`),
    "Erro ao buscar categorias"
  );
}

export async function listarFornecedores() {
  return tratarResposta(
    await apiFetch(`${API_URL}/fornecedores`),
    "Erro ao buscar fornecedores"
  );
}