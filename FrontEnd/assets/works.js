const works_API = "http://localhost:5678/api/works";
const gallery = document.querySelector(".gallery");
const categories_API = "http://localhost:5678/api/categories";
const filters = document.querySelector(".filters");

/* Nettoyage de la galerie */
if (gallery) {
  gallery.innerHTML = "";
}

/* Récupération des travaux depuis l'API */
fetch(works_API).then((response) =>
  response.json().then((works) => {
    allWorks = works;
    for (let i = 0; i < works.length; i++) {
      let figure = createWork(works[i]);
    }
  })
);

/* Création des balises des travaux récupérés de l'API, et les rattacher au DOM */
function createWork(work) {
  if (gallery) {
    let figure = document.createElement("figure");
    let imageWork = document.createElement("img");
    imageWork.src = work.imageUrl;
    figure.appendChild(imageWork);

    let figcaption = document.createElement("figcaption");
    figcaption.innerText = work.title ?? "(Aucun nom)";
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  }
}

/* Récupération des catégories des travaux depuis l'APLI */
fetch(categories_API).then((response) =>
  response.json().then((categories) => {
    let filterWorks = new Set(categories);
    allCategories = Array.from(filterWorks);
    allCategories.unshift({ id: 0, name: "Tous" });
    Tous = { id: 0, name: "Tous" };
    createFilters(allCategories);
  })
);

/* Réalisation des filtres, et les rattacher au DOM */
function createFilters(category) {
  allCategories.forEach((category) => {
    const categoryVar = document.createElement("button");
    categoryVar.innerHTML = category.name;
    categoryVar.classList.add("filters-button");
    categoryVar.dataset.categoryId = category.id;
    if (category.id === 0) {
      categoryVar.classList.add("filter-selected");
    }

    if (filters) {
      categoryVar.addEventListener("click", () => {
        removeSelectedClass();
        filterWork(category.id);
        categoryVar.classList.add("filter-selected");
      });
      filters.appendChild(categoryVar);
    }
  });
}

/* Filtrage des catégories */
function filterWork(categoryId) {
  gallery.innerHTML = "";
  for (let i = 0; i < allWorks.length; i++) {
    if (allWorks[i].categoryId === categoryId || categoryId === 0) {
      createWork(allWorks[i]);
    }
  }
}

/* Fonction qui change l'apparence d'un filtre désélectionné */
function removeSelectedClass() {
  let buttons = document.querySelectorAll(".filters-button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("filter-selected");
  }
}

/* Fonction qui gére ce qui se passe lors de l'autentification */
function authentification() {
  if (sessionStorage.getItem("token")) {
    //Remplacement de login par logout
    let loginBtn = document.getElementById("login");
    loginBtn.textContent = "Logout";

    //Apparition de la section de modification
    let section_edition = document.getElementById("edition");
    section_edition.style.display = "flex";

    //Apparition de l'outil de modification
    let div_modification = document.getElementById("modify_project");
    div_modification.style.display = "flex";

    //Disparition des filtres
    let div_filters = document.querySelector(".filters");
    div_filters.style.display = "none";
    let divInes = document.getElementById("div_modification_title");
    divInes.classList.add("gap-filters");

    //Déconnexion après clic sur logout
    loginBtn.addEventListener("click", function (event) {
      event.preventDefault();
      sessionStorage.removeItem("token");
      window.location.href = "index.html";
    });
  }
}
authentification();
