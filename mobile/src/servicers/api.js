import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

//  Descobre o IP do host automaticamente
let baseURL = "http://localhost:3000";

try {
  const debuggerHost = Constants.manifest2 ? Constants.manifest2.extra.expoGo?.debuggerHost : Constants.manifest?.debuggerHost;

  if (debuggerHost) {
    const ip = debuggerHost.split(':').shift();
    baseURL = `http://${ip}:3000`;
  }
} catch (e) {
  console.warn("Não foi possível detectar o IP automaticamente:", e);
}

const api = axios.create({ baseURL });

// Except para token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Except para erro 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("Erro 401: Token expirado ou inválido. Fazendo logout.");
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('usuario');
      alert("Sua sessão expirou. Por favor, faça login novamente.");
    }
    return Promise.reject(error);
  }
);

export default api;
