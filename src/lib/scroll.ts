export function scrollToId(id: string) {
  if (typeof document === 'undefined') return
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export const CV_PATH = '/cv/Frontend-developer_Huynh-Quoc-Bao.pdf'
