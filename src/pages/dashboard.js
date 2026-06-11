import { supabase } from '../supabase.js'
import { MATCHES, TEAMS, GROUPS, isMatchLocked, formatDateBRT, formatTimeBRT, formatDayBRT } from '../data/matches.js'
import { showToast } from '../components/toast.js'

let userPredictions = {}
let currentUser = null
let viewMode = 'rodada' // 'rodada' | 'grupo'
let activeFilter = 1    // round 1/2/3 or group A-L
let realtimeSub = null

export async function renderDashboard(user) {
  currentUser = user

  // Load user predictions
  const { data: preds } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', user.id)

  userPredictions = {}
  if (preds) preds.forEach(p => { userPredictions[p.match_id] = p })

  return buildDashboardHTML()
}

function buildDashboardHTML() {
  return `
  <div class="max-w-3xl mx-auto px-4 py-6">
    <!-- View toggle -->
    <div class="flex gap-2 mb-5 bg-card border border-border rounded-xl p-1">
      <button onclick="window.setDashView('rodada')"
        id="btn-view-rodada"
        class="flex-1 py-2 text-sm font-semibold rounded-lg transition-all
          ${viewMode === 'rodada' ? 'bg-gold text-night' : 'text-slate-400 hover:text-white'}">
        Por Rodada
      </button>
      <button onclick="window.setDashView('grupo')"
        id="btn-view-grupo"
        class="flex-1 py-2 text-sm font-semibold rounded-lg transition-all
          ${viewMode === 'grupo' ? 'bg-gold text-night' : 'text-slate-400 hover:text-white'}">
        Por Grupo
      </button>
    </div>

    <!-- Filter pills -->
    <div id="filter-pills" class="flex gap-2 overflow-x-auto pb-2 mb-5 scroll-fade">
      ${buildFilterPills()}
    </div>

    <!-- Matches list -->
    <div id="matches-list">
      ${buildMatchList()}
    </div>
  </div>
  `
}

function buildFilterPills() {
  if (viewMode === 'rodada') {
    return [1, 2, 3].map(r => `
      <button onclick="window.setDashFilter(${r})"
        class="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all
          ${activeFilter === r
            ? 'bg-gold border-gold text-night'
            : 'border-border text-slate-400 hover:border-gold hover:text-gold'}">
        Rodada ${r}
      </button>
    `).join('')
  } else {
    return GROUPS.map(g => `
      <button onclick="window.setDashFilter('${g}')"
        class="flex-shrink-0 w-9 h-9 rounded-full text-sm font-bold border transition-all
          ${activeFilter === g
            ? 'bg-gold border-gold text-night'
            : 'border-border text-slate-400 hover:border-gold hover:text-gold'}">
        ${g}
      </button>
    `).join('')
  }
}

function buildMatchList() {
  let matches
  if (viewMode === 'rodada') {
    matches = MATCHES
      .filter(m => m.round === activeFilter)
      .sort((a, b) => new Date(a.match_datetime) - new Date(b.match_datetime))
  } else {
    matches = MATCHES
      .filter(m => m.group === activeFilter)
      .sort((a, b) => a.round - b.round || new Date(a.match_datetime) - new Date(b.match_datetime))
  }

  if (!matches.length) return '<p class="text-slate-500 text-center py-8">Nenhum jogo encontrado.</p>'

  // Group by day
  const byDay = {}
  matches.forEach(m => {
    const day = formatDayBRT(m.match_datetime)
    if (!byDay[day]) byDay[day] = []
    byDay[day].push(m)
  })

  return Object.entries(byDay).map(([day, dayMatches]) => `
    <div class="mb-6">
      <h3 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">${day}</h3>
      <div class="flex flex-col gap-3">
        ${dayMatches.map(m => buildMatchCard(m)).join('')}
      </div>
    </div>
  `).join('')
}

function buildMatchCard(match) {
  const home = TEAMS[match.home]
  const away = TEAMS[match.away]
  const locked = isMatchLocked(match)
  const pred = userPredictions[match.id]
  const hasResult = match.home_score !== null && match.home_score !== undefined
  const isLive = !hasResult && locked

  let statusBadge = ''
  if (hasResult) {
    statusBadge = `<span class="text-xs bg-green-900 text-green-400 font-bold px-2 py-0.5 rounded-full">Encerrado</span>`
  } else if (isLive) {
    statusBadge = `<div class="flex items-center gap-1.5"><div class="live-dot"></div><span class="text-xs font-bold text-green-400">Ao vivo</span></div>`
  }

  let pointsBadge = ''
  if (pred && hasResult) {
    const pts = pred.points ?? 0
    const cls = pts === 3 ? 'badge-3pts' : pts === 1 ? 'badge-1pt' : 'badge-0pt'
    const label = pts === 3 ? '+3 pts' : pts === 1 ? '+1 pt' : '0 pts'
    pointsBadge = `<span class="${cls} text-white text-xs font-black px-2.5 py-0.5 rounded-full">${label}</span>`
  }

  const groupColor = getGroupColor(match.group)

  return `
  <div class="match-card bg-card border border-border rounded-2xl overflow-hidden hover:border-slate-600">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 pt-3 pb-2 border-b border-border">
      <div class="flex items-center gap-2">
        <span class="group-tag ${groupColor}">GRUPO ${match.group}</span>
        <span class="text-slate-500 text-xs">· Rodada ${match.round}</span>
      </div>
      <div class="flex items-center gap-2 text-xs text-slate-500">
        ${statusBadge}
        ${!statusBadge ? `<span>⏰ ${formatTimeBRT(match.match_datetime)} BRT</span>` : ''}
        ${pointsBadge}
      </div>
    </div>

    <!-- Teams & Score -->
    <div class="px-4 py-4">
      <div class="flex items-center justify-between gap-3">
        <!-- Home -->
        <div class="flex-1 flex flex-col items-center gap-1.5 min-w-0">
          <span class="text-3xl">${home.flag}</span>
          <span class="text-xs font-semibold text-center text-white leading-tight">${home.name}</span>
        </div>

        <!-- Score / Prediction -->
        <div class="flex-shrink-0 flex flex-col items-center gap-2">
          ${buildScoreSection(match, pred, locked)}
        </div>

        <!-- Away -->
        <div class="flex-1 flex flex-col items-center gap-1.5 min-w-0">
          <span class="text-3xl">${away.flag}</span>
          <span class="text-xs font-semibold text-center text-white leading-tight">${away.name}</span>
        </div>
      </div>

      ${buildPredictionSection(match, pred, locked)}
    </div>
  </div>
  `
}

function buildScoreSection(match, pred, locked) {
  const hasResult = match.home_score !== null && match.home_score !== undefined

  if (hasResult) {
    // Show actual result
    return `
      <div class="flex items-center gap-2">
        <span class="text-3xl font-black text-white w-8 text-center">${match.home_score}</span>
        <span class="text-slate-500 font-bold text-lg">×</span>
        <span class="text-3xl font-black text-white w-8 text-center">${match.away_score}</span>
      </div>
      ${pred ? `<div class="text-xs text-slate-500">Seu palpite: ${pred.home_score}×${pred.away_score}</div>` : ''}
    `
  } else if (locked) {
    if (pred) {
      return `
        <div class="flex items-center gap-2">
          <span class="text-2xl font-black text-gold w-8 text-center">${pred.home_score}</span>
          <span class="text-slate-500 font-bold text-lg">×</span>
          <span class="text-2xl font-black text-gold w-8 text-center">${pred.away_score}</span>
        </div>
        <div class="text-xs text-slate-500">Palpite enviado</div>
      `
    }
    return `
      <div class="text-sm text-slate-500 font-semibold text-center">
        <div class="text-2xl font-black">— × —</div>
        <div class="text-xs mt-1">Jogo bloqueado</div>
      </div>
    `
  }

  // Not locked, show input if no pred, else show pred with locked msg
  if (pred) {
    return `
      <div class="flex items-center gap-2">
        <span class="text-2xl font-black text-gold w-8 text-center">${pred.home_score}</span>
        <span class="text-slate-500 font-bold text-lg">×</span>
        <span class="text-2xl font-black text-gold w-8 text-center">${pred.away_score}</span>
      </div>
      <div class="text-xs text-green-400 font-semibold">✓ Palpite salvo</div>
    `
  }

  return `
    <div class="flex items-center gap-2">
      <input type="number" min="0" max="99"
        id="home-${match.id}"
        placeholder="0"
        class="score-input bg-navy border border-border rounded-lg px-2 py-1.5 text-xl font-black text-white
               focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold" />
      <span class="text-slate-500 font-bold text-lg">×</span>
      <input type="number" min="0" max="99"
        id="away-${match.id}"
        placeholder="0"
        class="score-input bg-navy border border-border rounded-lg px-2 py-1.5 text-xl font-black text-white
               focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold" />
    </div>
    <button onclick="window.savePrediction(${match.id})"
      class="text-xs font-bold bg-gold hover:bg-gold-dark text-night px-4 py-1.5 rounded-full transition-colors">
      Salvar palpite
    </button>
  `
}

function buildPredictionSection(match, pred, locked) {
  if (!locked || match.home_score === null) return ''
  return ''
}

function getGroupColor(group) {
  const colors = {
    A: 'bg-red-900 text-red-400',
    B: 'bg-orange-900 text-orange-400',
    C: 'bg-yellow-900 text-yellow-400',
    D: 'bg-green-900 text-green-400',
    E: 'bg-teal-900 text-teal-400',
    F: 'bg-cyan-900 text-cyan-400',
    G: 'bg-blue-900 text-blue-400',
    H: 'bg-indigo-900 text-indigo-400',
    I: 'bg-violet-900 text-violet-400',
    J: 'bg-purple-900 text-purple-400',
    K: 'bg-pink-900 text-pink-400',
    L: 'bg-rose-900 text-rose-400',
  }
  return colors[group] || 'bg-slate-800 text-slate-400'
}

export function bindDashboardEvents(user) {
  currentUser = user

  window.setDashView = (mode) => {
    viewMode = mode
    activeFilter = mode === 'rodada' ? 1 : 'A'
    const el = document.getElementById('matches-list')
    const pills = document.getElementById('filter-pills')
    if (!el || !pills) return

    // Update toggle buttons
    document.getElementById('btn-view-rodada').className = `flex-1 py-2 text-sm font-semibold rounded-lg transition-all
      ${mode === 'rodada' ? 'bg-gold text-night' : 'text-slate-400 hover:text-white'}`
    document.getElementById('btn-view-grupo').className = `flex-1 py-2 text-sm font-semibold rounded-lg transition-all
      ${mode === 'grupo' ? 'bg-gold text-night' : 'text-slate-400 hover:text-white'}`

    pills.innerHTML = buildFilterPills()
    el.innerHTML = buildMatchList()
    bindScoreInputs()
  }

  window.setDashFilter = (filter) => {
    activeFilter = filter
    const el = document.getElementById('matches-list')
    const pills = document.getElementById('filter-pills')
    if (!el || !pills) return
    pills.innerHTML = buildFilterPills()
    el.innerHTML = buildMatchList()
    bindScoreInputs()
  }

  window.savePrediction = async (matchId) => {
    const match = MATCHES.find(m => m.id === matchId)
    if (!match) return

    if (isMatchLocked(match)) {
      showToast('Esse jogo já começou — palpite bloqueado!', 'warning')
      return
    }

    const homeInput = document.getElementById(`home-${matchId}`)
    const awayInput = document.getElementById(`away-${matchId}`)
    if (!homeInput || !awayInput) return

    const homeScore = parseInt(homeInput.value)
    const awayScore = parseInt(awayInput.value)

    if (isNaN(homeScore) || isNaN(awayScore) || homeScore < 0 || awayScore < 0) {
      showToast('Preencha os dois placares corretamente!', 'error')
      return
    }

    const btn = homeInput.closest('.match-card')?.querySelector('button')
    if (btn) { btn.disabled = true; btn.textContent = 'Salvando...' }

    const { error } = await supabase
      .from('predictions')
      .insert({
        user_id: user.id,
        match_id: matchId,
        home_score: homeScore,
        away_score: awayScore,
      })

    if (error) {
      showToast(error.code === '23505' ? 'Você já tem um palpite para esse jogo!' : 'Erro ao salvar palpite.', 'error')
      if (btn) { btn.disabled = false; btn.textContent = 'Salvar palpite' }
      return
    }

    userPredictions[matchId] = { match_id: matchId, home_score: homeScore, away_score: awayScore, points: 0 }
    showToast('Palpite salvo com sucesso! 🎯', 'success')

    // Re-render only the affected card
    const el = document.getElementById('matches-list')
    if (el) { el.innerHTML = buildMatchList(); bindScoreInputs() }
  }

  // Subscribe to real-time match updates
  realtimeSub = supabase
    .channel('matches-realtime')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'matches' }, async (payload) => {
      const updated = payload.new
      // Update local match data
      const idx = MATCHES.findIndex(m => m.id === updated.id)
      if (idx !== -1) {
        MATCHES[idx].home_score = updated.home_score
        MATCHES[idx].away_score = updated.away_score
        MATCHES[idx].status = updated.status
      }
      // Reload predictions (points may have changed)
      const { data: preds } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user.id)
      userPredictions = {}
      if (preds) preds.forEach(p => { userPredictions[p.match_id] = p })

      const el = document.getElementById('matches-list')
      if (el) { el.innerHTML = buildMatchList(); bindScoreInputs() }
    })
    .subscribe()

  bindScoreInputs()
}

function bindScoreInputs() {
  // Allow only numbers 0-99 in score inputs
  document.querySelectorAll('input[type=number]').forEach(input => {
    input.addEventListener('input', () => {
      let v = parseInt(input.value)
      if (isNaN(v) || v < 0) input.value = ''
      else if (v > 99) input.value = 99
    })
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const matchId = parseInt(input.id.split('-')[1])
        window.savePrediction(matchId)
      }
    })
  })
}

export function cleanupDashboard() {
  if (realtimeSub) {
    supabase.removeChannel(realtimeSub)
    realtimeSub = null
  }
}
