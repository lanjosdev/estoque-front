// Config JSON:
import api from '../../public/configApi.json';
// Funcionalidades / Libs:
import axios from "axios";

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = api.api_url;
// console.log(API_URL);


// End-Points/Rotas da API:
// Pega dados para o dashboard (GET):
export async function ALERT_PRODUCT_GET_ALL(token) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(`${API_URL}/get-all-products-alert`, { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// export async function ALERT_PRODUCT_GENERATE(token) {
//    console.log('CALL FUNCTION API');

//    const response = await axios.get(`${API_URL}/export-alert-products`, { 
//       headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
//    });

//    // console.log(response.data);
//    return response.data;
// }
export async function ALERT_PRODUCT_GENERATE(token) {
   console.log('CALL FUNCTION API');

   // axios({
   //    method: "get",
   //    url: API_URL + '/export-alert-products',
   //    responseType: 'blob',       
   //    headers: {
   //       'Access-Control-Allow-Origin': '*',
   //       Authorization: "Bearer " + token
   //    }
   // }).then((response) => {
   //       console.log(response);
   //       const blob = new Blob([response.data], { type: 'application/pdf' });
   //       const url = window.URL.createObjectURL(blob);

   //       const link = document.createElement('a');
   //       link.href = url;
   //       link.setAttribute('download', 'document.pdf'); // Nome do arquivo a ser baixado
   //       document.body.appendChild(link);

   //       link.click(); // Simula o clique para iniciar o download
   //       link.remove(); // Remove o link após o clique
   //    })
   //    .catch((error) => {
   //       console.error('Erro ao baixar o PDF', error);
   //    });
   axios({
      method: "get",
      url: API_URL + '/export-alert-products',
      responseType: 'blob',
      headers: {
        'Access-Control-Allow-Origin': '*',
        Authorization: "Bearer " + token
      }
    }).then((response) => {
      console.log(response);
      const blob = new Blob([response.data], { type: 'text/csv' }); // Alterado para CSV
      const url = window.URL.createObjectURL(blob);
    
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'produtos-em-alerta.csv'); // Alterado o nome do arquivo para CSV
      document.body.appendChild(link);
    
      link.click(); // Simula o clique para iniciar o download
      link.remove(); // Remove o link após o clique
    })
    .catch((error) => {
      console.error('Erro ao baixar o arquivo CSV', error);
    });
}