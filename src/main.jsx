import './index.css'

const API_KEY = import.meta.env.VITE_NASA_API_KEY;

const app = document.querySelector("#app");
app.innerHTML = "<p>loading...</p>";

// Function to calculate time until next APOD (midnight UTC)
function updateCountdown() {
  const now = new Date();
  const nextMidnightUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
  const timeUntil = nextMidnightUTC - now;
  
  const hours = Math.floor((timeUntil / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeUntil / (1000 * 60)) % 60);
  const seconds = Math.floor((timeUntil / 1000) % 60);
  
  const timerEl = document.querySelector("#timer");
  if (timerEl) {
    timerEl.textContent = `next nasa image of the day in: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}

// Start countdown timer updates
setInterval(updateCountdown, 1000);
updateCountdown();

fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
  .then(response => response.json())
  .then(data => {
    let media;

    if (data.media_type === "image") {
      media = `<img src="${data.url}" alt="${data.title}"/>`;
    } else if (data.url.includes("youtube")) {
      media = `<iframe src="${data.url.replace("watch?v=", "embed/")}" title="${data.title}"></iframe>`;
    } else {
      media = `<video src="${data.url}" controls></video>`;
    }

    app.innerHTML = `
      <div id="timer"></div>
      <h1>${data.title}</h1>
      ${media}
      <p>${data.explanation}</p>
    `;
    updateCountdown(); // Update timer with fresh DOM
  })
  .catch(err => {
    app.innerHTML = `<p>Error: ${err.message}</p>`;
  });