/* Shared result-window boundaries and presenter key conventions. */
(() => {
 'use strict';
 const windows = new Map();
 const navigation = '#prev,#next,#mobilePrev,#mobileNext,.slide-sidebar-item,.hc-sidebar-item,#fullscreenBtn,#touchPrev,#touchNext,#lessonMenu,#touchClose,#phycomHome';
 document.addEventListener('click', event => {
  if (event.target.closest(navigation)) return;
  for (const config of windows.values()) {
   if (!config.isOpen() || event.target.closest(config.inside)) continue;
   config.close();
   event.preventDefault();
   event.stopImmediatePropagation();
   break;
  }
 }, true);
 window.lessonUI = {
  bindOutside(config) { windows.set(config.key, config); },
  direction(event) {
   if (/input|textarea|select/i.test(event.target.tagName) || event.target.isContentEditable) return 0;
   if (event.key === ' ' && event.target.closest('button,[role="button"]')) return 0;
   return ['ArrowRight','PageDown',' '].includes(event.key) ? 1 : ['ArrowLeft','PageUp'].includes(event.key) ? -1 : 0;
  }
 };
})();


