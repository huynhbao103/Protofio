import type { NextRequest } from 'next/server'

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]'])

export function isLocalHostname(hostname: string): boolean {
  const host = hostname.split(':')[0]?.toLowerCase() ?? ''
  return LOCAL_HOSTS.has(host)
}

export function isLocalRequest(request: NextRequest): boolean {
  const hostHeader = request.headers.get('host') || ''
  if (isLocalHostname(hostHeader)) return true

  const forwardedHost = request.headers.get('x-forwarded-host') || ''
  if (forwardedHost && isLocalHostname(forwardedHost.split(',')[0].trim())) {
    return true
  }

  return false
}

export function isLocalClient(): boolean {
  if (typeof window === 'undefined') return false
  return isLocalHostname(window.location.hostname)
}
