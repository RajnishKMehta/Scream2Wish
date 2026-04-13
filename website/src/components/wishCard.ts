import type { WishData, DisplayMode } from '@/types'

function formatDate(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function renderWishCard(data: WishData, displayMode: DisplayMode, index: number): string {
  const content = displayMode === 'wishes' ? data.wish : data.note
  const delay = index * 40
  return /* html */ `
    <div class="wish-card fade-in" style="animation-delay:${delay}ms; opacity:0">
      <div class="card-content">${escapeHtml(content)}</div>
      <div class="card-meta">
        <span class="card-from">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="5"/><path d="M3 21a9 9 0 0 1 18 0"/>
          </svg>
          ${escapeHtml(data.from)}
        </span>
        <span class="card-time">${formatDate(data.at)}</span>
      </div>
    </div>
  `
}

export function updateCardContent(card: Element, data: WishData, displayMode: DisplayMode): void {
  const contentEl = card.querySelector('.card-content')
  if (!contentEl) return
  contentEl.classList.add('fading')
  setTimeout(() => {
    contentEl.textContent = displayMode === 'wishes' ? data.wish : data.note
    contentEl.classList.remove('fading')
  }, 200)
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
