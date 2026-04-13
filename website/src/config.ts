import type { SortMode, DisplayMode } from '@/types'

export const CONFIG = {
  app: {
    name: 'Scream2Wish',
    tagline: 'Break a Genie Lamp by Screaming at Your Phone',
    description:
      'A completely useless, mildly chaotic Android app that forces you to scream as loud as you can to break a genie\'s lamp — and only then lets you make a wish.',
    repoUrl: 'https://github.com/RajnishKMehta/Scream2Wish',
    wishesRepoUrl: 'https://github.com/RajnishKMehta/Scream2Wish-wishes',
    author: 'Rajnish Mehta',
    authorGithub: 'https://github.com/RajnishKMehta',
    authorDevTo: 'https://dev.to/RajnishKMehta',
    authorLinkedIn: 'https://linkedin.com/in/RajnishKMehta',
    authorTwitter: 'https://twitter.com/RajnishKMehta',
    authorInstagram: 'https://instagram.com/RajnishKMehta',
  },

  links: {
    apkDownload:
      'https://github.com/RajnishKMehta/Scream2Wish/releases/latest/download/app.apk',
    devToPost:
      'https://dev.to/rajnishkmehta/scream2wish-break-a-genie-lamp-by-screaming-at-your-phone-11e8',
    githubRelease: 'https://github.com/RajnishKMehta/Scream2Wish/releases/latest',
  },

  wishes: {
    indexUrl:
      'https://raw.githubusercontent.com/RajnishKMehta/Scream2Wish-wishes/refs/heads/main/wishes/index.json',
    baseUrl:
      'https://raw.githubusercontent.com/RajnishKMehta/Scream2Wish-wishes/refs/heads/main/wishes',
    pageSize: 10,
  },

  defaults: {
    sortMode: 'latest' as SortMode,
    displayMode: 'wishes' as DisplayMode,
  },
} as const
