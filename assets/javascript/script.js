
const apodImage = document.getElementById("orbit-image");
const API_KEY = "q6MAM0NRPdrz7ICmAHstyfpVH1KIkOHnta2GaO4x";
const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

window.addEventListener("load", function() {
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      apodImage.src = data.url;
      apodImage.alt = data.title;
    })
    .catch(error => console.error(error));
});
  