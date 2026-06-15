let currentSong = null;

const saveBtn = document.getElementById("saveBtn");
const savedContainer = document.getElementById("savedContainer");

async function searchSong() {
  const input = document.getElementById("songInput").value;

  if (!input) {
    alert("Please enter a song name");
    return;
  }

  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(input)}&entity=song`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.results.length === 0) {
    alert("No song found, try again");
    return;
  }

  const song = data.results[0];

  currentSong = {
    trackName: song.trackName,
    artistName: song.artistName,
    releaseDate: song.releaseDate,
    artwork: song.artworkUrl100.replace("100x100", "600x600")
  };

  document.getElementById("cover").src = currentSong.artwork;
}


saveBtn.addEventListener("click", () => {
  if (!currentSong) return;

  let saved = JSON.parse(localStorage.getItem("savedAlbums")) || [];


  if (!saved.some(s => s.artwork === currentSong.artwork)) {
    saved.push(currentSong);
    localStorage.setItem("savedAlbums", JSON.stringify(saved));
  }

  renderSaved();
});


function renderSaved() {
  const saved = JSON.parse(localStorage.getItem("savedAlbums")) || [];

  savedContainer.innerHTML = "";

  saved.forEach(song => {
    const img = document.createElement("img");
    img.src = song.artwork;
    img.classList.add("saved-img");

    img.addEventListener("click", () => {
      showPopup(song);
    });

    savedContainer.appendChild(img);
  });
}


function generateDescription(song) {
  const year = song.releaseDate.slice(0, 4);

  const moods = ["energetic", "emotional", "dark", "uplifting", "chill", "intense"];
  const visuals = ["vibrant colors", "minimalist design", "neon tones", "moody lighting", "abstract visuals"];

  const templates = [
    `${song.trackName} by ${song.artistName} (${year}) features artwork with ${rand(visuals)}, giving it a ${rand(moods)} feel.`,
    
    `The cover of "${song.trackName}" by ${song.artistName} uses ${rand(visuals)}, creating a ${rand(moods)} atmosphere that reflects the music.`,
    
    `${song.artistName}'s "${song.trackName}" (${year}) stands out with its ${rand(visuals)} and a ${rand(moods)} visual tone.`,
    
    `${song.artistName}'s "${song.trackName}" (${year}) stands out with attention detail. Fans praise this song for it's iconic melody and feel.`,

    `With ${rand(visuals)} and a ${rand(moods)} vibe, the artwork for "${song.trackName}" complements the song’s identity.`,
    
    `The album cover for "${song.trackName}" leans into ${rand(visuals)}, giving off a ${rand(moods)} impression tied to the track.`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function showPopup(song) {
  document.getElementById("popup").classList.remove("hidden");

  document.getElementById("popup-img").src = song.artwork;
  document.getElementById("popup-title").textContent = song.trackName;
  document.getElementById("popup-artist").textContent = "Artist: " + song.artistName;
  document.getElementById("popup-date").textContent = "Release: " + song.releaseDate.slice(0, 10);
  document.getElementById("popup-desc").textContent = generateDescription(song);
}


document.getElementById("closePopup").addEventListener("click", () => {
  document.getElementById("popup").classList.add("hidden");
});


window.addEventListener("load", renderSaved);