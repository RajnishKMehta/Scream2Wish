import { CONFIG } from '@/config'

export function renderNavbar(activePage: 'home' | 'about'): string {
  return /* html */ `
    <nav class="navbar">
      <div class="container navbar-inner">
        <a href="#home" class="navbar-logo">
          <img src="images/icon.png" alt="${CONFIG.app.name}" />
          <span>${CONFIG.app.name}</span>
        </a>
        <div class="navbar-links">
          <a href="#home" class="nav-link ${activePage === 'home' ? 'active' : ''}">Home</a>
          <a href="#about" class="nav-link ${activePage === 'about' ? 'active' : ''}">About</a>
        </div>
      </div>
    </nav>
  `
}
