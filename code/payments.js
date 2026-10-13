function goToSwishScreen() {

 const recipient=document.getElementById('recipient')?.value || '';

 const phone=document.getElementById('phoneNumber')?.value || '';

 const amount=document.getElementById('amount')?.value || '';

 const customEnabled=document.getElementById('customDetailsToggle')?.checked || false;

 const customText=document.getElementById('customDetailsText')?.value || '';

 const paymentSound=document.getElementById('paymentSound');

 if(paymentSound) { paymentSound.pause(); paymentSound.currentTime=0; paymentSound.volume=1; paymentSound.play().catch(error=>console.log('Sound error:',error)); }

 showPage('swishscreen');

 const screen=document.querySelector('.confirmation-screen');

 document.getElementById('swishRecipient').textContent=recipient;

 
document.getElementById('swishPhone').textContent = customEnabled
    ? phone.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4')
    : formatSwedishPhone(phone);


 document.getElementById('swishAmount').textContent=Number(amount.replace(',','.')).toLocaleString('sv-SE',{minimumFractionDigits:0,maximumFractionDigits:2})+' kr';

 if(customEnabled) {

   screen.classList.add('custom-mode');

   if(customText.trim()) { const extra=document.createElement('div'); extra.className='confirmation-extra'; extra.textContent=customText; document.getElementById('swishPhone').before(extra); }

   const reference=document.createElement('div'); reference.className='confirmation-reference';

   const label=document.createElement('span'); label.className='confirmation-reference-label'; label.textContent='Reference';

   const value=document.createElement('span'); value.className='confirmation-reference-value'; 
const randomDigits = Array.from(
    crypto.getRandomValues(new Uint8Array(16)),
    n => String(n % 10)
).join('');

value.textContent = randomDigits.match(/.{1,4}/g).join(' ');


   reference.append(label,value);

   const footer=screen.querySelector('.confirmation-footer'); footer.before(reference);

 }

 updateSwishDateTime();

 startIdleParticles();

 // Record only when the demo confirmation screen has been reached.
 saveDemoTransaction({
   name: recipient,
   phone: phone,
   amount: document.getElementById('swishAmount')?.textContent || ''
 });

}

function updateSwishDateTime() {

 const display=document.getElementById('swishDateTime'); if(!display)return;

 const now=new Date(); const date=now.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}); const time=now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false}); display.textContent=date+' at '+time;

}

setInterval(updateSwishDateTime,1000);
