export default function Field({ label, required, hint, children, error }) {
  return (
    <div className="mb-[18px]">
      {label && (
        <label className="block text-[12.5px] font-semibold text-ink mb-[7px] tracking-[0.1px]">
          {label}
          {required && <span className="text-red ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint && <div className="text-[11.5px] text-ink-3 mt-1.5">{hint}</div>}
      {error && <div className="text-[11.5px] text-red font-semibold mt-1.5">{error}</div>}
    </div>
  )
}
