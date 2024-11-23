const TOKEN = "fe6f3640-d8c2-46dc-aa70-f24d4b8373f3";

const registerButton = document.getElementById("register-button");
const loginButton = document.getElementById("login-button");
const privateSection = document.getElementById("private-section");
const registerUsername = document.getElementById("register-username");
const registerPassword = document.getElementById("register-password");
const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");

const register = function (username, password) {
  return fetch("https://ws.cipiaceinfo.it/credential/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      key: TOKEN,
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.text())
    .then((result) => {
      if (result === "ok") {
        alert("Registrazione completata con successo!");
      } else {
        console.error("Errore durante la registrazione.");
        alert("Registrazione fallita.");
      }
    })
    .catch((error) => {
      console.error("Errore registrazione:", error);
      alert("Registrazione fallita.");
    });
};

const login = function (username, password) {
  return fetch("https://ws.cipiaceinfo.it/credential/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      key: TOKEN,
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.result === true) {
        alert("Login effettuato con successo!");
        privateSection.classList.remove("hidden");
      } else {
        alert("Credenziali errate.");
      }
    })
    .catch((error) => {
      console.error("Errore login:", error);
      alert("Login fallito. Controlla le credenziali.");
    });
};

registerButton.onclick = () => {
    const username = registerUsername.value;
    const password = registerPassword.value;
    if (username && password) {
      register(username, password);
    } else {
      alert("Compila tutti i campi.");
    }
  };
  
  loginButton.onclick = () => {
    const username = loginUsername.value;
    const password = loginPassword.value;
    if (username && password) {
      login(username, password);
    } else {
      alert("Compila tutti i campi.");
    }
  };