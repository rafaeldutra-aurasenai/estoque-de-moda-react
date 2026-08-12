import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    navigate("/app/dashboard");
  }

  return (
    <section>
      <div className="auth-shell">
        <div className="auth-art">
          <div className="brand-mark">ESTOQUE DE MODA</div>
          <div className="pitch">
            <h1>Cada peça, no lugar certo.</h1>
            <p>Controle de coleções, tamanhos e cores em um só lugar — do recebimento à venda.</p>
          </div>
          <div className="stat-row">
            <div><b>2.480</b><span>peças em estoque</span></div>
            <div><b>36</b><span>fornecedores ativos</span></div>
            <div><b>98%</b><span>pedidos no prazo</span></div>
          </div>
        </div>
        <div className="auth-form-wrap">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="eyebrow">Bem-vinda de volta</div>
            <h2>Entrar na sua conta</h2>
            <div className="sub">Acesse o painel para gerenciar seu estoque.</div>
            <div className="field">
              <label>E-mail</label>
              <input type="email" placeholder="voce@marca.com.br" defaultValue="ana@atelieluz.com.br" />
            </div>
            <div className="field">
              <label>Senha</label>
              <input type="password" placeholder="••••••••" defaultValue="••••••••" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "-4px 0 18px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-soft)" }}>
                <input type="checkbox" defaultChecked style={{ width: "auto" }} />
                Lembrar de mim
              </label>
              <Link to="/forgot" style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>
                Esqueci a senha
              </Link>
            </div>
            <button className="btn btn-primary" type="submit">Entrar</button>
            <div className="auth-foot">
              Ainda não tem conta? <Link to="/signup">Criar conta</Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
