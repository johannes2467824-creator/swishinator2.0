/* Swishinator Profile layout add-on. Demo UI only. */
(function () {
  'use strict';

  if (typeof pages === 'undefined') {
    console.warn('Profile layout requires code/main.js to load first.');
    return;
  }

  const demoNumber = '+46 73 000 42 19';
  const icon = (body) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  const gear = icon('<circle cx="12" cy="12" r="3"/><path d="M10.1 2.5h3.8l.6 2.2 1.7.7 2-.9 2.7 2.7-.9 2 .7 1.7 2.2.6v3.8l-2.2.6-.7 1.7.9 2-2.7 2.7-2-.9-1.7.7-.6 2.2h-3.8l-.6-2.2-1.7-.7-2 .9-2.7-2.7.9-2-.7-1.7-2.2-.6v-3.8l2.2-.6.7-1.7-.9-2 2.7-2.7 2 .9 1.7-.7z"/>');
  const chevron = icon('<path d="m9 5 7 7-7 7"/>');
  const rows = [
    ['Automatic payments', icon('<path d="M9.5 8C8 5.5 6.4 4.8 4.4 4.8a5 5 0 0 0 0 10c2.6 0 4.3-2.5 7.6-6.6 3.3-4.1 5-6.6 7.6-6.6a5 5 0 0 1 0 10c-2 0-3.6-.7-5.1-3.2" transform="translate(0 3.5)"/>')],
    ['Blocked senders', icon('<circle cx="12" cy="12" r="9"/><path d="M5.7 5.7 18.3 18.3"/>')],
    ['My bank', icon('<path d="m3 9 9-6 9 6M4 9h16M5 19h14M3 22h18M7 10v8M12 10v8M17 10v8"/>')],
    ['My data', icon('<path d="M3 21h18M5 21V12h4v9M10 21V5h4v16M15 21v-8h4v8"/>')],
    ['Help center', icon('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.3h.01"/>')]
  ];

  pages.profile = `
    <section class="profile-page" aria-label="Profile demo">
      <div class="profile-sticky" aria-hidden="false">
        <div class="profile-sticky-canvas">
          <!-- A SINGLE green surface changes shape with scrolling; no crossfade. -->
          <svg class="profile-green-header" viewBox="0 0 390 460" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="profileGreenGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#86a333"/><stop offset="1" stop-color="#2e7a34"/></linearGradient></defs>
            <path class="profile-morph-shape" d="" fill="url(#profileGreenGradient)"/>
          </svg>
          <button type="button" class="profile-settings-button" onclick="profileDemoNotice('Settings')" aria-label="Settings">${gear}</button>
          <h1 class="profile-title">Profile</h1>
          <div class="profile-qr-card" aria-label="Decorative demo QR placeholder">
            <div class="profile-qr-image-frame"><img src="./images/profile-qr-placeholder.png" alt="Non-scannable QR placeholder" draggable="false"></div>
            <div class="profile-card-number">${demoNumber}</div>
          </div>
          <div class="profile-compact-number">${demoNumber}</div>
        </div>
      </div>
      <div class="profile-scroll-stage">
        <div class="profile-snap-point profile-snap-start" aria-hidden="true"></div>
        <div class="profile-snap-point profile-snap-collapsed" aria-hidden="true"></div>
        <div class="profile-menu" aria-label="Profile options">
        ${rows.map(([label, svg]) => `<button type="button" class="profile-menu-row" onclick="profileDemoNotice('${label}')"><span class="profile-menu-icon">${svg}</span><span class="profile-menu-label">${label}</span><span class="profile-menu-arrow">${chevron}</span></button>`).join('')}
      </div>
      <p class="profile-demo-footnote">Demo profile · No real payments or QR transfers</p>
        <div class="profile-toast" id="profileToast" role="status" aria-live="polite" hidden></div>
      </div>
    </section>`;

  let toastTimer;
  window.profileDemoNotice = function (label) {
    const toast = document.getElementById('profileToast');
    if (!toast) return;
    toast.textContent = label + ' is coming soon in this demo.';
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { if (toast.isConnected) toast.hidden = true; }, 2200);
  };

  const panel = document.getElementById('panel');
  if (!panel) return;
  let activeProfile = null;
  let animationFrame = 0;
  let snapTimer = 0;
  let lastSnapState = 0;
  const SNAP_DISTANCE = 205;

  const interpolate = (start, end, progress) => start + (end - start) * progress;
  const px = value => `${value.toFixed(2)}px`;

  function updateProfile() {
    animationFrame = 0;
    if (!activeProfile || !activeProfile.isConnected) return;
    const progress = Math.max(0, Math.min(1, activeProfile.scrollTop / SNAP_DISTANCE));
    const width = panel.clientWidth;
    const card = activeProfile.querySelector('.profile-qr-card');
    const frame = activeProfile.querySelector('.profile-qr-image-frame');
    const header = activeProfile.querySelector('.profile-green-header');
    const greenShape = activeProfile.querySelector('.profile-morph-shape');
    const cardNumber = activeProfile.querySelector('.profile-card-number');
    const compactNumber = activeProfile.querySelector('.profile-compact-number');
    if (!card || !frame || !header || !greenShape || !cardNumber || !compactNumber) return;

    // Interpolate the SAME image from the large green card into the compact QR icon.
    const expandedWidth = Math.min(236, width - 66);
    const expandedLeft = (width - expandedWidth) / 2;
    const expandedTop = 185;
    const compactTop = 156;
    const expandedQr = expandedWidth - 40;
    const compactQr = 44;

    card.style.left = px(interpolate(expandedLeft, 16, progress));
    card.style.top = px(interpolate(expandedTop, compactTop, progress));
    card.style.width = px(interpolate(expandedWidth, 44, progress));
    card.style.height = px(interpolate(264, 44, progress));
    card.style.borderRadius = px(interpolate(24, 7, progress));
    // Morph the same green SVG path: rounded card -> full-width curved header.
    // No opacity blending or swapping between two green elements.
    const left = interpolate(expandedLeft, 0, progress);
    const right = interpolate(expandedLeft + expandedWidth, width, progress);
    const top = interpolate(expandedTop, 0, progress);
    const bottom = interpolate(449, 207, progress);
    const radius = interpolate(24, 0, progress);
    const curve = interpolate(0, 41.5, progress);
    const center = (left + right) / 2;
    const path = [
      `M ${left + radius} ${top}`,
      `L ${right - radius} ${top}`,
      `Q ${right} ${top} ${right} ${top + radius}`,
      `L ${right} ${bottom - radius}`,
      `Q ${right} ${bottom} ${right - radius} ${bottom}`,
      `Q ${center} ${bottom + 2 * curve} ${left + radius} ${bottom}`,
      `Q ${left} ${bottom} ${left} ${bottom - radius}`,
      `L ${left} ${top + radius}`,
      `Q ${left} ${top} ${left + radius} ${top}`,
      'Z'
    ].join(' ');
    header.setAttribute('viewBox', `0 0 ${width} 460`);
    greenShape.setAttribute('d', path);

    frame.style.left = px(interpolate(20, 0, progress));
    frame.style.top = px(interpolate(20, 0, progress));
    frame.style.width = px(interpolate(expandedQr, compactQr, progress));
    frame.style.height = px(interpolate(expandedQr, compactQr, progress));
    frame.style.borderRadius = px(interpolate(12, 6, progress));
    cardNumber.style.opacity = String(Math.max(0, 1 - progress * 2.6));
    compactNumber.style.opacity = String(Math.max(0, Math.min(1, (progress - 0.55) / 0.45)));
    // The green surface remains fully visible throughout the morph.
    activeProfile.style.setProperty('--profile-progress', progress.toFixed(4));
  }

  function requestProfileUpdate() {
    if (!animationFrame) animationFrame = requestAnimationFrame(updateProfile);
  }

  function synchronizeProfile() {
    const page = panel.querySelector(':scope > .profile-page');
    if (page !== activeProfile) {
      activeProfile = page;
      panel.classList.toggle('profile-layout-active', !!page);
      if (page) {
        page.scrollTop = 0;
        lastSnapState = 0;
        clearTimeout(snapTimer);
      }
    }
    if (page) requestProfileUpdate();
  }

  // A real scroll container and native scroll-snap points drive the animation.
  // No artificial tween: QR and header follow the actual scroll position.
  function reportSnap() {
    clearTimeout(snapTimer);
    if (!activeProfile || !activeProfile.isConnected) return;
    const position = activeProfile.scrollTop;
    const state = position >= SNAP_DISTANCE / 2 ? 1 : 0;
    if (Math.abs(position - state * SNAP_DISTANCE) > 4 || state === lastSnapState) return;
    lastSnapState = state;
    // Supported on some Android browsers, not on iOS Safari / Home Screen web apps.
    if (typeof navigator.vibrate === 'function') {
      try { navigator.vibrate(15); } catch (_) {}
    }
  }

  function handleProfileScroll(event) {
    if (event.target !== activeProfile) return;
    requestProfileUpdate();
    clearTimeout(snapTimer);
    snapTimer = setTimeout(reportSnap, 160);
  }

  // scroll does not bubble, but capture observes the active .profile-page.
  panel.addEventListener('scroll', handleProfileScroll, { passive: true, capture: true });
  panel.addEventListener('scrollend', (event) => {
    if (event.target === activeProfile) reportSnap();
  }, { passive: true, capture: true });

  // A single deliberate swipe should choose a state, even if the finger
  // traveled less than half the 205px snap distance. The scroll itself
  // animates; the QR/header continue following its position frame by frame.
  let touchStartY = null;
  let wheelLockUntil = 0;
  function settleTo(state) {
    if (!activeProfile || !activeProfile.isConnected) return;
    activeProfile.scrollTo({ top: state ? SNAP_DISTANCE : 0, behavior: 'smooth' });
  }
  panel.addEventListener('touchstart', (event) => {
    if (!activeProfile || !activeProfile.contains(event.target) || event.touches.length !== 1) return;
    touchStartY = event.touches[0].clientY;
  }, { passive: true, capture: true });
  panel.addEventListener('touchend', (event) => {
    if (touchStartY === null || !activeProfile || !activeProfile.isConnected) return;
    const moved = touchStartY - event.changedTouches[0].clientY;
    touchStartY = null;
    if (Math.abs(moved) < 30) return;
    // Let the native touch gesture finish, then smoothly settle the scroll.
    requestAnimationFrame(() => settleTo(moved > 0 ? 1 : 0));
  }, { passive: true, capture: true });
  panel.addEventListener('touchcancel', () => { touchStartY = null; }, { passive: true, capture: true });

  // Wheel/trackpad support for testing on desktop browsers.
  panel.addEventListener('wheel', (event) => {
    if (!activeProfile || !activeProfile.contains(event.target)) return;
    event.preventDefault();
    const now = performance.now();
    if (Math.abs(event.deltaY) < 8 || now < wheelLockUntil) return;
    wheelLockUntil = now + 420;
    settleTo(event.deltaY > 0 ? 1 : 0);
  }, { passive: false, capture: true });
  window.addEventListener('resize', requestProfileUpdate, { passive: true });
  new MutationObserver(synchronizeProfile).observe(panel, { childList: true });
  synchronizeProfile();
})();
