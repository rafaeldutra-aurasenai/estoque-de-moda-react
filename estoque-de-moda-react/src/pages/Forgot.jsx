import { Link } from "react-router-dom";

export default function Forgot() {
  function handleSubmit(e) {
    e.preventDefault();
    alert("Link de recuperação enviado (simulação).");
  }

  return (
    <section>
      <div className="auth-shell">
        <div className="auth-art">
          <div className="brand-mark">ESTOQUE DE MODA</div>
          <div className="pitch">
            <h1>Vamos recuperar seu acesso.</h1>
            <p>Enviaremos um link de redefinição para o e-mail cadastrado na sua conta.</p>
          </div>
        </div>
        <div className="auth-form-wrap">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="eyebrow">Recuperar acesso</div>
            <h2>Esqueceu a senha?</h2>
            <div className="sub">Informe o e-mail da conta para receber o link de redefinição.</div>
            <div className="field"><label>E-mail</label><input type="email" placeholder="voce@marca.com.br" /></div>
            <button className="btn btn-primary" type="submit">Enviar link</button>
            <div className="auth-foot">
              <Link to="/">← Voltar para o login</Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
