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

            console.log("Dati inviati: ", result);

            if (callback) {
                callback(result);
            }
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

const form = createForm();
form.setlabels([
    ["Indirizzo", "text"],
    ["Targhe coinvolte", "text"],
    ["Data", "date"],
    ["Orario", "time"],
    ["Numero feriti", "number"],
    ["Numero morti", "number"]
]);

// Callback per l'inserimento nella tabella
form.submit((formData) => {
    console.log("Dati inviati:", formData);

    const nuovaRiga = [
        formData["Indirizzo"],
        formData["Targhe coinvolte"],
        formData["Data"],
        formData["Orario"],
        formData["Numero feriti"],
        formData["Numero morti"]
    ];
    table.addRow(nuovaRiga);
});

// Bottone per aprire la modale
document.getElementById("openModalButton").onclick = () => {
    form.render();
};
