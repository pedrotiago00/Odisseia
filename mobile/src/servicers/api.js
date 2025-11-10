import axios from "axios";
import Constants from 'expo-constants';
// IMPORTADO: Nosso novo adaptador de armazenamento
import storage from './storage'; 

// --- A MUDANÇA CRÍTICA É AQUI ---
// Defina a URL base como o endereço público do Render.
// Isso ignora toda a lógica de detecção de IP local, que não é mais necessária.
//const baseURL = "https://odisseiaclone1-0.onrender.com"; 


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

console.log(`[API] Conectando à base: ${baseURL}`);


const api = axios.create({
  //baseURL: 'https://odisseiaclone1-0.onrender.com'
    baseURL: baseURL
});

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