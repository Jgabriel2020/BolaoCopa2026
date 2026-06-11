import { supabase } from '../supabase.js'
import { MATCHES, TEAMS, formatDateBRT } from '../data/matches.js'
import { showToast } from '../components/toast.js'

export async function renderAdmin(user) {
  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, username')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return `
    <div class="max-w-3xl mx-auto px-4 py-16 text-center">
      <div class="text-5xl mb-4">🔒</div>
      <h2 class="text-xl font-bold text-white mb-2">Acesso Restrito</h2>
      <p class="text-slate-400">Apenas administradores podem atualizar resultados.</p>
    </div>
    `
  }

  // Load matches from DB to get current scores
  const { data: dbMatches } = await supabase
    .from('matches')
    .select('*')
    .order('match_datetime', { ascending: true })

  const dbMatchMap = {}
  if (dbMatches) dbMatches.forEach(m => { dbMatchMap[m.id] = m })

  return `
  <div class="max-w-3xl mx-auto px-4 py-6">
    <div class="bg-red-900/20 border border-red-700/40 rounded-2xl p-4 mb-6 flex items-center gap-3">
      <span class="text-2xl">⚙️</span>
      <div>
        <p class="font-bold text-red-300 text-sm">Painel do Administrador</p>
        <p class="text-xs text-slate-400">Atualize os resultados dos jogos. Os pontos serão calculados automaticamente.</p>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      ${MATCHES.map(match => buildAdminCard(match, dbMatchMap[match.id])).join('')}
    </div>
  </div>
  `
}

function buildAdminCard(match, dbMatch) {
  const home = TEAMS[match.home]
  const away = TEAMS[match.away]
  const hasResult = dbMatch?.home_score !== null && dbMatch?.home_score !== undefined
  const locked = new Date() >= new Date(match.match_datetime)

  return `
  <div class="bg-card border border-border rounded-2xl p-4">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold text-slate-400">Grupo ${match.group} · R${match.round}</span>
        ${hasResult ? '<span class="text-xs bg-green-900 text-green-400 px-2 py-0.5 rounded-full font-bold">Resultado salvo</span>' : ''}
        ${locked && !hasResult ? '<span class="text-xs bg-yellow-900 text-yellow-400 px-2 py-0.5 rounded-full font-bold">Em andamento</span>' : ''}
      </div>
      <span class="text-xs text-slate-500">${formatDateBRT(match.match_datetime)}</span>
    </div>

    <div class="flex items-center gap-3">
      <div class="flex-1 flex items-center gap-2">
        <span class="text-xl">${home.flag}</span>
        <span class="text-sm font-semibold text-white truncate">${home.name}</span>
      </div>

      <div class="flex items-center gap-2 flex-shrink-0">
        <input type="number" min="0" max="99"
          id="admin-home-${match.id}"
          value="${hasResult ? dbMatch.home_score : ''}"
          placeholder="0"
          ${!locked ? 'disabled' : ''}
          class="score-input bg-navy border border-border rounded-lg px-2 py-1.5 text-lg font-black text-white
                 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold
                 ${!locked ? 'opacity-40 cursor-not-allowed' : ''}" />
        <span class="text-slate-500 font-bold">×</span>
        <input type="number" min="0" max="99"
          id="admin-away-${match.id}"
          value="${hasResult ? dbMatch.away_score : ''}"
          placeholder="0"
          ${!locked ? 'disabled' : ''}
          class="score-input bg-navy border border-border rounded-lg px-2 py-1.5 text-lg font-black text-white
                 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold
                 ${!locked ? 'opacity-40 cursor-not-allowed' : ''}" />
      </div>

      <div class="flex-1 flex items-center justify-end gap-2">
        <span class="text-sm font-semibold text-white truncate">${away.name}</span>
        <span class="text-xl">${away.flag}</span>
      </div>
    </div>

    ${locked ? `
    <div class="flex gap-2 mt-3">
      <button onclick="window.saveResult(${match.id})"
        class="flex-1 bg-gold hover:bg-gold-dark text-night font-bold py-2 px-4 rounded-xl transition-colors text-sm">
        ${hasResult ? 'Atualizar resultado' : 'Salvar resultado'}
      </button>
    </div>
    ` : `
    <p class="text-xs text-slate-600 mt-3 text-center">O resultado só pode ser inserido após o início do jogo</p>
    `}
  </div>
  `
}

export function bindAdminEvents(user) {
  window.saveResult = async (matchId) => {
    const homeInput = document.getElementById(`admin-home-${matchId}`)
    const awayInput = document.getElementById(`admin-away-${matchId}`)
    if (!homeInput || !awayInput) return

    const homeScore = parseInt(homeInput.value)
    const awayScore = parseInt(awayInput.value)

    if (isNaN(homeScore) || isNaN(awayScore) || homeScore < 0 || awayScore < 0) {
      showToast('Preencha os dois placares!', 'error')
      return
    }

    const btn = homeInput.closest('.bg-card')?.querySelector('button')
    if (btn) { btn.disabled = true; btn.textContent = 'Salvando...' }

    // Update match
    const { error } = await supabase
      .from('matches')
      .update({
        home_score: homeScore,
        away_score: awayScore,
        status: 'finished',
      })
      .eq('id', matchId)

    if (error) {
      showToast('Erro ao salvar resultado: ' + error.message, 'error')
      if (btn) { btn.disabled = false; btn.textContent = 'Salvar resultado' }
      return
    }

    // Trigger point calculation via RPC
    const { error: rpcErr } = await supabase.rpc('calculate_points_for_match', {
      p_match_id: matchId,
      p_home_score: homeScore,
      p_away_score: awayScore,
    })

    if (rpcErr) {
      showToast('Resultado salvo, mas erro ao calcular pontos: ' + rpcErr.message, 'warning')
    } else {
      showToast('Resultado salvo e pontos calculados! ✓', 'success')
    }

    if (btn) {
      btn.disabled = false
      btn.textContent = 'Atualizar resultado'
      btn.classList.add('bg-green-700')
      btn.classList.remove('bg-gold')
      setTimeout(() => {
        btn.classList.remove('bg-green-700')
        btn.classList.add('bg-gold')
      }, 2000)
    }
  }
}
