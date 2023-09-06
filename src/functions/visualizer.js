export const initVisualizer = (_song, wasPlaying) => {
    const canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let audioSource = null;
    let analyser = null;

    if (wasPlaying) {
        audioSource = audioCtx.createMediaElementSource(_song);
        analyser = audioCtx.createAnalyser();
        audioSource.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 32; //128



        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const barWidth = (canvas.width / bufferLength) - 5;
        let barHeight;
        let x = 0;
        function animate() {
            x = 0;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            analyser.getByteFrequencyData(dataArray);
            for (let i = bufferLength; i >= 0; i--) {
                barHeight = dataArray[i - 1];
                if (i == 0) { // this is just cheating because I don't like the way it looks
                    barHeight = barHeight * 0.7
                } else if (i == 1) {
                    barHeight = barHeight * 0.8
                } else if (i == 2) {
                    barHeight = barHeight * 0.9
                } else {
                    barHeight = barHeight * 1.2
                }
                if (i <= 12) {
                    barHeight = barHeight * 1.8
                    ctx.fillStyle = '#b9d4dc'
                    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                    x += barWidth + 5;
                }
            }

            requestAnimationFrame(animate);
        }

        animate();
    }
}