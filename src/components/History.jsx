import { useState, useMemo } from 'react'
import {
  UNITS, t, NOW, monthTotalizer,
  fmtNum, fmtDate, fmtTime, fmtDateTime, isoDate,
  downloadCSV, exportPDF,
} from '../lib/data'
import Icon from './Icon'
import Field from './Field'
import Modal from './Modal'

function TypePill({ type, lang }) {
  return (
    <span className={`type-pill ${type === 'genset' ? 'type-pill-genset' : 'type-pill-heavy'}`}>
      <span className="dot" />
      {type === 'genset' ? 'Genset' : (lang === 'en' ? 'Heavy Eq.' : 'Alat Berat')}
    </span>
  )
}

export default function HistoryScreen({ lang, session, records }) {
  const nowTs = NOW()
  const d = new Date(nowTs)
  const monthStartTs = new Date(d.getFullYear(), d.getMonth(), 1).getTime()
  const todayStartTs = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()

  const [quick, setQuick] = useState('month')
  const [type, setType] = useState('all')
  const [unitId, setUnitId] = useState('all')
  const [from, setFrom] = useState(isoDate(monthStartTs))
  const [to, setTo] = useState(isoDate(nowTs))
  const [detail, setDetail] = useState(null)
  const [photoView, setPhotoView] = useState(null)

  const applyQuick = (q) => {
    setQuick(q)
    if (q === 'today') { setFrom(isoDate(todayStartTs)); setTo(isoDate(nowTs)) }
    else if (q === 'week') { setFrom(isoDate(nowTs - 6 * 864e5)); setTo(isoDate(nowTs)) }
    else if (q === 'month') { setFrom(isoDate(monthStartTs)); setTo(isoDate(nowTs)) }
  }

  const resetFilters = () => { setType('all'); setUnitId('all'); applyQuick('month') }

  const allUnits = [...UNITS.genset, ...UNITS.alatberat]
  const unitOptions = type === 'all' ? allUnits : UNITS[type] || allUnits

  const filtered = useMemo(() => {
    const fromTs = from ? new Date(from + 'T00:00:00').getTime() : 0
    const toTs = to ? new Date(to + 'T23:59:59').getTime() : Infinity
    return records.filter((r) => {
      if (type !== 'all' && r.type !== type) return false
      if (unitId !== 'all' && r.unitId !== unitId) return false
      if (r.ts < fromTs || r.ts > toTs) return false
      return true
    })
  }, [records, type, unitId, from, to])

  const totalVol = filtered.reduce((s, r) => s + Number(r.liters || 0), 0)

  const reportMeta = {
    station: t('app.station', lang),
    range: `${fmtDate(new Date(from).getTime(), lang)} – ${fmtDate(new Date(to).getTime(), lang)}`,
    by: session.name,
  }

  return (
    <div className="fade-up">
      <div className="mb-5">
        <h1 className="text-[22px] lg:text-[26px] font-bold m-0 mb-[3px] tracking-[-0.2px]">{t('hist.title', lang)}</h1>
        <p className="m-0 text-ink-2 text-[13.5px]">{t('hist.subtitle', lang)}</p>
      </div>

      {/* Filters */}
      <div className="bg-surface border border-line rounded-lg shadow-sm p-4 mb-[18px]">
        <div className="flex flex-wrap gap-2 mb-3.5">
          {['today', 'week', 'month'].map((q) => (
            <button key={q} className={`chip ${quick === q ? 'active' : ''}`} onClick={() => applyQuick(q)}>
              {t(`hist.quick.${q}`, lang)}
            </button>
          ))}
          <button className="chip ml-auto flex items-center gap-1" onClick={resetFilters}>
            <Icon name="refresh" size={14} />{t('hist.filter.reset', lang)}
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.5px] text-ink-3 font-semibold mb-1.5">{t('hist.filter.type', lang)}</label>
            <select className="form-select h-[42px] text-[13.5px]" value={type} onChange={(e) => { setType(e.target.value); setUnitId('all') }}>
              <option value="all">{t('hist.filter.all', lang)}</option>
              <option value="genset">Genset</option>
              <option value="alatberat">{lang === 'en' ? 'Heavy Equipment' : 'Alat Berat'}</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-[0.5px] text-ink-3 font-semibold mb-1.5">{t('hist.filter.unit', lang)}</label>
            <select className="form-select h-[42px] text-[13.5px]" value={unitId} onChange={(e) => setUnitId(e.target.value)}>
              <option value="all">{t('hist.filter.all', lang)}</option>
              {unitOptions.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-[0.5px] text-ink-3 font-semibold mb-1.5">{t('hist.filter.from', lang)}</label>
            <input type="date" className="form-input h-[42px] text-[13.5px]" value={from} max={to} onChange={(e) => { setFrom(e.target.value); setQuick('') }} />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-[0.5px] text-ink-3 font-semibold mb-1.5">{t('hist.filter.to', lang)}</label>
            <input type="date" className="form-input h-[42px] text-[13.5px]" value={to} min={from} onChange={(e) => { setTo(e.target.value); setQuick('') }} />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-3.5">
        <div className="flex gap-[18px] flex-wrap">
          <div className="text-[13px] text-ink-2">
            <b className="font-mono text-ink text-[15px] font-semibold">{filtered.length}</b> {t('hist.records', lang)}
          </div>
          <div className="text-[13px] text-ink-2">
            {t('hist.totalvol', lang)}: <b className="font-mono text-ink text-[15px] font-semibold">{fmtNum(totalVol)}</b> L
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            className="btn btn-ghost btn-sm"
            disabled={!filtered.length}
            onClick={() => downloadCSV(filtered, lang)}
          >
            <Icon name="excel" size={16} className="text-green" />{t('hist.download.excel', lang)}
          </button>
          <button
            className="btn btn-navy btn-sm"
            disabled={!filtered.length}
            onClick={() => exportPDF(filtered, lang, reportMeta)}
          >
            <Icon name="pdf" size={16} />{t('hist.download.pdf', lang)}
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="text-center py-14 px-5 text-ink-3">
            <Icon name="search" className="w-11 h-11 mx-auto mb-3 text-line" />
            <p className="text-[14px] m-0">{t('hist.empty', lang)}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-line bg-surface">
            <table className="w-full border-collapse text-[13.5px]">
              <thead>
                <tr>
                  {[t('hist.col.time',lang), t('hist.col.unit',lang), t('hist.col.fuelman',lang), t('hist.col.user',lang)].map((h) => (
                    <th key={h} className="bg-surface-2 text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.6px] text-ink-2 border-b border-line whitespace-nowrap">{h}</th>
                  ))}
                  <th className="bg-surface-2 text-right px-4 py-3 text-[11px] font-bold uppercase tracking-[0.6px] text-ink-2 border-b border-line">{t('hist.col.volume',lang)}</th>
                  <th className="bg-surface-2 text-right px-4 py-3 text-[11px] font-bold uppercase tracking-[0.6px] text-ink-2 border-b border-line">{t('hist.col.totalizer',lang)}</th>
                  <th className="bg-surface-2 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.6px] text-ink-2 border-b border-line w-[60px]">{t('hist.col.photo',lang)}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-line-2 last:border-0 hover:bg-surface-2 cursor-pointer transition-colors"
                    onClick={() => setDetail(r)}
                  >
                    <td className="px-4 py-[13px] align-middle">
                      <b className="text-[13.5px]">{fmtTime(r.ts)}</b>
                      <span className="block text-[11.5px] text-ink-3">{fmtDate(r.ts, lang)}</span>
                    </td>
                    <td className="px-4 py-[13px] align-middle">
                      <div className="font-semibold mb-1">{r.unitName}</div>
                      <TypePill type={r.type} lang={lang} />
                    </td>
                    <td className="px-4 py-[13px] align-middle">{r.fuelman}</td>
                    <td className="px-4 py-[13px] align-middle">{r.user}</td>
                    <td className="px-4 py-[13px] align-middle text-right font-mono font-semibold">
                      {fmtNum(r.liters)} <span className="text-ink-3 font-normal">L</span>
                    </td>
                    <td className="px-4 py-[13px] align-middle text-right font-mono font-semibold text-ink-3">
                      {fmtNum(monthTotalizer(r.unitId, r.ts))}
                    </td>
                    <td className="px-4 py-[13px] align-middle" onClick={(e) => { e.stopPropagation(); if (r.photo) setPhotoView(r) }}>
                      <button className="w-[38px] h-[30px] rounded-[6px] overflow-hidden border border-line p-0 bg-surface-2 grid place-items-center text-ink-3">
                        {r.photo
                          ? <img src={r.photo} alt="" className="w-full h-full object-cover" />
                          : <Icon name="image" size={15} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map((r) => (
              <div
                key={r.id}
                className="bg-surface border border-line rounded-lg p-3.5 shadow-sm cursor-pointer"
                onClick={() => setDetail(r)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-[15px] font-bold">{r.unitName}</div>
                    <div className="text-[12px] text-ink-3 mt-0.5">{fmtDateTime(r.ts, lang)}</div>
                    <div className="mt-1.5"><TypePill type={r.type} lang={lang} /></div>
                  </div>
                  <div className="text-right">
                    <b className="font-mono text-[20px] font-semibold">{fmtNum(r.liters)}</b>
                    <br /><span className="text-[12px] text-ink-3">{t('form.liters', lang)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-3.5 gap-y-2.5 pt-3 border-t border-line-2">
                  {[
                    { k: t('hist.col.fuelman',lang), v: r.fuelman },
                    { k: t('hist.col.user',lang), v: r.user },
                    { k: t('hist.col.totalizer',lang), v: `${fmtNum(monthTotalizer(r.unitId, r.ts))} L`, mono: true },
                  ].map(({ k, v, mono }) => (
                    <div key={k}>
                      <div className="text-[10.5px] uppercase tracking-[0.5px] text-ink-3 font-semibold">{k}</div>
                      <div className={`text-[13.5px] font-semibold mt-0.5 ${mono ? 'font-mono' : ''}`}>{v}</div>
                    </div>
                  ))}
                  <div>
                    <div className="text-[10.5px] uppercase tracking-[0.5px] text-ink-3 font-semibold">{t('hist.col.photo',lang)}</div>
                    <div className="mt-0.5">
                      {r.photo
                        ? <button
                            className="btn btn-ghost btn-sm h-[30px] px-2.5 text-[12px]"
                            onClick={(e) => { e.stopPropagation(); setPhotoView(r) }}
                          >
                            <Icon name="eye" size={14} />{t('common.viewPhoto', lang)}
                          </button>
                        : <span className="text-ink-3 font-normal">—</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Detail modal */}
      {detail && (
        <Modal title={t('hist.detail', lang)} onClose={() => setDetail(null)}>
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[19px] font-bold">{detail.unitName}</div>
              <div className="text-ink-3 text-[13px] mt-0.5">{detail.id}</div>
            </div>
            <TypePill type={detail.type} lang={lang} />
          </div>
          <div className="grid grid-cols-2 gap-3.5 mt-4">
            {[
              { k: t('hist.col.time',lang), v: fmtDateTime(detail.ts, lang) },
              { k: t('hist.col.volume',lang), v: `${fmtNum(detail.liters)} L`, mono: true },
              { k: t('hist.col.fuelman',lang), v: detail.fuelman },
              { k: t('hist.col.user',lang), v: detail.user },
              { k: t('form.totalizer',lang), v: `${fmtNum(monthTotalizer(detail.unitId, detail.ts))} L`, mono: true },
            ].map(({ k, v, mono }) => (
              <div key={k}>
                <div className="text-[11px] uppercase tracking-[0.5px] text-ink-3 font-semibold">{k}</div>
                <div className={`text-[15px] font-semibold mt-[3px] ${mono ? 'font-mono' : ''}`}>{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-[18px]">
            <div className="text-[11px] uppercase tracking-[0.5px] text-ink-3 font-semibold mb-2">{t('form.photo', lang)}</div>
            {detail.photo
              ? <img className="w-full rounded border border-line block" src={detail.photo} alt="flowmeter" />
              : <div className="photo-zone cursor-default">
                  <div className="w-10 h-10 mx-auto rounded-full grid place-items-center text-ink-3"><Icon name="image" size={24} /></div>
                  <span className="text-ink-3 text-[12px]">{lang === 'en' ? 'No photo (seed data)' : 'Tidak ada foto (data contoh)'}</span>
                </div>}
          </div>
        </Modal>
      )}

      {/* Photo viewer */}
      {photoView && (
        <Modal title={`${t('form.photo', lang)} · ${photoView.unitName}`} onClose={() => setPhotoView(null)} width={560}>
          {photoView.photo
            ? <img className="w-full rounded border border-line block" src={photoView.photo} alt="flowmeter" />
            : <div className="text-ink-3">{lang === 'en' ? 'No photo available.' : 'Foto tidak tersedia.'}</div>}
          <div className="text-ink-3 text-[12.5px] mt-3 text-center">
            {fmtDateTime(photoView.ts, lang)} · {photoView.fuelman}
          </div>
        </Modal>
      )}
    </div>
  )
}
