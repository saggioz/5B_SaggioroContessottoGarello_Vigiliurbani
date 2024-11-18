import { SETTABELLA, GETTABELLA } from './progetto.js';

const createTable = (parentElement) => {
    let data = [];
    let originale = []; // Aggiungi questa variabile per memorizzare i dati originali

    return {
        build: (dataInput) => {
            data = dataInput;
            originale = dataInput; // Memorizza i dati originali
        },
        render: () => {
            let htmlTable = "<table class='table table-bordered'>";
            htmlTable += "<thead><tr>" + data[0].map((col) => `<th>${col}</th>`).join("") + "</tr></thead>";
            htmlTable += "<tbody>" + 
                data.slice(1).map((row) => 
                    "<tr>" + row.map((col) => 
                        `<td>${col}</td>`
                    ).join("") + "</tr>"
                ).join("") + "</tbody>";
            htmlTable += "</table>";
            parentElement.innerHTML = htmlTable;
        },
        addRow: function (newRow) {
            data.push(newRow);
            this.render();
            SETTABELLA(data).catch((err) => {
                console.error("Errore durante il salvataggio della tabella nella cache:", err);
            });
        },
        filter: function(cerca) {
            if (cerca === "") {
                data = originale; // Ripristina i dati originali se la ricerca è vuota
            } else {
                data = originale.filter(row => 
                    row[0].toLowerCase().includes(cerca.toLowerCase())
                );
            }
            this.render();
        },
        load: function () {
            GETTABELLA().then((cachedData) => {
                originale = cachedData; // Memorizza i dati originali
                data = cachedData;
                this.render();
            }).catch((err) => {
                console.error("Errore durante il caricamento dei dati dalla cache:", err);
            });
        },
    };
};

const table = createTable(document.querySelector("#table"));
table.build([["INDIRIZZO", "TARGHE COINVOLTE", "DATA", "ORA", "NUMERO FERITI", "NUMERO MORTI"]]);

// Carica i dati dalla cache
table.load();

// Aggiungi l'event listener per il pulsante di ricerca
document.getElementById("bottoneRicerca").onclick = () => {
    const cerca = document.getElementById("ricerca").value;
    table.filter(cerca);
};

export { table };