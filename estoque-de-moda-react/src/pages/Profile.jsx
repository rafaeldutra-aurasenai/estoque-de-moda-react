import { usePageHeader } from "../components/PageHeaderContext.jsx";

export default function Profile() {
  usePageHeader("conta / perfil", "Meu perfil");

  function handleSave(e) {
    e.preventDefault();
    alert("Alterações salvas (simulação).");
  }

  return (
    <div className="grid-3">
      <div className="card" style={{ textAlign: "center" }}>
        <div className="avatar" style={{ width: 76, height: 76, fontSize: 26, margin: "0 auto 14px" }}>AD</div>
        <div style={{ fontWeight: 700, fontSize: 16 }}>Ana Duarte</div>
        <div style={{ color: "var(--ink-soft)", fontSize: 13, marginBottom: 16 }}>Atelier Luz · Gerente de estoque</div>
        <button className="btn btn-ghost btn-sm" style={{ width: "100%" }}>Alterar foto</button>
      </div>
      <div className="form-card">
        <h4>Informações pessoais</h4>
        <div className="field-row">
          <div className="field"><label>Nome</label><input defaultValue="Ana" /></div>
          <div className="field"><label>Sobrenome</label><input defaultValue="Duarte" /></div>
        </div>
        <div className="field"><label>E-mail</label><input defaultValue="ana@atelieluz.com.br" /></div>
        <div className="field"><label>Telefone</label><input defaultValue="(11) 98888-2233" /></div>
        <div className="form-actions"><button className="btn btn-primary" onClick={handleSave}>Salvar alterações</button></div>
      </div>
    </div>
  );
}
