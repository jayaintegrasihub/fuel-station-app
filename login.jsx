/* ============================================================
   Login screen
   ============================================================ */
function LoginScreen({ lang, setLang, onLogin }) {
  const t = (k) => window.TM.t(k, lang);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e && e.preventDefault();
    setError("");
    const user = window.TM.USERS.find(
      (u) => u.username === username.trim().toLowerCase() && u.password === password
    );
    if (!user) { setError(t("login.error")); return; }
    setLoading(true);
    setTimeout(() => { onLogin(user); }, 620);
  };

  const fillDemo = (role) => {
    setUsername(role);
    setPassword("1234");
    setError("");
  };

  return (
    <div className="login">
      {/* Brand pane (desktop) */}
      <div className="login__brandpane">
        <img className="login__logo" src="assets/telemetric-logo-white.png" alt="TELEMETRIC" />
        <div className="login__hero">
          <h2>{lang === "en"
            ? "Diesel fueling, logged precisely — from the field to the report."
            : "Pencatatan pengisian solar yang presisi — dari lapangan langsung ke laporan."}</h2>
          <p>{lang === "en"
            ? "Record every genset and heavy-equipment fueling with automatic totalizer, timestamp and flowmeter proof."
            : "Catat setiap pengisian genset dan alat berat dengan totalizer otomatis, jam tercatat, dan bukti foto flowmeter."}</p>
          <div className="login__features">
            <div className="login__feat"><span className="fi"><Icon name="gauge" size={18} /></span>{lang === "en" ? "Auto monthly totalizer per unit" : "Totalizer akumulasi bulanan per unit"}</div>
            <div className="login__feat"><span className="fi"><Icon name="camera" size={18} /></span>{lang === "en" ? "Flowmeter photo proof on every record" : "Bukti foto flowmeter di setiap catatan"}</div>
            <div className="login__feat"><span className="fi"><Icon name="download" size={18} /></span>{lang === "en" ? "Filtered history + Excel / PDF report" : "History berfilter + report Excel / PDF"}</div>
          </div>
        </div>
        <div className="login__foot">© 2026 TELEMETRIC · {t("app.station")}</div>
      </div>

      {/* Form pane */}
      <div className="login__formpane">
        <form className="login__card fade-up" onSubmit={submit}>
          <div className="login__mobilelogo">
            <img src="assets/telemetric-logo.png" alt="TELEMETRIC" />
          </div>
          <div className="flex-between" style={{ alignItems: "flex-start" }}>
            <div>
              <h1>{t("login.title")}</h1>
              <p className="sub">{t("login.subtitle")}</p>
            </div>
            <div className="lang-toggle" style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}>
              {["id", "en"].map((l) => (
                <button key={l} type="button" className={lang === l ? "active" : ""}
                  style={lang === l ? null : { color: "var(--ink-3)" }}
                  onClick={() => setLang(l)}>{l.toUpperCase()}</button>
              ))}
            </div>
          </div>

          {error ? (
            <div className="login__error"><Icon name="alert" size={16} />{error}</div>
          ) : null}

          <Field label={t("login.username")} required>
            <input className="input" value={username} autoCapitalize="none" autoComplete="username"
              onChange={(e) => setUsername(e.target.value)} placeholder="operator / supervisor" />
          </Field>

          <Field label={t("login.password")} required>
            <div className="input-pw">
              <input className="input" type={showPw ? "text" : "password"} value={password} autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)} placeholder="••••" />
              <button type="button" className="toggle" onClick={() => setShowPw((s) => !s)} aria-label="toggle">
                <Icon name={showPw ? "eyeOff" : "eye"} size={19} />
              </button>
            </div>
          </Field>

          <label className="checkbox" style={{ marginBottom: 18 }}>
            <input type="checkbox" defaultChecked /> {t("login.remember")}
          </label>

          <button className="btn btn--primary btn--block btn--lg" type="submit" disabled={loading}>
            {loading ? <Icon name="refresh" size={18} className="spin" /> : <Icon name="lock" size={18} />}
            {t("login.submit")}
          </button>

          <div className="login__demos">
            <div className="lbl">{t("login.demo")}</div>
            <div className="demo-row">
              <button type="button" className="demo-card" onClick={() => fillDemo("operator")}>
                <div className="row gap-sm" style={{ marginBottom: 2 }}>
                  <Icon name="user" size={15} style={{ color: "var(--blue)" }} />
                  <span className="role">{t("login.role.operator")}</span>
                </div>
                <div className="cred">operator · 1234</div>
              </button>
              <button type="button" className="demo-card" onClick={() => fillDemo("supervisor")}>
                <div className="row gap-sm" style={{ marginBottom: 2 }}>
                  <Icon name="shield" size={15} style={{ color: "var(--blue)" }} />
                  <span className="role">{t("login.role.supervisor")}</span>
                </div>
                <div className="cred">supervisor · 1234</div>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

window.LoginScreen = LoginScreen;
