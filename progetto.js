const chiave ="mappa"
const token = "3819207b-2545-44f5-9bce-560b484b2f0f"

marcatori = [];

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
            const data = JSON.parse(r.result);
            resolve(data);
        })
        .catch(error => reject(error));
    });
  }

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

const GETINDIRiZZO = (indirizzo) => {
  GETMAPPA(indirizzo).then((coordinate) => {
    if (coordinate) {
      const marcatore = L.marker(coordinate).addTo(map);
      marcatore.bindPopup(`<b>${coordinate.display_name}</b>`);
    }
  })
}


let places = [
    {
        name: "Piazza del Duomo",
        coords: [45.4639102, 9.1906426]
    },
    {
        name: "Darsena",
        coords: [45.4536286, 9.1755852]
    },
    {
        name: "Parco Lambro",
        coords: [45.4968296, 9.2505173]
    },
    {
        name: "Stazione Centrale",
        coords: [45.48760768, 9.2038215]
    }
];

let zoom = 12;
let maxZoom = 19;
let map = L.map('map').setView(places[0].coords, zoom);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: maxZoom,
    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function render(){
    GETDATI(chiave,token).then((posti)=>{
        console.log(posti);
        posti.forEach((posto) => {
            const marker = L.marker(posto.coords).addTo(map);
            marker.bindPopup(`<b>${posto.name}</b>`);
        });
    });
}
render();