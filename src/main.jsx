import './index.css'

const API_KEY = import.meta.env.VITE_NASA_API_KEY;

const app = document.querySelector("#app");
app.innerHTML = "<p>loading...</p>";

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
      <h1>${data.title}</h1>
      ${media}
      <p>${data.explanation}</p>
    `;
  })
  .catch(err => {
    app.innerHTML = `<p>Error: ${err.message}</p>`;
  });