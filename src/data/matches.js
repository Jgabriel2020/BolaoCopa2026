// Todos os jogos da fase de grupos da Copa do Mundo 2026
// match_datetime em UTC (horário de Brasília = UTC-3, então BRT+3h = UTC)
// Exemplos: 16h BRT = 19:00 UTC | 19h BRT = 22:00 UTC

export const TEAMS = {
  // Grupo A
  MEX: { name: 'México',             flag: '🇲🇽', group: 'A' },
  RSA: { name: 'África do Sul',      flag: '🇿🇦', group: 'A' },
  KOR: { name: 'Coreia do Sul',      flag: '🇰🇷', group: 'A' },
  CZE: { name: 'Tchéquia',          flag: '🇨🇿', group: 'A' },
  // Grupo B
  CAN: { name: 'Canadá',            flag: '🇨🇦', group: 'B' },
  BIH: { name: 'Bósnia-Herz.',      flag: '🇧🇦', group: 'B' },
  QAT: { name: 'Qatar',             flag: '🇶🇦', group: 'B' },
  SUI: { name: 'Suíça',             flag: '🇨🇭', group: 'B' },
  // Grupo C
  BRA: { name: 'Brasil',            flag: '🇧🇷', group: 'C' },
  MAR: { name: 'Marrocos',          flag: '🇲🇦', group: 'C' },
  HAI: { name: 'Haiti',             flag: '🇭🇹', group: 'C' },
  SCO: { name: 'Escócia',           flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C' },
  // Grupo D
  USA: { name: 'EUA',               flag: '🇺🇸', group: 'D' },
  PAR: { name: 'Paraguai',          flag: '🇵🇾', group: 'D' },
  AUS: { name: 'Austrália',         flag: '🇦🇺', group: 'D' },
  TUR: { name: 'Turquia',           flag: '🇹🇷', group: 'D' },
  // Grupo E
  GER: { name: 'Alemanha',          flag: '🇩🇪', group: 'E' },
  CUW: { name: 'Curaçao',           flag: '🇨🇼', group: 'E' },
  CIV: { name: 'Costa do Marfim',   flag: '🇨🇮', group: 'E' },
  ECU: { name: 'Equador',           flag: '🇪🇨', group: 'E' },
  // Grupo F
  NED: { name: 'Holanda',           flag: '🇳🇱', group: 'F' },
  JPN: { name: 'Japão',             flag: '🇯🇵', group: 'F' },
  SWE: { name: 'Suécia',            flag: '🇸🇪', group: 'F' },
  TUN: { name: 'Tunísia',           flag: '🇹🇳', group: 'F' },
  // Grupo G
  BEL: { name: 'Bélgica',           flag: '🇧🇪', group: 'G' },
  EGY: { name: 'Egito',             flag: '🇪🇬', group: 'G' },
  IRN: { name: 'Irã',               flag: '🇮🇷', group: 'G' },
  NZL: { name: 'Nova Zelândia',     flag: '🇳🇿', group: 'G' },
  // Grupo H
  ESP: { name: 'Espanha',           flag: '🇪🇸', group: 'H' },
  CPV: { name: 'Cabo Verde',        flag: '🇨🇻', group: 'H' },
  KSA: { name: 'Arábia Saudita',    flag: '🇸🇦', group: 'H' },
  URU: { name: 'Uruguai',           flag: '🇺🇾', group: 'H' },
  // Grupo I
  FRA: { name: 'França',            flag: '🇫🇷', group: 'I' },
  IRQ: { name: 'Iraque',            flag: '🇮🇶', group: 'I' },
  NOR: { name: 'Noruega',           flag: '🇳🇴', group: 'I' },
  SEN: { name: 'Senegal',           flag: '🇸🇳', group: 'I' },
  // Grupo J
  ARG: { name: 'Argentina',         flag: '🇦🇷', group: 'J' },
  ALG: { name: 'Argélia',           flag: '🇩🇿', group: 'J' },
  AUT: { name: 'Áustria',           flag: '🇦🇹', group: 'J' },
  JOR: { name: 'Jordânia',          flag: '🇯🇴', group: 'J' },
  // Grupo K
  POR: { name: 'Portugal',          flag: '🇵🇹', group: 'K' },
  COD: { name: 'Congo RD',          flag: '🇨🇩', group: 'K' },
  UZB: { name: 'Uzbequistão',       flag: '🇺🇿', group: 'K' },
  COL: { name: 'Colômbia',          flag: '🇨🇴', group: 'K' },
  // Grupo L
  ENG: { name: 'Inglaterra',        flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L' },
  CRO: { name: 'Croácia',           flag: '🇭🇷', group: 'L' },
  GHA: { name: 'Gana',              flag: '🇬🇭', group: 'L' },
  PAN: { name: 'Panamá',            flag: '🇵🇦', group: 'L' },
}

// Todos os 72 jogos da fase de grupos
// match_datetime em UTC | BRT = UTC - 3h
export const MATCHES = [
  // ─── RODADA 1 ────────────────────────────────────────────────────────────
  // Grupo A
  { id: 1,  group: 'A', round: 1, home: 'MEX', away: 'RSA', match_datetime: '2026-06-11T19:00:00Z', venue: 'Cidade do México, MEX' },
  { id: 2,  group: 'A', round: 1, home: 'KOR', away: 'CZE', match_datetime: '2026-06-12T02:00:00Z', venue: 'Zapopan, MEX' },
  // Grupo B
  { id: 3,  group: 'B', round: 1, home: 'CAN', away: 'BIH', match_datetime: '2026-06-12T19:00:00Z', venue: 'Toronto, CAN' },
  { id: 4,  group: 'D', round: 1, home: 'USA', away: 'PAR', match_datetime: '2026-06-13T01:00:00Z', venue: 'Inglewood, EUA' },
  // Grupo B / D
  { id: 5,  group: 'B', round: 1, home: 'QAT', away: 'SUI', match_datetime: '2026-06-13T19:00:00Z', venue: 'Santa Clara, EUA' },
  // Grupo C
  { id: 6,  group: 'C', round: 1, home: 'BRA', away: 'MAR', match_datetime: '2026-06-13T22:00:00Z', venue: 'East Rutherford, EUA' },
  { id: 7,  group: 'C', round: 1, home: 'HAI', away: 'SCO', match_datetime: '2026-06-14T01:00:00Z', venue: 'Foxborough, EUA' },
  // Grupo D
  { id: 8,  group: 'D', round: 1, home: 'AUS', away: 'TUR', match_datetime: '2026-06-14T04:00:00Z', venue: 'Vancouver, CAN' },
  // Grupo E
  { id: 9,  group: 'E', round: 1, home: 'GER', away: 'CUW', match_datetime: '2026-06-14T17:00:00Z', venue: 'Houston, EUA' },
  { id: 10, group: 'E', round: 1, home: 'CIV', away: 'ECU', match_datetime: '2026-06-14T23:00:00Z', venue: 'Philadelphia, EUA' },
  // Grupo F
  { id: 11, group: 'F', round: 1, home: 'NED', away: 'JPN', match_datetime: '2026-06-15T20:00:00Z', venue: 'Arlington, EUA' },
  { id: 12, group: 'F', round: 1, home: 'SWE', away: 'TUN', match_datetime: '2026-06-15T02:00:00Z', venue: 'Monterrey, MEX' },
  // Grupo H
  { id: 13, group: 'H', round: 1, home: 'ESP', away: 'CPV', match_datetime: '2026-06-15T17:00:00Z', venue: 'Atlanta, EUA' },
  // Grupo G
  { id: 14, group: 'G', round: 1, home: 'BEL', away: 'EGY', match_datetime: '2026-06-15T22:00:00Z', venue: 'Seattle, EUA' },
  { id: 15, group: 'H', round: 1, home: 'KSA', away: 'URU', match_datetime: '2026-06-15T22:00:00Z', venue: 'Miami Gardens, EUA' },
  { id: 16, group: 'G', round: 1, home: 'IRN', away: 'NZL', match_datetime: '2026-06-16T04:00:00Z', venue: 'Inglewood, EUA' },
  // Grupo I
  { id: 17, group: 'I', round: 1, home: 'FRA', away: 'SEN', match_datetime: '2026-06-16T19:00:00Z', venue: 'East Rutherford, EUA' },
  { id: 18, group: 'I', round: 1, home: 'IRQ', away: 'NOR', match_datetime: '2026-06-16T22:00:00Z', venue: 'Foxborough, EUA' },
  // Grupo J
  { id: 19, group: 'J', round: 1, home: 'ARG', away: 'ALG', match_datetime: '2026-06-17T01:00:00Z', venue: 'Kansas City, EUA' },
  { id: 20, group: 'J', round: 1, home: 'AUT', away: 'JOR', match_datetime: '2026-06-17T04:00:00Z', venue: 'Santa Clara, EUA' },
  // Grupo K
  { id: 21, group: 'K', round: 1, home: 'POR', away: 'COD', match_datetime: '2026-06-17T17:00:00Z', venue: 'Houston, EUA' },
  // Grupo L
  { id: 22, group: 'L', round: 1, home: 'ENG', away: 'CRO', match_datetime: '2026-06-17T20:00:00Z', venue: 'Arlington, EUA' },
  { id: 23, group: 'L', round: 1, home: 'GHA', away: 'PAN', match_datetime: '2026-06-17T23:00:00Z', venue: 'Toronto, CAN' },
  { id: 24, group: 'K', round: 1, home: 'UZB', away: 'COL', match_datetime: '2026-06-18T02:00:00Z', venue: 'Cidade do México, MEX' },

  // ─── RODADA 2 ────────────────────────────────────────────────────────────
  // Grupo A
  { id: 25, group: 'A', round: 2, home: 'CZE', away: 'RSA', match_datetime: '2026-06-18T16:00:00Z', venue: 'Atlanta, EUA' },
  { id: 26, group: 'B', round: 2, home: 'SUI', away: 'BIH', match_datetime: '2026-06-18T19:00:00Z', venue: 'Inglewood, EUA' },
  { id: 27, group: 'B', round: 2, home: 'CAN', away: 'QAT', match_datetime: '2026-06-18T22:00:00Z', venue: 'Vancouver, CAN' },
  { id: 28, group: 'A', round: 2, home: 'MEX', away: 'KOR', match_datetime: '2026-06-19T01:00:00Z', venue: 'Zapopan, MEX' },
  // Grupo D
  { id: 29, group: 'D', round: 2, home: 'USA', away: 'AUS', match_datetime: '2026-06-19T19:00:00Z', venue: 'Seattle, EUA' },
  // Grupo C
  { id: 30, group: 'C', round: 2, home: 'SCO', away: 'MAR', match_datetime: '2026-06-19T22:00:00Z', venue: 'Foxborough, EUA' },
  { id: 31, group: 'C', round: 2, home: 'BRA', away: 'HAI', match_datetime: '2026-06-20T01:00:00Z', venue: 'Philadelphia, EUA' },
  { id: 32, group: 'D', round: 2, home: 'TUR', away: 'PAR', match_datetime: '2026-06-20T04:00:00Z', venue: 'Santa Clara, EUA' },
  // Grupo F
  { id: 33, group: 'F', round: 2, home: 'NED', away: 'SWE', match_datetime: '2026-06-20T17:00:00Z', venue: 'Houston, EUA' },
  // Grupo E
  { id: 34, group: 'E', round: 2, home: 'GER', away: 'CIV', match_datetime: '2026-06-20T20:00:00Z', venue: 'Toronto, CAN' },
  { id: 35, group: 'E', round: 2, home: 'ECU', away: 'CUW', match_datetime: '2026-06-21T00:00:00Z', venue: 'Kansas City, EUA' },
  { id: 36, group: 'F', round: 2, home: 'TUN', away: 'JPN', match_datetime: '2026-06-21T04:00:00Z', venue: 'Monterrey, MEX' },
  // Grupo H
  { id: 37, group: 'H', round: 2, home: 'ESP', away: 'KSA', match_datetime: '2026-06-21T16:00:00Z', venue: 'Atlanta, EUA' },
  // Grupo G
  { id: 38, group: 'G', round: 2, home: 'BEL', away: 'IRN', match_datetime: '2026-06-21T19:00:00Z', venue: 'Inglewood, EUA' },
  { id: 39, group: 'H', round: 2, home: 'URU', away: 'CPV', match_datetime: '2026-06-21T22:00:00Z', venue: 'Miami Gardens, EUA' },
  { id: 40, group: 'G', round: 2, home: 'NZL', away: 'EGY', match_datetime: '2026-06-22T01:00:00Z', venue: 'Vancouver, CAN' },
  // Grupo J
  { id: 41, group: 'J', round: 2, home: 'ARG', away: 'AUT', match_datetime: '2026-06-22T17:00:00Z', venue: 'Arlington, EUA' },
  // Grupo I
  { id: 42, group: 'I', round: 2, home: 'FRA', away: 'IRQ', match_datetime: '2026-06-22T21:00:00Z', venue: 'Philadelphia, EUA' },
  { id: 43, group: 'I', round: 2, home: 'NOR', away: 'SEN', match_datetime: '2026-06-23T00:00:00Z', venue: 'East Rutherford, EUA' },
  { id: 44, group: 'J', round: 2, home: 'JOR', away: 'ALG', match_datetime: '2026-06-23T03:00:00Z', venue: 'Santa Clara, EUA' },
  // Grupo K
  { id: 45, group: 'K', round: 2, home: 'POR', away: 'UZB', match_datetime: '2026-06-23T17:00:00Z', venue: 'Houston, EUA' },
  // Grupo L
  { id: 46, group: 'L', round: 2, home: 'ENG', away: 'GHA', match_datetime: '2026-06-23T20:00:00Z', venue: 'Foxborough, EUA' },
  { id: 47, group: 'L', round: 2, home: 'PAN', away: 'CRO', match_datetime: '2026-06-23T23:00:00Z', venue: 'Toronto, CAN' },
  { id: 48, group: 'K', round: 2, home: 'COL', away: 'COD', match_datetime: '2026-06-24T02:00:00Z', venue: 'Zapopan, MEX' },

  // ─── RODADA 3 (simultâneos) ───────────────────────────────────────────────
  // Grupo A
  { id: 49, group: 'A', round: 3, home: 'MEX', away: 'CZE', match_datetime: '2026-06-25T01:00:00Z', venue: 'Kansas City, EUA' },
  { id: 50, group: 'A', round: 3, home: 'RSA', away: 'KOR', match_datetime: '2026-06-25T01:00:00Z', venue: 'Houston, EUA' },
  // Grupo B
  { id: 51, group: 'B', round: 3, home: 'SUI', away: 'CAN', match_datetime: '2026-06-24T19:00:00Z', venue: 'Vancouver, CAN' },
  { id: 52, group: 'B', round: 3, home: 'BIH', away: 'QAT', match_datetime: '2026-06-24T19:00:00Z', venue: 'Seattle, EUA' },
  // Grupo C
  { id: 53, group: 'C', round: 3, home: 'SCO', away: 'BRA', match_datetime: '2026-06-24T22:00:00Z', venue: 'Miami Gardens, EUA' },
  { id: 54, group: 'C', round: 3, home: 'MAR', away: 'HAI', match_datetime: '2026-06-24T22:00:00Z', venue: 'Atlanta, EUA' },
  // Grupo D
  { id: 55, group: 'D', round: 3, home: 'TUR', away: 'USA', match_datetime: '2026-06-26T02:00:00Z', venue: 'Inglewood, EUA' },
  { id: 56, group: 'D', round: 3, home: 'PAR', away: 'AUS', match_datetime: '2026-06-26T02:00:00Z', venue: 'Santa Clara, EUA' },
  // Grupo E
  { id: 57, group: 'E', round: 3, home: 'ECU', away: 'GER', match_datetime: '2026-06-25T20:00:00Z', venue: 'East Rutherford, EUA' },
  { id: 58, group: 'E', round: 3, home: 'CUW', away: 'CIV', match_datetime: '2026-06-25T20:00:00Z', venue: 'Philadelphia, EUA' },
  // Grupo F
  { id: 59, group: 'F', round: 3, home: 'JPN', away: 'SWE', match_datetime: '2026-06-25T23:00:00Z', venue: 'Arlington, EUA' },
  { id: 60, group: 'F', round: 3, home: 'TUN', away: 'NED', match_datetime: '2026-06-25T23:00:00Z', venue: 'Kansas City, EUA' },
  // Grupo I
  { id: 61, group: 'I', round: 3, home: 'NOR', away: 'FRA', match_datetime: '2026-06-26T19:00:00Z', venue: 'Foxborough, EUA' },
  { id: 62, group: 'I', round: 3, home: 'SEN', away: 'IRQ', match_datetime: '2026-06-26T19:00:00Z', venue: 'Toronto, CAN' },
  // Grupo H
  { id: 63, group: 'H', round: 3, home: 'CPV', away: 'KSA', match_datetime: '2026-06-27T00:00:00Z', venue: 'Houston, EUA' },
  { id: 64, group: 'H', round: 3, home: 'URU', away: 'ESP', match_datetime: '2026-06-27T00:00:00Z', venue: 'Zapopan, MEX' },
  // Grupo G
  { id: 65, group: 'G', round: 3, home: 'EGY', away: 'IRN', match_datetime: '2026-06-27T03:00:00Z', venue: 'Seattle, EUA' },
  { id: 66, group: 'G', round: 3, home: 'NZL', away: 'BEL', match_datetime: '2026-06-27T03:00:00Z', venue: 'Vancouver, CAN' },
  // Grupo L
  { id: 67, group: 'L', round: 3, home: 'PAN', away: 'ENG', match_datetime: '2026-06-27T21:00:00Z', venue: 'East Rutherford, EUA' },
  { id: 68, group: 'L', round: 3, home: 'CRO', away: 'GHA', match_datetime: '2026-06-27T21:00:00Z', venue: 'Philadelphia, EUA' },
  // Grupo K
  { id: 69, group: 'K', round: 3, home: 'COL', away: 'POR', match_datetime: '2026-06-27T23:30:00Z', venue: 'Miami Gardens, EUA' },
  { id: 70, group: 'K', round: 3, home: 'COD', away: 'UZB', match_datetime: '2026-06-27T23:30:00Z', venue: 'Atlanta, EUA' },
  // Grupo J
  { id: 71, group: 'J', round: 3, home: 'JOR', away: 'ARG', match_datetime: '2026-06-28T02:00:00Z', venue: 'Arlington, EUA' },
  { id: 72, group: 'J', round: 3, home: 'ALG', away: 'AUT', match_datetime: '2026-06-28T02:00:00Z', venue: 'Kansas City, EUA' },
]

export const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L']

export function getMatchesByGroup(group) {
  return MATCHES.filter(m => m.group === group).sort((a, b) => a.round - b.round)
}

export function getMatchesByRound(round) {
  return MATCHES.filter(m => m.round === round).sort(
    (a, b) => new Date(a.match_datetime) - new Date(b.match_datetime)
  )
}

export function isMatchLocked(match) {
  return new Date() >= new Date(match.match_datetime)
}

export function formatDateBRT(isoStr) {
  const d = new Date(isoStr)
  return d.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short', day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}

export function formatTimeBRT(isoStr) {
  const d = new Date(isoStr)
  return d.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit', minute: '2-digit'
  })
}

export function formatDayBRT(isoStr) {
  const d = new Date(isoStr)
  return d.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long', day: '2-digit', month: 'long'
  })
}
