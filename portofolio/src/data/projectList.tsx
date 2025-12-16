export type Project = {
  name: string
  date: string
  slug: string
  tagline: string
  url?: string
  writeup?: string
  highlight?: boolean
}

export const projectsList: Project[] = [
  {
    name: 'asutrisna.dev',
    date: '2025',
    slug: 'asutrisna.com',
    tagline: 'Source of this website',
  },
  {
    name: 'Keyboard Accordion',
    date: '2022',
    slug: 'accordion',
    tagline: 'Play the accordion online!',
    url: 'https://www.keyboardaccordion.com',
    writeup: '/musical-instrument-web-audio-api',
    highlight: true,
  },
  {
    name: 'React Advanced Form',
    date: '2022',
    slug: 'react-advanced-form',
    tagline: 'A schema-based form system',
  },
]
