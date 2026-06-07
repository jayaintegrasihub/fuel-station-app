/* Data layer — converted from window.TM global to ES module */

export const UNITS = {
  genset: [
    { id: 'GS-101', name: 'Genset 101', spec: 'Cat 3516 · 2000 kVA' },
    { id: 'GS-102', name: 'Genset 102', spec: 'Cat 3512 · 1500 kVA' },
    { id: 'GS-103', name: 'Genset 103', spec: 'Cummins KTA50 · 1250 kVA' },
    { id: 'GS-104', name: 'Genset 104', spec: 'Perkins 4012 · 1000 kVA' },
    { id: 'GS-105', name: 'Genset 105', spec: 'Mitsubishi · 800 kVA' },
  ],
  alatberat: [
    { id: 'EX-01', name: 'Excavator EX-01', spec: 'Komatsu PC200' },
    { id: 'EX-02', name: 'Excavator EX-02', spec: 'Hitachi ZX210' },
    { id: 'WL-01', name: 'Wheel Loader WL-01', spec: 'Cat 950GC' },
    { id: 'FL-01', name: 'Forklift FL-01', spec: 'Toyota 8FD30' },
    { id: 'DZ-01', name: 'Bulldozer DZ-01', spec: 'Komatsu D65' },
  ],
}

export const FUELMEN = ['Budi Santoso', 'Agus Pratama', 'Rahmat Hidayat', 'Dedi Kurniawan']
export const OPERATORS = ['Slamet Riyadi', 'Joko Susilo', 'Wahyu Nugroho', 'Andi Saputra']

export const USERS = [
  { username: 'operator', password: '1234', role: 'operator', name: 'Slamet Riyadi' },
  { username: 'supervisor', password: '1234', role: 'supervisor', name: 'Hendra Wijaya' },
]

export const I18N = {
  id: {
    'app.name': 'Fuel Log',
    'app.station': 'Stasiun Pengisian Solar · Pabrik',
    'login.title': 'Masuk',
    'login.subtitle': 'Sistem Pencatatan Pengisian Solar',
    'login.username': 'Nama Pengguna',
    'login.password': 'Kata Sandi',
    'login.submit': 'Masuk',
    'login.demo': 'Akun demo',
    'login.role.operator': 'Operator',
    'login.role.supervisor': 'Supervisor',
    'login.error': 'Nama pengguna atau kata sandi salah.',
    'login.remember': 'Ingat saya',
    'nav.input': 'Pengisian',
    'nav.history': 'History',
    'nav.dashboard': 'Dashboard',
    'logout': 'Keluar',
    'form.title': 'Form Pengisian Solar',
    'form.subtitle': 'Catat pengisian bahan bakar unit',
    'form.type': 'Jenis Unit',
    'form.type.genset': 'Genset',
    'form.type.alatberat': 'Alat Berat',
    'form.unit': 'Pilih Unit',
    'form.unit.placeholder': '— Pilih unit —',
    'form.fuelman': 'Fuelman',
    'form.fuelman.placeholder': 'Nama petugas pengisian',
    'form.user': 'User / PIC Unit',
    'form.user.placeholder': 'Nama penanggung jawab unit',
    'form.totalizer': 'Totalizer (Akumulasi Bulan Ini)',
    'form.totalizer.hint': 'Otomatis dari history tgl 1 s/d kini',
    'form.totalFueling': 'Total Fueling Saat Ini',
    'form.totalFueling.placeholder': '0',
    'form.time': 'Jam Pengisian',
    'form.time.auto': 'Otomatis tercatat',
    'form.photo': 'Foto Bukti Flowmeter',
    'form.photo.capture': 'Buka Kamera',
    'form.photo.retake': 'Ambil Ulang',
    'form.photo.hint': 'Wajib — foto angka pada flowmeter',
    'form.submit': 'Simpan Pengisian',
    'form.reset': 'Reset',
    'form.success': 'Pengisian berhasil disimpan',
    'form.liters': 'Liter',
    'form.required': 'Lengkapi field bertanda *',
    'form.newTotalizer': 'Totalizer setelah pengisian ini',
    'hist.title': 'History Pengisian',
    'hist.subtitle': 'Riwayat seluruh pengisian solar',
    'hist.filter.type': 'Jenis',
    'hist.filter.unit': 'Unit',
    'hist.filter.from': 'Dari Tanggal',
    'hist.filter.to': 'Sampai Tanggal',
    'hist.filter.all': 'Semua',
    'hist.filter.reset': 'Reset Filter',
    'hist.quick.today': 'Hari Ini',
    'hist.quick.week': '7 Hari',
    'hist.quick.month': 'Bulan Ini',
    'hist.records': 'catatan',
    'hist.totalvol': 'Total Volume',
    'hist.empty': 'Tidak ada data untuk filter ini.',
    'hist.col.time': 'Waktu',
    'hist.col.unit': 'Unit',
    'hist.col.fuelman': 'Fuelman',
    'hist.col.user': 'User',
    'hist.col.volume': 'Volume',
    'hist.col.totalizer': 'Totalizer',
    'hist.col.photo': 'Bukti',
    'hist.download': 'Download Report',
    'hist.download.excel': 'Excel (CSV)',
    'hist.download.pdf': 'PDF',
    'hist.detail': 'Detail Pengisian',
    'dash.title': 'Dashboard Operasional',
    'dash.subtitle': 'Ringkasan konsumsi solar bulan ini',
    'dash.totalMonth': 'Total Solar Bulan Ini',
    'dash.totalToday': 'Hari Ini',
    'dash.fills': 'Jumlah Pengisian',
    'dash.units': 'Unit Aktif',
    'dash.byUnit': 'Konsumsi per Unit (Bulan Ini)',
    'dash.recent': 'Pengisian Terbaru',
    'dash.viewAll': 'Lihat Semua',
    'common.liters': 'L',
    'common.close': 'Tutup',
    'common.viewPhoto': 'Lihat Foto',
  },
  en: {
    'app.name': 'Fuel Log',
    'app.station': 'Diesel Fueling Station · Plant',
    'login.title': 'Sign In',
    'login.subtitle': 'Diesel Fueling Record System',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.submit': 'Sign In',
    'login.demo': 'Demo accounts',
    'login.role.operator': 'Operator',
    'login.role.supervisor': 'Supervisor',
    'login.error': 'Invalid username or password.',
    'login.remember': 'Remember me',
    'nav.input': 'Fueling',
    'nav.history': 'History',
    'nav.dashboard': 'Dashboard',
    'logout': 'Sign Out',
    'form.title': 'Diesel Fueling Form',
    'form.subtitle': 'Record unit fuel filling',
    'form.type': 'Unit Type',
    'form.type.genset': 'Genset',
    'form.type.alatberat': 'Heavy Equipment',
    'form.unit': 'Select Unit',
    'form.unit.placeholder': '— Select unit —',
    'form.fuelman': 'Fuelman',
    'form.fuelman.placeholder': 'Filling officer name',
    'form.user': 'User / Unit PIC',
    'form.user.placeholder': 'Unit person in charge',
    'form.totalizer': 'Totalizer (This Month Accumulated)',
    'form.totalizer.hint': 'Auto from history, day 1 to now',
    'form.totalFueling': 'Current Total Fueling',
    'form.totalFueling.placeholder': '0',
    'form.time': 'Filling Time',
    'form.time.auto': 'Auto captured',
    'form.photo': 'Flowmeter Proof Photo',
    'form.photo.capture': 'Open Camera',
    'form.photo.retake': 'Retake',
    'form.photo.hint': 'Required — photo of flowmeter reading',
    'form.submit': 'Save Fueling',
    'form.reset': 'Reset',
    'form.success': 'Fueling saved successfully',
    'form.liters': 'Liters',
    'form.required': 'Complete fields marked *',
    'form.newTotalizer': 'Totalizer after this fueling',
    'hist.title': 'Fueling History',
    'hist.subtitle': 'All diesel fueling records',
    'hist.filter.type': 'Type',
    'hist.filter.unit': 'Unit',
    'hist.filter.from': 'From Date',
    'hist.filter.to': 'To Date',
    'hist.filter.all': 'All',
    'hist.filter.reset': 'Reset Filters',
    'hist.quick.today': 'Today',
    'hist.quick.week': '7 Days',
    'hist.quick.month': 'This Month',
    'hist.records': 'records',
    'hist.totalvol': 'Total Volume',
    'hist.empty': 'No data for this filter.',
    'hist.col.time': 'Time',
    'hist.col.unit': 'Unit',
    'hist.col.fuelman': 'Fuelman',
    'hist.col.user': 'User',
    'hist.col.volume': 'Volume',
    'hist.col.totalizer': 'Totalizer',
    'hist.col.photo': 'Proof',
    'hist.download': 'Download Report',
    'hist.download.excel': 'Excel (CSV)',
    'hist.download.pdf': 'PDF',
    'hist.detail': 'Fueling Detail',
    'dash.title': 'Operations Dashboard',
    'dash.subtitle': 'Diesel consumption summary this month',
    'dash.totalMonth': 'Total Diesel This Month',
    'dash.totalToday': 'Today',
    'dash.fills': 'Number of Fillings',
    'dash.units': 'Active Units',
    'dash.byUnit': 'Consumption per Unit (This Month)',
    'dash.recent': 'Recent Fueling',
    'dash.viewAll': 'View All',
    'common.liters': 'L',
    'common.close': 'Close',
    'common.viewPhoto': 'View Photo',
  },
}

export function t(key, lang) {
  return (I18N[lang] && I18N[lang][key]) || I18N.id[key] || key
}

/* Demo clock fixed at Jun 7 2026, advances with real elapsed time */
const DEMO_BASE = new Date(2026, 5, 7, 0, 0, 0).getTime()
const REAL_BASE = Date.now()
export function NOW() {
  return DEMO_BASE + (Date.now() - REAL_BASE) + 9 * 3600 * 1000 + 14 * 60 * 1000
}

/* Storage */
const LS = { records: 'tm_fuel_records', session: 'tm_session', lang: 'tm_lang' }

function seedRecords() {
  const recs = []
  let counter = 1
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
  const add = (type, unit, dayOffset, hour, minute, liters) => {
    const d = new Date(2026, 5, 7, hour, minute, 0)
    d.setDate(d.getDate() - dayOffset)
    recs.push({
      id: 'FL' + String(2600 + counter).padStart(5, '0'),
      type, unitId: unit.id, unitName: unit.name,
      fuelman: pick(FUELMEN), user: pick(OPERATORS),
      liters, ts: d.getTime(), photo: null,
    })
    counter++
  }
  const G = (i) => UNITS.genset[i]
  const A = (i) => UNITS.alatberat[i]

  add('genset', G(0), 20, 8, 15, 1850); add('genset', G(1), 19, 9, 30, 1320)
  add('alatberat', A(0), 18, 7, 45, 280); add('genset', G(0), 15, 8, 10, 1900)
  add('alatberat', A(2), 13, 13, 20, 340)
  add('genset', G(0), 6, 8, 5, 1820); add('genset', G(1), 6, 8, 40, 1280)
  add('alatberat', A(0), 6, 9, 15, 260); add('alatberat', A(3), 6, 10, 5, 95)
  add('genset', G(2), 5, 8, 0, 1100); add('genset', G(0), 5, 14, 25, 1780)
  add('alatberat', A(1), 5, 9, 50, 305); add('genset', G(1), 4, 8, 20, 1310)
  add('alatberat', A(2), 4, 11, 10, 360); add('alatberat', A(0), 4, 15, 30, 270)
  add('genset', G(0), 3, 8, 12, 1860); add('genset', G(3), 3, 9, 5, 880)
  add('alatberat', A(4), 3, 13, 40, 420); add('genset', G(1), 2, 8, 35, 1295)
  add('alatberat', A(1), 2, 10, 20, 290); add('alatberat', A(3), 2, 14, 0, 88)
  add('genset', G(0), 1, 8, 8, 1840); add('genset', G(2), 1, 9, 25, 1150)
  add('alatberat', A(0), 1, 11, 45, 255); add('genset', G(1), 0, 7, 10, 1300)

  recs.sort((a, b) => b.ts - a.ts)
  return recs
}

export function getRecords() {
  try {
    const raw = localStorage.getItem(LS.records)
    if (!raw) {
      const seed = seedRecords()
      localStorage.setItem(LS.records, JSON.stringify(seed))
      return seed
    }
    return JSON.parse(raw)
  } catch {
    return seedRecords()
  }
}

export function addRecord(rec) {
  const recs = getRecords()
  recs.unshift(rec)
  recs.sort((a, b) => b.ts - a.ts)
  localStorage.setItem(LS.records, JSON.stringify(recs))
  return recs
}

export function getSession() {
  try { return JSON.parse(localStorage.getItem(LS.session) || 'null') }
  catch { return null }
}
export function setSession(s) {
  if (s) localStorage.setItem(LS.session, JSON.stringify(s))
  else localStorage.removeItem(LS.session)
}
export function getLang() { return localStorage.getItem(LS.lang) || 'id' }
export function setLang(l) { localStorage.setItem(LS.lang, l) }

export function monthTotalizer(unitId, refTs) {
  const ref = refTs || NOW()
  const d = new Date(ref)
  const start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0).getTime()
  return getRecords()
    .filter((r) => r.unitId === unitId && r.ts >= start && r.ts <= ref)
    .reduce((s, r) => s + Number(r.liters || 0), 0)
}

/* Formatting */
export function fmtNum(n) {
  return Number(n || 0).toLocaleString('id-ID', { maximumFractionDigits: 0 })
}
function pad(n) { return String(n).padStart(2, '0') }
export function fmtDate(ts, lang) {
  const d = new Date(ts)
  const months = {
    id: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
    en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  }
  const m = (months[lang] || months.id)[d.getMonth()]
  return `${pad(d.getDate())} ${m} ${d.getFullYear()}`
}
export function fmtTime(ts) {
  const d = new Date(ts)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}
export function fmtDateTime(ts, lang) { return `${fmtDate(ts, lang)} · ${fmtTime(ts)}` }
export function isoDate(ts) {
  const d = new Date(ts)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/* Report exports */
export function downloadCSV(records, lang) {
  const headers = ['ID','Tanggal','Jam','Jenis','Unit','Fuelman','User','Volume (L)','Totalizer Bulan (L)']
  const typeLabel = (tp) => (tp === 'genset' ? 'Genset' : lang === 'en' ? 'Heavy Equipment' : 'Alat Berat')
  const rows = records.map((r) => [
    r.id, isoDate(r.ts), fmtTime(r.ts), typeLabel(r.type), r.unitName,
    r.fuelman, r.user, r.liters, monthTotalizer(r.unitId, r.ts),
  ])
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`
  const csv = [headers, ...rows].map((row) => row.map(esc).join(',')).join('\r\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `Fuel_Report_${isoDate(NOW())}.csv`
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}

export function exportPDF(records, lang, meta) {
  const typeLabel = (tp) => (tp === 'genset' ? 'Genset' : lang === 'en' ? 'Heavy Equipment' : 'Alat Berat')
  const total = records.reduce((s, r) => s + Number(r.liters || 0), 0)
  const rowsHtml = records.map((r) => `
    <tr>
      <td>${r.id}</td><td>${fmtDate(r.ts, lang)}</td><td>${fmtTime(r.ts)}</td>
      <td>${typeLabel(r.type)}</td><td>${r.unitName}</td>
      <td>${r.fuelman}</td><td>${r.user}</td>
      <td class="num">${fmtNum(r.liters)}</td>
    </tr>`).join('')
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(`<!doctype html><html><head><meta charset="utf-8">
    <title>Fuel Report ${isoDate(NOW())}</title>
    <style>
      *{box-sizing:border-box}body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#0E2233;margin:32px}
      .head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #2F80C2;padding-bottom:14px;margin-bottom:18px}
      .head h1{font-size:18px;margin:0 0 4px;letter-spacing:.5px}.head .brand{font-size:22px;font-weight:800;color:#2F80C2;letter-spacing:1px}
      .meta{font-size:11px;color:#5b6b78;margin:2px 0}table{width:100%;border-collapse:collapse;font-size:11px}
      th{background:#0E2233;color:#fff;text-align:left;padding:7px 8px;font-weight:600}
      td{padding:6px 8px;border-bottom:1px solid #e2e8ee}td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}
      tr:nth-child(even) td{background:#f5f8fb}.tot{margin-top:14px;text-align:right;font-size:13px;font-weight:700}
      .foot{margin-top:24px;font-size:10px;color:#90a0ad;border-top:1px solid #e2e8ee;padding-top:8px}
      @media print{body{margin:14mm}}
    </style></head><body>
    <div class="head">
      <div><div class="brand">TELEMETRIC</div><div class="meta">${meta.station}</div></div>
      <div style="text-align:right">
        <h1>${lang === 'en' ? 'DIESEL FUELING REPORT' : 'LAPORAN PENGISIAN SOLAR'}</h1>
        <div class="meta">${meta.range}</div>
        <div class="meta">${lang === 'en' ? 'Generated' : 'Dibuat'}: ${fmtDateTime(NOW(), lang)} · ${meta.by}</div>
      </div>
    </div>
    <table><thead><tr>
      <th>ID</th><th>${lang === 'en' ? 'Date' : 'Tanggal'}</th><th>${lang === 'en' ? 'Time' : 'Jam'}</th>
      <th>${lang === 'en' ? 'Type' : 'Jenis'}</th><th>Unit</th><th>Fuelman</th><th>User</th>
      <th class="num">Volume (L)</th>
    </tr></thead><tbody>${rowsHtml}</tbody></table>
    <div class="tot">Total Volume: ${fmtNum(total)} L &nbsp;·&nbsp; ${records.length} ${lang === 'en' ? 'records' : 'catatan'}</div>
    <div class="foot">TELEMETRIC Fuel Log — ${lang === 'en' ? 'auto-generated report' : 'laporan dibuat otomatis'}.</div>
    <script>window.onload=function(){setTimeout(function(){window.print();},350);}<\/script>
    </body></html>`)
  win.document.close()
}
