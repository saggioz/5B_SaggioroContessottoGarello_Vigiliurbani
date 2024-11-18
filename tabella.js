import { SETTABELLA, GETTABELLA } from './progetto.js';

const createTable = (parentElement) => {
    let data = [];
    let originale = [];

    return {
        build: (dataInput) => {
            data = dataInput;
            originale = dataInput;
        },
        render: () => {
            let htmlTable = "<table class='table table-bordered'>";
            htmlTable += "<thead><tr>" + data[0].map((col) => `<th>${col}</th>`).join("") + "</tr></thead>";
            htmlTable += "<tbody>" + 
                data.slice(1).map((row) => 
                    "<tr>" + row.map((col) => 
                        `<td>${col}</td>`
                    ).join("")
                ).join("") + "</tr></tbody>";
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
            const via_cercata = originale.filter(row => 
                row[0].toLowerCase().includes(cerca.toLowerCase())
            );
            data = via_cercata;
            this.render();
        },
        load: function () {
            GETTABELLA().then((cachedData) => {
                    data = cachedData;
                    this.render();
                    
            });
        },
    };
};

const table = createTable(document.querySelector("#table"));
table.build([["INDIRIZZO", "TARGHE COINVOLTE", "DATA", "ORA", "NUMERO FERITI", "NUMERO MORTI"]]);

export { table };

document.getElementById("bottoneRicerca").onclick = () => {
    const cerca = document.getElementById("ricerca").value;
    table.filter(cerca);
};