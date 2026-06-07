import Icon from './Icon'

export default function ToastHost({ toasts }) {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-20 lg:bottom-6 z-[80] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-[420px]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-navy text-white rounded px-4 py-[13px] flex items-center gap-3 shadow-lg toast-anim"
        >
          <div className={`w-[30px] h-[30px] rounded-full grid place-items-center flex-none ${toast.type === 'success' ? 'bg-green' : 'bg-red'}`}>
            <Icon name={toast.type === 'success' ? 'check' : 'alert'} size={18} />
          </div>
          <div>
            <b className="text-[14px] block">{toast.title}</b>
            {toast.sub && <span className="text-[12px] text-[#9fb3c4]">{toast.sub}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
