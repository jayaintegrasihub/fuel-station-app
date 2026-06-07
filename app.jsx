/* ============================================================
   App shell — auth, nav, language, routing
   ============================================================ */
function defaultTabFor(session) {
  if (!session) return null;
  return session.role === "supervisor" ? "dashboard" : "input";
}

function App() {
  const [lang, setLangState] = useState(window.TM.getLang());
  const [session, setSession] = useState(window.TM.getSession());
  const [records, setRecords] = useState(window.TM.getRecords());
  const [tab, setTab] = useState(() => defaultTabFor(window.TM.getSession()));
  const { toasts, push } = useToasts();

  const setLang = (l) => { setLangState(l); window.TM.setLang(l); };
  const t = (k) => window.TM.t(k, lang);

  const refreshRecords = () => setRecords(window.TM.getRecords());

  // tabs per role
  const tabs = useMemo(() => {
    if (!session) return [];
    if (session.role === "supervisor") {
      return [
        { id: "dashboard", icon: "dashboard", label: t("nav.dashboard") },
        { id: "history", icon: "history", label: t("nav.history") },
      ];
    }
    return [
      { id: "input", icon: "fuel", label: t("nav.input") },
    ];
  }, [session, lang]);

  const login = (user) => {
    const sess = { username: user.username, role: user.role, name: user.name };
    window.TM.setSession(sess);
    setSession(sess);
    setTab(defaultTabFor(sess));
  };
  const logout = () => {
    window.TM.setSession(null);
    setSession(null);
    setTab(null);
  };

  if (!session) {
    return (
      <>
        <LoginScreen lang={lang} setLang={setLang} onLogin={login} />
        <ToastHost toasts={toasts} />
      </>
    );
  }

  const initials = session.name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  const canInput = session.role === "operator";

  // Safe active tab: always falls back to the first available tab so the
  // content area can never render blank (e.g. if `tab` is stale or null).
  const activeId = tabs.some((tb) => tb.id === tab) ? tab : (tabs[0] ? tabs[0].id : null);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <img className="header__logo" src="assets/telemetric-logo-white.png" alt="TELEMETRIC" />
        <div className="header__divider"></div>
        <div className="header__station">{t("app.station")}</div>
        <div className="header__spacer"></div>
        <div className="header__right">
          <div className="lang-toggle">
            {["id", "en"].map((l) => (
              <button key={l} className={lang === l ? "active" : ""} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
          <div className="user-chip">
            <div className="user-chip__avatar">{initials}</div>
            <div className="user-chip__meta">
              <div className="user-chip__name">{session.name}</div>
              <div className="user-chip__role">{t(`login.role.${session.role}`)}</div>
            </div>
          </div>
          <button className="icon-btn" onClick={logout} title={t("logout")} aria-label={t("logout")}>
            <Icon name="logout" size={17} />
          </button>
        </div>
      </header>

      {/* Desktop top tabs (only when there's more than one section) */}
      {tabs.length > 1 ? (
      <nav className="toptabs">
        <div className="toptabs__inner">
          {tabs.map((tb) => (
            <button key={tb.id} className={`toptab ${activeId === tb.id ? "active" : ""}`} onClick={() => setTab(tb.id)}>
              <Icon name={tb.icon} size={17} />{tb.label}
            </button>
          ))}
        </div>
      </nav>
      ) : null}

      {/* Main */}
      <main className="app-main">
        {activeId === "input" && canInput && (
          <InputForm lang={lang} session={session} pushToast={push}
            onSaved={refreshRecords} goHistory={() => setTab("history")} />
        )}
        {activeId === "history" && (
          <HistoryScreen lang={lang} session={session} records={records} />
        )}
        {activeId === "dashboard" && (
          <Dashboard lang={lang} records={records} canInput={canInput}
            goHistory={() => setTab("history")} goInput={() => setTab("input")} />
        )}
      </main>

      {/* Mobile bottom tabbar (only when there's more than one section) */}
      {tabs.length > 1 ? (
      <nav className="tabbar">
        {tabs.map((tb) => (
          <button key={tb.id} className={`tabbar__item ${activeId === tb.id ? "active" : ""}`} onClick={() => setTab(tb.id)}>
            <Icon name={tb.icon} size={22} />{tb.label}
          </button>
        ))}
      </nav>
      ) : null}

      <ToastHost toasts={toasts} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
