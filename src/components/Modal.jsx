import { useEffect } from 'react'
import Icon from './Icon'

export default function Modal({ title, onClose, children, width }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[90] bg-navy/55 backdrop-blur-sm grid place-items-center p-5 backdrop-anim"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-lg w-full shadow-lg modal-anim overflow-hidden"
        style={{ maxWidth: width || 460 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line-2">
          <h3 className="m-0 text-[16px] font-bold">{title}</h3>
          <button
            className="w-[34px] h-[34px] grid place-items-center rounded-sm border border-line bg-surface-2 text-ink-2 transition-colors hover:bg-surface"
            onClick={onClose}
          >
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
