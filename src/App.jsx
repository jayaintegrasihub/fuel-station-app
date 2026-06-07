import { useState, useMemo } from 'react'
import { t, getLang, setLang as saveLang, getSession, setSession as saveSession, getRecords } from './lib/data'
import { useToasts } from './hooks/useToasts'
import Icon from './components/Icon'
import ToastHost from './components/Toast'
import Login from './components/Login'
import InputForm from './components/InputForm'
import HistoryScreen from './components/History'
import Dashboard from './components/Dashboard'

function defaultTabFor(session) {
  if (!session) return null
  return session.role === 'supervisor' ? 'dashboard' : 'input'
}

export default function App() {
  const [lang, setLangState] = useState(getLang())
  const [session, setSession] = useState(getSession())
  const [records, setRecords] = useState(getRecords())
  const [tab, setTab] = useState(() => defaultTabFor(getSession()))
  const { toasts, push } = useToasts()

  const setLang = (l) => { setLangState(l); saveLang(l) }

  const refreshRecords = () => setRecords(getRecords())

  const tabs = useMemo(() => {
    if (!session) return []
    if (session.role === 'supervisor') {
      return [
        { id: 'dashboard', icon: 'dashboard', label: t('nav.dashboard', lang) },
        { id: 'history', icon: 'history', label: t('nav.history', lang) },
      ]
    }
    return [{ id: 'input', icon: 'fuel', label: t('nav.input', lang) }]
  }, [session, lang])

  const login = (user) => {
    const sess = { username: user.username, role: user.role, name: user.name }
    saveSession(sess); setSession(sess); setTab(defaultTabFor(sess))
  }
  const logout = () => {
    saveSession(null); setSession(null); setTab(null)
  }

  if (!session) {
    return (
      <>
        <Login lang={lang} setLang={setLang} onLogin={login} />
        <ToastHost toasts={toasts} />
      </>
    )
  }

  const initials = session.name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase()
  const canInput = session.role === 'operator'
  const activeId = tabs.some((tb) => tb.id === tab) ? tab : (tabs[0] ? tabs[0].id : null)

  return (
    <div className="min-h-screen flex flex-col bg-page">
      {/* Header */}
      <header
        className="sticky top-0 z-40 h-[60px] bg-navy text-white flex items-center gap-3.5 px-4"
        style={{ boxShadow: '0 1px 0 rgba(255,255,255,0.06), 0 2px 12px rgba(0,0,0,0.18)' }}
      >
        <img className="h-[22px] w-auto block" src="/assets/telemetric-logo-white.png" alt="TELEMETRIC" />
        <div className="w-px h-[26px] bg-white/[0.14]" />
        <div className="text-[11px] text-[#9fb3c4] tracking-[0.3px] whitespace-nowrap overflow-hidden text-ellipsis">
          {t('app.station', lang)}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <div className="inline-flex bg-white/[0.08] border border-white/[0.14] rounded-full p-[2px] gap-[2px]">
            {['id', 'en'].map((l) => (
              <button
                key={l}
                className={`text-[11px] font-bold tracking-[0.5px] px-2.5 py-1 rounded-full transition-all ${lang === l ? 'bg-blue text-white' : 'text-[#b9c8d6]'}`}
                onClick={() => setLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* User chip */}
          <div className="flex items-center gap-2.5 py-1 pr-1.5 pl-1 rounded-full border border-white/[0.12] bg-white/[0.05]">
            <div
              className="w-[30px] h-[30px] rounded-full grid place-items-center text-[12px] font-bold text-white flex-none"
              style={{ background: 'linear-gradient(135deg, #2f80c2, #1f5f96)' }}
            >
              {initials}
            </div>
            <div className="hidden sm:block leading-[1.15]">
              <div className="text-[12.5px] font-semibold text-white">{session.name}</div>
              <div className="text-[10px] text-[#8fa6b8] uppercase tracking-[0.6px]">{t(`login.role.${session.role}`, lang)}</div>
            </div>
          </div>

          {/* Logout */}
          <button
            className="w-[34px] h-[34px] grid place-items-center rounded-sm border border-white/[0.14] bg-white/[0.05] text-[#cdd9e3] transition-all hover:bg-white/[0.12] hover:text-white"
            onClick={logout}
            title={t('logout', lang)}
            aria-label={t('logout', lang)}
          >
            <Icon name="logout" size={17} />
          </button>
        </div>
      </header>

      {/* Desktop top tabs */}
      {tabs.length > 1 && (
        <nav className="hidden lg:block bg-navy-2 px-4 shadow-sm">
          <div className="flex gap-1 max-w-[1180px] mx-auto w-full">
            {tabs.map((tb) => (
              <button
                key={tb.id}
                className={`flex items-center gap-2 text-[13.5px] font-semibold px-[18px] py-[13px] border-b-[3px] transition-all duration-150 ${
                  activeId === tb.id
                    ? 'text-white border-blue'
                    : 'text-[#9fb3c4] border-transparent hover:text-[#e3edf4]'
                }`}
                onClick={() => setTab(tb.id)}
              >
                <Icon name={tb.icon} size={17} />{tb.label}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Main content */}
      <main className="flex-1 w-full max-w-[1180px] mx-auto px-5 py-[22px] pb-[92px] lg:px-7 lg:py-7 lg:pb-10">
        {activeId === 'input' && canInput && (
          <InputForm
            lang={lang}
            session={session}
            pushToast={push}
            onSaved={refreshRecords}
          />
        )}
        {activeId === 'history' && (
          <HistoryScreen lang={lang} session={session} records={records} />
        )}
        {activeId === 'dashboard' && (
          <Dashboard
            lang={lang}
            records={records}
            canInput={canInput}
            goHistory={() => setTab('history')}
            goInput={() => setTab('input')}
          />
        )}
      </main>

      {/* Mobile bottom tabbar */}
      {tabs.length > 1 && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-40 h-[64px] bg-surface border-t border-line flex lg:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)', boxShadow: '0 -2px 12px rgba(14,34,51,0.06)' }}
        >
          {tabs.map((tb) => (
            <button
              key={tb.id}
              className={`flex-1 flex flex-col items-center justify-center gap-[3px] text-[10.5px] font-semibold transition-colors duration-150 ${
                activeId === tb.id ? 'text-blue' : 'text-ink-3'
              }`}
              onClick={() => setTab(tb.id)}
            >
              <Icon name={tb.icon} size={22} strokeWidth={activeId === tb.id ? 2.4 : 2} />
              {tb.label}
            </button>
          ))}
        </nav>
      )}

      <ToastHost toasts={toasts} />
    </div>
  )
}
