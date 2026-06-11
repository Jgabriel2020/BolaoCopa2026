import { supabase } from '../supabase.js'
import { MATCHES, TEAMS, formatDateBRT } from '../data/matches.js'

export async function renderMyPicks(user) {
  const { data: preds } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', user.id)
    .order('match_id', { ascending: true })

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, total_points')
    .eq('id', user.id)
    .single()

  const predMap = {}
  if (preds) preds.forEach(p => { predMap[p.match_id] = p })

  const totalPreds = preds?.length || 0
  const exactHits = preds?.filter(p => p.points === 3).length || 0
  const partialHits = preds?.filter(p => p.points === 1).length || 0
  const misses = preds?.filter(p => p.points === 0 && p.match_id !== null).length || 0
  const pending = preds?.filter(p => p.points === null || p.points === 0).length || 0

  return `
  <div class="max-w-3xl mx-auto px-4 py-6">
    <!-- User stats -->
    <div class="bg-gradient-to-r from-navy to-card border border-border rounded-2xl p-5 mb-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center">
          <span class="text-xl font-black text-gold">${(profile?.username || 'U')[0].toUpperCase()}</span>
        </div>
        <div>
          <h2 class="font-black text-white text-lg">${profile?.username || 'Usuário'}</h2>
          <p class="text-xs text-slate-400">Meus palpites</p>
        </div>
        <div class="ml-auto text-right">
          <div class="text-3xl font-black text-gold">${profile?.total_points || 0}</div>
          <div class="text-xs text-slate-400">pontos totais</div>
        </div>
      </div>

      <div class="grid grid-cols-4 gap-2 text-center">
        <div class="bg-navy rounded-xl p-2">
          <div class="text-xl font-black text-white">${totalPreds}</div>
          <div class="text-xs text-slate-400">palpites</div>
        </div>
        <div class="bg-yellow-900/30 rounded-xl p-2">
          <div class="text-xl font-black text-yellow-400">${exactHits}</div>
          <div class="text-xs text-slate-400">cravados</div>
        </div>
        <div class="bg-blue-900/30 rounded-xl p-2">
          <div class="text-xl font-black text-blue-400">${partialHits}</div>
          <div class="text-xs text-slate-400">acertos</div>
        </div>
        <div class="bg-slate-800/50 rounded-xl p-2">
          <div class="text-xl font-black text-slate-400">${MATCHES.length - totalPreds}</div>
          <div class="text-xs text-slate-400">pendentes</div>
        </div>
      </div>
    </div>

    ${totalPreds === 0
      ? `<div class="text-center py-16">
           <div class="text-5xl mb-4">⚽</div>
           <p class="text-slate-400">Você ainda não fez nenhum palpite.</p>
           <p class="text-xs text-slate-500 mt-2">Acesse a aba "Jogos" para começar!</p>
         </div>`
      : `<div class="flex flex-col gap-3">
           ${MATCHES.filter(m => predMap[m.id]).map(m => buildPickRow(m, predMap[m.id])).join('')}
         </div>`
    }
  </div>
  `
}

function buildPickRow(match, pred) {
  const home = TEAMS[match.home]
  const away = TEAMS[match.away]
  const hasResult = match.home_score !== null && match.home_score !== undefined
  const pts = pred.points

  let ptsBadge = ''
  let borderClass = 'border-border'
  if (hasResult) {
    if (pts === 3) {
      ptsBadge = `<span class="badge-3pts text-white text-xs font-black px-2.5 py-1 rounded-full">🎯 +3</span>`
      borderClass = 'border-yellow-700/50'
    } else if (pts === 1) {
      ptsBadge = `<span class="badge-1pt text-white text-xs font-black px-2.5 py-1 rounded-full">✓ +1</span>`
      borderClass = 'border-blue-700/50'
    } else {
      ptsBadge = `<span class="badge-0pt text-white text-xs font-black px-2.5 py-1 rounded-full">✕ 0</span>`
      borderClass = 'border-slate-700'
    }
  }

  return `
  <div class="bg-card border ${borderClass} rounded-2xl px-4 py-3">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs text-slate-500">Grupo ${match.group} · R${match.round} · ${formatDateBRT(match.match_datetime)}</span>
      ${ptsBadge}
    </div>
    <div class="flex items-center gap-3">
      <div class="flex-1 flex items-center gap-2">
        <span class="text-xl">${home.flag}</span>
        <span class="text-sm font-semibold text-white truncate">${home.name}</span>
      </div>
      <div class="flex-shrink-0 text-center">
        <div class="text-sm font-black text-gold">${pred.home_score} × ${pred.away_score}</div>
        ${hasResult
          ? `<div class="text-xs text-slate-500 mt-0.5">${match.home_score} × ${match.away_score}</div>`
          : `<div class="text-xs text-slate-500 mt-0.5">aguardando</div>`}
      </div>
      <div class="flex-1 flex items-center justify-end gap-2">
        <span class="text-sm font-semibold text-white truncate">${away.name}</span>
        <span class="text-xl">${away.flag}</span>
      </div>
    </div>
  </div>
  `
}
