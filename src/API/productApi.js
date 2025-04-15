// Config JSON:
import api from '../../public/configApi.json';
// Funcionalidades / Libs:
import axios from "axios";

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = api.api_url;
// console.log(API_URL);


// End-Points/Rotas da API (TABELA PRODUCT):
// Pega todos os produtos (GET):
export async function PRODUCT_GET_ALL(token) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(`${API_URL}/get-all-product-equipaments`, { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Pega produto by ID (GET):
export async function PRODUCT_GET_ID(token, idProduct) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(`${API_URL}/get-product-equipaments/${idProduct}`, { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Pega produtos por params (GET):
export async function PRODUCT_GET_PER_PARAMS(token, params, page) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(`${API_URL}/get-all-product-equipaments?${params}&page=${page}`, { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}
// Pega todas produtos por params (GET):
export async function PRODUCT_GET_ALL_PER_PARAMS(token, params, otherQuery) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(`${API_URL}/get-all-product-equipaments?${otherQuery}`, {
      params: params,
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Pega produtos por pagina (GET):
export async function PRODUCT_GET_PER_PAGE(token, page) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(`${API_URL}/get-all-product-equipaments?page=${page}`, { 
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

// Cria um novo produto (POST):
export async function PRODUCT_CREATE(token, name, categoryProduct, quantIdeal, hasExpiration, is_reservation, is_exit) {
   console.log('CALL FUNCTION API');

   const bodyReq = {
      name: name,
      fk_category_id: categoryProduct,
      quantity_ideal: quantIdeal,
      observation: null,
      expiration_date: hasExpiration,
      is_reservation: is_reservation,
      is_exit: is_exit
   };
   console.log(bodyReq);

   const response = await axios.post(`${API_URL}/product-equipaments`, bodyReq, {
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Atualiza dados (nome e/ou quantmin e/ou categoria/setorProduto) do produto (ADMIN) (POST):
export async function PRODUCT_UPDATE(token, idProduct, name, categoryProduct, quantIdeal, quantMin, obs, hasExpiration, is_reservation, is_exit) {
   console.log('CALL FUNCTION API');

   const bodyReq = {
      name: name,
      fk_category_id: categoryProduct,
      quantity_ideal: quantIdeal,
      quantity_min: quantMin,
      observation: obs || null,
      expiration_date: hasExpiration,
      is_reservation: is_reservation,
      is_exit: is_exit
   };
   console.log(bodyReq);
 
   const response = await axios.post(`${API_URL}/update-product-equipaments/${idProduct}`, bodyReq, {
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });
 
   // console.log(response.data);
   return response.data;
}

// Deleta produto (DELETE):
export async function PRODUCT_DELETE(token, idProduct) {
    console.log('CALL FUNCTION API');

    const response = await axios.delete(`${API_URL}/delete-product-equipaments/${idProduct}`, {
       headers: { "Accept": "application/json", Authorization: "Bearer " + token }
    });
 
    // console.log(response.data);
    return response.data;
}

// Atualiza dados do grupo de produtos (POST):
export async function PRODUCT_UPDATE_GROUP(token, idProduct, name, categoryProduct, listProducts) {
    console.log('CALL FUNCTION API');
 
    const response = await axios.post(`${API_URL}/update-product-equipaments/${idProduct}`, {
      "is_group": 1,
      "name": name,
      "list_products": listProducts,
      "fk_category_id": categoryProduct,
      "expiration_date": 0,
      "quantity_min": 1
    }, 
    { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
    });
 
    // console.log(response.data);
    return response.data;
}

// Pega produtos em alerta por paginate (GET):
export async function PRODUCT_GET_ALERT(token, page) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(`${API_URL}/product-alert?page=${page}`, { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}