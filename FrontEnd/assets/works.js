const works_API = "http://localhost:5678/api/works";
const gallery = document.querySelector(".gallery");

//Nettoyage de la galerie
gallery.innerHTML = "";

// Récupération des travaux depuis l'API
fetch(works_API).then((response) =>
  response.json().then((works) => {
    for (let i = 0; i < works.length; i++) {
      let figure = createWork(works[i]);
    }
  })
);

function createWork(work) {
  let figure = document.createElement("figure");
  let imageWork = document.createElement("img");
  imageWork.src = work.imageUrl;
  figure.appendChild(imageWork);

  let figcaption = document.createElement("figcaption");
  figcaption.innerText = work.title || "(Aucun nom)";
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}
