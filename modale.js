let lista_diz = [];

/* Funzione per creare una lista a partire da un dizionario */
const crea_lista_diz = (result) => {
    let lista_diz = [];
    const chiaviPrenotazioni = Object.keys(result);
    
    chiaviPrenotazioni.forEach((chiave_diz) => {
        // Per ogni chiave, crea una lista separando gli elementi con "/"
        let lista_prenotazione = chiave_diz.split("/");
        lista_prenotazione.push(result[chiave_diz]);
        lista_diz.push(lista_prenotazione);
    });
    
    console.log(lista_diz);
    return lista_diz;
};

/* Funzione per creare e gestire un form all'interno di una modale */
const createForm = () => {
    let data;
    callback = null;

    const modal = document.getElementById("modal");
    modal.style.display = "none";

    const closeModal = () => {
        modal.style.display = "none";
    };

    const openModal = () => {
        modal.style.display = "block";
    };

    const renderModalContent = () => {
        // Aggiunge il contenuto HTML alla modale, compreso il form e i pulsanti
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button" id="closeButton"></span>
                <div id="formContent"></div>
                <div id="Message"></div>
                <button type="button" class="btn btn-primary" id="submit">PRENOTA</button>
                <button type="button" class="btn btn-secondary" id="cancel">ANNULLA</button>
            </div>
        `;

        document.getElementById("Message").onclick = closeModal;
        document.getElementById("closeButton").onclick = closeModal;
        document.getElementById("cancel").onclick = closeModal;

        const submitButton = document.getElementById("submit");
        submitButton.onclick = () => {
            const result = {};
            data.forEach((index) => {
                result[index[0]] = document.getElementById(index[0]).value;
            });
            let nom_rep = document.querySelector(".active").textContent.trim();
            console.log(nom_rep);
            result["Reparto"] = nom_rep;
            let chiave_d = `${result["Reparto"]}/${result["Data"]}/${result["Orario Prenotazione"]}`;
            Aggiorna(chiave_d, result["Nominativo"]);
            document.getElementById("Message").innerText = "Prenotazione eseguita con successo";
            if (callback) {
                console.log(result);
                callback(result);
            }
        };
    };

    return {
        // Components
        setlabels: (labels) => { data = labels; },
        submit: (callbackinput) => { callback = callbackinput; },
        render: () => {
            renderModalContent();
            const formContent = document.getElementById("formContent");
            formContent.innerHTML = data.map((index) => {
                if (index[1] === "dropdown") {
                    return `
                    <div class="form-group">
                        ${index[0]}
                        <select id="${index[0]}" class="form-control">
                            ${index[2].map(option => `<option value="${option}">${option}</option>`).join('')}
                        </select>
                    </div>`;
                }
                return `
                <div class="form-group">
                    ${index[0]}
                    <input type="${index[1]}" id="${index[0]}" class="form-control"/>
                </div>`;
            }).join("\n");

            openModal();
        },
    };
};

/* Funzione per gestire una prenotazione*/
const Booking = (result) => {
    let available = [...lista_dizionario_giorni];
    console.log(available);
    let controllo = false;

    available.forEach((giorno) => {
        if (giorno["Data"] == result.Data) {
            for (chiave_dizionario in result) {
                if (chiave_dizionario != "Data") {
                    if ((giorno[chiave_dizionario] - result[chiave_dizionario]) < 0) {
                        controllo = true;
                    }
                }
            }
        }
    });

    if (controllo) {
        alert("Errore");
    } else {
        console.log("stai aggiornando");
        Aggiorna(result);
    }
};

const form = createForm(document.getElementById("form"));
form.setlabels([["Data", "date"],
    ["Orario Prenotazione", "dropdown", ["08:00", "09:00", "10:00", "11:00", "12:00"]],
    ["Nominativo", "text"],
]); // Imposta le etichette e i campi del form

form.submit = ((formData) => {
    document.getElementById("Message").onclick = openModal();
    console.log("Dati inviati:", formData);
    Booking(formData); // Esegue la funzione di prenotazione con i dati inviati
});
