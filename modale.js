// Lista globale
let lista_diz = [];

/* Funzione per creare una lista a partire da un dizionario */
const crea_lista_diz = (result) => {
    let lista_diz = [];
    const chiaviPrenotazioni = Object.keys(result);
    
    chiaviPrenotazioni.forEach((chiave_diz) => {
        let lista_prenotazione = chiave_diz.split("/");
        lista_prenotazione.push(result[chiave_diz]);
        lista_diz.push(lista_prenotazione);
    });
    
    console.log(lista_diz);
    return lista_diz;
};

/* Funzione per creare e gestire un form all'interno di una modale */
const createForm = () => {
    let data = [];
    let callback = null;

    const modal = document.getElementById("modal");
    modal.style.display = "none";

    const closeModal = () => {
        modal.style.display = "none";
    };

    const openModal = () => {
        modal.style.display = "block";
    };

    const renderModalContent = () => {
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button" id="closeButton">&times;</span>
                <div id="formContent"></div>
                <div id="Message"></div>
                <button type="button" class="btn btn-primary" id="submit">PRENOTA</button>
                <button type="button" class="btn btn-secondary" id="cancel">ANNULLA</button>
            </div>
        `;

        document.getElementById("closeButton").onclick = closeModal;
        document.getElementById("cancel").onclick = closeModal;

        const submitButton = document.getElementById("submit");
        submitButton.onclick = () => {
            const result = {};
            let isValid = true;

            data.forEach(([fieldId]) => {
                const value = document.getElementById(fieldId).value;
                if (!value) isValid = false;
                result[fieldId] = value;
            });

            if (!isValid) {
                document.getElementById("Message").innerText = "Compilare tutti i campi!";
                return;
            }

            const nom_rep = document.querySelector(".active")?.textContent.trim();
            if (!nom_rep) {
                alert("Errore: nessun reparto selezionato.");
                return;
            }

            result["Reparto"] = nom_rep;
            const chiave_d = `${result["Reparto"]}/${result["Data"]}/${result["Orario Prenotazione"]}`;
            Aggiorna(chiave_d, result["Nominativo"]);
            document.getElementById("Message").innerText = "Prenotazione eseguita con successo";

            if (callback) callback(result);

            closeModal();
        };
    };

    return {
        setlabels: (labels) => { data = labels; },
        submit: (callbackInput) => { callback = callbackInput; },
        render: () => {
            renderModalContent();
            const formContent = document.getElementById("formContent");

            formContent.innerHTML = data.map(([label, type, options]) => {
                if (type === "dropdown") {
                    return `
                        <div class="form-group">
                            <label>${label}</label>
                            <select id="${label}" class="form-control">
                                ${options.map(option => `<option value="${option}">${option}</option>`).join('')}
                            </select>
                        </div>`;
                }
                return `
                    <div class="form-group">
                        <label>${label}</label>
                        <input type="${type}" id="${label}" class="form-control"/>
                    </div>`;
            }).join("\n");

            openModal();
        },
    };
};

/* Funzione per gestire una prenotazione */
const Booking = (result) => {
    let available = [...lista_diz];
    console.log("Giorni disponibili:", available);

    let controllo = false;
    available.forEach((giorno) => {
        if (giorno["Data"] === result.Data) {
            for (const chiave in result) {
                if (chiave !== "Data" && giorno[chiave] - result[chiave] < 0) {
                    controllo = true;
                }
            }
        }
    });

    if (controllo) {
        alert("Errore: dati non disponibili!");
    } else {
        console.log("Dati aggiornati con successo!");
    }
};

// Creazione del form
const form = createForm();
form.setlabels([
    ["Data", "date"],
    ["Orario Prenotazione", "dropdown", ["08:00", "09:00", "10:00", "11:00", "12:00"]],
    ["Nominativo", "text"],
]);

// Callback della prenotazione
form.submit((formData) => {
    console.log("Dati inviati:", formData);
    Booking(formData);
});

// Bottone per aprire la modale
document.getElementById("openModalButton").onclick = () => {
    form.render();
};
