

const panel = document.getElementById('panel');

const logo = document.getElementById('logo');

const actions = document.getElementById('actions');

const pages = {

swishscreen: `

<div class="confirmation-screen">

  <div class="confirmation-green">

    <svg class="green-shape" viewBox="0 0 390 430" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">

      <defs><linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#91B900"/><stop offset="100%" stop-color="#198A29"/></linearGradient></defs>

      <path d="M 0 0 H 390 V 399 Q 195 449 0 399 Z" fill="url(#greenGradient)"/>

    </svg>

    <div class="confirmation-particles"></div>

    <div class="click-particle-layer" id="clickParticleLayer"></div>

    <!-- 3x3 SOUND PAD FÖR SWISH PLINGEN -->

<!-- INVISIBLE SOUND PAD -->

<div class="confirmation-soundpad">



    <button class="sound-box" data-sound="1" aria-label="Sound 1"></button>

    <button class="sound-box" data-sound="2" aria-label="Sound 2"></button>

    <button class="sound-box" data-sound="3" aria-label="Sound 3"></button>



    <button class="sound-box" data-sound="4" aria-label="Sound 4"></button>

    <button class="sound-box" data-sound="5" aria-label="Sound 5"></button>

    <button class="sound-box" data-sound="6" aria-label="Sound 6"></button>



    <button class="sound-box" data-sound="7" aria-label="Sound 7"></button>

    <button class="sound-box" data-sound="8" aria-label="Sound 8"></button>

    <button class="sound-box" data-sound="9" aria-label="Sound 9"></button>



</div>

    <svg class="confirmation-check" viewBox="0 0 64 64" fill="none"><circle cx="30" cy="34" r="25" stroke="white" stroke-opacity=".5" stroke-width="3"/><path d="M18 33 L27 42 L57 12" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>

    <div class="confirmation-message">Your payment has been sent!</div>

  </div>

  <div class="confirmation-date" id="swishDateTime"></div>

  <div class="confirmation-card">

    <div class="confirmation-name" id="swishRecipient"></div>

    <div class="confirmation-phone" id="swishPhone"></div>

    <div class="confirmation-amount" id="swishAmount"></div>

    <div class="confirmation-dots">...</div>

  </div>

  <div class="confirmation-demo-label" aria-label="Demo only, no real payment">DEMO PREVIEW · NO REAL PAYMENT</div>

  <div class="confirmation-footer">

    <div class="confirmation-brand"><img src="./images/swishscreen.png" class="confirmation-logo" alt="Swish"></div>

    <button class="confirmation-close" onclick="showPage('home')" aria-label="Close">×</button>

  </div>

</div>`,

together: `<h1>Together</h1><div class="tile"><h2>Shared space</h2><p>Your shared activities will appear here.</p><button class="primary" onclick="demoNotice()">Create a shared space</button></div>`,

history: `<h1>History</h1><div class="tile"><h2>No activity yet</h2><p>This demo has no transaction history.</p></div>`,

profile: `<h1>Profile</h1><div class="tile"><h2>Demo profile</h2><p>Customize your app experience.</p><label>Display name<input class="field" id="displayname" placeholder="Your name" maxlength="40"></label><button class="primary" onclick="saveName()">Save name</button><p id="savedname"></p></div>`,

swish: `
<div class="payment-page">
  <header class="payment-header">
    <div class="payment-top-actions">
      <button class="payment-circle-btn" type="button" onclick="showPage('home')" aria-label="Close payment screen">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5L19 19M19 5L5 19"/></svg>
      </button>
      <button class="payment-circle-btn" type="button" aria-label="Help (coming soon)" onclick="paymentPlaceholder()">
        <span class="payment-help-icon">?</span>
      </button>
    </div>
    <div class="payment-tabs" role="tablist" aria-label="Payment type">
      <button class="payment-tab selected" type="button" role="tab" aria-selected="true">Swish</button>
      <button class="payment-tab" type="button" role="tab" aria-selected="false" onclick="paymentPlaceholder()">Request</button>
    </div>
  </header>

  <div class="payment-content">
    <section class="payment-recipient-card" aria-label="Recipient">
      <label class="payment-recipient-input-wrap" for="phoneNumber">
        <input id="phoneNumber" type="tel" inputmode="tel" autocomplete="tel" placeholder="Recipient" aria-label="Recipient phone number">
      </label>
      <div class="payment-shortcuts">
        <button type="button" class="payment-shortcut" onclick="openPaymentContacts()">
          <span class="payment-shortcut-icon">
            <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="12"/><circle cx="16" cy="12.5" r="4"/><path d="M7.5 24c1.5-4.7 5-6.3 8.5-6.3s7 1.6 8.5 6.3"/></svg>
          </span><span>Contacts</span>
        </button>
        <button type="button" class="payment-shortcut" onclick="paymentPlaceholder()">
          <span class="payment-shortcut-icon">
            <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 27 5.5 16.6C-1 9.8 9 1.7 16 10c7-8.3 17-0.2 10.5 6.6Z"/></svg>
          </span><span>Favorites</span>
        </button>
        <button type="button" class="payment-shortcut qr" onclick="paymentPlaceholder()">
          <span class="payment-shortcut-icon">
            <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 3h10v10H3zM19 3h10v10H19zM3 19h10v10H3zM6 6h4v4H6zM22 6h4v4h-4zM6 22h4v4H6zM19 19h4v4h-4zM27 19v5h-4M19 27h5m3 0h2v2"/></svg>
          </span><span>Scan QR</span>
        </button>
      </div>
    </section>

    <label class="payment-field-card" for="amount">
      <input id="amount" type="text" inputmode="decimal" autocomplete="off" placeholder="Amount" aria-label="Amount in SEK">
    </label>

    <label class="payment-field-card" for="paymentMessage">
      <input id="paymentMessage" type="text" autocomplete="off" placeholder="Message" aria-label="Message">
    </label>

    <button class="payment-include-card" id="paymentIncludeCardButton" type="button" onclick="openCardOptions()" aria-haspopup="dialog">
      <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 13 16 3l13 10v16H3V13zM3 14l13 11 13-11M3 29l10-9m16 9-10-9"/></svg>
      <span>Include a card</span>
    </button>

    <div class="payment-demo-note">Demo only · No money will be sent</div>
  </div>

  <button class="payment-submit" type="button" onclick="startDemoVerification()">
    <span>Swish</span><span class="payment-bankid">BankID</span>
  </button>

  <!-- Separate options screen; opened only by the Include a card button. -->
  <section class="payment-card-screen" id="paymentCardScreen" role="dialog" aria-modal="true" aria-labelledby="paymentCardTitle" hidden>
    <header class="payment-card-screen-header">
      <button class="payment-card-back" type="button" onclick="closeCardOptions()" aria-label="Back to payment">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4L7 12l8 8"/></svg>
      </button>
      <h2 id="paymentCardTitle">Include a card</h2>
      <span class="payment-card-header-spacer" aria-hidden="true"></span>
    </header>
    <div class="payment-card-screen-body">
      <p class="payment-card-intro">Choose how your demo payment details appear.</p>
      <div class="payment-name-field">
        <label for="recipient">Name:</label>
        <input id="recipient" type="text" autocomplete="off" placeholder="Enter recipient name" maxlength="100">
      </div>
    <section class="payment-custom-details" aria-label="Custom payment details">
      <div class="payment-custom-row">
        <span id="customDetailsLabel">Custom Details</span>
        <label class="payment-custom-switch" aria-label="Enable custom details">
          <input type="checkbox" id="customDetailsToggle" onchange="toggleCustomDetails()" aria-controls="customDetailsInput" aria-expanded="false">
          <span class="payment-custom-switch-slider" aria-hidden="true"></span>
        </label>
      </div>
      <div class="payment-custom-input" id="customDetailsInput" style="display:none">
        <label for="customDetailsText">Additional recipient text</label>
        <input id="customDetailsText" type="text" placeholder="Example: VALLENTUNA KOMMUN" autocomplete="off" maxlength="100">
        <p class="payment-custom-hint">Custom mode changes the confirmation layout, adds a reference number and displays the phone number in groups.</p>
      </div>
    </section>

      <p class="payment-card-demo-note">Demo only · No money will be sent</p>
    </div>
    <button class="payment-card-done" type="button" onclick="closeCardOptions()">Done</button>
  </section>

  <div class="payment-contacts-backdrop" id="paymentContactsBackdrop" hidden onclick="closePaymentContacts(event)">
    <div class="payment-contacts-sheet" role="dialog" aria-modal="true" aria-label="Saved contacts" onclick="event.stopPropagation()">
      <div class="payment-sheet-top"><strong>Contacts</strong><button type="button" onclick="closePaymentContacts()" aria-label="Close contacts">×</button></div>
      <div id="paymentContactList" class="payment-contact-list"></div>
      <div class="payment-contact-actions">
        <button type="button" onclick="savePaymentContact()">Save current recipient</button>
      </div>
    </div>
  </div>
</div>`,


scan: `<button class="back" onclick="showPage('home')">← Back</button><h1>Scan</h1><div class="scanframe"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9V3h6M15 3h6v6M3 15v6h6M21 15v6h-6M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7zM14 14h2m2 0v3m-4 0h2"/></svg></div><p style="text-align:center">QR scanning is a visual demo only.</p>`

};

function showPage(page) {



    // Stop animations from previous screens

    clearInterval(idleParticleInterval);

    idleParticleInterval = null;



    stopParticleHold();



    const home = page === 'home';



    logo.hidden = !home;

    actions.hidden = !home;

    panel.hidden = home;



    if (!home) {

        panel.innerHTML = pages[page] || '';



        if (page === 'swish') {
            // Contacts are displayed in the Contacts sheet on demand.
        }

    }



    document.querySelector('.navbar').hidden = (page === 'swish' || page === 'swishscreen');
    panel.classList.toggle('payment-panel', page === 'swish');

    document.querySelectorAll('.tab').forEach(tab => {

        const active = tab.dataset.page === page;



        tab.classList.toggle('active', active);



        tab.setAttribute(

            'aria-current',

            active ? 'page' : 'false'

        );

    });

}

function demoNotice() { alert('Transaktion nekad. Inte tillräckligt saldo på kontot.'); }

function saveName() { const name=document.getElementById('displayname').value.trim(); document.getElementById('savedname').textContent=name ? 'Saved for this preview: '+name : 'Please enter a name.'; }

function toggleCustomDetails() { const toggle=document.getElementById('customDetailsToggle'); const box=document.getElementById('customDetailsInput'); if(toggle&&box) { box.style.display=toggle.checked?'block':'none'; toggle.setAttribute('aria-expanded', String(toggle.checked)); } }

function formatSwedishPhone(phone) {

 let digits=String(phone).replace(/\D/g,'');

 if(digits.startsWith('46')) digits='0'+digits.slice(2);

 if(/^07\d{8}$/.test(digits)) return '+46 '+digits.slice(1,3)+' '+digits.slice(3,6)+' '+digits.slice(6,8)+' '+digits.slice(8,10);

 return phone;

}



