import { useState } from "react";
import { usePageHeader } from "../components/PageHeaderContext.jsx";

const tabs = ["Geral", "Notificações", "Equipe", "Cobrança"];

export default function Settings() {
  usePageHeader("conta / configurações", "Configurações");
  const [activeTab, setActiveTab] = useState("Geral");
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [emailConfirm, setEmailConfirm] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div>
      <div className="tabs">
        {tabs.map((t) => (
          <button
            key={t}
            className={"tab-btn" + (activeTab === t ? " active" : "")}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="card">
        <div className="settings-row">
          <div>
            <div className="label">Nome da marca</div>
            <div className="desc">Exibido nos relatórios e etiquetas</div>
          </div>
          <input defaultValue="Atelier Luz" style={{ width: 220, padding: "9px 12px", border: "1px solid var(--line)", borderRadius: 8 }} />
        </div>
        <div className="settings-row">
          <div>
            <div className="label">Alerta de estoque baixo</div>
            <div className="desc">Notificar quando um item atingir o estoque mínimo</div>
          </div>
          <div className={"toggle" + (lowStockAlert ? " on" : "")} onClick={() => setLowStockAlert(!lowStockAlert)}></div>
        </div>
        <div className="settings-row">
          <div>
            <div className="label">Confirmação de pedidos por e-mail</div>
            <div className="desc">Enviar recibo automático ao cliente</div>
          </div>
          <div className={"toggle" + (emailConfirm ? " on" : "")} onClick={() => setEmailConfirm(!emailConfirm)}></div>
        </div>
        <div className="settings-row">
          <div>
            <div className="label">Modo escuro</div>
            <div className="desc">Ainda em teste para o painel</div>
          </div>
          <div className={"toggle" + (darkMode ? " on" : "")} onClick={() => setDarkMode(!darkMode)}></div>
        </div>
        <div className="settings-row">
          <div>
            <div className="label">Moeda padrão</div>
            <div className="desc">Usada em preços e relatórios</div>
          </div>
          <select style={{ padding: "9px 12px", border: "1px solid var(--line)", borderRadius: 8 }}>
            <option>Real (R$)</option>
            <option>Dólar (US$)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
