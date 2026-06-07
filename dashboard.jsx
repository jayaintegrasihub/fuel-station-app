/* ============================================================
   Supervisor dashboard — monthly overview
   ============================================================ */
function Dashboard({ lang, records, goHistory, goInput, canInput }) {
  const t = (k) => window.TM.t(k, lang);
  const NOW = window.TM.NOW();
  const d = new Date(NOW);
  const monthStartTs = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
  const todayStartTs = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

  const monthRecs = records.filter((r) => r.ts >= monthStartTs && r.ts <= NOW);
  const totalMonth = monthRecs.reduce((s, r) => s + Number(r.liters || 0), 0);
  const totalToday = records.filter((r) => r.ts >= todayStartTs).reduce((s, r) => s + Number(r.liters || 0), 0);
  const activeUnits = new Set(monthRecs.map((r) => r.unitId)).size;

  const monthName = window.TM.fmtDate(NOW, lang).split(" ").slice(1).join(" ");

  // consumption per unit this month
  const allUnits = [...window.TM.UNITS.genset, ...window.TM.UNITS.alatberat];
  const perUnit = allUnits.map((u) => {
    const total = monthRecs.filter((r) => r.unitId === u.id).reduce((s, r) => s + Number(r.liters || 0), 0);
    const type = window.TM.UNITS.genset.find((g) => g.id === u.id) ? "genset" : "alatberat";
    return { ...u, total, type };
  }).filter((u) => u.total > 0).sort((a, b) => b.total - a.total);
  const maxUnit = Math.max(1, ...perUnit.map((u) => u.total));

  const recent = records.slice(0, 6);
  const typePill = (tp) => (
    <span className={`pill pill--${tp}`}><span className="dot"></span>{tp === "genset" ? "Genset" : (lang === "en" ? "Heavy Eq." : "Alat Berat")}</span>
  );

  return (
    <div className="fade-up">
      <div className="page-head flex-between" style={{ alignItems: "flex-end" }}>
        <div><h1>{t("dash.title")}</h1><p>{t("dash.subtitle")} · {monthName}</p></div>
        {canInput ? (
          <button className="btn btn--primary btn--sm desktop-only" onClick={goInput}><Icon name="plus" size={16} />{t("nav.input")}</button>
        ) : null}
      </div>

      {/* Stats */}
      <div className="stats" style={{ marginBottom: 18 }}>
        <div className="stat">
          <div className="stat__label"><span className="si si--blue"><Icon name="drop" size={16} /></span>{t("dash.totalMonth")}</div>
          <div className="stat__value">{window.TM.fmtNum(totalMonth)}<span className="u">L</span></div>
          <div className="stat__delta">{monthRecs.length} {t("hist.records")} · {monthName}</div>
        </div>
        <div className="stat">
          <div className="stat__label"><span className="si si--amber"><Icon name="clock" size={16} /></span>{t("dash.totalToday")}</div>
          <div className="stat__value">{window.TM.fmtNum(totalToday)}<span className="u">L</span></div>
          <div className="stat__delta">{window.TM.fmtDate(NOW, lang)}</div>
        </div>
        <div className="stat">
          <div className="stat__label"><span className="si si--green"><Icon name="fuel" size={16} /></span>{t("dash.fills")}</div>
          <div className="stat__value">{monthRecs.length}</div>
          <div className="stat__delta">{lang === "en" ? "this month" : "bulan ini"}</div>
        </div>
        <div className="stat">
          <div className="stat__label"><span className="si si--navy"><Icon name="layers" size={16} /></span>{t("dash.units")}</div>
          <div className="stat__value">{activeUnits}<span className="u">/{allUnits.length}</span></div>
          <div className="stat__delta">{lang === "en" ? "units fueled" : "unit terisi"}</div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 18, gridTemplateColumns: "1fr" }} className="dash-grid">
        {/* Consumption per unit */}
        <div className="card">
          <div className="card__head"><Icon name="dashboard" size={18} style={{ color: "var(--blue)" }} /><h2>{t("dash.byUnit")}</h2></div>
          <div className="card__body">
            <div className="barlist">
              {perUnit.map((u) => (
                <div key={u.id} className="barrow">
                  <div className="barrow__top">
                    <div className="barrow__name">
                      <Icon name={u.type === "genset" ? "genset" : "excavator"} size={16} style={{ color: u.type === "genset" ? "var(--blue)" : "var(--amber)" }} />
                      {u.name}
                    </div>
                    <div className="barrow__val">{window.TM.fmtNum(u.total)} L</div>
                  </div>
                  <div className="barrow__track">
                    <div className={`barrow__fill ${u.type}`} style={{ width: `${(u.total / maxUnit) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent */}
        <div className="card">
          <div className="card__head flex-between">
            <div className="row gap-sm"><Icon name="history" size={18} style={{ color: "var(--blue)" }} /><h2>{t("dash.recent")}</h2></div>
            <button className="btn btn--ghost btn--sm" onClick={goHistory}>{t("dash.viewAll")}</button>
          </div>
          <div className="card__body" style={{ padding: 0 }}>
            <div className="recent-list">
              {recent.map((r) => (
                <div key={r.id} className="recent-item" onClick={goHistory}>
                  <div className="recent-item__ic" style={{ color: r.type === "genset" ? "var(--blue)" : "var(--amber)", background: r.type === "genset" ? "var(--blue-50)" : "var(--amber-bg)" }}>
                    <Icon name={r.type === "genset" ? "genset" : "excavator"} size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{r.unitName}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{window.TM.fmtDateTime(r.ts, lang)} · {r.fuelman}</div>
                  </div>
                  <div style={{ fontFamily: "var(--mono)", fontWeight: 600, fontSize: 15 }}>{window.TM.fmtNum(r.liters)} <span className="muted" style={{ fontSize: 12, fontWeight: 400 }}>L</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 980px){ .dash-grid{ grid-template-columns: 1.15fr 1fr !important; } }
        .recent-list{ display:flex; flex-direction:column; }
        .recent-item{ display:flex; align-items:center; gap:12px; padding:13px 20px; border-bottom:1px solid var(--line-2); cursor:pointer; transition: background .12s; }
        .recent-item:last-child{ border-bottom:0; }
        .recent-item:hover{ background: var(--surface-2); }
        .recent-item__ic{ width:38px; height:38px; border-radius:9px; display:grid; place-items:center; flex:none; }
      `}</style>
    </div>
  );
}

window.Dashboard = Dashboard;
