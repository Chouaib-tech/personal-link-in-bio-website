export type Theme = 'light' | 'dark'
export const THEME_KEY = 'theme-v2' // bumped: ignores older saved choices so everyone starts on the green theme

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

// Only active when the URL has ?debug: prints the browser, script errors, failed files and whether React started.
// Open /?debug on a phone that misbehaves and send a screenshot of the green box.
export const DEBUG_SCRIPT = `(function(){if(!/[?&]debug\\b/.test(location.search))return;var log=[],box;function show(){if(!document.body)return;if(!box){box=document.createElement('pre');box.style.cssText='position:fixed;left:0;right:0;bottom:0;max-height:55vh;overflow:auto;margin:0;padding:8px;z-index:2147483647;background:#000d;color:#9f9;font:11px/1.35 monospace;white-space:pre-wrap;word-break:break-all';document.body.appendChild(box)}box.textContent=log.join('\\n')}function add(s){log.push(s);show()}add('UA: '+navigator.userAgent);try{add('screen '+screen.width+'x'+screen.height+' dpr '+devicePixelRatio+' hover:'+matchMedia('(hover: hover)').matches+' pointer-fine:'+matchMedia('(pointer: fine)').matches+' PointerEvent:'+(typeof PointerEvent))}catch(e){add('env error: '+e.message)}window.addEventListener('error',function(e){var t=e.target;if(t&&t!==window&&(t.src||t.href))add('FILE FAILED TO LOAD: '+(t.src||t.href));else add('ERROR: '+e.message+' @'+String(e.filename||'').split('/').pop()+':'+e.lineno+':'+e.colno)},true);window.addEventListener('unhandledrejection',function(e){add('PROMISE ERROR: '+((e.reason&&e.reason.message)||e.reason))});document.addEventListener('DOMContentLoaded',show);setTimeout(function(){add('React started: '+(document.documentElement.getAttribute('data-hydrated')==='1'?'YES':'NO  (the page JavaScript did not start)'))},4000)})()`
