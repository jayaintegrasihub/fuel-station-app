import { useState, useEffect, useRef, useMemo } from 'react'
import { UNITS, FUELMEN, OPERATORS, t, NOW, monthTotalizer, fmtNum, fmtTime, fmtDate, addRecord } from '../lib/data'
import Icon from './Icon'
import Field from './Field'

function fmtTimeSec(ts) {
  const d = new Date(ts)
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

export default function InputForm({ lang, session, onSaved, pushToast }) {
  const [type, setType] = useState('genset')
  const [unitId, setUnitId] = useState('')
  const [fuelman, setFuelman] = useState(session.name)
  const [user, setUser] = useState('')
  const [liters, setLiters] = useState('')
  const [photo, setPhoto] = useState(null)
  const [now, setNow] = useState(Date.now())
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  const fileRef = useRef(null)
  const videoRef = useRef(null)

  // Realtime clock — update setiap detik
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(iv)
  }, [])

  // Pasang stream ke video element saat kamera terbuka
  useEffect(() => {
    if (showCamera && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream
    }
  }, [showCamera, cameraStream])

  // Bersihkan stream saat komponen unmount
  useEffect(() => {
    return () => { cameraStream?.getTracks().forEach((t) => t.stop()) }
  }, [cameraStream])

  const units = UNITS[type]
  useEffect(() => { setUnitId('') }, [type])

  const totalizer = useMemo(
    () => (unitId ? monthTotalizer(unitId, NOW()) : 0),
    [unitId, now]
  )
  const litersNum = Number(liters) || 0

  /* ---- Camera handlers ---- */
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      })
      setCameraStream(stream)
      setShowCamera(true)
    } catch {
      // getUserMedia gagal (browser lama / izin ditolak) → fallback ke file picker
      fileRef.current.click()
    }
  }

  const capturePhoto = () => {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    const src = canvas.toDataURL('image/jpeg', 0.9)
    setPhoto({ src, name: 'camera_capture.jpg', capturedAt: Date.now() })
    setErrors((x) => ({ ...x, photo: null }))
    closeCamera()
  }

  const closeCamera = () => {
    cameraStream?.getTracks().forEach((t) => t.stop())
    setCameraStream(null)
    setShowCamera(false)
  }

  // Fallback: file picker (jika getUserMedia tidak tersedia)
  const onPickFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = '' // reset agar file yang sama bisa dipilih ulang
    const reader = new FileReader()
    reader.onload = () => setPhoto({ src: reader.result, name: file.name, capturedAt: Date.now() })
    reader.readAsDataURL(file)
    setErrors((x) => ({ ...x, photo: null }))
  }

  /* ---- Form handlers ---- */
  const reset = () => {
    setUnitId(''); setFuelman(session.name); setUser(''); setLiters(''); setPhoto(null); setErrors({})
  }

  const validate = () => {
    const e = {}
    if (!unitId) e.unitId = true
    if (!fuelman.trim()) e.fuelman = true
    if (!user.trim()) e.user = true
    if (!litersNum || litersNum <= 0) e.liters = true
    if (!photo) e.photo = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const requestSave = () => {
    if (!validate()) { pushToast('error', t('form.required', lang)); return }
    const unit = UNITS[type].find((u) => u.id === unitId)
    setConfirm({ ts: Date.now(), unit })
  }

  const doSave = () => {
    if (!confirm) return
    setConfirm(null)
    setSaving(true)
    const { ts, unit } = confirm
    const rec = {
      id: 'FL' + String(ts).slice(-7),
      type, unitId, unitName: unit.name,
      fuelman: fuelman.trim(), user: user.trim(),
      liters: litersNum, ts, photo: photo.src,
    }
    setTimeout(() => {
      addRecord(rec)
      onSaved()
      setSaving(false)
      pushToast('success', t('form.success', lang), `${unit.name} · ${fmtNum(litersNum)} L`)
      reset()
    }, 700)
  }

  return (
    <div className="fade-up">
      <div className="mb-5">
        <h1 className="text-[22px] lg:text-[26px] font-bold m-0 mb-[3px] tracking-[-0.2px]">{t('form.title', lang)}</h1>
        <p className="m-0 text-ink-2 text-[13.5px]">{t('form.subtitle', lang)}</p>
      </div>

      <div className="grid gap-[18px]">
        {/* Type + Unit */}
        <div className="card">
          <div className="card-head">
            <Icon name="layers" size={18} className="text-blue" />
            <h2>{t('form.type', lang)}</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-2.5 mb-[18px]">
              {['genset', 'alatberat'].map((tp) => (
                <button
                  key={tp}
                  type="button"
                  className={`seg-opt ${type === tp ? 'active' : ''}`}
                  onClick={() => setType(tp)}
                >
                  <span className="seg-icon">
                    <Icon name={tp === 'genset' ? 'genset' : 'excavator'} size={22} />
                  </span>
                  <span>
                    <b className={`block text-[14.5px] font-bold seg-label ${type === tp ? '' : 'text-ink'}`}>{t(`form.type.${tp}`, lang)}</b>
                    <span className="text-[11.5px] text-ink-3">{UNITS[tp].length} unit</span>
                  </span>
                </button>
              ))}
            </div>
            <Field label={t('form.unit', lang)} required error={errors.unitId ? t('form.required', lang) : null}>
              <select
                className={`form-select ${errors.unitId ? 'invalid' : ''}`}
                value={unitId}
                onChange={(e) => { setUnitId(e.target.value); setErrors((x) => ({ ...x, unitId: null })) }}
              >
                <option value="">{t('form.unit.placeholder', lang)}</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} — {u.spec}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        {/* Totalizer readout — hanya satu kartu */}
        <div className="readout">
          <div className="readout-label">
            {t('form.totalizer', lang)}{unitId ? ` · ${UNITS[type].find((u) => u.id === unitId).name}` : ''}
          </div>
          <div className="readout-value">{fmtNum(totalizer)} <span className="u">L</span></div>
          <div className="readout-sub">{t('form.totalizer.hint', lang)}</div>
        </div>

        {/* Details */}
        <div className="card">
          <div className="card-head">
            <Icon name="user" size={18} className="text-blue" />
            <h2>{lang === 'en' ? 'Fueling Details' : 'Detail Pengisian'}</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Field label={t('form.fuelman', lang)} required>
                <div className="form-input flex items-center gap-2.5 bg-surface-2 cursor-not-allowed">
                  <Icon name="user" size={16} className="text-ink-3 flex-none" />
                  <span className="text-ink font-medium">{fuelman}</span>
                </div>
              </Field>
              <Field label={t('form.user', lang)} required error={errors.user ? ' ' : null}>
                <input
                  className={`form-input ${errors.user ? 'invalid' : ''}`}
                  value={user}
                  list="user-list"
                  placeholder={t('form.user.placeholder', lang)}
                  onChange={(e) => { setUser(e.target.value); setErrors((x) => ({ ...x, user: null })) }}
                />
                <datalist id="user-list">
                  {OPERATORS.map((f) => <option key={f} value={f} />)}
                </datalist>
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Field
                label={`${t('form.totalFueling', lang)}${unitId ? ' · ' + UNITS[type].find((u) => u.id === unitId).name : ''}`}
                required
                error={errors.liters ? ' ' : null}
              >
                <div className="relative">
                  <input
                    className={`form-input font-mono font-semibold text-[17px] tracking-[0.5px] pr-[44px] ${errors.liters ? 'invalid' : ''}`}
                    inputMode="numeric"
                    value={liters}
                    placeholder={t('form.totalFueling.placeholder', lang)}
                    onChange={(e) => { setLiters(e.target.value.replace(/[^0-9.]/g, '')); setErrors((x) => ({ ...x, liters: null })) }}
                  />
                  <span className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[13px] font-semibold text-ink-3 pointer-events-none">
                    {t('form.liters', lang)}
                  </span>
                </div>
              </Field>

              {/* Filling time — realtime dengan detik */}
              <Field label={t('form.time', lang)} hint={t('form.time.auto', lang)}>
                <div className="form-input flex items-center gap-2.5 bg-surface-2 pointer-events-none">
                  <Icon name="clock" size={18} className="text-blue flex-none" />
                  <span className="font-mono font-semibold text-[16px] tracking-[0.5px]">{fmtTimeSec(now)}</span>
                  <span className="font-sans font-medium text-ink-3 text-[13px]">· {fmtDate(now, lang)}</span>
                </div>
              </Field>
            </div>
          </div>
        </div>

        {/* Photo — hanya tombol Open Camera */}
        <div className="card">
          <div className="card-head">
            <Icon name="camera" size={18} className="text-blue" />
            <h2>{t('form.photo', lang)} <span className="text-red">*</span></h2>
          </div>
          <div className="card-body">
            {/* Hidden file input sebagai fallback */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onPickFile}
            />

            {photo ? (
              <div className="relative rounded overflow-hidden border-[1.5px] border-line">
                <img src={photo.src} alt="flowmeter" className="w-full block max-h-[320px] object-cover" />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-navy/[0.82] text-white text-[11px] font-semibold px-2.5 py-[5px] rounded-full backdrop-blur-sm">
                  <span className="w-[7px] h-[7px] rounded-full bg-green flex-none" />
                  {lang === 'en' ? 'Captured' : 'Terambil'} · {fmtTimeSec(photo.capturedAt)}
                </div>
                <button
                  type="button"
                  className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 bg-white/[0.94] text-ink rounded-full px-3.5 py-2 text-[12.5px] font-bold shadow"
                  onClick={() => setPhoto(null)}
                >
                  <Icon name="refresh" size={15} />{t('form.photo.retake', lang)}
                </button>
              </div>
            ) : (
              <div className={`photo-zone ${errors.photo ? 'invalid' : ''}`} onClick={openCamera}>
                <div className="w-[56px] h-[56px] rounded-full bg-blue-50 text-blue grid place-items-center mx-auto mb-3">
                  <Icon name="camera" size={28} />
                </div>
                <b className="text-[14px]">{t('form.photo.capture', lang)}</b>
                <span className="block text-[12px] text-ink-3 mt-1">{t('form.photo.hint', lang)}</span>
                <button
                  type="button"
                  className="btn btn-primary btn-sm mt-4 mx-auto"
                  onClick={(e) => { e.stopPropagation(); openCamera() }}
                >
                  <Icon name="camera" size={16} />{t('form.photo.capture', lang)}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="btn btn-ghost" type="button" onClick={reset}>
            <Icon name="refresh" size={17} />{t('form.reset', lang)}
          </button>
          <button
            className="btn btn-primary flex-1"
            type="button"
            onClick={requestSave}
            disabled={saving}
          >
            {saving ? <Icon name="refresh" size={18} className="spin-anim" /> : <Icon name="check" size={18} />}
            {t('form.submit', lang)}
          </button>
        </div>
      </div>

      {/* ── Camera overlay ── */}
      {showCamera && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/70 to-transparent absolute top-0 left-0 right-0 z-10">
            <button
              type="button"
              className="flex items-center gap-2 text-white text-[14px] font-semibold"
              onClick={closeCamera}
            >
              <Icon name="x" size={20} />
              {lang === 'en' ? 'Cancel' : 'Batal'}
            </button>
            <span className="text-white/70 text-[13px] font-medium">
              {lang === 'en' ? 'Point at flowmeter & capture' : 'Arahkan ke flowmeter & ambil foto'}
            </span>
            <div className="w-[70px]" />
          </div>

          {/* Video preview */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="flex-1 w-full object-cover"
          />

          {/* Capture button */}
          <div className="flex items-center justify-center py-8 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0">
            <button
              type="button"
              onClick={capturePhoto}
              className="w-[76px] h-[76px] rounded-full border-4 border-white/50 grid place-items-center active:scale-95 transition-transform"
              aria-label={lang === 'en' ? 'Capture' : 'Ambil Foto'}
            >
              <div className="w-[60px] h-[60px] rounded-full bg-white" />
            </button>
          </div>
        </div>
      )}

      {/* ── Confirmation modal ── */}
      {confirm && (
        <div
          className="fixed inset-0 z-[90] bg-navy/55 backdrop-blur-sm grid place-items-center p-5 backdrop-anim"
          onClick={() => setConfirm(null)}
        >
          <div
            className="bg-surface rounded-lg w-full max-w-[440px] shadow-lg modal-anim overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-line-2 bg-surface-2">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue grid place-items-center flex-none">
                <Icon name="checkCircle" size={20} />
              </div>
              <div>
                <h3 className="m-0 text-[16px] font-bold">
                  {lang === 'en' ? 'Confirm Fueling' : 'Konfirmasi Pengisian'}
                </h3>
                <p className="m-0 text-[12px] text-ink-3">
                  {lang === 'en' ? 'Please review before saving' : 'Cek kembali sebelum menyimpan'}
                </p>
              </div>
            </div>

            <div className="px-5 py-4 flex flex-col gap-3">
              {[
                { label: 'Unit', value: confirm.unit.name, sub: confirm.unit.spec, icon: type === 'genset' ? 'genset' : 'excavator', iconColor: type === 'genset' ? 'text-blue' : 'text-amber' },
                { label: t('form.fuelman', lang), value: fuelman.trim(), icon: 'user', iconColor: 'text-ink-2' },
                { label: t('form.user', lang), value: user.trim(), icon: 'shield', iconColor: 'text-ink-2' },
                { label: t('form.totalFueling', lang), value: `${fmtNum(litersNum)} ${t('form.liters', lang)}`, mono: true, icon: 'drop', iconColor: 'text-blue' },
                { label: t('form.time', lang), value: `${fmtTimeSec(confirm.ts)} · ${fmtDate(confirm.ts, lang)}`, mono: true, icon: 'clock', iconColor: 'text-ink-2' },
              ].map(({ label, value, sub, mono, icon, iconColor }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon name={icon} size={16} className={`flex-none ${iconColor}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] uppercase tracking-[0.5px] text-ink-3 font-semibold">{label}</div>
                    <div className={`text-[14px] font-semibold truncate ${mono ? 'font-mono' : ''}`}>{value}</div>
                    {sub && <div className="text-[11.5px] text-ink-3">{sub}</div>}
                  </div>
                </div>
              ))}

              {photo && (
                <div className="flex items-center gap-3">
                  <Icon name="camera" size={16} className="flex-none text-ink-2" />
                  <div className="flex-1">
                    <div className="text-[11px] uppercase tracking-[0.5px] text-ink-3 font-semibold mb-1">{t('form.photo', lang)}</div>
                    <img src={photo.src} alt="flowmeter" className="h-[60px] rounded border border-line object-cover" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 px-5 pb-5">
              <button className="btn btn-ghost flex-1" onClick={() => setConfirm(null)}>
                {lang === 'en' ? 'Cancel' : 'Batal'}
              </button>
              <button className="btn btn-primary flex-1" onClick={doSave}>
                <Icon name="check" size={18} />
                {lang === 'en' ? 'Yes, Save' : 'Ya, Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
