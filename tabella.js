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
            htmlTable += data.map((row) => 
                "<tr>" + row.map((col) => 
                    "<td>" + col + "</td>"
                ).join("")
            ).join("") + "</tr>";
            htmlTable += "</table>";
            parentElement.innerHTML = htmlTable;
        },
        addRow: function(newRow) {
            data.push(newRow);
            this.render();
        },
        filter: function(cerca) {
            const dato_cercato = originale.filter(row => 
                row[0].toLowerCase().includes(cerca.toLowerCase())
            );
            data = dato_cercato;
            this.render();
        },
    };
};

const table = createTable(document.querySelector("#table"));
table.build([["INDIRIZZO", "TARGHE COINVOLTE", "DATA", "ORA", "NUMERO FERITI", "NUMERO MORTI"]]);
table.render();

document.getElementById("bottoneRicerca").onclick = () => {
    const cerca = document.getElementById("ricerca").value;
    table.filter(cerca);
};

export { table };
