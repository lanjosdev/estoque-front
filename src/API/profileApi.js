// Config JSON:
import api from '../../public/configApi.json';
// Funcionalidades / Libs:
import axios from "axios";

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = api.api_url;
// console.log(API_URL);


// Update password do user logado (POST):
export async function PROFILE_UPDATE_PASSWORD(token, password, passwordConfirmation) {
   console.log('CALL FUNCTION API');

   const response = await axios.post(`${API_URL}/update-password`, {
      "password": password,
      "password_confirmation": passwordConfirmation,
   },
   { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}