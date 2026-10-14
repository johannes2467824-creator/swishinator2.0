/* Swishinator demo: live camera preview. No QR decoding or payment functionality. */
(() => {
  let stream = null;
  let requestId = 0;
  let overlay = null;

  function stopCamera() {
    requestId++;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
    const video = overlay?.querySelector('video');
    if (video) {
      video.pause();
      video.srcObject = null;
    }
  }

  function closeScanCamera() {
    stopCamera();
    if (overlay) overlay.remove();
    overlay = null;
    document.removeEventListener('keydown', onKeyDown);
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') closeScanCamera();
  }

  async function openScanCamera() {
    closeScanCamera();

    overlay = document.createElement('section');
    overlay.className = 'scan-camera-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Camera scanner preview');
    overlay.innerHTML = `
      <header class="scan-camera-header">
        <button class="scan-camera-close" type="button" aria-label="Close camera">×</button>
        <strong>Scan QR</strong>
        <span class="scan-camera-spacer" aria-hidden="true"></span>
      </header>
      <div class="scan-camera-view">
        <video class="scan-camera-video" autoplay muted playsinline aria-label="Live camera preview"></video>
        <div class="scan-camera-frame" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
        <p class="scan-camera-status" role="status">Opening camera…</p>
      </div>
      <p class="scan-camera-note">Camera preview only · QR codes aren't read yet</p>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('.scan-camera-close').addEventListener('click', closeScanCamera);
    document.addEventListener('keydown', onKeyDown);

    const video = overlay.querySelector('video');
    const status = overlay.querySelector('.scan-camera-status');
    const thisRequest = ++requestId;

    if (!navigator.mediaDevices?.getUserMedia) {
      status.textContent = 'Camera unavailable. Open the website over HTTPS in Safari.';
      return;
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: 'environment' } }
      });
      if (thisRequest !== requestId || !overlay || !overlay.contains(video)) {
        newStream.getTracks().forEach(track => track.stop());
        return;
      }
      stream = newStream;
      video.srcObject = stream;
      try {
        await video.play();
        if (thisRequest === requestId) status.hidden = true;
      } catch {
        if (thisRequest === requestId) status.textContent = 'Camera started, but the preview could not play.';
      }
    } catch (error) {
      if (thisRequest !== requestId) return;
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        status.textContent = 'Camera access was denied. Allow camera access in your iPhone settings and try again.';
      } else if (error.name === 'NotFoundError' || error.name === 'OverconstrainedError') {
        status.textContent = 'No available camera was found.';
      } else {
        status.textContent = 'Could not open the camera. Please try again.';
      }
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && overlay) closeScanCamera();
  });
  window.addEventListener('pagehide', closeScanCamera);
  window.openScanCamera = openScanCamera;
})();
