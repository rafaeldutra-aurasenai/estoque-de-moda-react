import { notifications } from "../data.js";
import { usePageHeader } from "../components/PageHeaderContext.jsx";

export default function Notifications() {
  usePageHeader("conta / notificações", "Notificações");

  return (
    <div className="card" style={{ padding: 8 }}>
      <div>
        {notifications.map((n, i) => (
          <div className={"notif-row" + (n.unread ? " unread" : "")} key={i}>
            <div className="notif-ic" style={{ background: n.bg }}>{n.ic}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{n.title}</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 2 }}>{n.sub}</div>
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-faint)", whiteSpace: "nowrap" }}>{n.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
