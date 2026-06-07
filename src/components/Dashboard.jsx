import { UNITS, t, NOW, fmtNum, fmtDate, fmtDateTime } from '../lib/data'
import Icon from './Icon'

function TypePill({ type, lang }) {
  return (
    <span className={`type-pill ${type === 'genset' ? 'type-pill-genset' : 'type-pill-heavy'}`}>
      <span className="dot" />
      {type === 'genset' ? 'Genset' : (lang === 'en' ? 'Heavy Eq.' : 'Alat Berat')}
    </span>
  )
}

export default function Dashboard({ lang, records, goHistory, goInput, canInput }) {
  const nowTs = NOW()
  const d = new Date(nowTs)
  const monthStartTs = new Date(d.getFullYear(), d.getMonth(), 1).getTime()
  const todayStartTs = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()

  const monthRecs = records.filter((r) => r.ts >= monthStartTs && r.ts <= nowTs)
  const totalMonth = monthRecs.reduce((s, r) => s + Number(r.liters || 0), 0)
  const totalToday = records.filter((r) => r.ts >= todayStartTs).reduce((s, r) => s + Number(r.liters || 0), 0)
  const activeUnits = new Set(monthRecs.map((r) => r.unitId)).size

  const monthName = fmtDate(nowTs, lang).split(' ').slice(1).join(' ')

  const allUnits = [...UNITS.genset, ...UNITS.alatberat]
  const perUnit = allUnits.map((u) => {
    const total = monthRecs.filter((r) => r.unitId === u.id).reduce((s, r) => s + Number(r.liters || 0), 0)
    const type = UNITS.genset.find((g) => g.id === u.id) ? 'genset' : 'alatberat'
    return { ...u, total, type }
  }).filter((u) => u.total > 0).sort((a, b) => b.total - a.total)
  const maxUnit = Math.max(1, ...perUnit.map((u) => u.total))

  const recent = records.slice(0, 6)

  const stats = [
    {
      label: t('dash.totalMonth', lang),
      icon: 'drop', iconBg: 'bg-blue-50', iconColor: 'text-blue',
      value: fmtNum(totalMonth), unit: 'L',
      delta: `${monthRecs.length} ${t('hist.records', lang)} · ${monthName}`,
    },
    {
      label: t('dash.totalToday', lang),
      icon: 'clock', iconBg: 'bg-amber-bg', iconColor: 'text-amber',
      value: fmtNum(totalToday), unit: 'L',
      delta: fmtDate(nowTs, lang),
    },
    {
      label: t('dash.fills', lang),
      icon: 'fuel', iconBg: 'bg-green-bg', iconColor: 'text-green',
      value: String(monthRecs.length), unit: null,
      delta: lang === 'en' ? 'this month' : 'bulan ini',
    },
    {
      label: t('dash.units', lang),
      icon: 'layers', iconBg: 'bg-[#e7edf2]', iconColor: 'text-navy',
      value: String(activeUnits), unit: `/${allUnits.length}`,
      delta: lang === 'en' ? 'units fueled' : 'unit terisi',
    },
  ]

  return (
    <div className="fade-up">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-[22px] lg:text-[26px] font-bold m-0 mb-[3px] tracking-[-0.2px]">{t('dash.title', lang)}</h1>
          <p className="m-0 text-ink-2 text-[13.5px]">{t('dash.subtitle', lang)} · {monthName}</p>
        </div>
        {canInput && (
          <button className="btn btn-primary btn-sm hidden lg:inline-flex" onClick={goInput}>
            <Icon name="plus" size={16} />{t('nav.input', lang)}
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-[18px]">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center gap-[7px] text-[12px] text-ink-2 font-semibold mb-2.5">
              <span className={`stat-icon ${s.iconBg} ${s.iconColor}`}><Icon name={s.icon} size={16} /></span>
              {s.label}
            </div>
            <div className="font-mono font-semibold text-[27px] tracking-[0.5px] flex items-baseline gap-1">
              {s.value}
              {s.unit && <span className="text-[13px] text-ink-3 font-sans font-medium">{s.unit}</span>}
            </div>
            <div className="text-[11.5px] text-ink-3 mt-1">{s.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-[18px] lg:grid-cols-[1.15fr_1fr]">
        {/* Consumption per unit */}
        <div className="card">
          <div className="card-head">
            <Icon name="dashboard" size={18} className="text-blue" />
            <h2>{t('dash.byUnit', lang)}</h2>
          </div>
          <div className="card-body">
            {perUnit.length === 0 ? (
              <p className="text-ink-3 text-[13px] text-center py-6">
                {lang === 'en' ? 'No data this month.' : 'Belum ada data bulan ini.'}
              </p>
            ) : (
              <div className="flex flex-col gap-3.5">
                {perUnit.map((u) => (
                  <div key={u.id}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <div className="flex items-center gap-2 text-[13px] font-semibold">
                        <Icon
                          name={u.type === 'genset' ? 'genset' : 'excavator'}
                          size={16}
                          className={u.type === 'genset' ? 'text-blue' : 'text-amber'}
                        />
                        {u.name}
                      </div>
                      <div className="font-mono text-[13px] font-semibold">{fmtNum(u.total)} L</div>
                    </div>
                    <div className="barrow-track">
                      <div
                        className={`barrow-fill ${u.type === 'genset' ? 'barrow-fill-genset' : 'barrow-fill-heavy'}`}
                        style={{ width: `${(u.total / maxUnit) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent */}
        <div className="card">
          <div className="card-head flex justify-between">
            <div className="flex items-center gap-2">
              <Icon name="history" size={18} className="text-blue" />
              <h2 className="m-0 text-[15px] font-bold">{t('dash.recent', lang)}</h2>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={goHistory}>{t('dash.viewAll', lang)}</button>
          </div>
          <div className="flex flex-col">
            {recent.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-3 px-5 py-[13px] border-b border-line-2 last:border-0 cursor-pointer transition-colors hover:bg-surface-2"
                onClick={goHistory}
              >
                <div
                  className="w-[38px] h-[38px] rounded-[9px] grid place-items-center flex-none"
                  style={{
                    color: r.type === 'genset' ? '#2f80c2' : '#e0922f',
                    background: r.type === 'genset' ? '#eaf3fb' : '#fcf1e1',
                  }}
                >
                  <Icon name={r.type === 'genset' ? 'genset' : 'excavator'} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[14px]">{r.unitName}</div>
                  <div className="text-ink-3 text-[12px]">{fmtDateTime(r.ts, lang)} · {r.fuelman}</div>
                </div>
                <div className="font-mono font-semibold text-[15px]">
                  {fmtNum(r.liters)} <span className="text-ink-3 text-[12px] font-normal">L</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
