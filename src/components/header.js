import { supabase } from '../supabase.js'

export function renderHeader(activePage, username, isAdmin) {
  const nav = [
    { id: 'dashboard', label: 'Jogos',    icon: '⚽' },
    { id: 'mypicks',   label: 'Meus Palpites', icon: '🎯' },
    { id: 'ranking',   label: 'Ranking',   icon: '🏆' },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: '⚙️' }] : []),
  ]

  const navItems = nav.map(item => `
    <button onclick="window.renderPage('${item.id}')"
      class="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all
        ${activePage === item.id
          ? 'text-gold'
          : 'text-slate-500 hover:text-slate-300'}">
      <span class="text-lg">${item.icon}</span>
      <span class="hidden sm:block">${item.label}</span>
    </button>
  `).join('')

  return `
  <header class="sticky top-0 z-40 bg-navy/90 backdrop-blur-lg border-b border-border">
    <div class="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center gap-2 cursor-pointer" onclick="window.renderPage('dashboard')">
        <span class="text-xl">⚽</span>
        <span class="font-black text-white text-sm sm:text-base">Bolão <span class="text-gold">2026</span></span>
      </div>

      <!-- Nav -->
      <nav class="flex items-center gap-1">
        ${navItems}
      </nav>

      <!-- User -->
      <div class="flex items-center gap-2">
        <div class="hidden sm:flex flex-col items-end">
          <span class="text-xs font-semibold text-white">${username || 'Usuário'}</span>
        </div>
        <button onclick="window.handleLogout()"
          class="text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-900/20"
          title="Sair">
          Sair
        </button>
      </div>
    </div>
  </header>
  `
}

export async function bindHeaderLogout() {
  window.handleLogout = async () => {
    await supabase.auth.signOut()
    window.renderPage('login')
  }
}
