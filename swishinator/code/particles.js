/* =========================================

   OPTIMIZED PARTICLES + SLIDE SOUND

========================================= */



let idleParticleInterval = null;

let activeGesture = null;

let lastParticleAt = 0;

let slidePlaying = false;

const SLIDE_THRESHOLD = 12;

const STAR_SECRET_CODE = [1, 1, 2, 2, 3, 3, 2, 8, 8, 5, 5, 7, 7, 1];

let starCodeProgress = 0;

function checkStarSecretCode(number) {
    if (number === STAR_SECRET_CODE[starCodeProgress]) {
        starCodeProgress++;
    } else {
        starCodeProgress = number === STAR_SECRET_CODE[0] ? 1 : 0;
    }

    if (starCodeProgress === STAR_SECRET_CODE.length) {
        starCodeProgress = 0;
        return true;
    }

    return false;
}



// The SVG green edge is a quadratic curve (viewBox 390 x 430).

// Check against that curve, not the rectangular sound pad.

function isInsideGreen(clientX, clientY) {

    const green = document.querySelector('.confirmation-green');

    if (!green) return false;

    const rect = green.getBoundingClientRect();

    const x = (clientX - rect.left) / rect.width;

    const y = (clientY - rect.top) / rect.height;

    if (x < 0 || x > 1 || y < 0 || y > 1) return false;

    return y <= (399 + 100 * x * (1 - x)) / 430;

}



function createClickParticles(clientX, clientY, amount = 4, particleSize = "large", useStars = false) {

    const layer = document.getElementById('clickParticleLayer');

    if (!layer) return;

    const rect = layer.getBoundingClientRect();

    const x = clientX - rect.left, y = clientY - rect.top;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < amount; i++) {

        const particle = document.createElement('span');

        
        particle.className = useStars
            ? 'click-particle star-particle'
         : 'click-particle';

        if (useStars) {
            particle.textContent = '⭐';
        }


        const angle = Math.random() * Math.PI * 2;

        const distance = 35 + Math.random() * 95;

        particle.style.left = x + 'px';

        particle.style.top = y + 'px';

        particle.style.setProperty('--moveX', Math.cos(angle) * distance + 'px');
        particle.style.setProperty('--moveY', Math.sin(angle) * distance + 'px');
        if (useStars) {
    particle.style.setProperty(
        '--spin',
        (Math.random() > 0.5 ? 1 : -1) *
        (360 + Math.random() * 720) + 'deg'
    );
}

        
particle.style.setProperty(
    '--size',
    useStars
    ? (24 + Math.random() * 36) + 'px'
        : (particleSize === 'tap'
            ? 4 + Math.random() * 6
            : 5 + Math.random() * 7) + 'px'
);

        particle.style.setProperty('--duration', (particleSize === 'tap' ? 450 + Math.random() * 350 : 1150 + Math.random() * 550) + 'ms');

        particle.addEventListener('animationend', () => particle.remove(), {once:true});

        fragment.appendChild(particle);

    }

    layer.appendChild(fragment);

    while (layer.childElementCount > 420) layer.firstElementChild.remove();

}



function startSlideSound() {

    if (slidePlaying) return;

    slidePlaying = true;

    const sound = document.getElementById('paymentSlideSound');

    if (!sound) return;

    sound.volume = 1;

    sound.currentTime = 0;

    sound.play().catch(error => console.log('Slide audio:', error));

}

function stopSlideSound() {

    slidePlaying = false;

    const sound = document.getElementById('paymentSlideSound');

    if (sound) { sound.pause(); sound.currentTime = 0; }

}

function stopParticleHold() {

    activeGesture = null;

    stopSlideSound();

}



document.addEventListener('pointerdown', event => {

    const zone = event.target.closest('.sound-box');

    if (!zone || !isInsideGreen(event.clientX,event.clientY) || activeGesture || (event.pointerType === 'mouse' && event.button !== 0)) return;

    
const soundNumber = Number(zone.dataset.sound);
const starActivated = checkStarSecretCode(soundNumber);

activeGesture = {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    lastX: event.clientX,
    lastY: event.clientY,
    sound: soundNumber,
    sliding: false,
    star: starActivated
};


    // Pointer capture ensures release is detected even when dragging outside a box.

    zone.setPointerCapture?.(event.pointerId);

});



document.addEventListener('pointermove', event => {

    const gesture = activeGesture;

    if (!gesture || gesture.id !== event.pointerId) return;

    const insideGreen = isInsideGreen(event.clientX, event.clientY);

    const distance = Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y);

    if (!gesture.sliding && distance >= SLIDE_THRESHOLD) {

        gesture.sliding = true;

    }

    if (!insideGreen) {

        stopSlideSound();

        gesture.lastX = event.clientX;

        gesture.lastY = event.clientY;

        return;

    }

    if (gesture.sliding && !slidePlaying) {

        startSlideSound();

        createClickParticles(event.clientX, event.clientY, 32, 'large', gesture.star);

    }

    if (gesture.sliding) {

        const now = performance.now();

        if (now - lastParticleAt >= 35 && Math.hypot(event.clientX-gesture.lastX,event.clientY-gesture.lastY)>2) {

            createClickParticles(event.clientX, event.clientY, 16, 'large', gesture.star);

            lastParticleAt = now;

        }

    }

    gesture.lastX = event.clientX;

    gesture.lastY = event.clientY;

});



document.addEventListener('pointerup', event => {

    const gesture = activeGesture;

    if (!gesture || gesture.id !== event.pointerId) return;

    if (!gesture.sliding && isInsideGreen(event.clientX,event.clientY)) {

        pressSoundBox(gesture.sound);

        
createClickParticles(
    event.clientX,
    event.clientY,
    gesture.star ? 15 : 28,
    'tap',
    gesture.star
);


    }

    stopParticleHold();

});

document.addEventListener('pointercancel', stopParticleHold);

window.addEventListener('blur', stopParticleHold);



// LIGHTWEIGHT BACKGROUND PARTICLES



function createIdleParticle() {



    const container = document.querySelector('.confirmation-particles');



    if (!container) return;



    const particle = document.createElement('span');



    const isGlow = Math.random() < 0.18;

    particle.className = isGlow ? 'idle-particle idle-glow' : 'idle-particle';



    const angle = Math.random() * Math.PI * 2;

    const distance = 20 + Math.random() * 70;



    particle.style.left = Math.random() * container.clientWidth + 'px';



    particle.style.top = Math.random() * container.clientHeight + 'px';



    particle.style.setProperty(

        '--size',

        (isGlow ? 7 + Math.random() * 6 : 1.5 + Math.random() * 2.5) + 'px'

    );



    particle.style.setProperty(

        '--moveX',

        Math.cos(angle) * distance + 'px'

    );



    particle.style.setProperty(

        '--moveY',

        Math.sin(angle) * distance + 'px'

    );



    particle.style.setProperty(

        '--duration',

        (2500 + Math.random() * 2500) + 'ms'

    );



    particle.style.setProperty(

        '--brightness',

        isGlow ? 0.18 + Math.random() * 0.18 : 0.45 + Math.random() * 0.5

    );



    container.appendChild(particle);

    while (container.childElementCount > 110) container.firstElementChild.remove();



    particle.addEventListener(

        'animationend',

        () => particle.remove(),

        { once: true }

    );



}





// START BACKGROUND PARTICLES



function startIdleParticles() {



    clearInterval(idleParticleInterval);



    const container = document.querySelector('.confirmation-particles');



    if (!container) return;



    container.replaceChildren();



    for (let i = 0; i < 65; i++) {



        createIdleParticle();



    }



    idleParticleInterval = setInterval(() => {



        if (!document.querySelector('.confirmation-particles')) {



            clearInterval(idleParticleInterval);



            idleParticleInterval = null;



            return;



        }



        createIdleParticle();



    }, 95);



}

