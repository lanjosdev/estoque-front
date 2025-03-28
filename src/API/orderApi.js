// Config JSON:
import api from '../../public/configApi.json';
// Funcionalidades / Libs:
import axios from "axios";

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = api.api_url;
// console.log(API_URL);


// End-Points/Rotas da API (TABELA ORDER):
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