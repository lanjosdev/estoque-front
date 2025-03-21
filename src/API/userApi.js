// Config JSON:
import api from '../../public/configApi.json';
// Funcionalidades / Libs:
import axios from "axios";

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = api.api_url;
// console.log(API_URL);


// End-Points/Rotas da API (TABELA USER):
// Logar usuario (POST):
export async function USER_LOGIN(email, password) {
   console.log('CALL FUNCTION API');

   const response = await axios.post(`${API_URL}/login`, {
      "email": email,
      "password": password
   },
   { 
      headers: { "Accept": "application/json" } 
   });

   // console.log(response.data);
   return response.data;
}

// Logout usuario (POST):
export async function USER_LOGOUT(token) {
   console.log('CALL FUNCTION API');

   const res = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: { "Accept": "application/json", Authorization: 'Bearer ' + token }
   });
   const response = await res.json();

   // console.log(response);
   return response;
}

// Pega detalhes do perfil logado:
export async function USER_PROFILE_DETAILS(token) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(`${API_URL}/my-profile`, {
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Pega todos os usuarios (GET):
export async function USER_GET_ALL(token, params) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(`${API_URL}/get-all-user?${params}`, { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Cria novo usuario (POST):
export async function USER_CREATE(token, email, password, name) {
   console.log('CALL FUNCTION API');

   const response = await axios.post(API_URL + '/register-user', {
      "email": email,
      "password": password,
      "name": name
   },
   { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Deleta usuario (DELETE):
export async function USER_DELETE(token, idUser) {
   console.log('CALL FUNCTION API');

   const response = await axios.delete(API_URL + '/delete-user/' + idUser, { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Atualiza senha do usuário (ADMIN) (POST):
export async function USER_UPDATE_PASSWORD(token, password, idUser) {
   console.log('CALL FUNCTION API');

   const response = await axios.post(API_URL + '/reset-password/' + idUser, {
      "password": password
   },
   { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Pega as categorias do usuario pelo id (GET):
export async function USER_GET_CATEGORY(token, idUser) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(API_URL + '/view-category-user/' + idUser, { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Atualiza/atribui categorias ao usuario (pelo idUser) (ADMIN) (POST):
export async function USER_UPDATE_CATEGORY(token, idUser, array) {
   console.log('CALL FUNCTION API');
   console.log(array);

   const response = await axios.post(API_URL + '/assign-category-user/' + idUser, {
      "responsible_category": array
   }, 
   { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Atualiza/atribui level ao usuario (pelo idUser) (ADMIN) (POST):
export async function USER_UPDATE_LEVEL(token, idUser, level) {
   console.log('CALL FUNCTION API');

   const response = await axios.post(API_URL + '/update-level/' + idUser, {
      "level": level
   }, 
   { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Atualiza dados (email e/ou nome) do usuário (ADMIN) (POST):
export async function USER_UPDATE_PERFIL(token, idUser, email, name) {
   console.log('CALL FUNCTION API');

   const response = await axios.post(API_URL + '/update-user/' + idUser, {
      "email": email,
      "name": name
   }, 
   { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// Restaurar usuario (POST):
export async function USER_RESTORE(token, idUser) {
   console.log('CALL FUNCTION API');

   // const response = await axios.post(`${API_URL}/reverse-deleted-user/${idUser}`, { 
   //    headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   // });
   const res = await fetch(`${API_URL}/reverse-deleted-user/${idUser}`, {
      method: 'POST',
      headers: { "Accept": "application/json", Authorization: 'Bearer ' + token }
   });
   const response = await res.json();

   // console.log(response.data);
   return response;
}








// Cria um  novo usuario (CREATE):
// export async function USER_REGISTER(nome, email, senha) {
//    console.log('CALL FUNCTION API');

//    const response = await axios.post(API_URL + '/register', {
//       "name": nome,
//       "email": email,
//       "password": senha
//    },
//    { 
//       headers: { "Accept": "application/json" } 
//    }
//    );

//    // console.log(response.data);
//    return response.data;
// }

// // Logout usuario:
// export async function USER_LOGOUT(token) {
//    console.log('CALL FUNCTION API');
   
//    const respons = await fetch(API_URL + '/logout', {
//       method: 'POST',
//       headers: {"Accept": "application/json", Authorization: 'Bearer ' + token}
//    });
//    const response = await respons.json();

//    // console.log(response.data);
//    return response;
// }

// // Pega detalhes do usuario:
// export async function USER_DETAILS(token) {
//    console.log('CALL FUNCTION API');

//    const response = await axios.get(API_URL + '/me', { 
//       headers: {"Accept": "application/json", Authorization: "Bearer " + token} 
//    });

//    // console.log(response.data);
//    return response.data;
// }
// // LOGIN/REGISTER END //

// // Update nome user:
// export async function USER_EDIT_NAME(token, name) {
//    console.log('CALL FUNCTION API');

//    const response = await axios.post(API_URL + '/reset-name', {
//       "name": name
//    },
//    { 
//       headers: { "Accept": "application/json", Authorization: "Bearer " + token, 'X-Dry-Run': true } 
//    });

//    // console.log(response.data);
//    return response.data;
// }

// // Update email user:
// export async function USER_EDIT_EMAIL(token, email) {
//    console.log('CALL FUNCTION API');

//    const response = await axios.post(API_URL + '/reset-email', {
//       "email": email
//    },
//    { 
//       headers: { "Accept": "application/json", Authorization: "Bearer " + token, 'X-Dry-Run': true } 
//    });

//    // console.log(response.data);
//    return response.data;
// }

// export async function USER_RESET_PASS(token, senha, senhaConfirm) {
//    console.log('CALL FUNCTION API');

//    const response = await axios.post(API_URL + '/reset-password', {
//       "password": senha,
//       "password_confirmation": senhaConfirm
//    },
//    { 
//       headers: { "Accept": "application/json", Authorization: "Bearer " + token, 'X-Dry-Run': true } 
//    });

//    // console.log(response.data);
//    return response.data;
// }