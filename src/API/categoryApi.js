// Config JSON:
import api from '../../public/configApi.json';
// Funcionalidades / Libs:
import axios from "axios";

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = api.api_url;
// console.log(API_URL);


// End-Points/Rotas da API (TABELA CATEGORY):
// Pega todas as categorias (GET):
export async function CATEGORY_GET_ALL(token, params) {
    console.log('CALL FUNCTION API');
 
    const response = await axios.get(`${API_URL}/get-all-category?${params}`, { 
       headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
    });
 
    // console.log(response.data);
    return response.data;
}

// Cria nova categoria/setor (POST):
export async function CATEGORY_CREATE(token, name, description) {
    console.log('CALL FUNCTION API');
 
    const response = await axios.post(`${API_URL}/category`, {
       "name": name,
       "description": description,
    },
    { 
       headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
    });
 
    // console.log(response.data);
    return response.data;
}

// Deleta categoria/setor (DELETE):
export async function CATEGORY_DELETE(token, idCategory) {
    console.log('CALL FUNCTION API');

    const response = await axios.delete(`${API_URL}/delete-category/${idCategory}`, {
       headers: { "Accept": "application/json", Authorization: "Bearer " + token }
    });
 
    // console.log(response.data);
    return response.data;
}

// Atualiza dados (nome e/ou descricao) da categoria/setor (ADMIN) (POST):
export async function CATEGORY_UPDATE(token, idCategory, name, description) {
    console.log('CALL FUNCTION API');
 
    const response = await axios.post(`${API_URL}/update-category/${idCategory}`, {
       "name": name,
       "description": description
    }, 
    { 
       headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
    });
 
    // console.log(response.data);
    return response.data;
}

// Restaura categoria/setor (POST):
export async function CATEGORY_RESTORE(token, idCategory) {
   console.log('CALL FUNCTION API');

   const res = await fetch(`${API_URL}/reverse-deleted-category/${idCategory}`, {
      method: 'POST',
      headers: { "Accept": "application/json", Authorization: 'Bearer ' + token }
   });
   const response = await res.json();

   // console.log(response.data);
   return response;
}