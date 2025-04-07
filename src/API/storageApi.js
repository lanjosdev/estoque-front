// Config JSON:
import api from '../../public/configApi.json';
// Funcionalidades / Libs:
import axios from "axios";

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = api.api_url;
// console.log(API_URL);


// End-Points/Rotas da API (TABELA STORAGE):
// Pega depositos por params (GET):
export async function STORAGE_GET_PER_PARAMS(token, params, page) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(`${API_URL}/get-all-storage-location?${params}&page=${page}`, { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Pega produtos por pagina (GET):
export async function PRODUCT_GET_PER_PAGE_SEARCH(token, search, page) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(`${API_URL}/get-all-product-equipaments?name=${search}&active=true&page=${page}`, { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}


// Registra novo deposito/storage (POST):
export async function STORAGE_CREATE(token, name, idCategoryStorage, obs) {
   console.log('CALL FUNCTION API');

   const bodyReq = {
      name: name,
      observation: obs || null,
      fk_category_id: idCategoryStorage
   };
   console.log(bodyReq);

   const response = await axios.post(`${API_URL}/storage-location`, bodyReq, {
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Atualiza dados (nome e/ou observação) do deposito/storage (ADMIN) (POST):
export async function STORAGE_UPDATE(token, idStorage, name, idCategoryStorage, obs) {
   console.log('CALL FUNCTION API');

   const bodyReq = {
      name: name,
      observation: obs || null,
      fk_category_id: idCategoryStorage
   };
   console.log(bodyReq);

   const response = await axios.post(`${API_URL}/update-storage-location/${idStorage}`, bodyReq, {
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Deleta deposito/storage (DELETE):
export async function STORAGE_DELETE(token, idStorage) {
   console.log('CALL FUNCTION API');

   const response = await axios.delete(`${API_URL}/delete-storage-location/${idStorage}`, {
   headers: { "Accept": "application/json", Authorization: "Bearer " + token }
   });

   // console.log(response.data);
   return response.data;
}