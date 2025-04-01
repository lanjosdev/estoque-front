// Config JSON:
import api from '../../public/configApi.json';
// Funcionalidades / Libs:
import axios from "axios";

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = api.api_url;
// console.log(API_URL);


// End-Points/Rotas da API:
// Pega todas as solcitacoes por params (GET):
export async function DASH_GET_ALL(token) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(`${API_URL}/get-all-info-dash`, { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}