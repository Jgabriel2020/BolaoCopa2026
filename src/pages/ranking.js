import { supabase } from '../supabase.js'

let realtimeSub = null
let currentUserId = null

export async function renderRanking(user) {
  currentUserId = user.id
  const html = `
  <div class="max-w-3xl mx-auto px-4 py-6">
    <div id="ranking-content">
      <div class="flex justify-center py-12"><div class="loading-spinner"></div></div>
    </div>
  </div>
  `
  return html
}

export async function loadRankingData() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, total_points')
    .order('total_points', { ascending: false })
    .limit(100)

  if (error) {
    return '<p class="text-red-400 text-center py-8">Erro ao carregar ranking.</p>'
  }

  // Get prediction counts per user
  const { data: predCounts } = await supabase
    .from('predictions')
    .select('user_id, points')

  const countMap = {}
  const pointsBreakdown = {}
  if (predCounts) {
    predCounts.forEach(p => {
      if (!countMap[p.user_id]) countMap[p.user_id] = { total: 0, exact: 0, partial: 0 }
      countMap[p.user_id].total++
      if (p.points === 3) countMap[p.user_id].exact++
      else if (p.points === 1) countMap[p.user_id].partial++
    })
  }

  if (!data || data.length === 0) {
    return `
      <div class="text-center py-16">
        <div class="text-5xl mb-4">🏆</div>
        <p class="text-slate-400">O ranking ainda está vazio. Seja o primeiro a fazer palpites!</p>
      </div>
    `
  }

  const rows = data.map((profile, index) => {
    const rank = index + 1
    const isMe = profile.id === currentUserId
    const counts = countMap[profile.id] || { total: 0, exact: 0, partial: 0 }

    const medalEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`
    const rankDisplay = rank <= 3
      ? `<span class="text-2xl">${medalEmoji}</span>`
      : `<span class="text-sm font-bold text-slate-500 w-8 text-center">${rank}°</span>`

    return `
    <div class="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all
      ${isMe
        ? 'bg-gold/10 border-gold/40 glow-gold'
        : 'bg-card border-border hover:border-slate-600'}">
      <div class="flex-shrink-0 w-10 flex items-center justify-center">
        ${rankDisplay}
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span class="font-bold text-sm text-white truncate">${profile.username}</span>
          ${isMe ? '<span class="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full font-semibold flex-shrink-0">Você</span>' : ''}
        </div>
        <div class="flex items-center gap-3 mt-0.5">
          <span class="text-xs text-slate-500">${counts.total} palpite${counts.total !== 1 ? 's' : ''}</span>
          ${counts.exact > 0 ? `<span class="text-xs text-yellow-500">🎯 ${counts.exact} cravo${counts.exact !== 1 ? 's' : ''}</span>` : ''}
          ${counts.partial > 0 ? `<span class="text-xs text-blue-400">✓ ${counts.partial} acerto${counts.partial !== 1 ? 's' : ''}</span>` : ''}
        </div>
      </div>
      <div class="flex-shrink-0 text-right">
        <div class="text-2xl font-black ${isMe ? 'text-gold' : 'text-white'}">${profile.total_points}</div>
        <div class="text-xs text-slate-500">pontos</div>
      </div>
    </div>
    `
  }).join('')

  return `
  <div>
    <!-- Header card -->
    <div class="bg-gradient-to-r from-gold/20 to-yellow-900/20 border border-gold/30 rounded-2xl p-5 mb-6 text-center">
      <div class="text-4xl mb-2">🏆</div>
      <h2 class="text-xl font-black text-white">Ranking Geral</h2>
      <p class="text-xs text-slate-400 mt-1">Atualizado em tempo real</p>
    </div>

    <!-- Legend -->
    <div class="flex items-center gap-4 mb-4 px-1 text-xs text-slate-500">
      <span class="flex items-center gap-1"><span class="badge-3pts rounded px-1.5 py-0.5 text-white font-bold text-xs">3pts</span> Placar exato</span>
      <span class="flex items-center gap-1"><span class="badge-1pt rounded px-1.5 py-0.5 text-white font-bold text-xs">1pt</span> Vencedor/Empate</span>
      <span class="flex items-center gap-1"><span class="badge-0pt rounded px-1.5 py-0.5 text-white font-bold text-xs">0pts</span> Errou</span>
    </div>

    <!-- Ranking rows -->
    <div class="flex flex-col gap-2">
      ${rows}
    </div>
  </div>
  `
}

export function bindRankingEvents(user) {
  currentUserId = user.id

  // Load initial data
  loadRankingData().then(html => {
    const el = document.getElementById('ranking-content')
    if (el) el.innerHTML = html
  })

  // Subscribe to real-time ranking updates
  realtimeSub = supabase
    .channel('ranking-realtime')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, () => {
      loadRankingData().then(html => {
        const el = document.getElementById('ranking-content')
        if (el) el.innerHTML = html
      })
    })
    .subscribe()
}

export function cleanupRanking() {
  if (realtimeSub) {
    supabase.removeChannel(realtimeSub)
    realtimeSub = null
  }
}
