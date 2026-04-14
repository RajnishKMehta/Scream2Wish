import { CONFIG } from '@/config'
import { renderNavbar, renderSkeletons, renderWishCard, updateCardContent, renderCreator } from '@cmp'
import { fetchIndex, fetchBatch, getPageIds, getTotalPages } from '@/services/wishes'
import type { SortMode, DisplayMode, PageState, WishData } from '@/types'

function renderFooter(): string {
  return /* html */ `
    <footer class="footer">
      <div class="container">
        <p>
          Made with chaos and questionable priorities by
          <a href="${CONFIG.app.authorGithub}" target="_blank" rel="noopener">${CONFIG.app.author}</a>
          &nbsp;·&nbsp;
          <a href="${CONFIG.app.repoUrl}" target="_blank" rel="noopener">GitHub</a>
        </p>
      </div>
    </footer>
  `
}

let state: PageState = {
  sortMode: CONFIG.defaults.sortMode,
  displayMode: CONFIG.defaults.displayMode,
  currentPage: 0,
  currentPageIds: [],
  randomHistory: [],
  usedRandomIds: new Set(),
}

let allIds: string[] = []
let currentWishes: WishData[] = []
let isLoading = false

export function renderHome(): string {
  return /* html */ `
    ${renderNavbar('home')}
    <main class="page">
      <div class="container">
        ${renderHero()}
        <section class="section">
          ${renderControls()}
          <div id="wishes-grid" class="wishes-grid">
            ${renderSkeletons()}
          </div>
          <div id="pagination" class="pagination" style="display:none"></div>
        </section>
        ${renderCreator()}
      </div>
    </main>
    ${renderFooter()}
  `
}

function renderHero(): string {
  return /* html */ `
    <div class="hero">
      <h1 class="hero-title">
        Public <span>Wishes</span> Board
      </h1>
      <p class="hero-subtitle">
        Every wish screamed into the void appears here in real time.
      </p>
      <div class="hero-actions">
        <a href="${CONFIG.links.apkDownload}" class="btn btn-primary" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download APK
        </a>
        <a href="${CONFIG.links.devToPost}" class="btn btn-ghost" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Dev.to Post
        </a>
      </div>
    </div>
  `
}

function renderControls(): string {
  const { sortMode, displayMode } = state
  const modes: { key: SortMode; label: string }[] = [
    { key: 'latest', label: 'Latest' },
    { key: 'oldest', label: 'Oldest' },
    { key: 'random', label: 'Random' },
  ]
  const displays: { key: DisplayMode; label: string }[] = [
    { key: 'wishes', label: 'Wishes' },
    { key: 'notes', label: 'Notes' },
  ]
  return /* html */ `
    <div class="controls-bar" id="controls-bar">
      <div class="control-group">
        <span class="control-label">Sort</span>
        ${modes
          .map(
            (m) =>
              `<button class="seg-btn ${sortMode === m.key ? 'active' : ''}" data-sort="${m.key}">${m.label}</button>`,
          )
          .join('')}
      </div>
      <div class="control-group">
        <span class="control-label">View</span>
        ${displays
          .map(
            (d) =>
              `<button class="seg-btn ${displayMode === d.key ? 'active-mode' : ''}" data-display="${d.key}">${d.label}</button>`,
          )
          .join('')}
      </div>
    </div>
  `
}

function renderPagination(totalPages: number): string {
  const { currentPage } = state
  const isFirst = currentPage === 0
  const isLast = state.sortMode === 'random' ? false : currentPage >= totalPages - 1
  const pageLabel =
    state.sortMode === 'random'
      ? `Page ${currentPage + 1}`
      : `${currentPage + 1} / ${totalPages}`

  return /* html */ `
    <button class="pagination-btn" id="prev-btn" ${isFirst ? 'disabled' : ''}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      Prev
    </button>
    <span class="pagination-info">${pageLabel}</span>
    <button class="pagination-btn" id="next-btn" ${isLast ? 'disabled' : ''}>
      Next
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  `
}

function renderError(msg: string): string {
  return /* html */ `
    <div class="error-box">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      ${msg}
    </div>
  `
}

async function loadPage() {
  if (isLoading) return
  isLoading = true

  const grid = document.getElementById('wishes-grid')
  const pag = document.getElementById('pagination')
  if (!grid) return

  grid.innerHTML = renderSkeletons()
  if (pag) pag.style.display = 'none'

  try {
    if (allIds.length === 0) {
      allIds = await fetchIndex()
    }

    const { ids, updatedHistory, updatedUsed } = getPageIds(
      allIds,
      state.sortMode,
      state.currentPage,
      state.randomHistory,
      state.usedRandomIds,
    )

    state.randomHistory = updatedHistory
    state.usedRandomIds = updatedUsed
    state.currentPageIds = ids

    if (ids.length === 0) {
      grid.innerHTML = `<div class="empty-state">No wishes found yet. Be the first to scream!</div>`
      isLoading = false
      return
    }

    currentWishes = await fetchBatch(ids)

    grid.innerHTML = currentWishes
      .map((w, i) => renderWishCard(w, state.displayMode, i))
      .join('')

    const totalPages = getTotalPages(allIds)
    if (pag) {
      pag.innerHTML = renderPagination(totalPages)
      pag.style.display = 'flex'
      bindPaginationEvents(totalPages)
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to load wishes'
    grid.innerHTML = renderError(msg)
  } finally {
    isLoading = false
  }
}

function updateDisplayMode(mode: DisplayMode) {
  state.displayMode = mode
  const cards = document.querySelectorAll('.wish-card')
  cards.forEach((card, i) => {
    const wish = currentWishes[i]
    if (wish) updateCardContent(card, wish, mode)
  })
  updateControlsUI()
}

function updateControlsUI() {
  document.querySelectorAll('[data-sort]').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-sort') === state.sortMode)
  })
  document.querySelectorAll('[data-display]').forEach((btn) => {
    btn.classList.toggle('active-mode', btn.getAttribute('data-display') === state.displayMode)
  })
}

function bindPaginationEvents(totalPages: number) {
  const prevBtn = document.getElementById('prev-btn') as HTMLButtonElement | null
  const nextBtn = document.getElementById('next-btn') as HTMLButtonElement | null

  prevBtn?.addEventListener('click', () => {
    if (state.currentPage > 0) {
      state.currentPage--
      void loadPage()
    }
  })

  nextBtn?.addEventListener('click', () => {
    const isLast = state.sortMode !== 'random' && state.currentPage >= totalPages - 1
    if (!isLast) {
      state.currentPage++
      void loadPage()
    }
  })
}

let keyboardHandler: ((e: KeyboardEvent) => void) | null = null

export function cleanupHome() {
  if (keyboardHandler) {
    window.removeEventListener('keydown', keyboardHandler)
    keyboardHandler = null
  }
}

export function initHome() {
  state = {
    sortMode: CONFIG.defaults.sortMode,
    displayMode: CONFIG.defaults.displayMode,
    currentPage: 0,
    currentPageIds: [],
    randomHistory: [],
    usedRandomIds: new Set(),
  }
  currentWishes = []
  isLoading = false

  void loadPage()

  const root = document.getElementById('root')
  if (!root) return

  root.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const btn = target.closest('[data-sort],[data-display]') as HTMLElement | null
    if (!btn) return

    const sortKey = btn.getAttribute('data-sort') as SortMode | null
    const displayKey = btn.getAttribute('data-display') as DisplayMode | null

    if (sortKey && sortKey !== state.sortMode) {
      state.sortMode = sortKey
      state.currentPage = 0
      state.randomHistory = []
      state.usedRandomIds = new Set()
      updateControlsUI()
      void loadPage()
    }

    if (displayKey && displayKey !== state.displayMode) {
      updateDisplayMode(displayKey)
    }
  })

  cleanupHome()
  keyboardHandler = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prevBtn = document.getElementById('prev-btn') as HTMLButtonElement | null
      if (prevBtn && !prevBtn.disabled && state.currentPage > 0) {
        state.currentPage--
        void loadPage()
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      const nextBtn = document.getElementById('next-btn') as HTMLButtonElement | null
      if (nextBtn && !nextBtn.disabled) {
        const totalPages = getTotalPages(allIds)
        const isLast = state.sortMode !== 'random' && state.currentPage >= totalPages - 1
        if (!isLast) {
          state.currentPage++
          void loadPage()
        }
      }
    }
  }
  window.addEventListener('keydown', keyboardHandler)
}
