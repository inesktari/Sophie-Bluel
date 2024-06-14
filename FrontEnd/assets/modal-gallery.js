const works_API_modal = "http://localhost:5678/api/works/";
const gallery_modal = document.querySelector(".gallery-modal");
const editionGalleryModalId = document.querySelector("#editionGalleryModalId");
const addWorkModalId = document.querySelector("#addWorkModalId");
const fileInput = document.querySelector("#myFile");
const titleWork = document.querySelector("#title-work");
const selectCategory = document.querySelector("#select_category");
const submitWork = document.querySelector("#submit_work");
const picturePreviewImg = document.querySelector("#picturePreviewImg");
const pictureSelection = document.querySelector(".add-work-zone-1");
const picturePreviewZone = document.querySelector(".add-work-zone-2");
const buttonAddFile = document.querySelector("#myFileLabel");

let modal = null;

/* Fonction d'ouverture de la modale */
const openModal = function () {
  modal = document.querySelector(".modal");
  modal.style.display = "flex";
  addWorkModalId.style.display = "none";
  editionGalleryModalId.style.display = "flex";

  /* Création des éléments de la galerie sur la modale */
  function createWork(work) {
    let figure = document.createElement("figure");
    let imageWork = document.createElement("img");
    let deleteIcon = document.createElement("i");

    imageWork.src = work.imageUrl;
    deleteIcon.classList.add("fa-solid", "fa-trash-can");
    deleteIcon.addEventListener("click", () => deleteWork(work.id));

    figure.appendChild(imageWork);
    figure.appendChild(deleteIcon);
    gallery_modal.appendChild(figure);
  }

  /* Récupération des travaux depuis l'API */
  fetch(works_API_modal).then((response) =>
    response.json().then((works) => {
      allWorks = works;
      gallery_modal.innerHTML = "";

      for (let i = 0; i < works.length; i++) {
        let figure = createWork(works[i]);
      }
    })
  );
  resetPictureSelected();
  resetForm();
  GetCategories();
  modal.querySelector(".fa-xmark").addEventListener("click", closeModal);
};

/* Fonction de fermeture de la modale */
const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.querySelector(".fa-xmark").removeEventListener("click", closeModal);
  modal = null;
};

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

/* Retour à la modale de la galerie après clic sur l'icone de la fleche */
document.querySelectorAll(".fa-arrow-left").forEach((a) => {
  a.addEventListener("click", openModal);
});

/* Fermeture de la modale après clic sur l'icone "x" */
document.querySelectorAll(".fa-xmark").forEach((a) => {
  a.addEventListener("click", closeModal);
});

/* Fermeture de la modale après clic sur échap */
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
});

/* Fermeture de la modale après clic en dehors de la modale */
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

/* Fonction de suppression d'un work */
async function deleteWork(workId) {
  let token = sessionStorage.getItem("token");

  try {
    const confirmation = confirm(
      "Êtes-vous sûr de vouloir supprimer ce projet ?"
    );

    if (confirmation) {
      fetch(works_API_modal + workId, {
        method: "DELETE",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        if (response.ok) {
          console.log("projet supprimé");
          // alert("Projet supprimé !");
        } else {
          alert("Une erreur est survenue. Veuillez réesseyer.");
          closeModal();
        }
      });
    }
  } catch (error) {
    console.error("Erreur 3");
  }
  return false;
}

/* Affichage de la modale d'ajout d'un projet au clic sur le bouton d'ajout */
const AddWorkButton = document.querySelector("#add-work");
AddWorkButton.addEventListener("click", ModalAddWork);

/* Fonction d'ouverture de la modale d'ajout d'un projet */
function ModalAddWork(e) {
  editionGalleryModalId.style.display = "none";
  addWorkModalId.style.display = "block";
  picturePreviewZone.style.display = "none";
}

/* Sélection d'un projet */
fileInput.addEventListener("change", function () {
  if (this.files[0].size > 4 * 1024 * 1024) {
    alert("La taille maximale autorisée d'une image est 4 Mo.");
    this.value = "";
  }
  if (this.files[0]) {
    picturePreviewImg.src = URL.createObjectURL(this.files[0]);
    picturePreviewZone.style.display = "block";
    pictureSelection.style.display = "none";
  }
});

/* Réinitialisation de l'image sélectionnée */
function resetPictureSelected() {
  fileInput.value = "";
  picturePreviewImg.src = "";
  picturePreviewImg.style.display = "block";
  pictureSelection.style.display = "block";
}

/* Réinitialisation du formulaire d'upload d'un projet */
function resetForm() {
  selectCategory.value = "";
  titleWork.value = "";
}

/* Récupération des catégories depuis l'API */
function GetCategories() {
  selectCategory.innerHTML = "";

  /* Récupération des catégories */
  allCategories.forEach((category) => {
    let option = document.createElement("option");
    if (category.id > 0) {
      option.value = category.id;
      option.innerText = category.name;
      selectCategory.appendChild(option);
    }
  });
}

/* Fonction d'upload d'un nouveau projet */
const AddWork = async function (event) {
  event.preventDefault();
  let token = sessionStorage.getItem("token");

  const formData = new FormData();
  formData.append("image", fileInput.files[0]);
  formData.append("title", titleWork.value);
  formData.append("category", selectCategory.value);

  fetch(works_API, {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }).then((response) => {
    if (response.status === 201) {
      alert("Projet importé avec succès.");
      resetPictureSelected();
      resetForm();
      activBtnSubmit();
    }
  });
  return false;
};

/* Activation du bouton de submit, pour envoyer le formulaire d'ajout d'un projet */
const activBtnSubmit = function () {
  if (fileInput.value != "" && titleWork.value != "") {
    submitWork.style.backgroundColor = "#1D6154";
    submitWork.style.cursor = "pointer";
    submitWork.addEventListener("click", AddWork);
  } else {
    submitWork.style.backgroundColor = "#A7A7A7";
    submitWork.style.cursor = "default";
    submitWork.removeEventListener("click", AddWork);
  }
};

fileInput.addEventListener("change", activBtnSubmit);
titleWork.addEventListener("change", activBtnSubmit);
