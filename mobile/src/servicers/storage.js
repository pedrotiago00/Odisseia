import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Adaptador de armazenamento universal (Web/Mobile).
 * Usa localStorage na web e SecureStore no mobile.
 */
const storage = {
    /**
     * Salva um item no armazenamento.
     * @param {string} key A chave.
     * @param {string} value O valor.
     */
    async setItem(key, value) {
        if (Platform.OS === 'web') {
            try {
                // Na web, usa localStorage
                localStorage.setItem(key, value);
            } catch (e) {
                console.error('Erro ao salvar no localStorage:', e);
            }
        } else {
            // No mobile, usa SecureStore
            try {
                await SecureStore.setItemAsync(key, value);
            } catch (e) {
                console.error('Erro ao salvar no SecureStore:', e);
            }
        }
    },

    /**
     * Pega um item do armazenamento.
     * @param {string} key A chave.
     * @returns {Promise<string | null>} O valor.
     */
    async getItem(key) {
        if (Platform.OS === 'web') {
            try {
                // Na web, lê do localStorage
                return localStorage.getItem(key);
            } catch (e) {
                console.error('Erro ao ler do localStorage:', e);
                return null;
            }
        } else {
            // No mobile, lê do SecureStore
            try {
                return await SecureStore.getItemAsync(key);
            } catch (e) {
                console.error('Erro ao ler do SecureStore:', e);
                return null;
            }
        }
    },

    /**
     * Remove um item do armazenamento.
     * @param {string} key A chave.
     */
    async deleteItem(key) {
        if (Platform.OS === 'web') {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error('Erro ao remover do localStorage:', e);
            }
        } else {
            try {
                await SecureStore.deleteItemAsync(key);
            } catch (e) {
                console.error('Erro ao remover do SecureStore:', e);
            }
        }
    }
};

export default storage;