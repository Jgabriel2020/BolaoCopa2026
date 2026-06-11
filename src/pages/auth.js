import { supabase } from '../supabase.js'
import { showToast } from '../components/toast.js'

export function renderAuth(mode = 'login') {
  return `
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-12">
    <!-- Logo -->
    <div class="text-center mb-8">
      <div class="text-6xl mb-3">⚽</div>
      <h1 class="text-3xl font-black text-white tracking-tight">Bolão Copa <span class="text-gold">2026</span></h1>
      <p class="text-slate-400 mt-2 text-sm">Faça seus palpites e dispute o ranking!</p>
    </div>

    <!-- Card -->
    <div class="w-full max-w-sm bg-card border border-border rounded-2xl p-7 shadow-2xl">
      <!-- Tabs -->
      <div class="flex border-b border-border mb-6">
        <button id="tab-login"
          class="flex-1 pb-3 text-sm font-semibold transition-colors ${mode === 'login' ? 'tab-active' : 'text-slate-400 hover:text-white'}"
          onclick="window.renderPage('login')">
          Entrar
        </button>
        <button id="tab-register"
          class="flex-1 pb-3 text-sm font-semibold transition-colors ${mode === 'register' ? 'tab-active' : 'text-slate-400 hover:text-white'}"
          onclick="window.renderPage('register')">
          Cadastrar
        </button>
      </div>

      ${mode === 'login' ? loginForm() : registerForm()}
    </div>

    <p class="text-slate-600 text-xs mt-6">Copa do Mundo FIFA 2026 · EUA, México e Canadá</p>
  </div>
  `
}

function loginForm() {
  return `
  <form id="login-form" class="flex flex-col gap-4">
    <div>
      <label class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">E-mail</label>
      <input id="login-email" type="email" required autocomplete="email"
        placeholder="seu@email.com"
        class="w-full bg-navy border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600
               focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors" />
    </div>
    <div>
      <label class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Senha</label>
      <input id="login-password" type="password" required autocomplete="current-password"
        placeholder="••••••••"
        class="w-full bg-navy border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600
               focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors" />
    </div>
    <button type="submit" id="login-btn"
      class="mt-2 bg-gold hover:bg-gold-dark text-night font-bold py-2.5 px-4 rounded-xl transition-colors text-sm">
      Entrar
    </button>
    <p id="login-error" class="text-red-400 text-xs text-center hidden"></p>
  </form>
  `
}

function registerForm() {
  return `
  <form id="register-form" class="flex flex-col gap-4">
    <div>
      <label class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Nome de usuário</label>
      <input id="reg-username" type="text" required autocomplete="username"
        placeholder="seu_nick"
        maxlength="20"
        class="w-full bg-navy border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600
               focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors" />
    </div>
    <div>
      <label class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">E-mail</label>
      <input id="reg-email" type="email" required autocomplete="email"
        placeholder="seu@email.com"
        class="w-full bg-navy border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600
               focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors" />
    </div>
    <div>
      <label class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Senha</label>
      <input id="reg-password" type="password" required autocomplete="new-password"
        placeholder="Mínimo 6 caracteres"
        minlength="6"
        class="w-full bg-navy border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600
               focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors" />
    </div>
    <button type="submit" id="reg-btn"
      class="mt-2 bg-gold hover:bg-gold-dark text-night font-bold py-2.5 px-4 rounded-xl transition-colors text-sm">
      Criar conta
    </button>
    <p id="reg-error" class="text-red-400 text-xs text-center hidden"></p>
  </form>
  `
}

export function bindAuthEvents(mode) {
  if (mode === 'login') {
    document.getElementById('login-form')?.addEventListener('submit', handleLogin)
  } else {
    document.getElementById('register-form')?.addEventListener('submit', handleRegister)
  }
}

async function handleLogin(e) {
  e.preventDefault()
  const btn = document.getElementById('login-btn')
  const errEl = document.getElementById('login-error')
  const email = document.getElementById('login-email').value.trim()
  const password = document.getElementById('login-password').value

  btn.disabled = true
  btn.textContent = 'Entrando...'
  errEl.classList.add('hidden')

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    errEl.textContent = error.message === 'Invalid login credentials'
      ? 'E-mail ou senha incorretos.'
      : error.message
    errEl.classList.remove('hidden')
    btn.disabled = false
    btn.textContent = 'Entrar'
  } else {
    showToast('Bem-vindo de volta! ⚽', 'success')
    window.renderPage('dashboard')
  }
}

async function handleRegister(e) {
  e.preventDefault()
  const btn = document.getElementById('reg-btn')
  const errEl = document.getElementById('reg-error')
  const username = document.getElementById('reg-username').value.trim()
  const email = document.getElementById('reg-email').value.trim()
  const password = document.getElementById('reg-password').value

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    errEl.textContent = 'Nome de usuário deve ter 3-20 caracteres (letras, números ou _).'
    errEl.classList.remove('hidden')
    return
  }

  btn.disabled = true
  btn.textContent = 'Cadastrando...'
  errEl.classList.add('hidden')

  // Check username uniqueness
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle()

  if (existing) {
    errEl.textContent = 'Este nome de usuário já está em uso.'
    errEl.classList.remove('hidden')
    btn.disabled = false
    btn.textContent = 'Criar conta'
    return
  }

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    errEl.textContent = error.message
    errEl.classList.remove('hidden')
    btn.disabled = false
    btn.textContent = 'Criar conta'
    return
  }

  // Create profile
  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      username,
      total_points: 0,
    })
  }

  showToast('Conta criada! Bem-vindo ao Bolão! 🎉', 'success')
  window.renderPage('dashboard')
}
