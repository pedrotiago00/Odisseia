import axios from "axios";
// REMOVIDO: import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
// IMPORTADO: Nosso novo adaptador de armazenamento
import storage from './storage'; // Garanta que 'storage.js' esteja na mesma pasta

// --- Detecção de IP ---
let baseURL = "http://localhost:3000"; // Padrão para web
try {
  const debuggerHost = Constants.manifest2 ? Constants.manifest2.extra.expoGo?.debuggerHost : Constants.manifest?.debuggerHost;
  if (debuggerHost) {
    const ip = debuggerHost.split(':').shift();
    if (ip) {
        baseURL = `http://${ip}:3000`;
    }
  }
} catch (e) {
  console.warn("Não foi possível detectar o IP automaticamente:", e);
}

// Log para sabermos qual IP está sendo usado
console.log(`[API] Conectando à base: ${baseURL}`);
// --- Fim da Detecção de IP ---


const api = axios.create({ baseURL });

// Interceptor para enviar o token em todas as requisições
api.interceptors.request.use(
  async (config) => {
    // CORRIGIDO: Usa nosso 'storage' universal
    const token = await storage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erro 401 (Sessão Expirada)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // CORREÇÃO: Verifica se o erro 401 NÃO VEIO da tela de login
    const isLoginRoute = originalRequest.url.endsWith('/usuarios/login');

    if (error.response?.status === 401 && !isLoginRoute) {
      console.log("Erro 401: Token expirado ou inválido. Fazendo logout.");
      
      // CORRIGIDO: Usa nosso 'storage' universal para limpar os dados
      await storage.deleteItem('token');
      await storage.deleteItem('usuario');
      
      alert("Sua sessão expirou. Por favor, faça login novamente.");
    }
    return Promise.reject(error);
  }
);

export default api;