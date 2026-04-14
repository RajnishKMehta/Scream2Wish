import { CONFIG } from '@/config'
import { renderNavbar, renderCreator } from '@cmp'

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

export function renderAbout(): string {
  return /* html */ `
    ${renderNavbar('about')}
    <main class="page">
      <div class="container">

        <div class="about-hero">
          <h1 class="hero-title" style="font-size:clamp(1.7rem,5vw,2.4rem)">About</h1><br>
          <img src="images/logo16x9.png" alt="${CONFIG.app.name}" class="hero-logo" />
          <p class="hero-subtitle">${CONFIG.app.description}</p>
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
              Read on Dev.to
            </a>
          </div>
        </div>

        <div class="about-section">
          <h2 class="about-section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            What Is This?
          </h2>
          <div class="about-card">
            <p>
              Scream2Wish is a completely 100% useful (👀), mildly chaotic Android app built for the
              <a href="${CONFIG.links.devToPost}" target="_blank" rel="noopener">DEV April Fools Challenge 2026</a>.
              It forces you to <strong style="color:var(--text-white)">scream as loud as you can</strong> to break a genie's lamp and only then lets you make a wish.
            </p>
            <p>
              Your wish gets sent to the internet via a Cloudflare Worker → GitHub Actions pipeline and lives forever in a
              <a href="${CONFIG.app.wishesRepoUrl}" target="_blank" rel="noopener">public repository</a>. In return, you get to read a random stranger's note. Whether that's comforting or unsettling
              is entirely up to you.
            </p>
            <p>It is a fun project made for timepass and <em><b>learning</b></em>.</p>
          </div>
        </div>

        <div class="about-section">
          <h2 class="about-section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            The Full Experience
          </h2>
          <div class="step-list">
            ${[
              {
                title: 'Permissions Gate',
                desc: 'The app opens with an animated permission screen asking for microphone access (to detect your screams) and vibration. You cannot proceed without granting both. The back button is "defective."',
              },
              {
                title: 'Joke Login',
                desc: 'A suspiciously serious login screen asks for your real name and a password. The name is used throughout the experience. The password has a specific validation rule, figure it out yourself.',
              },
              {
                title: 'The Lamp',
                desc: 'A countdown from 5. Then the main event. A genie lamp sits in the centre of the screen. The louder you scream, the faster the lamp breaks. Stop screaming for even a second and the lamp fully resets.',
              },
              {
                title: 'Make Your Wish',
                desc: 'The character that emerged from the lamp greets you via text-to-speech and asks you to type your wish, then leave a note for the world.',
              },
              {
                title: 'The End',
                desc: "Your wish is queued to be sent to the public repository. You receive a random stranger's note in return. There is no restart button. The app is done with you.",
              },
            ]
              .map(
                (s, i) => /* html */ `
              <div class="step-item">
                <span class="step-num">${i + 1}</span>
                <div class="step-body">
                  <div class="step-title">${s.title}</div>
                  <div class="step-desc">${s.desc}</div>
                </div>
              </div>
            `,
              )
              .join('')}
          </div>
        </div>

        <div class="about-section">
          <h2 class="about-section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/></svg>
            Tech Stack
          </h2>
          <div class="tech-grid">
            ${[
              { name: 'Expo + React Native', desc: 'Core app framework' },
              { name: 'expo-audio', desc: 'Real-time scream detection & playin meme sounds' },
              { name: 'expo-speech', desc: 'Genie text-to-speech' },
              { name: 'expo-video', desc: 'Punishing video overlay' },
              { name: 'react-native-reanimated', desc: 'Smooth animations' },
              { name: 'Cloudflare Workers', desc: 'Secure API proxy' },
              { name: 'GitHub Actions', desc: 'Wish persistence pipeline' },
              { name: 'Vite + TypeScript', desc: 'This website' },
              { name: 'GitHub Pages', desc: 'Hosting this website' },
              { name: 'EAS Build', desc: 'Automated APK builds' },
            ]
              .map(
                (t) => /* html */ `
              <div class="tech-chip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                <div>
                  <div class="tech-chip-name">${t.name}</div>
                  <div class="tech-chip-desc">${t.desc}</div>
                </div>
              </div>
            `,
              )
              .join('')}
          </div>
        </div>

        ${renderCreator()}

        <div class="about-section">
          <h2 class="about-section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Why Does This Exist?
          </h2>
          <div class="about-card">
            <p>
              <a href="${CONFIG.links.devToPost}" target="_blank" rel="noopener">DEV April Fools Challenge 2026</a> prompt was simple: <b>build something completely useless or silly.</b>
              Something that makes people ask <em>"why on earth did they build this?"</em>
            </p>
            <p>
              The answer here is: because it required a scream-detection algorithm, a Cloudflare Worker, a GitHub Actions pipeline,
              three different characters (two of which are mermaids coming out of a lamp), text-to-speech, real-time vibration
              feedback, fake login validation, OTA updates, and a public wishes board, all in service of letting someone type a
              wish into their phone.
            </p>
            <p>It is overengineered on purpose. It is useless on purpose. And it absolutely works.</p>
          </div>
        </div>

      </div>
    </main>
    ${renderFooter()}
  `
}
