import { table } from "./tabella.js";
const chiave= "Marco";
let config;
const myObject=table
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
           'key': cacheToken
        },
        method: "POST",
        body: JSON.stringify({
           key: chiave, 
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
            'key': cacheToken
         },
         method: "POST",
         body: JSON.stringify({
            key: chiave,
            value: myObject
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



const crea_lista_diz = (dati) => {
   const lista = [];
   for (const chiave in dati) {
      lista.push({ chiave, valore: dati[chiave] });
   }
   return lista;
};


//fa sia la get che set per poi aggiornare la tabella
const Aggiorna = (chiave_d,incidente)=>{
   GET("Vigili").then(result_get => {
      const dati = JSON.parse(result_get) || {};
      dati[chiave_d] = incidente;
      return SET("Vigili", JSON.stringify(dati));
   })
   .then(setResult => {
      if (setResult === "Ok") 
         return GET("Vigili");
   })
   .then(newResult => {
      const lista_diz = crea_lista_diz(JSON.parse(newResult));
      table.build(lista_diz);
      table.render();
   })
};



const InizializzaTabella = () => {
   GET("Vigili")
      .then(result_get => {
         const lista_diz = crea_lista_diz(JSON.parse(result_get) || {});
         table.build(lista_diz);
         table.render();
      })
      
};

GetData().then(() => InizializzaTabella()); 
export {Aggiorna,GetData,config};
