const gallery_modal = document.querySelector(".gallery-modal");

let modal = null;

const works_API_modal = "http://localhost:5678/api/works";

const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);

  function createWork(work) {
    let figure = document.createElement("figure");
    let imageWork = document.createElement("img");
    let deleteIcon = document.createElement("i");

    imageWork.src = work.imageUrl;
    deleteIcon.classList.add("fa-solid", "fa-trash-can");
    deleteIcon.addEventListener("click", () => deleteImage(work.id));

    figure.appendChild(imageWork);
    figure.appendChild(deleteIcon);
    gallery_modal.appendChild(figure);
  }

  fetch(works_API_modal).then((response) =>
    response.json().then((works) => {
      allWorks = works;
      gallery_modal.innerHTML = "";

      for (let i = 0; i < works.length; i++) {
        let figure = createWork(works[i]);
      }
    })
  );
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);

  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);

  modal = null;
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
});
