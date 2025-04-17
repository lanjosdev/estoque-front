// Config JSON:
import api from '../../public/configApi.json';
// Funcionalidades / Libs:
import axios from "axios";

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = api.api_url;
// console.log(API_URL);


// End-Points/Rotas da API:
// Pega todas as movimentações por params (GET):
export async function MOVIMENTATION_GET_PER_PARAMS(token, params, page) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(`${API_URL}/get-all-movimentations?${params}&page=${page}`, { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Pega todas as movimentações por params (GET):
export async function MOVIMENTATION_GET_ALL_PER_PARAMS(token, params) {
   console.log('CALL FUNCTION API');
   console.log(params);

   const response = await axios.get(`${API_URL}/get-all-movimentations`, {
      params: params,
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}