export const MOTION_STORAGE_KEY = 'motion'

export const MOTION_INIT_SCRIPT = `(function(){try{if(localStorage.getItem('${MOTION_STORAGE_KEY}')==='paused')document.documentElement.setAttribute('data-motion','paused')}catch(e){}})()`
