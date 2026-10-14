/* Together screen visual redesign. No changes to payment or history logic. */
(function () {
  'use strict';
  if (typeof pages === 'undefined') {
    console.warn('Together layout: main.js must be loaded before together-layout.js');
    return;
  }

  pages.together = `
    <section class="together-page" aria-label="Together">
      <button class="together-more" type="button" onclick="toggleTogetherMenu()" aria-label="More options" aria-expanded="false">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>
      </button>
      <div class="together-more-menu" id="togetherMoreMenu" hidden>
        <span>Together is a demo screen</span>
      </div>
      <h1 class="together-title">Together</h1>
      <img class="together-art" src="./images/together-illustration.png" alt="Illustration of friends, music and food" draggable="false">
      <p class="together-description">Request a Swish or split a cost<br>with others.</p>
      <div class="together-actions">
        <button class="together-request" type="button" onclick="togetherComingSoon('Request')">Request</button>
        <button class="together-split" type="button" onclick="togetherComingSoon('Split cost')">Split cost</button>
      </div>
      <div class="together-toast" id="togetherToast" role="status" aria-live="polite" hidden></div>
    </section>`;

  let toastTimeout;
  window.togetherComingSoon = function (feature) {
    const toast = document.getElementById('togetherToast');
    if (!toast) return;
    toast.textContent = feature + ' is coming soon in this demo.';
    toast.hidden = false;
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { toast.hidden = true; }, 2300);
  };

  window.toggleTogetherMenu = function () {
    const menu = document.getElementById('togetherMoreMenu');
    const button = document.querySelector('.together-more');
    if (!menu || !button) return;
    menu.hidden = !menu.hidden;
    button.setAttribute('aria-expanded', String(!menu.hidden));
  };
})();
