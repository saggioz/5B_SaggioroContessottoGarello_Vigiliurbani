const createTable = (parentElement) => {
    let data;
    return {
        build: (dataInput) => {
            data = dataInput;
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
        }
    }
}

const table = createTable(document.querySelector("#table"));
table.build([["INDIRIZZO", "TARGHE COINVOLTE", "DATA", "ORA", "NUMERO FERITI", "NUMERO MORTI"]]);
table.render();