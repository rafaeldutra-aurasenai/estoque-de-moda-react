import { useEffect, useState } from "react";
import { usePageHeader } from "../components/PageHeaderContext.jsx";
import { apiFetch, getUsuario, atualizarUsuario } from "../auth.js";

const API_URL = "http://localhost:3001/api";
const vazio = { nome: "", sobrenome: "", email: "", telefone: "", empresa: "", cargo: "" };

export default function Profile() {
  usePageHeader("conta / perfil", "Meu perfil");
  const [form, setForm] = useState({ ...vazio });
  const [usuario, setUsuario] = useState(getUsuario());
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const id = usuario?.id;

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      if (!id) { setErro("Não foi possível identificar o usuário. Entre novamente."); setCarregando(false); return; }
      try {
        const resposta = await apiFetch(`${API_URL}/usuarios/${id}`);
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.error || dados.mensagem || "Não foi possível carregar o perfil.");
        if (!ativo) return;
        setForm({ ...vazio, ...dados });
        setUsuario(dados);
        atualizarUsuario({ ...getUsuario(), ...dados });
      } catch (e) { if (ativo) setErro(e.message); }
      finally { if (ativo) setCarregando(false); }
    }
    carregar();
    return () => { ativo = false; };
  }, [id]);

  function alterar(campo, valor) { setForm((atual) => ({ ...atual, [campo]: valor })); setMensagem(""); }

  async function salvar(e) {
    e.preventDefault(); setErro(""); setMensagem(""); setSalvando(true);
    try {
      const resposta = await apiFetch(`${API_URL}/usuarios/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: form.nome, sobrenome: form.sobrenome, email: form.email, telefone: form.telefone, empresa: form.empresa, cargo: form.cargo }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.error || dados.mensagem || "Não foi possível salvar as alterações.");
      setForm({ ...vazio, ...dados }); setUsuario(dados);
      atualizarUsuario({ ...getUsuario(), ...dados });
      setMensagem("Perfil atualizado com sucesso.");
    } catch (e) { setErro(e.message); }
    finally { setSalvando(false); }
  }

  async function alterarFoto(e) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    if (!arquivo.type.startsWith("image/")) { setErro("Escolha um arquivo de imagem."); return; }
    if (arquivo.size > 5 * 1024 * 1024) { setErro("A imagem deve ter no máximo 5 MB."); return; }
    const dados = new FormData(); dados.append("foto", arquivo);
    setErro(""); setMensagem("");
    try {
      const resposta = await apiFetch(`${API_URL}/usuarios/${id}/foto`, { method: "POST", body: dados });
      const usuarioAtualizado = await resposta.json();
      if (!resposta.ok) throw new Error(usuarioAtualizado.error || "Não foi possível enviar a foto.");
      setUsuario(usuarioAtualizado); atualizarUsuario({ ...getUsuario(), ...usuarioAtualizado });
      setMensagem("Foto de perfil atualizada.");
    } catch (e) { setErro(e.message); }
    e.target.value = "";
  }

  async function removerFoto() {
    try {
      const resposta = await apiFetch(`${API_URL}/usuarios/${id}/foto`, { method: "DELETE" });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.error || "Não foi possível remover a foto.");
      setUsuario(dados); atualizarUsuario({ ...getUsuario(), ...dados }); setMensagem("Foto removida."); setErro("");
    } catch (e) { setErro(e.message); }
  }

  const nomeCompleto = [form.nome, form.sobrenome].filter(Boolean).join(" ") || "Meu perfil";
  const fotoUrl = usuario?.fotoUrl ? `http://localhost:3001${usuario.fotoUrl}` : null;
  const iniciais = `${form.nome?.[0] || ""}${form.sobrenome?.[0] || ""}`.toUpperCase() || "U";

  if (carregando) return <div className="card">Carregando seus dados...</div>;
  return <div className="grid-3">
    <div className="card" style={{ textAlign: "center", alignSelf: "start" }}>
      {fotoUrl ? <img src={fotoUrl} alt={`Foto de ${nomeCompleto}`} className="avatar" style={{ width: 76, height: 76, objectFit: "cover", margin: "0 auto 14px" }} /> : <div className="avatar" style={{ width: 76, height: 76, fontSize: 26, margin: "0 auto 14px" }}>{iniciais}</div>}
      <div style={{ fontWeight: 700, fontSize: 16 }}>{nomeCompleto}</div>
      <div style={{ color: "var(--ink-soft)", fontSize: 13, margin: "6px 0 16px" }}>{form.empresa || "Empresa não informada"} · {form.cargo || (usuario?.papel === "dono" ? "Proprietário(a)" : "Funcionário(a)")}</div>
      <label className="btn btn-ghost btn-sm" style={{ width: "100%", display: "block", cursor: "pointer", boxSizing: "border-box" }}>Alterar foto<input type="file" accept="image/*" onChange={alterarFoto} style={{ display: "none" }} /></label>
      {fotoUrl && <button className="btn btn-ghost btn-sm" style={{ width: "100%", marginTop: 8 }} onClick={removerFoto}>Remover foto</button>}
    </div>
    <form className="form-card" onSubmit={salvar} style={{ gridColumn: "span 2" }}>
      <h4>Informações pessoais</h4>
      <div className="field-row">
        <div className="field"><label htmlFor="nome">Nome *</label><input id="nome" value={form.nome} onChange={(e) => alterar("nome", e.target.value)} required maxLength={80} /></div>
        <div className="field"><label htmlFor="sobrenome">Sobrenome</label><input id="sobrenome" value={form.sobrenome || ""} onChange={(e) => alterar("sobrenome", e.target.value)} maxLength={80} /></div>
      </div>
      <div className="field"><label htmlFor="email">E-mail *</label><input id="email" type="email" value={form.email} onChange={(e) => alterar("email", e.target.value)} required maxLength={150} /></div>
      <div className="field-row">
        <div className="field"><label htmlFor="telefone">Telefone</label><input id="telefone" type="tel" value={form.telefone || ""} onChange={(e) => alterar("telefone", e.target.value)} maxLength={20} placeholder="(11) 99999-9999" /></div>
        <div className="field"><label htmlFor="cargo">Cargo</label><input id="cargo" value={form.cargo || ""} onChange={(e) => alterar("cargo", e.target.value)} maxLength={120} placeholder="Ex.: Gerente de estoque" /></div>
      </div>
      <div className="field"><label htmlFor="empresa">Empresa / marca</label><input id="empresa" value={form.empresa || ""} onChange={(e) => alterar("empresa", e.target.value)} maxLength={120} /></div>
      {erro && <p role="alert" style={{ color: "var(--danger, #c0392b)" }}>{erro}</p>}
      {mensagem && <p role="status" style={{ color: "var(--success, #218838)" }}>{mensagem}</p>}
      <div className="form-actions"><button className="btn btn-primary" type="submit" disabled={salvando}>{salvando ? "Salvando..." : "Salvar alterações"}</button></div>
    </form>
  </div>;
}
