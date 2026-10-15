export const LOCALE_STORAGE_KEY = 'locale'

export const ROOT_REDIRECT_SCRIPT = `var s;try{s=localStorage.getItem('${LOCALE_STORAGE_KEY}')}catch(e){}location.replace(s==='pt'||s==='en'?'/'+s+'/':/^pt/i.test(navigator.language)?'/pt/':'/en/')`
