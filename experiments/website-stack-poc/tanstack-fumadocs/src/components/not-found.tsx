import { Link } from '@tanstack/react-router'

export function NotFound() {
  return <main className="container catalog-head"><p className="eyebrow">404</p><h1>That public page is not here.</h1><p className="lede">The PoC returns an explicit not-found surface instead of a generic SPA shell.</p><Link className="button" to="/">Back home</Link></main>
}
