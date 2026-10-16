import { useEffect, useState } from "react";
import { usePageHeader } from "../components/PageHeaderContext.jsx";
import { apiFetch } from "../auth.js";

const API_URL = "http://localhost:3001/api";

export default function Settings() {
  usePageHeader("conta / configurações", "Configurações");
  const [config, setConfig] = useState({ nome_marca: "", alerta_estoque: true, email_pedidos: true });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    let ativo = true;
    apiFetch(`${API_URL}/configuracoes`).then(async (r) => {
      const dados = await r.json();
      if (!r.ok) throw new Error(dados.error || "Não foi possível carregar as configurações.");
      if (ativo && dados) setConfig({ nome_marca: dados.nome_marca || "", alerta_estoque: Boolean(dados.alerta_estoque), email_pedidos: Boolean(dados.email_pedidos) });
    }).catch((e) => { if (ativo) setErro(e.message); }).finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, []);

  function alterar(campo, valor) { setConfig((c) => ({ ...c, [campo]: valor })); setMensagem(""); }

  async function salvar(e) {
    e.preventDefault(); setErro(""); setMensagem(""); setSalvando(true);
    try {
      const resposta = await apiFetch(`${API_URL}/configuracoes`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(config) });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.error || "Não foi possível salvar as configurações.");
      setConfig({ nome_marca: dados.nome_marca || "", alerta_estoque: Boolean(dados.alerta_estoque), email_pedidos: Boolean(dados.email_pedidos) });
      setMensagem("Configurações salvas no banco de dados.");
    } catch (e) { setErro(e.message); }
    finally { setSalvando(false); }
  }

  if (carregando) return <div className="card">Carregando configurações...</div>;
  return <form onSubmit={salvar}>
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Geral e notificações</h3>
      <div className="settings-row">
        <div><div className="label">Nome da marca</div><div className="desc">Nome usado nas informações da sua loja.</div></div>
        <input aria-label="Nome da marca" value={config.nome_marca} onChange={(e) => alterar("nome_marca", e.target.value)} maxLength={120} required style={{ width: 220, padding: "9px 12px", border: "1px solid var(--line)", borderRadius: 8 }} />
      </div>
      <div className="settings-row">
        <div><div className="label">Alerta de estoque baixo</div><div className="desc">Preferência salva para alertas de itens abaixo do mínimo.</div></div>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}><input type="checkbox" checked={config.alerta_estoque} onChange={(e) => alterar("alerta_estoque", e.target.checked)} /> {config.alerta_estoque ? "Ativado" : "Desativado"}</label>
      </div>
      <div className="settings-row">
        <div><div className="label">Confirmação de pedidos por e-mail</div><div className="desc">Preferência para envio de confirmações. O envio automático depende de configurar um serviço de e-mail.</div></div>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}><input type="checkbox" checked={config.email_pedidos} onChange={(e) => alterar("email_pedidos", e.target.checked)} /> {config.email_pedidos ? "Ativado" : "Desativado"}</label>
      </div>
      {erro && <p role="alert" style={{ color: "var(--danger, #c0392b)" }}>{erro}</p>}
      {mensagem && <p role="status" style={{ color: "var(--success, #218838)" }}>{mensagem}</p>}
      <div className="form-actions"><button className="btn btn-primary" type="submit" disabled={salvando}>{salvando ? "Salvando..." : "Salvar configurações"}</button></div>
    </div>
    <div className="card" style={{ marginTop: 16 }}><h3 style={{ marginTop: 0 }}>Outros recursos</h3><p style={{ color: "var(--ink-soft)", marginBottom: 0 }}>Gerenciamento de equipe, cobrança e modo escuro ainda não estão implementados. Eles foram retirados daqui para não parecerem opções funcionais quando ainda não salvam ou alteram dados.</p></div>
  </form>;
}
