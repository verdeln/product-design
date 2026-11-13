import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export function SiteShell({ children }: { children: ReactNode }) {
  return <div className="site-frame"><header className="site-header"><Link to="/" className="brand" aria-label="Verdlen home"><span className="brand-mark">V</span><span>Verdlen</span></Link><nav className="nav-links" aria-label="Primary"><Link to="/help/$" params={{ _splat: 'getting-started' }}>Help</Link><Link to="/docs/$" params={{ _splat: 'editor-sdk' }}>Developers</Link><Link to="/templates">Templates</Link><Link to="/search">Search</Link></nav><Link to="/help/$" params={{ _splat: 'getting-started' }} className="button">Explore</Link></header>{children}<footer className="site-footer"><span>Verdlen website stack PoC · synthetic content</span><span><a href="/robots.txt">robots</a> · <a href="/sitemap.xml">sitemap</a></span></footer></div>
}
