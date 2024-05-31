const login_API = "http://localhost:5678/api/users/login";
const login_button = document.getElementById("login");

login_button.addEventListener("submit", function (event) {
  event.preventDefault();
  loginUser();
});

function loginUser() {
  let user = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  fetch(login_API, {
    method: "POST",
    headers: { accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        loginError = document.getElementById("login_error");
        loginError.innerHTML =
          "E-mail et/ou mot de passe incorrects. Veuillez réessayer";
      }
    })
    .then((data) => {
      if (data) {
        sessionStorage.setItem("token", data.token);
        window.location.href = "index.html";
      }
    });
}
