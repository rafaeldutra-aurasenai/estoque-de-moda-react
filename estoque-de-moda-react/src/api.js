const API_URL = "http://localhost:3001/api";

const BASE_URL = `${API_URL}/produtos`;

async function tratarResposta(resposta, mensagem) {
  if (!resposta.ok) {
    let erro = mensagem;

    try {
      const dados = await resposta.json();

      if (dados.erro) {
        erro = dados.erro;
      }
    } catch {
      // Mantém a mensagem original quando a resposta não é JSON.
    }

    throw new Error(erro);
  }

  return resposta.json();
}

// =============================
// PRODUTOS
// =============================

export async function listarProdutos() {
  const resposta = await fetch(BASE_URL);

  return tratarResposta(
    resposta,
    "Erro ao buscar produtos"
  );
}

export async function buscarProduto(sku) {
  const resposta = await fetch(
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
  const resposta = await fetch(BASE_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(produto)
  });

  return tratarResposta(
    resposta,
    "Erro ao criar produto"
  );
}

export async function atualizarProduto(sku, produto) {
  const resposta = await fetch(
    `${BASE_URL}/${encodeURIComponent(sku)}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(produto)
    }
  );

  return tratarResposta(
    resposta,
    "Erro ao atualizar produto"
  );
}

export async function excluirProduto(sku) {
  const resposta = await fetch(
    `${BASE_URL}/${encodeURIComponent(sku)}`,
    {
      method: "DELETE"
    }
  );

  if (!resposta.ok) {
    throw new Error("Erro ao excluir produto");
  }

  return true;
}

// =============================
// MOVIMENTAÇÕES
// =============================

export async function listarMovimentacoes() {
  const resposta = await fetch(
    `${API_URL}/movimentacoes`
  );

  return tratarResposta(
    resposta,
    "Erro ao buscar movimentações"
  );
}

// =============================
// PEDIDOS
// =============================

export async function listarPedidos() {
  const resposta = await fetch(
    `${API_URL}/pedidos`
  );

  return tratarResposta(
    resposta,
    "Erro ao buscar pedidos"
  );
}

// =============================
// CATEGORIAS
// =============================

export async function listarCategorias() {
  const resposta = await fetch(
    `${API_URL}/categorias`
  );

  return tratarResposta(
    resposta,
    "Erro ao buscar categorias"
  );
}