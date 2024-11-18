

const GET = (key, token) => {
   return fetch(`https://ws.cipiaceinfo.it/cache/get`, {
       method: "POST",
       headers: {
           "Content-Type": "application/json",
           "key": token,
       },
       body: JSON.stringify({ key }),
   })
       .then((response) => response.json())
       .then((data) => JSON.parse(data.result || "[]"))
       .catch((error) => {
           console.error("Errore durante il recupero della cache:", error);
       });
};

const SET = (key, value, token) => {
   return fetch(`https://ws.cipiaceinfo.it/cache/get/set`, {
       method: "POST",
       headers: {
           "Content-Type": "application/json",
           "key": token,
       },
       body: JSON.stringify({
           key,
           value: JSON.stringify(value),
       }),
   })
       .then((response) => response.json())
       .catch((error) => {
           console.error("Errore durante il salvataggio nella cache:", error);
       });
};

export { GET, SET };