/* MUSIC DATABASE */
const songs = [
    { title: "Cyberpunk Night", artist: "Neon Dreams", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Digital Horizon", artist: "SynthWave", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Midnight Drive", artist: "Retro Vibes", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { title: "Electric Sky", artist: "Future Bass", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" }
];

/* SELECTIONS */
let songIndex = 0;
const audio = document.getElementById('audio-element');
const playBtn = document.getElementById('play-pause');
const playIcon = document.getElementById('play-icon');
const progressBar = document.getElementById('progress-bar');
const playlistUI = document.getElementById('playlist');
const playerZone = document.getElementById('player-zone');

/* INITIALIZATION */
function initApp() {
    renderPlaylist();
    loadSong(songs[songIndex]);
    audio.volume = 0.7; // Default volume
}

function renderPlaylist() {
    playlistUI.innerHTML = '';
    songs.forEach((song, i) => {
        const li = document.createElement('li');
        li.className = `playlist-item ${i === songIndex ? 'active' : ''}`;
        li.innerHTML = `
            <strong>${song.title}</strong>
            <div style="font-size: 0.8rem; opacity: 0.6;">${song.artist}</div>
        `;
        li.onclick = () => selectSong(i);
        playlistUI.appendChild(li);
    });
}

function loadSong(song) {
    document.getElementById('title').innerText = song.title;
    document.getElementById('artist').innerText = song.artist;
    audio.src = song.src;
}

function selectSong(index) {
    songIndex = index;
    loadSong(songs[songIndex]);
    playMusic();
    renderPlaylist();
}

function playMusic() {
    playerZone.classList.add('playing');
    playIcon.className = 'fas fa-pause';
    audio.play().catch(e => console.log("User interaction required for play"));
}

function pauseMusic() {
    playerZone.classList.remove('playing');
    playIcon.className = 'fas fa-play';
    audio.pause();
}

/* EVENT LISTENERS */
playBtn.addEventListener('click', () => {
    const isPlaying = playerZone.classList.contains('playing');
    isPlaying ? pauseMusic() : playMusic();
});

document.getElementById('next').addEventListener('click', () => {
    songIndex = (songIndex + 1) % songs.length;
    selectSong(songIndex);
});

document.getElementById('prev').addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    selectSong(songIndex);
});

// Update Progress Bar & Timer
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.value = percent;
        document.getElementById('current-time').innerText = formatTime(audio.currentTime);
    }
});

// Load duration once metadata is ready
audio.addEventListener('loadedmetadata', () => {
    document.getElementById('duration').innerText = formatTime(audio.duration);
});

// Seek music
progressBar.addEventListener('input', () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});

// Volume update
document.getElementById('volume-slider').addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

// Formatting time helper
function formatTime(time) {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Auto-play next song
audio.addEventListener('ended', () => {
    songIndex = (songIndex + 1) % songs.length;
    selectSong(songIndex);
});

/* RUN */
initApp();