import { CONFIG } from '@/config'

const AVATAR = 'https://avatars.githubusercontent.com/u/172272341'

const socials: { href: string; label: string; svg: string }[] = [
  {
    href: CONFIG.app.authorGithub,
    label: 'GitHub',
    svg: `<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>`,
  },
  {
    href: CONFIG.app.authorDevTo,
    label: 'Dev.to',
    svg: `<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>`,
  },
  {
    href: CONFIG.app.authorLinkedIn,
    label: 'LinkedIn',
    svg: `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>`,
  },
  {
    href: CONFIG.app.authorTwitter,
    label: 'Twitter',
    svg: `<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>`,
  },
  {
    href: CONFIG.app.authorInstagram,
    label: 'Instagram',
    svg: `<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>`,
  },
]

export function renderCreator(): string {
  return /* html */ `
    <section class="creator-section">
      <h2 class="about-section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        The Creator
      </h2>
      <div class="creator-card">
        <img
          src="${AVATAR}?s=256"
          srcset="${AVATAR}?s=128 1x, ${AVATAR}?s=256 2x"
          alt="${CONFIG.app.author}"
          class="creator-avatar"
          width="96"
          height="96"
          loading="lazy"
          decoding="async"
        />
        <div class="creator-body">
          <div class="creator-name">${CONFIG.app.author}</div>
          <div class="creator-tagline">Built this with chaos and questionable priorities.</div>
          <div class="social-links">
            ${socials
              .map(
                (s) => /* html */ `
              <a href="${s.href}" class="social-link" target="_blank" rel="noopener" aria-label="${s.label}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  ${s.svg}
                </svg>
                ${s.label}
              </a>`,
              )
              .join('')}
          </div>
        </div>
      </div>
    </section>
  `
}
