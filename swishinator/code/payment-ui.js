
/* Payment screen-only interactions. Confirmation code remains unchanged. */
function paymentPlaceholder() {
  // Intentionally a visual-only control for now.
}
function openPaymentContacts() {
  const backdrop=document.getElementById('paymentContactsBackdrop');
  const list=document.getElementById('paymentContactList');
  if (!backdrop || !list) return;
  list.replaceChildren();
  const contacts=getSavedContacts();
  if (!contacts.length) {
    const empty=document.createElement('p');
    empty.className='payment-contact-empty';
    empty.textContent='No saved contacts yet. Enter a phone number, then add a name under Include a card to save it here.';
    list.appendChild(empty);
  }
  contacts.forEach(contact => {
    const button=document.createElement('button');
    button.type='button';
    const name=document.createElement('span');
    name.textContent=contact.name;
    const phone=document.createElement('small');
    phone.textContent=contact.phone;
    button.append(name,phone);
    button.addEventListener('click',()=>{
      document.getElementById('recipient').value=contact.name;
      document.getElementById('phoneNumber').value=contact.phone;
      closePaymentContacts();
    });
    list.appendChild(button);
  });
  backdrop.hidden=false;
}
function closePaymentContacts(event) {
  if (event && event.target!==event.currentTarget) return;
  const backdrop=document.getElementById('paymentContactsBackdrop');
  if (backdrop) backdrop.hidden=true;
}
function savePaymentContact() {
  const name=document.getElementById('recipient')?.value.trim();
  const phone=document.getElementById('phoneNumber')?.value.trim();
  if (!name || !phone) {
    alert('Enter a phone number in Recipient and a name under Include a card first.');
    return;
  }
  const contacts=getSavedContacts();
  const index=contacts.findIndex(c=>c.phone===phone);
  if (index>=0) contacts[index].name=name;
  else contacts.push({name,phone});
  try {
    localStorage.setItem('swishContacts',JSON.stringify(contacts));
  } catch {
    alert('Could not save the contact in this browser.');
    return;
  }
  openPaymentContacts();
}


/* A separate full-screen Include a card options page. */
function openCardOptions() {
  const screen = document.getElementById('paymentCardScreen');
  if (!screen) return;
  screen.hidden = false;
  screen.querySelector('.payment-card-back')?.focus();
}

function closeCardOptions() {
  const screen = document.getElementById('paymentCardScreen');
  if (!screen) return;
  screen.hidden = true;
  document.getElementById('paymentIncludeCardButton')?.focus();
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !document.getElementById('paymentCardScreen')?.hidden) {
    if (document.getElementById('paymentCardScreen')) closeCardOptions();
  }
});
