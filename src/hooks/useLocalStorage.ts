import { useState, useEffect } from 'react';
import { saveToStorage, loadFromStorage } from '../utils/localStorage';

/**
 * Hook personalizado para gerenciar localStorage com sincronização de estado
 * 
 * @param key - Chave do localStorage
 * @param initialValue - Valor inicial se não houver dados salvos
 * @returns [value, setValue, removeValue] - Tupla com valor, função setter e função de remoção
 * 
 * @example
 * const [user, setUser, removeUser] = useLocalStorage('user', null);
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Tentar carregar do localStorage
      const item = loadFromStorage<T>(key, initialValue);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error(`Erro ao carregar ${key}:`, error);
      return initialValue;
    }
  });

  // Função para atualizar o valor
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      // Permitir que o valor seja uma função (como setState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Salvar estado
      setStoredValue(valueToStore);
      
      // Salvar no localStorage
      saveToStorage(key, valueToStore);
    } catch (error) {
      console.error(`Erro ao salvar ${key}:`, error);
    }
  };

  // Função para remover o valor
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Erro ao remover ${key}:`, error);
    }
  };

  return [storedValue, setValue, removeValue];
}

/**
 * Hook para sincronizar estado com localStorage de forma assíncrona
 * Útil para dados que mudam frequentemente
 * 
 * @param key - Chave do localStorage
 * @param value - Valor a ser sincronizado
 * @param delay - Delay em ms para debounce (padrão: 500ms)
 */
export function useSyncWithStorage<T>(
  key: string,
  value: T,
  delay: number = 500
): void {
  useEffect(() => {
    // Debounce para evitar muitas escritas
    const timer = setTimeout(() => {
      if (value !== null && value !== undefined) {
        saveToStorage(key, value);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [key, value, delay]);
}

/**
 * Hook para verificar se há dados salvos no localStorage
 * 
 * @param key - Chave do localStorage
 * @returns boolean indicando se há dados salvos
 */
export function useHasStoredData(key: string): boolean {
  const [hasData, setHasData] = useState<boolean>(false);

  useEffect(() => {
    const item = localStorage.getItem(key);
    setHasData(item !== null);
  }, [key]);

  return hasData;
}

/**
 * Hook para observar mudanças no localStorage
 * Útil para sincronizar estado entre abas
 * 
 * @param key - Chave do localStorage
 * @param callback - Função chamada quando o valor muda
 */
export function useStorageListener<T>(
  key: string,
  callback: (newValue: T | null) => void
): void {
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : null;
          callback(newValue);
        } catch (error) {
          console.error(`Erro ao processar mudança em ${key}:`, error);
        }
      }
    };

    // Listener para mudanças em outras abas
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, callback]);
}

export default useLocalStorage;
