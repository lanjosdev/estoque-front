// Config JSON:
import api from '../../public/configApi.json';
// Funcionalidades / Libs:
import axios from "axios";

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = api.api_url;
// console.log(API_URL);


// End-Points/Rotas da API (TABELA SAIDA):
// Pega saídas por pagina (GET):
export async function EXIT_GET_PER_PAGE(token, page) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(`${API_URL}/get-all-exits?page=${page}`, { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Registra uma saida (POST):
export async function EXIT_CREATE(token, idProduct, quant, deliveryTo, reason, obs, idInput) {
   console.log('CALL FUNCTION API');

   const response = await axios.post(`${API_URL}/exits`, {
      "discarded": 0,
      "fk_product_equipament_id": idProduct,
      "quantity": quant,
      "delivery_to": deliveryTo,
      "reason_project": reason,
      "observation": obs,
      "fk_inputs_id": idInput
   },
   { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Registra uma saida de descarte (POST):
export async function EXIT_CREATE_DISCARD(token, idProduct, quant, obs) {
   console.log('CALL FUNCTION API');

   const bodyReq = {
      discarded: 1,
      fk_product_id: idProduct,
      quantity: Number(quant),
      observation: obs || null,
   };
   console.log(bodyReq);

   const response = await axios.post(`${API_URL}/exits`, bodyReq, { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Atualiza dados da saida (POST):
export async function EXIT_UPDATE(token, idExit, idProduct, quant, deliveryTo, reason, obs, idInput) {
   console.log('CALL FUNCTION API');

   const response = await axios.post(`${API_URL}/update-exits/${idExit}`, {
      "discarded": 0,
      "fk_product_equipament_id": idProduct,
      "quantity": quant,
      "delivery_to": deliveryTo,
      "reason_project": reason,
      "observation": obs,
      "fk_inputs_id": idInput
   }, 
   { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Atualiza dados da saida por descarte (POST):
export async function EXIT_UPDATE_DISCARD(token, idExit, idProduct, quant, obs) {
   console.log('CALL FUNCTION API');

   const bodyReq = {
      discarded: 1,
      fk_product_id: idProduct,
      quantity: Number(quant),
      observation: obs || null,
   };
   console.log(bodyReq);

   const response = await axios.post(`${API_URL}/update-exits/${idExit}`, bodyReq, {
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Deleta saída (ADMIN) (DELETE):
export async function EXIT_DELETE(token, idExit) {
   console.log('CALL FUNCTION API');

   const response = await axios.delete(`${API_URL}/delete-exits/${idExit}`, {
      headers: { "Accept": "application/json", Authorization: "Bearer " + token }
   });

   // console.log(response.data);
   return response.data;
}