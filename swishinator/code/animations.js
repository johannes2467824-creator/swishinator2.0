let demoVerificationRunning = false;

function animateGreenCurve(path, duration = 1100) {



    const svg = path.ownerSVGElement;



    // Use the actual screen height instead of assuming 900px

    const screen = document.querySelector('.confirmation-screen');

    const screenHeight = screen.getBoundingClientRect().height;



    // Match the real final SVG path geometry (its viewBox is 390 x 430).
    // This keeps the curve aligned with the finished confirmation screen.
    const finalHeight = screen.querySelector('.confirmation-green').getBoundingClientRect().height;
    const finalEdge = finalHeight * (399 / 430);
    const finalDepth = finalHeight * (50 / 430);



    svg.setAttribute('viewBox', `0 0 390 ${screenHeight}`);



    const start = performance.now();



    function frame(now) {



        const progress = Math.min((now - start) / duration, 1);

        const eased = 1 - Math.pow(1 - progress, 3);



        // Move the entire bottom edge upwards

        const edgeY =

            screenHeight + (finalEdge - screenHeight) * eased;



        // Gradually bend the straight edge into a curve

        const depth = finalDepth * eased;



        path.setAttribute(

            'd',

            `M 0 0 H 390

             V ${edgeY}

             Q 195 ${edgeY + depth} 0 ${edgeY}

             Z`

        );



        if (progress < 1) {

            requestAnimationFrame(frame);

        }

    }



    requestAnimationFrame(frame);

}

function playGreenConfirmationIntro() {



    const screen = document.querySelector('.confirmation-screen');

    if (!screen) return;



    screen.classList.add('intro-running');



    const intro = document.createElement('div');

    intro.className = 'green-intro';



    intro.innerHTML = `

        <div class="green-intro-shape">



<svg class="background-shape"

     viewBox="0 0 390 900"

     preserveAspectRatio="none">



    <defs>

        <linearGradient id="introGreenGradient"

            x1="0" y1="0" x2="1" y2="1">

            <stop offset="0%" stop-color="#91B900"/>

            <stop offset="100%" stop-color="#198A29"/>

        </linearGradient>

    </defs>



    <path

        id="animatedGreenPath"

        d="M 0 0 H 390 V 900 Q 195 900 0 900 Z"

        fill="url(#introGreenGradient)"

    />

</svg>



        </div>



        <div class="green-intro-content">

            <svg class="green-intro-check" viewBox="0 0 64 64">

                <circle cx="30" cy="34" r="25"/>

                <path d="M18 33 L27 42 L57 12"/>

            </svg>



            <div class="green-intro-text">

                Your payment has been sent!

            </div>

        </div>

    `;



    // Custom mode has different checkmark AND text endpoints. Measure the actual
    // final elements, rather than guessing percentages or changing the layout.
    if (screen.classList.contains('custom-mode')) {
        const screenRect = screen.getBoundingClientRect();
        const checkRect = screen.querySelector('.confirmation-check').getBoundingClientRect();
        const textRect = screen.querySelector('.confirmation-message').getBoundingClientRect();
        const checkTop = checkRect.top - screenRect.top;
        const messageTop = textRect.top - screenRect.top;
        // Existing intro layout: 90px check + 22px gap - 7px text margin.
        const textOffset = messageTop - (checkTop + checkRect.height + 22 - 7);
        intro.style.setProperty('--custom-intro-check-top', `${checkTop}px`);
        intro.style.setProperty('--custom-intro-text-offset', `${textOffset}px`);
    }

    screen.appendChild(intro);



    // First: draw the checkmark and reveal the text.

    setTimeout(() => {



        // Then: shrink the green area while details rise.



intro.classList.add('shrink');

screen.classList.add('intro-reveal');



// Animate the green edge into its curved final shape

const greenPath = intro.querySelector('#animatedGreenPath');



if (greenPath) {

    animateGreenCurve(greenPath, 850);

}





    }, 1200);



    // Settle into the existing confirmation layout.

    setTimeout(() => {



        screen.classList.remove('intro-running');



        intro.classList.add('finished');



        setTimeout(() => {

            intro.remove();

            screen.classList.remove('intro-reveal');

        }, 200);



    }, 2350);

}



function startDemoVerification() {



    if (demoVerificationRunning) return;



    demoVerificationRunning = true;



    const overlay = document.createElement('div');



    overlay.className = 'demo-verification';





overlay.innerHTML = `

    <img

        src="./images/swishloggan.png"

        class="verification-logo"

        alt="Demo app logo"

    >



    <div class="verification-loading">

        <div class="verification-dots">

            <span></span>

            <span></span>

            <span></span>

        </div>



        <div class="verification-text">

            Verifying your payment...

        </div>

    </div>

`;





    document.querySelector('.screen').appendChild(overlay);



    // Show loading animation for 2 seconds

    setTimeout(() => {



        // Prepare the confirmation screen underneath



    goToSwishScreen();



    // Prepare the full-screen green animation underneath.











    playGreenConfirmationIntro();



    // Fade the verification overlay away.

    requestAnimationFrame(() => {

        overlay.classList.add('fade-out');

    });





        // Remove overlay after fade finishes

        setTimeout(() => {

            overlay.remove();

            demoVerificationRunning = false;

        }, 550);



    }, 2000);



}



