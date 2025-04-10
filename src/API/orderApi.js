// Config JSON:
import api from '../../public/configApi.json';
// Funcionalidades / Libs:
import axios from "axios";

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = api.api_url;
// console.log(API_URL);


// End-Points/Rotas da API (TABELA ORDER):
// Pega todas as solcitacoes por params (GET):
export async function ORDER_GET_ALL_PER_PARAMS(token, params, page) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(`${API_URL}/get-all-order?${params}&page=${page}`, { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Pega as solcitacoes do user logado (GET):
export async function ORDER_GET_ME_PER_PARAMS(token, params, page) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(`${API_URL}/my-orders?${params}&page=${page}`, { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Cria uma nova solicitação (POST):
export async function ORDER_CREATE(token, idTypeOrder, productsQuantities, deliveryTo, daysReservation) {
   console.log('CALL FUNCTION API');

   const response = await axios.post(`${API_URL}/order`, {
      "fk_order_type_id": idTypeOrder,
      "product_quantities": productsQuantities,
      "delivery_to": deliveryTo,
      "days_in_reservation": daysReservation
   },
   { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}