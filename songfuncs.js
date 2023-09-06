//import { setMySongs } from '../App.js'

// song has ended 
export function songEnded(e, currentSong, setMySongs, mySongRef, mySongs, setPlaying, playAllRef, isPlaying, bucket) {
    const curSongs = mySongRef.current;
    const curId = Number(currentSong.id);
    const checkInSongs = curSongs.filter((song) => song.id == curId && song);
    if (checkInSongs.length != 0) {
        const isInSongs = checkInSongs[0].inYourSongs;
        setMySongs(curSongs.map((song) => (song.id == curId) ?
            { ...song, playStatus: false, inYourSongs: isInSongs } : song
        ))

        setPlaying(null);
        if (playAllRef.current && bucket === 'my-songs-bucket') {
            nextSongFn(e, currentSong, playAllRef.current, mySongRef, mySongs, setPlaying, isPlaying, setMySongs, playAllRef, bucket);
        }
    }
}

// when playAll is true - this function advances to the next song
export const nextSongFn = (e, lastSong, playAll, mySongRef, mySongs, setPlaying, isPlaying, setMySongs, playAllRef, bucket) => {
    if (lastSong.length == 1) {
        lastSong = lastSong[0];
    }
    const showingSongs = mySongRef.current.filter((song) => song.showSong == true);
    const thisSongIndex = showingSongs.findIndex(song => { if (song.id == lastSong.id) { return true } });
    let nextSong = showingSongs[thisSongIndex + 1];

    if (lastSong.id == showingSongs[showingSongs.length - 1].id) {
        nextSong = showingSongs[0];
    }
    startPlaying(nextSong, true, playAll, mySongs, setPlaying, isPlaying, setMySongs, mySongRef, playAllRef, bucket)
    if (bucket === 'my-songs-bucket') {
        const scrollSong = document.getElementById('song-id-' + nextSong.id);
        scrollSong.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// start playing a song
export const startPlaying2 = (theSong, playOrPause, playAll, mySongs, setPlaying, isPlaying, setMySongs, mySongRef, playAllRef, bucket) => {

    const currentSong = JSON.parse(JSON.stringify(theSong)); // create a copy of the song object
    if (currentSong.url != undefined) {
        const songIsPlaying = () => {  // checks to see if any song is playing
            const songPlaying = mySongs.filter((song) => song.playStatus == true);
            if (songPlaying.length > 0) {
                return true;
            } else {
                return false;
            }
        }

        let _song = ''
        if (songIsPlaying() == false) {  // no song is playing
            setMySongs(mySongs.map((song) => song.id === currentSong.id ?
                { ...song, playStatus: true } :
                { ...song, playStatus: false }
            ))
            _song = new Audio('https://www.chrishowardsongs.com/music-bucket/' + currentSong.url);
            setPlaying(_song);
            _song.id = 'audio' + currentSong.id;
            _song.addEventListener('ended', (e) => songEnded(e, currentSong, setMySongs, mySongRef, mySongs, setPlaying, playAllRef, isPlaying, bucket), true)
            _song.play();
            if (bucket === 'your-songs-bucket') {
                initVisualizer(_song);
            }
        } else {  // a song is playing
            if (playOrPause == 'pause') {  // clicked song is the playing one, pause it
                isPlaying.pause();
                setMySongs(mySongs.map((song) => currentSong.id === song.id ? ({ ...song, playStatus: false }) : song
                ))
            } else { // new song was clicked
                if (isPlaying != null) {
                    isPlaying.pause();
                }
                // isPlaying.removeEventListener('ended', songEnded, playAll)
                setMySongs(mySongs.map((song) => song.id === currentSong.id ?
                    { ...song, playStatus: true } :
                    { ...song, playStatus: false }
                ))
                _song = new Audio('https://www.chrishowardsongs.com/music-bucket/' + currentSong.url);
                setPlaying(_song);
                let tempPlayAll = false;

                if (playAll) {
                    tempPlayAll = true;
                }
                _song.id = 'audio' + currentSong.id;
                _song.addEventListener('ended', (e) => songEnded(e, currentSong, setMySongs, mySongRef, mySongs, setPlaying, playAllRef, isPlaying, bucket))
                _song.play();
                if (bucket === 'your-songs-bucket') {
                    initVisualizer(_song);
                }
            }
        }

    }
}

// rewind function
export const rewind = (song, isPlaying, setPlaying, setMySongs, mySongRef, mySongs, playAllRef, bucket) => {
    let _song = '';
    isPlaying.pause();
    setPlaying(null)
    _song = new Audio('https://www.chrishowardsongs.com/music-bucket/' + song.url);

    _song.removeEventListener('ended', songEnded, true)
    _song.addEventListener('ended', (e) => songEnded(e, song, setMySongs, mySongRef, mySongs, setPlaying, playAllRef, isPlaying, bucket), true)
    _song.id = 'audio' + song.id;
    _song.play();
    setPlaying(_song);
}


export const initVisualizer = (_song) => {
    _song.pause();
    let audio1 = _song;
    audio1.src = _song.src;

    const canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let audioSource = null;
    let analyser = null;

    audio1.play();
    audioSource = audioCtx.createMediaElementSource(audio1);
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
                barHeight = barHeight * 2
                ctx.fillStyle = '#b9d4dc'
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 5;
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

