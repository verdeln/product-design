import { Link } from '@tanstack/react-router'
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

export function baseOptions(): BaseLayoutProps {
  return { nav: { title: <Link to="/">Verdlen</Link> } }
}
