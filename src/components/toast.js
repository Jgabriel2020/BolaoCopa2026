export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container')
  const colors = {
    success: 'bg-green-600 border-green-500',
    error:   'bg-red-700 border-red-600',
    info:    'bg-blue-700 border-blue-600',
    warning: 'bg-yellow-600 border-yellow-500',
  }
  const icons = {
    success: '✓',
    error:   '✕',
    info:    'ℹ',
    warning: '⚠',
  }
  const el = document.createElement('div')
  el.className = `toast flex items-center gap-3 px-4 py-3 rounded-xl border text-white text-sm font-medium shadow-2xl ${colors[type]}`
  el.innerHTML = `<span class="text-lg font-bold">${icons[type]}</span><span>${message}</span>`
  container.appendChild(el)
  setTimeout(() => {
    el.style.opacity = '0'
    el.style.transition = 'opacity 0.3s ease'
    setTimeout(() => el.remove(), 300)
  }, 3500)
}
