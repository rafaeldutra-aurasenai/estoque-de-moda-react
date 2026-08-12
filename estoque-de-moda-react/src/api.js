// Este é o "elo" entre a tela React e o banco de dados.
// O React NUNCA fala direto com o MySQL — ele chama esta API (o backend
// em server/), e é o backend que roda o SQL. Por isso toda função aqui
// é só um fetch() para os endereços definidos em server/routes/produtos.js

const BASE_URL = 'http://localhost:3001/api/produtos';

export async function listarProdutos() {
  const resposta = await fetch(BASE_URL);
  if (!resposta.ok) throw new Error('Erro ao buscar produtos');
  return resposta.json();
}

export async function buscarProduto(sku) {
  const resposta = await fetch(`${BASE_URL}/${sku}`);
  if (!resposta.ok) return null;
  return resposta.json();
}

export async function criarProduto(produto) {
  const resposta = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produto),
  });
  if (!resposta.ok) throw new Error('Erro ao criar produto');
  return resposta.json();
}

export async function atualizarProduto(sku, produto) {
  const resposta = await fetch(`${BASE_URL}/${sku}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produto),
  });
  if (!resposta.ok) throw new Error('Erro ao atualizar produto');
  return resposta.json();
}

export async function excluirProduto(sku) {
  const resposta = await fetch(`${BASE_URL}/${sku}`, { method: 'DELETE' });
  if (!resposta.ok) throw new Error('Erro ao excluir produto');
}
