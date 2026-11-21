export type Theme = 'light' | 'dark'
export const THEME_KEY = 'theme'

// Runs inline in <head> before first paint: saved choice, otherwise dark (lamp off).
export const THEME_INIT_SCRIPT = `(function(){var d=document.documentElement,t;try{t=localStorage.getItem('${THEME_KEY}')}catch(e){}d.setAttribute('data-theme',t==='light'?'light':'dark')})()`

export function readTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

export function applyTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t)
  try {
    localStorage.setItem(THEME_KEY, t)
  } catch {}
}
