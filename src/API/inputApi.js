// Config JSON:
import api from '../../public/configApi.json';
// Funcionalidades / Libs:
import axios from "axios";

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = api.api_url;
// console.log(API_URL);


// End-Points/Rotas da API (TABELA ENTRADA):
// Pega todos as entradas (GET):
export async function INPUT_GET_ALL(token) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(`${API_URL}/get-all-inputs`, { 
   headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Pega entradas por parametros (GET):
export async function INPUT_GET_PER_PARAMS(token, params, page) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(`${API_URL}/get-all-inputs?${params}&page=${page}`, { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Pega entradas por pagina (GET):
export async function INPUT_GET_PER_PAGE(token, page) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(`${API_URL}/get-all-inputs?page=${page}`, { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Registra uma entrada (POST):
export async function INPUT_CREATE(token, idProduct, idStorage, quant, dateManufacture, dateExpiration, alertDays) {
   console.log('CALL FUNCTION API');

   const bodyReq = {
      fk_product_id: idProduct,
      fk_storage_location_id: idStorage,
      quantity: quant,
      date_of_manufacture: dateManufacture || null,
      expiration_date: dateExpiration || null,
      alert: alertDays || null
   }
   console.log(bodyReq);

   const response = await axios.post(`${API_URL}/inputs`, bodyReq, { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Atualiza dados da entrada (POST):
export async function INPUT_UPDATE(token, idInput, idProduct, idStorage, quant, dateManufacture, dateExpiration, alertDays) {
   console.log('CALL FUNCTION API');

   const bodyReq = {
      fk_product_id: idProduct,
      fk_storage_location_id: idStorage,
      quantity: quant,
      date_of_manufacture: dateManufacture || null,
      expiration_date: dateExpiration || null,
      alert: alertDays || null
   }
   console.log(bodyReq);

   const response = await axios.post(`${API_URL}/update-inputs/${idInput}`, bodyReq, { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Deleta entrada (ADMIN) (DELETE):
export async function INPUT_DELETE(token, idInput) {
   console.log('CALL FUNCTION API');

   const response = await axios.delete(`${API_URL}/delete-inputs/${idInput}`, {
      headers: { "Accept": "application/json", Authorization: "Bearer " + token }
   });

   // console.log(response.data);
   return response.data;
}

// Pega a entrada mais proxima a vencer POR produto (GET):
export async function INPUT_GET_EXPIRATION_PER_PRODUCT(token, idProduct) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(`${API_URL}/get-inputs-ordered-expiration-date/${idProduct}`, { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}