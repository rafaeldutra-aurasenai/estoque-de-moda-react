export default function Tag({ status, label }) {
  const map = {
    // produtos
    ok: { cls: "ok", text: "Em estoque" },
    low: { cls: "low", text: "Estoque baixo" },
    out: { cls: "out", text: "Esgotado" },
    // fornecedores
    Ativo: { cls: "ok", text: "Ativo" },
    Inativo: { cls: "out", text: "Inativo" },
    Pendente: { cls: "low", text: "Pendente" },
    // pedidos
    Enviado: { cls: "neutral", text: "Enviado" },
    Entregue: { cls: "ok", text: "Entregue" },
    Cancelado: { cls: "out", text: "Cancelado" },
    neutral: { cls: "neutral", text: "—" },
  };
  const info = map[status] || map.neutral;
  return <span className={`tag ${info.cls}`}>{label || info.text}</span>;
}