const chiave = "8b9c4f7d-363b-4f25-8fce-05bb6df76d31";
let result_get=[];

const SET = (chiave,value) => {
   console.log(value)
   return new Promise((resolve,reject)=>{
      try{
    fetch("https://ws.cipiaceinfo.it/cache/set", {
        headers: {
           'Content-Type': 'application/json',
           'key': chiave
        },
        method: "POST",
        body: JSON.stringify({
           key: "Vigili",
           value: value
        })
     }).then(r => r.json())
     .then(r => {
        resolve(r.result);
     })
     }
     catch(error){
      reject(error)
     }
   })
}

const GET = (chiave) => {
   return new Promise((resolve,reject)=>{
      try{
      fetch("https://ws.cipiaceinfo.it/cache/get", {
         headers: {
            'Content-Type': 'application/json',
            'key': chiave
         },
         method: "POST",
         body: JSON.stringify({
            key: "Vigili"
         })
      }).then(r => r.json())
      .then(r => {
         resolve(r.result);
      })
      }catch(error) {
         reject(error)
      }
   })   
}

const Aggiorna = (nuova_riga) => {
   GET(chiave).then(result_get => {
      console.log("Dati recuperati dalla cache:", result_get);

      // Assicurati che `result_get` sia un array
      if (!Array.isArray(result_get)) {
         result_get = [];
      }

      // Aggiungi la nuova riga ai dati esistenti
      result_get.push(nuova_riga);

      // Prova a salvare i nuovi dati nella cache
      SET(chiave, result_get).then(saveResult => {
         if (saveResult !== "Ok") {
            console.log("Errore durante il salvataggio nella cache.");
            return;
         }

         // Se il salvataggio ha successo, recupera di nuovo i dati aggiornati
         GET(chiave).then(updatedResult => {
            console.log("Dati aggiornati recuperati:", updatedResult);

            // Aggiorna la tabella
            table.build(updatedResult);
            table.render();
         }).catch(err => {
            console.error("Errore durante il recupero dei dati aggiornati:", err);
         });
      }).catch(err => {
         console.error("Errore durante la chiamata a SET:", err);
      });
   }).catch(err => {
      console.error("Errore durante la chiamata a GET:", err);
   });
};
