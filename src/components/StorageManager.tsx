import React, { useState, useEffect } from 'react';
import { Download, Upload, Trash2, HardDrive, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import {
  exportAllData,
  importAllData,
  clearAllStorage,
  getStorageStats,
  migrateStorageIfNeeded,
} from '../utils/localStorage';

interface StorageManagerProps {
  onDataCleared?: () => void;
}

const StorageManager: React.FC<StorageManagerProps> = ({ onDataCleared }) => {
  const [stats, setStats] = useState<any>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    loadStats();
    migrateStorageIfNeeded();
  }, []);

  const loadStats = () => {
    const storageStats = getStorageStats();
    setStats(storageStats);
  };

  const handleExport = () => {
    try {
      const data = exportAllData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sos-unifio-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Backup exportado com sucesso!', {
        description: 'Arquivo salvo na pasta de downloads',
      });
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      toast.error('Erro ao exportar backup', {
        description: 'Não foi possível exportar os dados',
      });
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonString = event.target?.result as string;
          const success = importAllData(jsonString);
          
          if (success) {
            toast.success('Backup importado com sucesso!', {
              description: 'A página será recarregada',
            });
            setTimeout(() => window.location.reload(), 2000);
          } else {
            toast.error('Erro ao importar backup', {
              description: 'Verifique se o arquivo está correto',
            });
          }
        } catch (error) {
          console.error('Erro ao importar dados:', error);
          toast.error('Arquivo inválido', {
            description: 'O arquivo selecionado não é um backup válido',
          });
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  };

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 5000);
      return;
    }

    const success = clearAllStorage();
    
    if (success) {
      toast.success('Dados limpos com sucesso!', {
        description: 'A página será recarregada',
      });
      
      if (onDataCleared) {
        onDataCleared();
      }
      
      setTimeout(() => window.location.reload(), 2000);
    } else {
      toast.error('Erro ao limpar dados', {
        description: 'Não foi possível limpar o armazenamento',
      });
    }
  };

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">Carregando informações...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas de Armazenamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Armazenamento Local
          </CardTitle>
          <CardDescription>
            Informações sobre os dados salvos no navegador
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Espaço Utilizado</p>
              <p className="text-2xl">
                {stats.totalSizeKB} KB
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.usagePercent}% do limite estimado
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Ocorrências Salvas</p>
              <p className="text-2xl">
                {stats.occurrencesCount}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Chamados no histórico
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Chamadas Ativas</p>
              <p className="text-2xl">
                {stats.incomingCallsCount}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Notificações pendentes
              </p>
            </div>
          </div>

          {stats.lastSync && (
            <div className="text-sm text-gray-600">
              <strong>Última sincronização:</strong>{' '}
              {new Date(stats.lastSync).toLocaleString('pt-BR')}
            </div>
          )}

          {/* Barra de Progresso */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uso do armazenamento</span>
              <span>{stats.usagePercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  parseFloat(stats.usagePercent) > 80
                    ? 'bg-red-500'
                    : parseFloat(stats.usagePercent) > 50
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(parseFloat(stats.usagePercent), 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações de Gerenciamento */}
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Dados</CardTitle>
          <CardDescription>
            Exportar, importar ou limpar os dados armazenados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Os dados são salvos automaticamente no navegador. Use as opções abaixo para fazer backup ou limpar os dados.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              onClick={handleExport}
              variant="outline"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Backup
            </Button>

            <Button
              onClick={handleImport}
              variant="outline"
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar Backup
            </Button>

            <Button
              onClick={handleClear}
              variant={confirmClear ? 'destructive' : 'outline'}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {confirmClear ? 'Confirmar Limpeza?' : 'Limpar Dados'}
            </Button>
          </div>

          {confirmClear && (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Atenção!</strong> Esta ação irá apagar todos os dados salvos incluindo
                usuário logado, ocorrências e configurações. Clique novamente para confirmar.
              </AlertDescription>
            </Alert>
          )}

          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Exportar Backup:</strong> Salva todos os dados em um arquivo JSON</p>
            <p><strong>Importar Backup:</strong> Restaura dados de um arquivo exportado anteriormente</p>
            <p><strong>Limpar Dados:</strong> Remove todos os dados salvos (requer confirmação)</p>
          </div>
        </CardContent>
      </Card>

      {/* Informações Técnicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Técnicas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm font-mono">
            {Object.entries(stats.items).map(([key, size]) => (
              <div key={key} className="flex justify-between p-2 bg-slate-50 rounded">
                <span className="text-gray-600">{key}</span>
                <span className="text-gray-900">{((size as number) / 1024).toFixed(2)} KB</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageManager;
