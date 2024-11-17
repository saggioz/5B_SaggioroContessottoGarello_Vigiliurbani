let config;
let result_Get;

//fa la fetch al json
const GetData = () => {
   return fetch('./conf.json')
      .then(response => {
         if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
         }
         return response.json();
      })
      .catch(error => {
         console.error("Errore nel caricamento dei dati", error);
      });
};

const SET = (chiave, value) => {
   console.log(value)
   return new Promise((resolve,reject)=>{
      try{
    fetch("https://ws.cipiaceinfo.it/cache/set", {
        headers: {
           'Content-Type': 'application/json',
           'key': config.cacheToken
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
   console.log(chiave)
   return new Promise((resolve,reject)=>{
      try{
      fetch("https://ws.cipiaceinfo.it/cache/get", {
         headers: {
            'Content-Type': 'application/json',
            'key': config.cacheToken
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


//fa sia la get che set per poi aggiornare la tabella
const Aggiorna = (chiave_d,incidente)=>{
   GET(config.cacheToken).then(result_get => {
      const dati = JSON.parse(result_get);
      dati[chiave_d] = incidente;
      SET(config.cacheToken, JSON.stringify(dati)).then(r=>{
         console.log(r)
         if (r === "Ok") {
            GET(config.cacheToken).then((result_get) => {
               const lista_diz= crea_lista_diz(JSON.parse(result_get));
               table.build(lista_diz);
               table.render();
           });
         }
      });
   });
};


const crea_lista_diz =(dati) =>{
   return Object.keys(dati).map(chiave => {
      return [chiave,dati[chiave].indirizzo, dati[chiave].tarhe.join(","), dati[chiave].dataOra, dati[chiave].numeroFeriti, dati[chiave].numeroMorti];
   });
};

GetData().then(configData => {
   config= configData;
   render();
});

export {Aggiorna,GetData,config};
