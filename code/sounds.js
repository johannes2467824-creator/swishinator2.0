const AudioContextClass =

    window.AudioContext || window.webkitAudioContext;



const swishAudioContext = new AudioContextClass({

    latencyHint: 'interactive'

});



const swishBuffers = new Array(9).fill(null);



let swishAudioReady = false;



// Download and decode all 9 MP3 files

async function loadSwishSounds() {



    try {



        const promises = Array.from({ length: 9 }, async (_, i) => {



            const number = i + 1;



            const response = await fetch(

                './sounds/swishpling' + number + '.mp3'

            );



            if (!response.ok) {

                throw new Error('Could not load sound ' + number);

            }



            const arrayBuffer = await response.arrayBuffer();



            const decodedAudio =

                await swishAudioContext.decodeAudioData(arrayBuffer);



            swishBuffers[i] = decodedAudio;



        });



        await Promise.all(promises);



        swishAudioReady = true;



        console.log('All 9 Swish sounds are ready!');



    } catch (error) {



        console.error('Sound loading failed:', error);



    }



}



// Start loading immediately

loadSwishSounds();





// Unlock audio on iPhone after user interaction

function unlockSwishAudio() {



    if (swishAudioContext.state === 'suspended') {



        swishAudioContext.resume().catch(error => {

            console.error('Audio unlock failed:', error);

        });



    }



}



document.addEventListener(

    'pointerdown',

    unlockSwishAudio,

    { passive: true }

);





// MIX MULTIPLE QUICK TAPS WITHOUT OVERLOADING THE OUTPUT

const plingCompressor = swishAudioContext.createDynamicsCompressor();

plingCompressor.threshold.value = -18;

plingCompressor.knee.value = 12;

plingCompressor.ratio.value = 6;

plingCompressor.attack.value = 0.003;

plingCompressor.release.value = 0.18;

plingCompressor.connect(swishAudioContext.destination);



const activePlings = new Set();

const MAX_PLINGS = 8;



function pressSoundBox(number) {

    const buffer = swishBuffers[number - 1];

    if (!buffer) return;



    // Every tap gets a NEW source, so rapid taps can overlap naturally.

    // Cap the number of voices to avoid distortion on phone speakers.

    if (activePlings.size >= MAX_PLINGS) {

        const oldest = activePlings.values().next().value;

        if (oldest) {

            try { oldest.stop(); } catch (_) {}

        }

    }



    const source = swishAudioContext.createBufferSource();

    const volume = swishAudioContext.createGain();

    source.buffer = buffer;

    volume.gain.value = 0.38;

    source.connect(volume);

    volume.connect(plingCompressor);

    activePlings.add(source);

    source.onended = () => {

        activePlings.delete(source);

        source.disconnect();

        volume.disconnect();

    };

    source.start();

}

