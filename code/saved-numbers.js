function getSavedContacts() { try { const contacts=JSON.parse(localStorage.getItem('swishContacts')||'[]'); return Array.isArray(contacts)?contacts:[]; } catch { return []; } }

function saveContact() {

 const name=document.getElementById('recipient').value.trim(), phone=document.getElementById('phoneNumber').value.trim();

 if(!name||!phone) { alert('Please enter a name and phone number first.'); return; }

 const contacts=getSavedContacts(), existing=contacts.findIndex(contact=>contact.phone===phone);

 if(existing!==-1) contacts[existing].name=name; else contacts.push({name,phone});

 try { localStorage.setItem('swishContacts',JSON.stringify(contacts)); } catch { alert('Could not save the contact in this browser.'); return; }

 loadSavedContacts(phone); alert('Contact saved!');

}

function loadSavedContacts(selectedPhone='') {

 const selector=document.getElementById('contactSelector'); if(!selector)return;

 selector.replaceChildren(new Option('Select a saved contact...',''));

 getSavedContacts().forEach(contact=>selector.add(new Option(contact.name+' ('+contact.phone+')',contact.phone)));

 selector.value=selectedPhone;

}

function selectSavedContact() {

 const selector=document.getElementById('contactSelector'); if(!selector)return;

 const contact=getSavedContacts().find(item=>item.phone===selector.value); if(!contact)return;

 document.getElementById('recipient').value=contact.name; document.getElementById('phoneNumber').value=contact.phone;

}

function browseContacts(direction) {

 const contacts=getSavedContacts(); if(!contacts.length) { alert('You have no saved contacts yet.'); return; }

 const selector=document.getElementById('contactSelector'); let index=contacts.findIndex(contact=>contact.phone===selector.value);

 if(index===-1) index=direction===1?0:contacts.length-1; else index=(index+direction+contacts.length)%contacts.length;

 selector.value=contacts[index].phone; selectSavedContact();

}



// PRELOAD ALL NINE SOUNDS

/* =========================================

   LOW-LATENCY IPHONE SOUND ENGINE

========================================= */



