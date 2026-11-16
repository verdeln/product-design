import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { SiteShell } from '@/components/site-shell'

type SearchResult = { id?: string; url?: string; title?: string; content?: string }

export const Route = createFileRoute('/search')({
  head: () => ({ meta: [{ title: 'Search · Verdlen' }, { name: 'robots', content: 'noindex,follow' }, { name: 'description', content: 'Search the public Verdlen PoC documentation corpus.' }] }),
  component: Page
})
function Page() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  useEffect(() => {
    const q = query.trim()
    if (!q) { setResults([]); return }
    const abort = new AbortController()
    const timer = window.setTimeout(() => {
      fetch(`/api/search?query=${encodeURIComponent(q)}`, { signal: abort.signal }).then((res) => res.ok ? res.json() : []).then((value) => setResults(Array.isArray(value) ? value : [])).catch(() => {})
    }, 120)
    return () => { window.clearTimeout(timer); abort.abort() }
  }, [query])
  return <SiteShell><main><header className="container catalog-head"><p className="eyebrow">Fumadocs search endpoint</p><h1>Find public guidance.</h1><input className="search-box" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search local-first, editor, sync…" /></header><section className="container results">{results.map((item, index) => <a className="result" href={item.url ?? item.id ?? '#'} key={item.id ?? `${item.title}-${index}`}><strong>{item.title}</strong><p>{item.content?.slice(0, 180)}</p></a>)}{query && results.length === 0 ? <p className="lede">No matching result yet.</p> : null}</section></main></SiteShell>
}
