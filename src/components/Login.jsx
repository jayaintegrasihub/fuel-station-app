import { useState } from 'react'
import { USERS, t } from '../lib/data'
import Icon from './Icon'
import Field from './Field'

export default function Login({ lang, setLang, onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = (e) => {
    e && e.preventDefault()
    setError('')
    const user = USERS.find(
      (u) => u.username === username.trim().toLowerCase() && u.password === password
    )
    if (!user) { setError(t('login.error', lang)); return }
    setLoading(true)
    setTimeout(() => onLogin(user), 620)
  }

  const fillDemo = (role) => { setUsername(role); setPassword('1234'); setError('') }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] bg-navy">
      {/* Brand pane */}
      <div className="hidden lg:flex flex-col justify-between p-14 relative overflow-hidden login-brandpane">
        <div className="relative z-10">
          <img className="h-8 w-auto object-contain" src="/assets/telemetric-logo-white.png" alt="TELEMETRIC" />
        </div>
        <div className="relative z-10">
          <h2 className="text-white text-[34px] leading-[1.18] font-bold m-0 mb-3.5 tracking-[-0.4px] max-w-[460px]">
            {lang === 'en'
              ? 'Diesel fueling, logged precisely — from the field to the report.'
              : 'Pencatatan pengisian solar yang presisi — dari lapangan langsung ke laporan.'}
          </h2>
          <p className="text-[#9fb3c4] text-[15px] leading-relaxed max-w-[400px] m-0">
            {lang === 'en'
              ? 'Record every genset and heavy-equipment fueling with automatic totalizer, timestamp and flowmeter proof.'
              : 'Catat setiap pengisian genset dan alat berat dengan totalizer otomatis, jam tercatat, dan bukti foto flowmeter.'}
          </p>
          <div className="flex flex-col gap-3.5 mt-[30px]">
            {[
              { icon: 'gauge', en: 'Auto monthly totalizer per unit', id: 'Totalizer akumulasi bulanan per unit' },
              { icon: 'camera', en: 'Flowmeter photo proof on every record', id: 'Bukti foto flowmeter di setiap catatan' },
              { icon: 'download', en: 'Filtered history + Excel / PDF report', id: 'History berfilter + report Excel / PDF' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-[#cdd9e3] text-[13.5px]">
                <span className="w-9 h-9 flex-none rounded-[9px] grid place-items-center text-blue"
                  style={{ background: 'rgba(47,128,194,0.18)', border: '1px solid rgba(47,128,194,0.3)' }}>
                  <Icon name={f.icon} size={18} />
                </span>
                {lang === 'en' ? f.en : f.id}
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-[#5f7689] text-[12px]">
          © 2026 TELEMETRIC · {t('app.station', lang)}
        </div>
      </div>

      {/* Form pane */}
      <div className="flex items-center justify-center bg-page px-[22px] py-7">
        <form
          className="bg-surface w-full max-w-[392px] rounded-[18px] shadow-lg border border-line px-[30px] py-8 fade-up"
          onSubmit={submit}
        >
          {/* Mobile logo */}
          <div className="flex justify-center mb-[22px] lg:hidden">
            <img className="h-[26px]" src="/assets/telemetric-logo.png" alt="TELEMETRIC" />
          </div>

          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-[23px] font-bold m-0 mb-1">{t('login.title', lang)}</h1>
              <p className="text-ink-2 text-[13.5px] m-0">{t('login.subtitle', lang)}</p>
            </div>
            <div className="inline-flex bg-surface-2 border border-line rounded-full p-[2px] gap-[2px]">
              {['id', 'en'].map((l) => (
                <button
                  key={l}
                  type="button"
                  className={`text-[11px] font-bold tracking-[0.5px] px-2.5 py-1 rounded-full transition-all ${lang === l ? 'bg-blue text-white' : 'text-ink-3'}`}
                  onClick={() => setLang(l)}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 bg-red-bg text-[#a13434] border border-[#f1c7c7] rounded px-3.5 py-[11px] text-[13px] font-semibold mb-4 shake-anim">
              <Icon name="alert" size={16} />{error}
            </div>
          )}

          <Field label={t('login.username', lang)} required>
            <input
              className="form-input"
              value={username}
              autoCapitalize="none"
              autoComplete="username"
              placeholder="operator / supervisor"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Field>

          <Field label={t('login.password', lang)} required>
            <div className="relative">
              <input
                className="form-input pr-[46px]"
                type={showPw ? 'text' : 'password'}
                value={password}
                autoComplete="current-password"
                placeholder="••••"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 border-0 bg-transparent text-ink-3 grid place-items-center rounded-[7px] hover:text-ink transition-colors"
                onClick={() => setShowPw((s) => !s)}
                aria-label="toggle password"
              >
                <Icon name={showPw ? 'eyeOff' : 'eye'} size={19} />
              </button>
            </div>
          </Field>

          <label className="flex items-center gap-2.5 text-[13px] text-ink-2 cursor-pointer select-none mb-[18px]">
            <input type="checkbox" defaultChecked className="w-[17px] h-[17px] accent-blue" />
            {t('login.remember', lang)}
          </label>

          <button
            className="btn btn-primary btn-block btn-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? <Icon name="refresh" size={18} className="spin-anim" /> : <Icon name="lock" size={18} />}
            {t('login.submit', lang)}
          </button>

          <div className="mt-[22px] border-t border-line-2 pt-[18px]">
            <div className="text-[11px] uppercase tracking-[0.6px] text-ink-3 font-bold mb-2.5">{t('login.demo', lang)}</div>
            <div className="flex gap-2.5">
              {[
                { role: 'operator', icon: 'user', label: t('login.role.operator', lang) },
                { role: 'supervisor', icon: 'shield', label: t('login.role.supervisor', lang) },
              ].map(({ role, icon, label }) => (
                <button
                  key={role}
                  type="button"
                  className="flex-1 border-[1.5px] border-line rounded p-[11px] text-left bg-surface transition-all hover:border-blue hover:bg-blue-50"
                  onClick={() => fillDemo(role)}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Icon name={icon} size={15} className="text-blue" />
                    <span className="text-[13px] font-bold text-ink">{label}</span>
                  </div>
                  <div className="text-[11px] text-ink-3 font-mono mt-0.5">{role} · 1234</div>
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
