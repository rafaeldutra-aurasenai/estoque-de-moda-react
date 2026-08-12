import { NavLink, useNavigate } from "react-router-dom";

function Item({ to, icon, children, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
    >
      <span className="ic">{icon}</span>
      {children}
    </NavLink>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <NavLink to="/app/dashboard" className="brand">
        <div className="mark">M</div>
        <span>Estoque de Moda</span>
      </NavLink>

      <div className="nav-group">
        <div className="nav-label">Visão geral</div>
        <Item to="/app/dashboard" icon="◆">Dashboard</Item>
        <Item to="/app/notificacoes" icon="✦">Notificações</Item>
      </div>

      <div className="nav-group">
        <div className="nav-label">Catálogo</div>
        <Item to="/app/produtos" icon="▤">Produtos</Item>
        <Item to="/app/categorias" icon="▦">Categorias</Item>
      </div>

      <div className="nav-group">
        <div className="nav-label">Operação</div>
        <Item to="/app/movimentacoes" icon="⇅">Movimentações</Item>
        <Item to="/app/fornecedores" icon="◫">Fornecedores</Item>
        <Item to="/app/pedidos" icon="▧">Pedidos</Item>
      </div>

      <div className="nav-group">
        <div className="nav-label">Análise</div>
        <Item to="/app/relatorios" icon="▲">Relatórios</Item>
      </div>

      <div className="nav-group">
        <div className="nav-label">Conta</div>
        <Item to="/app/perfil" icon="●">Perfil</Item>
        <Item to="/app/configuracoes" icon="⚙">Configurações</Item>
      </div>

      <div className="sidebar-foot">
        <NavLink to="/app/perfil" className="mini-profile">
          <div className="avatar">AD</div>
          <div>
            <div className="name">Ana Duarte</div>
            <div className="role">Atelier Luz</div>
          </div>
        </NavLink>
        <a
          className="nav-item"
          href="#"
          style={{ marginTop: 6 }}
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          <span className="ic">⏻</span>Sair
        </a>
      </div>
    </aside>
  );
}
