// Utilitário para gerenciar localStorage do SOS UNIFIO

const STORAGE_PREFIX = 'sos-unifio-';

export const StorageKeys = {
  USER: `${STORAGE_PREFIX}user`,
  PAGE: `${STORAGE_PREFIX}page`,
  ACTIVE_OCCURRENCE: `${STORAGE_PREFIX}active-occurrence`,
  ADMIN_MODE: `${STORAGE_PREFIX}admin-mode`,
  SIMULATED_OCCURRENCES: `${STORAGE_PREFIX}simulated-occurrences`,
  INCOMING_CALLS: `${STORAGE_PREFIX}incoming-calls`,
  OCCURRENCE_HISTORY: `${STORAGE_PREFIX}occurrence-history`,
  APP_VERSION: `${STORAGE_PREFIX}app-version`,
  LAST_SYNC: `${STORAGE_PREFIX}last-sync`,
} as const;

// Versão atual da aplicação para gerenciar migrações
const APP_VERSION = '1.0.0';

/**
 * Salvar dados no localStorage
 */
export function saveToStorage<T extends any>(key: string, data: T): boolean {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    localStorage.setItem(StorageKeys.LAST_SYNC, new Date().toISOString());
    return true;
  } catch (error) {
    console.error(`Erro ao salvar ${key} no localStorage:`, error);
    return false;
  }
}

/**
 * Carregar dados do localStorage
 */
export function loadFromStorage<T extends any>(key: string, defaultValue: T | null = null): T | null {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Erro ao carregar ${key} do localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Remover item do localStorage
 */
export function removeFromStorage(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Erro ao remover ${key} do localStorage:`, error);
    return false;
  }
}

/**
 * Limpar todos os dados do SOS UNIFIO
 */
export function clearAllStorage(): boolean {
  try {
    Object.values(StorageKeys).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Erro ao limpar localStorage:', error);
    return false;
  }
}

/**
 * Exportar todos os dados para backup
 */
export function exportAllData(): string {
  const data: Record<string, any> = {
    version: APP_VERSION,
    exportDate: new Date().toISOString(),
  };

  Object.entries(StorageKeys).forEach(([name, key]) => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      try {
        data[name] = JSON.parse(value);
      } catch {
        data[name] = value;
      }
    }
  });

  return JSON.stringify(data, null, 2);
}

/**
 * Importar dados de backup
 */
export function importAllData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    
    // Verificar versão
    if (data.version !== APP_VERSION) {
      console.warn('Versão dos dados importados diferente da aplicação atual');
    }

    // Limpar dados existentes
    clearAllStorage();

    // Importar novos dados
    Object.entries(StorageKeys).forEach(([name, key]) => {
      if (data[name] !== undefined) {
        saveToStorage(key, data[name]);
      }
    });

    saveToStorage(StorageKeys.APP_VERSION, APP_VERSION);
    return true;
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    return false;
  }
}

/**
 * Verificar espaço disponível no localStorage
 */
export function getStorageInfo() {
  let totalSize = 0;
  const items: Record<string, number> = {};

  Object.values(StorageKeys).forEach(key => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      const size = new Blob([value]).size;
      items[key] = size;
      totalSize += size;
    }
  });

  // Limite típico do localStorage é 5MB-10MB
  const estimatedLimit = 5 * 1024 * 1024; // 5MB em bytes
  const usagePercent = (totalSize / estimatedLimit) * 100;

  return {
    totalSize,
    totalSizeKB: (totalSize / 1024).toFixed(2),
    totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
    usagePercent: usagePercent.toFixed(2),
    items,
    estimatedLimit,
  };
}

/**
 * Migrar dados de versões antigas
 */
export function migrateStorageIfNeeded(): void {
  const currentVersion = loadFromStorage<string>(StorageKeys.APP_VERSION);
  
  if (!currentVersion) {
    // Primeira vez que usa a aplicação com versionamento
    saveToStorage(StorageKeys.APP_VERSION, APP_VERSION);
    console.log('Dados inicializados com versão:', APP_VERSION);
    return;
  }

  if (currentVersion !== APP_VERSION) {
    console.log(`Migrando dados de ${currentVersion} para ${APP_VERSION}`);
    // Aqui você pode adicionar lógica de migração quando mudar a versão
    saveToStorage(StorageKeys.APP_VERSION, APP_VERSION);
  }
}

/**
 * Obter estatísticas de uso do localStorage
 */
export function getStorageStats() {
  const info = getStorageInfo();
  const lastSync = loadFromStorage<string>(StorageKeys.LAST_SYNC);
  const simulatedOccurrences = loadFromStorage<any[]>(StorageKeys.SIMULATED_OCCURRENCES, []);
  const incomingCalls = loadFromStorage<any[]>(StorageKeys.INCOMING_CALLS, []);

  return {
    ...info,
    lastSync,
    occurrencesCount: simulatedOccurrences?.length || 0,
    incomingCallsCount: incomingCalls?.length || 0,
  };
}