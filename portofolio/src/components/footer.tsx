import React from 'react'
import Image, { StaticImageData } from 'next/image'

import netlify from '../../content/thumbnails/netlify.png'
import github from '../assets/nav-github.png'
// import next from '../assets/react.png'

type LinkItem = {
  url: string
  label: string
}

type MadeWithLinkItem = {
  url: string
  label: string
  icon: StaticImageData
}

const links: LinkItem[] = [
  { url: 'https://taniarascia.substack.com', label: 'Email signup' },
  { url: 'https://www.taniarascia.com/rss.xml', label: 'RSS feed' },
  { url: 'https://bsky.app/profile/tania.dev', label: 'Bluesky' },
  { url: 'https://ko-fi.com/taniarascia', label: 'Buy me a coffee' },
]

const madeWithLinks: MadeWithLinkItem[] = [
//   { url: 'https://nextjs.org', label: 'Next.js', icon: next },
  { url: 'https://github.com/taniarascia', label: 'GitHub', icon: github },
  { url: 'https://www.netlify.com', label: 'Netlify', icon: netlify },
]

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <section className="footer-section">
        <nav className="footer-menu">
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <nav className="footer-menu-buttons">
          {madeWithLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              title={link.label}
              target="_blank"
              rel="noopener noreferrer"
              className="button small"
            >
              <Image
                src={link.icon}
                alt={link.label}
                width={18}
                height={18}
              />
              <span>{link.label}</span>
            </a>
          ))}
        </nav>

        <div className="footer-made-by">
          Made with ❤️ using Next.js & TypeScript
        </div>
      </section>
    </footer>
  )
}
