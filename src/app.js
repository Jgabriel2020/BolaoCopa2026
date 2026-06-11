import { supabase } from './supabase.js'
import { renderAuth, bindAuthEvents } from './pages/auth.js'
import { renderDashboard, bindDashboardEvents, cleanupDashboard } from './pages/dashboard.js'
import { renderRanking, bindRankingEvents, cleanupRanking } from './pages/ranking.js'
import { renderAdmin, bindAdminEvents } from './pages/admin.js'
import { renderMyPicks } from './pages/mypicks.js'
import { renderHeader, bindHeaderLogout } from './components/header.js'

const app = document.getElementById('app')
let currentPage = null
let currentUser = null
let currentProfile = null

// ─── Main router ─────────────────────────────────────────────────────────────
window.renderPage = async (page) => {
  // Cleanup previous page subscriptions
  if (currentPage === 'dashboard') cleanupDashboard()
  if (currentPage === 'ranking') cleanupRanking()
  currentPage = page

  app.innerHTML = `<div class="flex items-center justify-center min-h-screen"><div class="loading-spinner"></div></div>`

  // Auth pages — no user needed
  if (page === 'login' || page === 'register') {
    app.innerHTML = await renderAuth(page)
    bindAuthEvents(page)
    return
  }

  // Ensure authenticated
  if (!currentUser) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      app.innerHTML = await renderAuth('login')
      bindAuthEvents('login')
      return
    }
    currentUser = user
  }

  // Load profile if not cached
  if (!currentProfile) {
    const { data } = await supabase
      .from('profiles')
      .select('username, total_points, is_admin')
      .eq('id', currentUser.id)
      .single()
    currentProfile = data
  }

  const isAdmin = currentProfile?.is_admin || false
  const username = currentProfile?.username || currentUser.email?.split('@')[0] || 'Usuário'

  // Render header + page
  let pageHTML = ''
  if (page === 'dashboard') {
    pageHTML = await renderDashboard(currentUser)
  } else if (page === 'ranking') {
    pageHTML = await renderRanking(currentUser)
  } else if (page === 'admin') {
    pageHTML = await renderAdmin(currentUser)
  } else if (page === 'mypicks') {
    pageHTML = await renderMyPicks(currentUser)
  } else {
    pageHTML = await renderDashboard(currentUser)
  }

  app.innerHTML = renderHeader(page, username, isAdmin) + `<main>${pageHTML}</main>`
  bindHeaderLogout()

  // Bind page-specific events
  if (page === 'dashboard') {
    bindDashboardEvents(currentUser)
  } else if (page === 'ranking') {
    bindRankingEvents(currentUser)
  } else if (page === 'admin') {
    bindAdminEvents(currentUser)
  }
}

// ─── Auth state listener ─────────────────────────────────────────────────────
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    currentUser = null
    currentProfile = null
    window.renderPage('login')
  } else if (event === 'SIGNED_IN' && session?.user) {
    currentUser = session.user
    currentProfile = null
  }
})

// ─── Initial load ────────────────────────────────────────────────────────────
async function init() {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    currentUser = user
    window.renderPage('dashboard')
  } else {
    window.renderPage('login')
  }
}

init()
