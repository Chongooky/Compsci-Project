let currentImage = "";


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
    alert("NO SONG FOUND");
    return;
  }

  const song = data.results[0];
  const image = song.artworkUrl100.replace("100x100", "600x600");

  currentImage = image;
  document.getElementById("cover").src = image;
}


const saveBtn = document.getElementById("saveBtn");
const savedContainer = document.getElementById("savedContainer");

saveBtn.addEventListener("click", () => {
  if (!currentImage) return;

  let saved = JSON.parse(localStorage.getItem("savedAlbums")) || [];

  if (!saved.includes(currentImage)) {
    saved.push(currentImage);
    localStorage.setItem("savedAlbums", JSON.stringify(saved));
  }

  renderSaved();
});


function renderSaved() {
  const saved = JSON.parse(localStorage.getItem("savedAlbums")) || [];

  savedContainer.innerHTML = "";

  saved.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.classList.add("saved-img");

    savedContainer.appendChild(img);
  });
}

window.addEventListener("load", renderSaved);