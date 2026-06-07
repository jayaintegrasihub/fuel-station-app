/* ============================================================
   History screen — filters + report download
   ============================================================ */
function HistoryScreen({ lang, session, records }) {
  const t = (k) => window.TM.t(k, lang);
  const NOW = window.TM.NOW();

  const monthStartTs = (() => { const d = new Date(NOW); return new Date(d.getFullYear(), d.getMonth(), 1).getTime(); })();
  const todayStartTs = (() => { const d = new Date(NOW); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); })();

  const [quick, setQuick] = useState("month");
  const [type, setType] = useState("all");
  const [unitId, setUnitId] = useState("all");
  const [from, setFrom] = useState(window.TM.isoDate(monthStartTs));
  const [to, setTo] = useState(window.TM.isoDate(NOW));
  const [detail, setDetail] = useState(null);
  const [photoView, setPhotoView] = useState(null);

  const applyQuick = (q) => {
    setQuick(q);
    if (q === "today") { setFrom(window.TM.isoDate(todayStartTs)); setTo(window.TM.isoDate(NOW)); }
    else if (q === "week") { setFrom(window.TM.isoDate(NOW - 6 * 864e5)); setTo(window.TM.isoDate(NOW)); }
    else if (q === "month") { setFrom(window.TM.isoDate(monthStartTs)); setTo(window.TM.isoDate(NOW)); }
  };

  const resetFilters = () => {
    setType("all"); setUnitId("all"); applyQuick("month");
  };

  const allUnits = [...window.TM.UNITS.genset, ...window.TM.UNITS.alatberat];
  const unitOptions = type === "all" ? allUnits : window.TM.UNITS[type] || allUnits;

  const filtered = useMemo(() => {
    const fromTs = from ? new Date(from + "T00:00:00").getTime() : 0;
    const toTs = to ? new Date(to + "T23:59:59").getTime() : Infinity;
    return records.filter((r) => {
      if (type !== "all" && r.type !== type) return false;
      if (unitId !== "all" && r.unitId !== unitId) return false;
      if (r.ts < fromTs || r.ts > toTs) return false;
      return true;
    });
  }, [records, type, unitId, from, to]);

  const totalVol = filtered.reduce((s, r) => s + Number(r.liters || 0), 0);

  // when changing date inputs manually, clear quick highlight
  const onFrom = (v) => { setFrom(v); setQuick(""); };
  const onTo = (v) => { setTo(v); setQuick(""); };

  const reportMeta = {
    station: window.TM.t("app.station", lang),
    range: `${window.TM.fmtDate(new Date(from).getTime(), lang)} – ${window.TM.fmtDate(new Date(to).getTime(), lang)}`,
    by: session.name,
  };

  const typePill = (tp) => (
    <span className={`pill pill--${tp}`}><span className="dot"></span>{tp === "genset" ? "Genset" : (lang === "en" ? "Heavy Eq." : "Alat Berat")}</span>
  );

  return (
    <div className="fade-up">
      <div className="page-head"><h1>{t("hist.title")}</h1><p>{t("hist.subtitle")}</p></div>

      {/* Filters */}
      <div className="filters">
        <div className="quick-chips">
          {["today", "week", "month"].map((q) => (
            <button key={q} className={`chip ${quick === q ? "active" : ""}`} onClick={() => applyQuick(q)}>{t(`hist.quick.${q}`)}</button>
          ))}
          <button className="chip" onClick={resetFilters} style={{ marginLeft: "auto" }}>
            <Icon name="refresh" size={14} style={{ marginRight: 4, verticalAlign: "-2px" }} />{t("hist.filter.reset")}
          </button>
        </div>
        <div className="filter-grid">
          <Field label={t("hist.filter.type")}>
            <select className="select" value={type} onChange={(e) => { setType(e.target.value); setUnitId("all"); }}>
              <option value="all">{t("hist.filter.all")}</option>
              <option value="genset">Genset</option>
              <option value="alatberat">{lang === "en" ? "Heavy Equipment" : "Alat Berat"}</option>
            </select>
          </Field>
          <Field label={t("hist.filter.unit")}>
            <select className="select" value={unitId} onChange={(e) => setUnitId(e.target.value)}>
              <option value="all">{t("hist.filter.all")}</option>
              {unitOptions.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </Field>
          <Field label={t("hist.filter.from")}>
            <input type="date" className="input" value={from} max={to} onChange={(e) => onFrom(e.target.value)} />
          </Field>
          <Field label={t("hist.filter.to")}>
            <input type="date" className="input" value={to} min={from} onChange={(e) => onTo(e.target.value)} />
          </Field>
        </div>
      </div>

      {/* Toolbar: summary + download */}
      <div className="hist-toolbar">
        <div className="hist-summary">
          <div className="hs"><b>{filtered.length}</b> {t("hist.records")}</div>
          <div className="hs">{t("hist.totalvol")}: <b>{window.TM.fmtNum(totalVol)}</b> L</div>
        </div>
        <div className="hist-actions">
          <button className="btn btn--ghost btn--sm" disabled={!filtered.length}
            onClick={() => window.TM.downloadCSV(filtered, lang)}>
            <Icon name="excel" size={16} style={{ color: "var(--green)" }} />{t("hist.download.excel")}
          </button>
          <button className="btn btn--navy btn--sm" disabled={!filtered.length}
            onClick={() => window.TM.exportPDF(filtered, lang, reportMeta)}>
            <Icon name="pdf" size={16} />{t("hist.download.pdf")}
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card"><div className="empty"><Icon name="search" /><p>{t("hist.empty")}</p></div></div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="table-wrap desktop-only">
            <table className="data">
              <thead>
                <tr>
                  <th>{t("hist.col.time")}</th>
                  <th>{t("hist.col.unit")}</th>
                  <th>{t("hist.col.fuelman")}</th>
                  <th>{t("hist.col.user")}</th>
                  <th className="num">{t("hist.col.volume")}</th>
                  <th className="num">{t("hist.col.totalizer")}</th>
                  <th style={{ width: 60 }}>{t("hist.col.photo")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} onClick={() => setDetail(r)}>
                    <td className="cell-time"><b>{window.TM.fmtTime(r.ts)}</b><span>{window.TM.fmtDate(r.ts, lang)}</span></td>
                    <td><div style={{ fontWeight: 600, marginBottom: 4 }}>{r.unitName}</div>{typePill(r.type)}</td>
                    <td>{r.fuelman}</td>
                    <td>{r.user}</td>
                    <td className="num cell-mono">{window.TM.fmtNum(r.liters)} <span className="muted" style={{ fontWeight: 400 }}>L</span></td>
                    <td className="num cell-mono muted">{window.TM.fmtNum(window.TM.monthTotalizer(r.unitId, r.ts))}</td>
                    <td onClick={(e) => { e.stopPropagation(); if (r.photo) setPhotoView(r); }}>
                      <button className="thumb-btn">
                        {r.photo ? <img src={r.photo} alt="" /> : <Icon name="image" size={15} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="hist-cards">
            {filtered.map((r) => (
              <div key={r.id} className="hcard" onClick={() => setDetail(r)}>
                <div className="hcard__top">
                  <div>
                    <div className="hcard__unit">{r.unitName}</div>
                    <div className="hcard__time">{window.TM.fmtDateTime(r.ts, lang)}</div>
                    <div style={{ marginTop: 6 }}>{typePill(r.type)}</div>
                  </div>
                  <div className="hcard__vol"><b>{window.TM.fmtNum(r.liters)}</b><br /><span>{t("form.liters")}</span></div>
                </div>
                <div className="hcard__grid">
                  <div className="hcard__cell"><div className="k">{t("hist.col.fuelman")}</div><div className="v">{r.fuelman}</div></div>
                  <div className="hcard__cell"><div className="k">{t("hist.col.user")}</div><div className="v">{r.user}</div></div>
                  <div className="hcard__cell"><div className="k">{t("hist.col.totalizer")}</div><div className="v mono">{window.TM.fmtNum(window.TM.monthTotalizer(r.unitId, r.ts))} L</div></div>
                  <div className="hcard__cell"><div className="k">{t("hist.col.photo")}</div>
                    <div className="v">
                      {r.photo
                        ? <button className="btn btn--ghost btn--sm" style={{ height: 30, padding: "0 10px", fontSize: 12 }} onClick={(e) => { e.stopPropagation(); setPhotoView(r); }}><Icon name="eye" size={14} />{t("common.viewPhoto")}</button>
                        : <span className="muted" style={{ fontWeight: 400 }}>—</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Detail modal */}
      {detail ? (
        <Modal title={t("hist.detail")} onClose={() => setDetail(null)}>
          <div className="flex-between">
            <div>
              <div style={{ fontSize: 19, fontWeight: 700 }}>{detail.unitName}</div>
              <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{detail.id}</div>
            </div>
            {typePill(detail.type)}
          </div>
          <div className="dl">
            <div className="dl__item"><div className="k">{t("hist.col.time")}</div><div className="v">{window.TM.fmtDateTime(detail.ts, lang)}</div></div>
            <div className="dl__item"><div className="k">{t("hist.col.volume")}</div><div className="v mono">{window.TM.fmtNum(detail.liters)} L</div></div>
            <div className="dl__item"><div className="k">{t("hist.col.fuelman")}</div><div className="v">{detail.fuelman}</div></div>
            <div className="dl__item"><div className="k">{t("hist.col.user")}</div><div className="v">{detail.user}</div></div>
            <div className="dl__item"><div className="k">{t("form.totalizer")}</div><div className="v mono">{window.TM.fmtNum(window.TM.monthTotalizer(detail.unitId, detail.ts))} L</div></div>
          </div>
          <div style={{ marginTop: 18 }}>
            <div className="k" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px", color: "var(--ink-3)", fontWeight: 600, marginBottom: 8 }}>{t("form.photo")}</div>
            {detail.photo
              ? <img className="modal__img" src={detail.photo} alt="flowmeter" />
              : <div className="photo-zone" style={{ cursor: "default" }}><div className="cam"><Icon name="image" size={24} /></div><span>{lang === "en" ? "No photo (seed data)" : "Tidak ada foto (data contoh)"}</span></div>}
          </div>
        </Modal>
      ) : null}

      {/* Photo viewer */}
      {photoView ? (
        <Modal title={`${t("form.photo")} · ${photoView.unitName}`} onClose={() => setPhotoView(null)} width={560}>
          {photoView.photo
            ? <img className="modal__img" src={photoView.photo} alt="flowmeter" />
            : <div className="muted">{lang === "en" ? "No photo available." : "Foto tidak tersedia."}</div>}
          <div className="muted" style={{ fontSize: 12.5, marginTop: 12, textAlign: "center" }}>{window.TM.fmtDateTime(photoView.ts, lang)} · {photoView.fuelman}</div>
        </Modal>
      ) : null}
    </div>
  );
}

window.HistoryScreen = HistoryScreen;
