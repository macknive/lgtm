export const addOverlay = (el: HTMLElement) => {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  el.appendChild(overlay);
}
