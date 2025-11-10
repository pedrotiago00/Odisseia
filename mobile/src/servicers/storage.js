import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Adaptador de Armazenamento Universal (Web/Mobile).
 * O objetivo é ter uma forma única (setItem, getItem, deleteItem)
 * de salvar dados, independentemente da plataforma.
 */
const storage = {
    /**
     * Salva um item (chave + valor).
     */
    async setItem(key, value) {
        if (Platform.OS === 'web') {
            // Web: Usa localStorage
            try {
                localStorage.setItem(key, value);
            } catch (e) {
                console.error('Erro ao salvar no localStorage:', e);
            }
        } else {
            // Mobile: Usa SecureStore (que é criptografado)
            try {
                await SecureStore.setItemAsync(key, value);
            } catch (e) {
                console.error('Erro ao salvar no SecureStore:', e);
            }
        }
    },

    /**
     * Pega um item pela chave.
     */
    async getItem(key) {
        if (Platform.OS === 'web') {
            // Web: Lê do localStorage
            try {
                return localStorage.getItem(key);
            } catch (e) {
                console.error('Erro ao ler do localStorage:', e);
                return null;
            }
        } else {
            // Mobile: Lê do SecureStore
            try {
                return await SecureStore.getItemAsync(key);
            } catch (e) {
                console.error('Erro ao ler do SecureStore:', e);
                return null;
            }
        }
    },

    /**
     * Remove um item pela chave.
     */
    async deleteItem(key) {
        if (Platform.OS === 'web') {
            // Web: Remove do localStorage
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error('Erro ao remover do localStorage:', e);
            }
        } else {
            // Mobile: Remove do SecureStore
            try {
                await SecureStore.deleteItemAsync(key);
            } catch (e) {
                console.error('Erro ao remover do SecureStore:', e);
            }
        }
    }
};

export default storage;