import '@/styles/global.css'
import { renderHome, initHome } from '@/pages/home'
import { renderAbout } from '@/pages/about'

function getRoute(): 'home' | 'about' {
  const hash = window.location.hash.replace('#', '').toLowerCase()
  return hash === 'about' ? 'about' : 'home'
}

function navigate() {
  const route = getRoute()
  const root = document.getElementById('root')
  if (!root) return

  root.innerHTML = route === 'about' ? renderAbout() : renderHome()

  if (route === 'home') {
    initHome()
  }

  window.scrollTo({ top: 0, behavior: 'instant' })
}

window.addEventListener('hashchange', navigate)
navigate()
