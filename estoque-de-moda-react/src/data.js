export const products = [
  { sku: "VM-0472-VN", name: "Vestido Midi Alfaiataria Vinho", cat: "Vestidos", price: "R$ 349,90", stock: 42, min: 10, status: "ok", emoji: "👗", color: "var(--accent-soft)", supplier: "Textura Confecções", location: "Depósito A · Prateleira 12", entry: "18 jul 2026", colors: ["#5C222B", "#23201D", "#B8863A"], sizes: ["P", "M", "G", "GG"], desc: "Vestido midi em alfaiataria com corte reto, cinto de amarrar e forro interno." },
  { sku: "BC-0118-AR", name: "Blusa Cropped Linho Areia", cat: "Blusas", price: "R$ 129,90", stock: 8, min: 12, status: "low", emoji: "👚", color: "#F5E9D3", supplier: "Malharia Fio Nobre", location: "Depósito A · Prateleira 4", entry: "22 jul 2026", colors: ["#E8D9BE", "#23201D"], sizes: ["P", "M", "G"], desc: "Blusa cropped em linho leve, ideal para composições de verão." },
  { sku: "CP-0299-PT", name: "Calça Pantalona Alfaiataria", cat: "Calças", price: "R$ 219,00", stock: 0, min: 8, status: "out", emoji: "👖", color: "#EFEAE2", supplier: "Denim Studio", location: "Depósito B · Prateleira 9", entry: "05 jul 2026", colors: ["#23201D", "#6B6259"], sizes: ["36", "38", "40", "42"], desc: "Calça pantalona de alfaiataria com cintura alta e caimento fluido." },
  { sku: "SM-0356-MT", name: "Saia Midi Plissada Mostarda", cat: "Saias", price: "R$ 179,90", stock: 26, min: 10, status: "ok", emoji: "🩱", color: "#F5E9D3", supplier: "Textura Confecções", location: "Depósito A · Prateleira 15", entry: "20 jul 2026", colors: ["#9C6B24", "#5C222B"], sizes: ["P", "M", "G"], desc: "Saia midi plissada em tecido leve com caimento fluido." },
  { sku: "BT-0087-CR", name: "Bolsa Tote Trança Caramelo", cat: "Acessórios", price: "R$ 289,00", stock: 15, min: 6, status: "ok", emoji: "👜", color: "#EFEAE2", supplier: "Couros do Vale", location: "Depósito C · Prateleira 2", entry: "14 jul 2026", colors: ["#9C6B24", "#23201D"], sizes: ["Único"], desc: "Bolsa tote em couro trançado à mão, acabamento artesanal." },
  { sku: "BO-0410-PT", name: "Blazer Oversized Preto", cat: "Blusas", price: "R$ 399,00", stock: 6, min: 10, status: "low", emoji: "🧥", color: "#EFEAE2", supplier: "Malharia Fio Nobre", location: "Depósito A · Prateleira 6", entry: "11 jul 2026", colors: ["#23201D"], sizes: ["P", "M", "G", "GG"], desc: "Blazer oversized de alfaiataria, forro completo e ombreira estruturada." },
  { sku: "VL-0521-TR", name: "Vestido Longo Seda Terracota", cat: "Vestidos", price: "R$ 459,90", stock: 19, min: 8, status: "ok", emoji: "👗", color: "var(--accent-soft)", supplier: "Textura Confecções", location: "Depósito A · Prateleira 13", entry: "24 jul 2026", colors: ["#B8863A", "#7A2E3A"], sizes: ["P", "M", "G"], desc: "Vestido longo em seda fluida, fenda lateral e alça fina ajustável." },
  { sku: "BR-0093-DR", name: "Brinco Argola Dourado", cat: "Acessórios", price: "R$ 69,90", stock: 54, min: 15, status: "ok", emoji: "💍", color: "#F5E9D3", supplier: "Couros do Vale", location: "Depósito C · Prateleira 5", entry: "27 jul 2026", colors: ["#B8863A"], sizes: ["Único"], desc: "Brinco argola folheado a ouro 18k, fecho de pressão." },
];

export const suppliers = [
  { name: "Textura Confecções", cat: "Vestidos & Saias", contact: "contato@textura.com.br", products: 64, status: "ok" },
  { name: "Malharia Fio Nobre", cat: "Blusas & Malhas", contact: "vendas@fionobre.com.br", products: 38, status: "ok" },
  { name: "Couros do Vale", cat: "Acessórios", contact: "comercial@courosdovale.com.br", products: 21, status: "low" },
  { name: "Denim Studio", cat: "Calças", contact: "pedidos@denimstudio.com.br", products: 29, status: "ok" },
];

export const orders = [
  { id: "4821", client: "Beatriz Nogueira", email: "bia.nog@email.com", city: "São Paulo, SP", freight: "R$ 24,90", items: 2, total: "R$ 1.013,70", date: "29 jul 2026", status: "low", label: "Em separação", lines: [{ sku: "VM-0472-VN", qty: 2, variant: "M · Vinho" }, { sku: "BT-0087-CR", qty: 1, variant: "Único · Caramelo" }] },
  { id: "4820", client: "Carla Mendes", email: "carla.mendes@email.com", city: "Curitiba, PR", freight: "R$ 19,90", items: 1, total: "R$ 349,90", date: "29 jul 2026", status: "ok", label: "Entregue", lines: [{ sku: "VM-0472-VN", qty: 1, variant: "G · Vinho" }] },
  { id: "4819", client: "Renata Silva", email: "renata.silva@email.com", city: "Belo Horizonte, MG", freight: "R$ 22,00", items: 3, total: "R$ 588,70", date: "28 jul 2026", status: "neutral", label: "Enviado", lines: [{ sku: "SM-0356-MT", qty: 2, variant: "M · Mostarda" }, { sku: "BR-0093-DR", qty: 1, variant: "Único · Dourado" }] },
  { id: "4818", client: "Juliana Prado", email: "ju.prado@email.com", city: "Porto Alegre, RS", freight: "R$ 21,50", items: 1, total: "R$ 219,00", date: "27 jul 2026", status: "out", label: "Cancelado", lines: [{ sku: "CP-0299-PT", qty: 1, variant: "40 · Preto" }] },
];

export const moves = [
  { type: "in", title: "Entrada · Vestido Midi Vinho", sub: "Textura Confecções · há 2h", qty: "+30" },
  { type: "out", title: "Saída · Calça Pantalona", sub: "Pedido #4818 · há 5h", qty: "-4" },
  { type: "in", title: "Entrada · Brinco Argola Dourado", sub: "Couros do Vale · ontem", qty: "+50" },
  { type: "out", title: "Saída · Blazer Oversized", sub: "Pedido #4815 · ontem", qty: "-2" },
];

export const notifications = [
  { unread: true, title: "Estoque baixo: Blazer Oversized Preto", sub: "Restam apenas 6 unidades", time: "há 12 min", ic: "⚠", bg: "var(--warning-bg)" },
  { unread: true, title: "Novo pedido recebido — #4821", sub: "Beatriz Nogueira · R$ 1.013,70", time: "há 2h", ic: "▧", bg: "var(--accent-soft)" },
  { unread: false, title: "Entrega confirmada pela Denim Studio", sub: "29 peças recebidas no depósito A", time: "ontem", ic: "◫", bg: "var(--success-bg)" },
  { unread: false, title: "Produto esgotado: Calça Pantalona Alfaiataria", sub: "Reponha o estoque para continuar vendendo", time: "há 2 dias", ic: "✕", bg: "var(--danger-bg)" },
];

export const categories = [
  { name: "Vestidos", count: "312 peças", ic: "👗", bg: "var(--accent-soft)" },
  { name: "Blusas", count: "248 peças", ic: "👚", bg: "#F5E9D3" },
  { name: "Calças", count: "196 peças", ic: "👖", bg: "#EFEAE2" },
  { name: "Saias", count: "140 peças", ic: "🩱", bg: "#E4EDE3" },
  { name: "Acessórios", count: "402 peças", ic: "👜", bg: "#F5E9D3" },
  { name: "Casacos", count: "88 peças", ic: "🧥", bg: "#EFEAE2" },
  { name: "Calçados", count: "120 peças", ic: "👠", bg: "var(--accent-soft)" },
  { name: "Malharia", count: "174 peças", ic: "🧶", bg: "#E4EDE3" },
];

export function findProduct(sku) {
  return products.find((p) => p.sku === sku);
}

export function findOrder(id) {
  return orders.find((o) => o.id === id);
}
