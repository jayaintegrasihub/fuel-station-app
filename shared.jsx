/* ============================================================
   TELEMETRIC Fuel Log — shared UI (icons + primitives)
   ============================================================ */
const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ---------- Icons (stroke, 24x24) ---------- */
function Icon({ name, size, style, className }) {
  const paths = {
    fuel: <><path d="M3 21h12V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16Z"/><path d="M7 8h6"/><path d="M15 9l3 3v6a2 2 0 0 0 2 2 2 2 0 0 0 2-2v-8l-3-3"/></>,
    history: <><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></>,
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></>,
    genset: <><rect x="2" y="7" width="20" height="11" rx="2"/><path d="M6 7V5a2 2 0 0 1 2-2h2"/><path d="M11 11l-2 3h3l-2 3"/><path d="M18 11v6"/></>,
    excavator: <><path d="M3 18h9v-3H4l-1 3Z"/><circle cx="6" cy="20" r="1.4"/><circle cx="10" cy="20" r="1.4"/><path d="M12 15v-3l5-5 2 2"/><path d="M19 9l2 5h-4"/></>,
    camera: <><path d="M14.5 4l1.5 2h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l1.5-2h5Z"/><circle cx="12" cy="13" r="3.2"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    check: <path d="M20 6 9 17l-5-5"/>,
    checkCircle: <><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></>,
    x: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
    alert: <><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></>,
    excel: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/><path d="M14 2v6h6"/><path d="m9 13 6 5"/><path d="m15 13-6 5"/></>,
    pdf: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/><path d="M14 2v6h6"/><path d="M9 15h1.5a1.5 1.5 0 0 0 0-3H9v5"/><path d="M14 12v5"/><path d="M16.5 12H14"/><path d="M16 14.5h-2"/></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
    eyeOff: <><path d="M9.9 4.2A9.5 9.5 0 0 1 12 4c6.5 0 10 7 10 7a13.2 13.2 0 0 1-2.2 3"/><path d="M6.6 6.6A13.4 13.4 0 0 0 2 12s3.5 7 10 7a9.3 9.3 0 0 0 4.4-1.1"/><path d="m2 2 20 20"/><path d="M9.5 9.5a3 3 0 0 0 4.2 4.2"/></>,
    filter: <path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3Z"/>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
    chevDown: <path d="m6 9 6 6 6-6"/>,
    drop: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/>,
    refresh: <><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    shield: <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></>,
    lock: <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,
    gauge: <><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="m13.4 12.6 3.6-3.6"/><path d="M4.5 18a9 9 0 1 1 15 0"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>,
    layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></>,
  };
  return (
    <svg className={className} width={size || 24} height={size || 24} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {paths[name]}
    </svg>
  );
}

/* ---------- Toast host ---------- */
function ToastHost({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <div className="ic"><Icon name={t.type === "success" ? "check" : "alert"} size={18} /></div>
          <div>
            <b>{t.title}</b>
            {t.sub ? <span>{t.sub}</span> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((type, title, sub) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, type, title, sub }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  return { toasts, push };
}

/* ---------- Modal ---------- */
function Modal({ title, onClose, children, width }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={width ? { maxWidth: width } : null} onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <h3>{title}</h3>
          <button className="icon-btn" style={{ background: "var(--surface-2)", borderColor: "var(--line)", color: "var(--ink-2)" }} onClick={onClose}>
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Field wrapper ---------- */
function Field({ label, required, hint, children, error }) {
  return (
    <div className="field">
      {label ? (
        <label className="field__label">
          {label}{required ? <span className="req">*</span> : null}
        </label>
      ) : null}
      {children}
      {hint ? <div className="field__hint">{hint}</div> : null}
      {error ? <div className="field__hint" style={{ color: "var(--red)", fontWeight: 600 }}>{error}</div> : null}
    </div>
  );
}

/* ---------- Generated placeholder flowmeter photo (demo capture) ----------
   Used when the user taps "simulate" — renders a realistic-looking meter board
   to a data URL so the prototype is testable without a real camera. */
function generateFlowmeterPhoto(readingLiters) {
  const c = document.createElement("canvas");
  c.width = 640; c.height = 420;
  const x = c.getContext("2d");
  // backdrop
  const g = x.createLinearGradient(0, 0, 0, 420);
  g.addColorStop(0, "#1a2730"); g.addColorStop(1, "#0c1318");
  x.fillStyle = g; x.fillRect(0, 0, 640, 420);
  // device body
  x.fillStyle = "#2b3a44"; roundRect(x, 70, 80, 500, 260, 18); x.fill();
  x.strokeStyle = "#46606e"; x.lineWidth = 3; roundRect(x, 70, 80, 500, 260, 18); x.stroke();
  // label
  x.fillStyle = "#7d97a6"; x.font = "bold 18px monospace";
  x.fillText("FLOW TOTALIZER  ·  LITER", 110, 130);
  // LCD
  x.fillStyle = "#0b1f12"; roundRect(x, 110, 150, 420, 110, 10); x.fill();
  x.strokeStyle = "#1e5236"; x.lineWidth = 2; roundRect(x, 110, 150, 420, 110, 10); x.stroke();
  // digits
  const reading = String(Math.round(readingLiters || (8000 + Math.random() * 4000))).padStart(7, "0");
  x.fillStyle = "#39e07a"; x.font = "bold 64px monospace"; x.textBaseline = "middle";
  x.shadowColor = "#39e07a"; x.shadowBlur = 14;
  x.fillText(reading, 140, 208);
  x.shadowBlur = 0;
  // unit
  x.fillStyle = "#2a7b4d"; x.font = "bold 22px monospace";
  x.fillText("L", 500, 212);
  // timestamp tag
  x.fillStyle = "rgba(255,255,255,0.65)"; x.font = "13px monospace";
  const now = new Date(window.TM.NOW());
  const ts = `${String(now.getDate()).padStart(2,"0")}/${String(now.getMonth()+1).padStart(2,"0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  x.fillText(ts, 110, 372);
  x.fillStyle = "#e0922f"; x.font = "bold 13px monospace";
  x.fillText("● REC", 500, 372);
  return c.toDataURL("image/jpeg", 0.85);
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* ---------- export to window ---------- */
Object.assign(window, {
  Icon, ToastHost, useToasts, Modal, Field,
  generateFlowmeterPhoto,
  useState, useEffect, useRef, useMemo, useCallback,
});
