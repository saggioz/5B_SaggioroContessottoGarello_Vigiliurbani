const chiave ="mappa"
const token = "3819207b-2545-44f5-9bce-560b484b2f0f"

const GETMAPPA = (indirizzo) => {
    return new Promise((resolve, reject) => {
        fetch("https://us1.locationiq.com/v1/search?key=pk.869b0a986abed22e19f8fca6de24a2cb&q=" + indirizzo + "&format=json&"

        )
        .then(r => r.json())
        .then(r => {
            resolve(r);
        })
        .catch(error => reject(error));
    });
};

const GETDATI = (chiave,token) => {
    return new Promise((resolve, reject) => {
      fetch('https://ws.cipiaceinfo.it/cache/get', {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "key": token
        },
        body: JSON.stringify({
          key: chiave
        })
      })
        .then(r => r.json())
        .then(r => {
          if (!r.result) {
            r.result = [];
          }
            const data = JSON.parse(r.result);
            resolve(data);
        })
        .catch(error => reject(error));
    });
  }

  const AddMAP = (indirizzo, titolo, GETMAPPA, SETDATI, map, zoom) => {
    GETMAPPA(indirizzo).then((result) => {
        if (result.length === 0) {
            console.error("Indirizzo non trovato!");
            return;
        }

        const luogo = result[0];
        const lat = luogo.lat;
        const lon = luogo.lon;

        SETDATI(titolo, lon, lat).then(() => {
            const marker = L.marker([lat, lon]).addTo(map);
            marker.bindPopup(titolo);
            map.setView([lat, lon], zoom);
        }).catch((err) => {
            console.error("Errore durante il salvataggio dei dati:", err);
        });
    }).catch((err) => {
        console.error("Errore durante la ricerca dell'indirizzo:", err);
    });
};


  const SETDATI = (titolo, long, lat ) => {
    return new Promise((resolve, reject) => {
        GETDATI(chiave, token) 
        .then(vecchiDati => {
          const nuoviDati = [
            ...vecchiDati,{
            "name": titolo,
            "coords":[lat,long]
            }
          ];

          fetch("https://ws.cipiaceinfo.it/cache/set", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "key": token
            },
            body: JSON.stringify({
              key: chiave,
              value: JSON.stringify(nuoviDati)
            })
          })
            .then(r => r.json())
            .then(result => {
              resolve(result);
            })
            .catch(error => reject(error));
        })
        .catch(error => reject(error));

    });
}

let zoom = 12;
let maxZoom = 19;
let map = L.map('map').setView([45.4642, 9.1900], zoom);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: maxZoom,
    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function render() {
  GETDATI(chiave, token).then((posti) => {
      console.log("Dati ricevuti:", posti);

      posti.forEach((posto) => {
          const marker = L.marker(posto.coords).addTo(map);
          marker.bindPopup(`<b>${posto.name}</b>`);
      });
  }).catch((error) => {
      console.error("Errore durante il recupero dei dati :", error);
  });
};


render();

export { AddMAP };
export { GETMAPPA, SETDATI, map, zoom };