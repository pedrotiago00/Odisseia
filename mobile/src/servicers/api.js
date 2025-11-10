import axios from "axios";
import Constants from 'expo-constants';
// Importa nosso adaptador de armazenamento universal
import storage from './storage'; 

// --- Lógica de detecção de IP (para testes locais) ---
let localBaseURL = "http://localhost:3000"; // Padrão
try {
  // Tenta pegar o IP da máquina que está rodando o Expo Go
  const debuggerHost = Constants.manifest2 ? Constants.manifest2.extra.expoGo?.debuggerHost : Constants.manifest?.debuggerHost;
  if (debuggerHost) {
    const ip = debuggerHost.split(':').shift();
    if (ip) {
        localBaseURL = `http://${ip}:3000`; // IP local encontrado
    }
  }
} catch (e) {
  console.warn("Não foi possível detectar o IP local:", e);
}
// ----------------------------------------------------


// Cria a instância central do Axios
const api = axios.create({
  // Define a URL base da API (neste caso, a de produção no Render)
  baseURL: 'https://odisseiaclone1-0.onrender.com'
  // OBS: Se quisesse usar o IP local para testes, usaria:
  // baseURL: localBaseURL
});

/**
 * INTERCEPTOR DE REQUISIÇÃO (Request)
 * Roda ANTES de CADA requisição ser enviada.
 *
 * Objetivo: Pegar o token salvo no 'storage' e
 * injetá-lo no cabeçalho (Header) 'Authorization'.
 */
api.interceptors.request.use(
  async (config) => {
    // Usa nosso 'storage' universal
    const token = await storage.getItem('token');
    
    // Se o token existir, anexa ele na requisição
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * INTERCEPTOR DE RESPOSTA (Response)
 * Roda DEPOIS que uma resposta (com erro) é recebida.
 *
 * Objetivo: Lidar com erros de "Sessão Expirada" (Erro 401).
 */
api.interceptors.response.use(
  (response) => response, // Se for sucesso, não faz nada
  async (error) => {
    const originalRequest = error.config;

    // Verifica se o erro é 401 (Não Autorizado) E
    // se o erro NÃO VEIO da própria tela de login (evita loop)
    const isLoginRoute = originalRequest.url.endsWith('/usuarios/login');

    if (error.response?.status === 401 && !isLoginRoute) {
      console.log("Erro 401: Sessão expirada. Deslogando...");
      
      // Limpa os dados do usuário (logout)
      await storage.deleteItem('token');
      await storage.deleteItem('usuario');
      
      // Avisa o usuário para fazer login novamente
      alert("Sua sessão expirou. Por favor, faça login novamente.");
      
    }
    return Promise.reject(error);
  }
);

export default api;