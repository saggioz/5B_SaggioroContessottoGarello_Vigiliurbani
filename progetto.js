// progetto.js

import { GET, SET } from './cache.js';

const chiave = "mappa";
const token = "3819207b-2545-44f5-9bce-560b484b2f0f";

// Funzione per ottenere la mappa (rimane invariata)
const GETMAPPA = (indirizzo) => {
    return new Promise((resolve, reject) => {
        fetch("https://us1.locationiq.com/v1/search?key=pk.869b0a986abed22e19f8fca6de24a2cb&q=" + indirizzo + "&format=json&")
            .then((r) => r.json())
            .then((r) => {
                resolve(r);
            })
            .catch((error) => reject(error));
    });
};

// Funzione per recuperare i dati dalla cache
const GETDATI = () => {
    return GET(chiave, token);
};

// Funzione per salvare i dati nella cache
const SETDATI = (titolo, long, lat) => {
    return GETDATI()
        .then((vecchiDati) => {
            const nuoviDati = [
                ...vecchiDati,
                { name: titolo, coords: [lat, long] },
            ];
            return SET(chiave, nuoviDati, token);
        })
        .catch((error) => {
            console.error("Errore durante l'aggiornamento dei dati nella cache:", error);
            throw error;
        });
};

// Funzione per aggiungere un marker alla mappa
const AddMAP = (indirizzo, titolo, GETMAPPA, SETDATI, map, zoom) => {
    GETMAPPA(indirizzo)
        .then((result) => {
            if (result.length === 0) {
                console.error("Indirizzo non trovato!");
                return;
            }
            const luogo = result[0];
            const lat = luogo.lat;
            const lon = luogo.lon;

            SETDATI(titolo, lon, lat)
                .then(() => {
                    const marker = L.marker([lat, lon]).addTo(map);
                    marker.bindPopup(`<b>${indirizzo}</b><br/>${titolo}</b>`);
                    map.setView([lat, lon], zoom);
                })
                .catch((err) => {
                    console.error("Errore durante il salvataggio dei dati:", err);
                });
        })
        .catch((err) => {
            console.error("Errore durante la ricerca dell'indirizzo:", err);
        });
};

// Configurazione della mappa Leaflet
let zoom = 12;
let maxZoom = 19;
let map = L.map('map').setView([45.4642, 9.1900], zoom);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: maxZoom,
    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Funzione per caricare i marker sulla mappa
function render() {
    GETDATI()
        .then((posti) => {
            console.log(posti);
            posti.forEach((posto) => {
                const marker = L.marker(posto.coords).addTo(map);
                marker.bindPopup(`<b>${posto.name}</b>`);
            });
        })
        .catch((error) => {
            console.error("Errore durante il recupero dei dati:", error);
        });
}

// Avvia il rendering iniziale
render();

export { AddMAP, GETMAPPA, SETDATI, map, zoom };
