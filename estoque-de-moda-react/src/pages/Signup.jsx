import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
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
            <h1>Comece a organizar sua coleção hoje.</h1>
            <p>Cadastre sua marca e importe seu catálogo em minutos.</p>
          </div>
          <div className="stat-row">
            <div><b>5 min</b><span>para configurar</span></div>
            <div><b>+120</b><span>marcas usando</span></div>
          </div>
        </div>
        <div className="auth-form-wrap">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="eyebrow">Nova conta</div>
            <h2>Criar sua conta</h2>
            <div className="sub">Leva menos de dois minutos.</div>
            <div className="field-row">
              <div className="field"><label>Nome</label><input placeholder="Ana" /></div>
              <div className="field"><label>Sobrenome</label><input placeholder="Duarte" /></div>
            </div>
            <div className="field"><label>Nome da marca</label><input placeholder="Atelier Luz" /></div>
            <div className="field"><label>E-mail</label><input type="email" placeholder="voce@marca.com.br" /></div>
            <div className="field"><label>Senha</label><input type="password" placeholder="Crie uma senha" /></div>
            <button className="btn btn-primary" type="submit">Criar conta</button>
            <div className="auth-foot">
              Já tem conta? <Link to="/">Entrar</Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
