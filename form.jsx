/* ============================================================
   Input form — fueling entry
   ============================================================ */
function InputForm({ lang, session, onSaved, pushToast, goHistory }) {
  const t = (k) => window.TM.t(k, lang);
  const [type, setType] = useState("genset");
  const [unitId, setUnitId] = useState("");
  const [fuelman, setFuelman] = useState("");
  const [user, setUser] = useState("");
  const [liters, setLiters] = useState("");
  const [photo, setPhoto] = useState(null);
  const [now, setNow] = useState(window.TM.NOW());
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  // live clock
  useEffect(() => {
    const iv = setInterval(() => setNow(window.TM.NOW()), 1000);
    return () => clearInterval(iv);
  }, []);

  const units = window.TM.UNITS[type];
  // reset unit when type changes
  useEffect(() => { setUnitId(""); }, [type]);

  const totalizer = useMemo(
    () => (unitId ? window.TM.monthTotalizer(unitId, window.TM.NOW()) : 0),
    [unitId, now]
  );
  const litersNum = Number(liters) || 0;
  const newTotalizer = totalizer + litersNum;

  const onPickFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto({ src: reader.result, name: file.name, sim: false });
    reader.readAsDataURL(file);
    setErrors((x) => ({ ...x, photo: null }));
  };

  const simulateCapture = () => {
    const guess = totalizer ? totalizer + litersNum + 1000 : null;
    const src = generateFlowmeterPhoto(guess);
    setPhoto({ src, name: "flowmeter_capture.jpg", sim: true });
    setErrors((x) => ({ ...x, photo: null }));
  };

  const reset = () => {
    setUnitId(""); setFuelman(""); setUser(""); setLiters(""); setPhoto(null); setErrors({});
  };

  const validate = () => {
    const e = {};
    if (!unitId) e.unitId = true;
    if (!fuelman.trim()) e.fuelman = true;
    if (!user.trim()) e.user = true;
    if (!litersNum || litersNum <= 0) e.liters = true;
    if (!photo) e.photo = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) {
      pushToast("error", t("form.required"));
      return;
    }
    setSaving(true);
    const unit = window.TM.UNITS[type].find((u) => u.id === unitId);
    const ts = window.TM.NOW();
    const rec = {
      id: "FL" + String(Date.now()).slice(-7),
      type, unitId, unitName: unit.name,
      fuelman: fuelman.trim(), user: user.trim(),
      liters: litersNum, ts, photo: photo.src,
    };
    setTimeout(() => {
      window.TM.addRecord(rec);
      onSaved();
      setSaving(false);
      pushToast("success", t("form.success"), `${unit.name} · ${window.TM.fmtNum(litersNum)} L`);
      reset();
    }, 700);
  };

  const TypeIcon = ({ which }) => <Icon name={which === "genset" ? "genset" : "excavator"} size={22} />;

  return (
    <div className="fade-up">
      <div className="page-head">
        <h1>{t("form.title")}</h1>
        <p>{t("form.subtitle")}</p>
      </div>

      <div style={{ display: "grid", gap: 18 }}>
        {/* TYPE + UNIT */}
        <div className="card">
          <div className="card__head"><Icon name="layers" size={18} style={{ color: "var(--blue)" }} /><h2>{t("form.type")}</h2></div>
          <div className="card__body">
            <div className="seg" style={{ marginBottom: 18 }}>
              {["genset", "alatberat"].map((tp) => (
                <button key={tp} type="button" className={`seg__opt ${type === tp ? "active" : ""}`} onClick={() => setType(tp)}>
                  <span className="ic"><TypeIcon which={tp} /></span>
                  <span className="tx">
                    <b>{t(`form.type.${tp}`)}</b>
                    <span>{tp === "genset" ? `${window.TM.UNITS.genset.length} unit` : `${window.TM.UNITS.alatberat.length} unit`}</span>
                  </span>
                </button>
              ))}
            </div>
            <Field label={t("form.unit")} required error={errors.unitId ? t("form.required") : null}>
              <select className={`select ${errors.unitId ? "invalid" : ""}`} value={unitId}
                onChange={(e) => { setUnitId(e.target.value); setErrors((x) => ({ ...x, unitId: null })); }}>
                <option value="">{t("form.unit.placeholder")}</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} — {u.spec}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        {/* TOTALIZER readout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }} className="totalizer-grid">
          <div className="readout">
            <div className="readout__label">{t("form.totalizer")}{unitId ? ` · ${window.TM.UNITS[type].find(u=>u.id===unitId).name}` : ""}</div>
            <div className="readout__value">{window.TM.fmtNum(totalizer)} <span className="u">L</span></div>
            <div className="readout__sub">{t("form.totalizer.hint")}</div>
          </div>
          <div className="readout readout--live amber">
            <div className="readout__label">{t("form.newTotalizer")}</div>
            <div className="readout__value">{window.TM.fmtNum(newTotalizer)} <span className="u">L</span></div>
            <div className="readout__sub">{window.TM.fmtNum(totalizer)} + {window.TM.fmtNum(litersNum)} L</div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="card">
          <div className="card__head"><Icon name="user" size={18} style={{ color: "var(--blue)" }} /><h2>{lang === "en" ? "Fueling Details" : "Detail Pengisian"}</h2></div>
          <div className="card__body">
            <div className="field-row cols-2">
              <Field label={t("form.fuelman")} required error={errors.fuelman ? " " : null}>
                <input className={`input ${errors.fuelman ? "invalid" : ""}`} value={fuelman} list="fuelman-list"
                  placeholder={t("form.fuelman.placeholder")}
                  onChange={(e) => { setFuelman(e.target.value); setErrors((x) => ({ ...x, fuelman: null })); }} />
                <datalist id="fuelman-list">
                  {window.TM.FUELMEN.map((f) => <option key={f} value={f} />)}
                </datalist>
              </Field>
              <Field label={t("form.user")} required error={errors.user ? " " : null}>
                <input className={`input ${errors.user ? "invalid" : ""}`} value={user} list="user-list"
                  placeholder={t("form.user.placeholder")}
                  onChange={(e) => { setUser(e.target.value); setErrors((x) => ({ ...x, user: null })); }} />
                <datalist id="user-list">
                  {window.TM.OPERATORS.map((f) => <option key={f} value={f} />)}
                </datalist>
              </Field>
            </div>

            <div className="field-row cols-2">
              <Field label={`${t("form.totalFueling")}${unitId ? " · " + window.TM.UNITS[type].find(u=>u.id===unitId).name : ""}`} required error={errors.liters ? " " : null}>
                <div className="input-suffix">
                  <input className={`input input--num ${errors.liters ? "invalid" : ""}`} inputMode="numeric" value={liters}
                    placeholder={t("form.totalFueling.placeholder")}
                    onChange={(e) => { setLiters(e.target.value.replace(/[^0-9.]/g, "")); setErrors((x) => ({ ...x, liters: null })); }} />
                  <span className="suffix">{t("form.liters")}</span>
                </div>
              </Field>
              <Field label={t("form.time")} hint={t("form.time.auto")}>
                <div className="input" style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--surface-2)", color: "var(--ink)", fontFamily: "var(--mono)", fontWeight: 600 }}>
                  <Icon name="clock" size={18} style={{ color: "var(--blue)" }} />
                  {window.TM.fmtTime(now)}
                  <span style={{ fontFamily: "var(--sans)", fontWeight: 500, color: "var(--ink-3)", fontSize: 13 }}>· {window.TM.fmtDate(now, lang)}</span>
                </div>
              </Field>
            </div>
          </div>
        </div>

        {/* PHOTO */}
        <div className="card">
          <div className="card__head"><Icon name="camera" size={18} style={{ color: "var(--blue)" }} /><h2>{t("form.photo")} <span className="req" style={{ color: "var(--red)" }}>*</span></h2></div>
          <div className="card__body">
            <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={onPickFile} />
            {photo ? (
              <div className="photo-preview">
                <img src={photo.src} alt="flowmeter" />
                <div className="badge"><span className="dot"></span>{photo.sim ? (lang === "en" ? "Simulated capture" : "Capture simulasi") : (lang === "en" ? "Captured" : "Terambil")} · {window.TM.fmtTime(now)}</div>
                <button type="button" className="retake" onClick={() => { setPhoto(null); }}>
                  <Icon name="refresh" size={15} />{t("form.photo.retake")}
                </button>
              </div>
            ) : (
              <div className={`photo-zone ${errors.photo ? "invalid" : ""}`} style={errors.photo ? { borderColor: "var(--red)" } : null} onClick={() => fileRef.current.click()}>
                <div className="cam"><Icon name="camera" size={26} /></div>
                <b>{t("form.photo.capture")}</b>
                <span>{t("form.photo.hint")}</span>
                <div className="row" style={{ justifyContent: "center", marginTop: 14, gap: 10 }}>
                  <button type="button" className="btn btn--primary btn--sm" onClick={(e) => { e.stopPropagation(); fileRef.current.click(); }}>
                    <Icon name="camera" size={16} />{t("form.photo.capture")}
                  </button>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={(e) => { e.stopPropagation(); simulateCapture(); }}>
                    <Icon name="image" size={16} />{lang === "en" ? "Simulate" : "Simulasi"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="row" style={{ gap: 12 }}>
          <button className="btn btn--ghost" type="button" onClick={reset}>
            <Icon name="refresh" size={17} />{t("form.reset")}
          </button>
          <button className="btn btn--primary" style={{ flex: 1 }} type="button" onClick={submit} disabled={saving}>
            {saving ? <Icon name="refresh" size={18} className="spin" /> : <Icon name="check" size={18} />}
            {t("form.submit")}
          </button>
        </div>
      </div>

      <style>{`
        @media (min-width: 640px){ .totalizer-grid{ grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </div>
  );
}

window.InputForm = InputForm;
