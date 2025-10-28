import React, { useState } from 'react';
import { Button } from './ui/button';
import { useApp } from '../contexts/AppContext';
import { 
  Phone,
  TestTube,
  Zap
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const TestCallButton: React.FC = () => {
  const { user, simulateEmergencyCall, hasPermission } = useApp() as any;
  const [isSimulating, setIsSimulating] = useState(false);

  // Apenas mostrar para socorristas
  if (user?.role !== 'socorrista' || !hasPermission('simulate_calls')) {
    return null;
  }

  const handleSimulateCall = async () => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    
    try {
      // Simular delay de chegada do chamado
      toast('🔄 Simulando chamado de emergência...', {
        duration: 2000,
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const call = simulateEmergencyCall();
      
      if (call) {
        toast.success('📞 Novo chamado simulado!', {
          description: `${call.occurrence.user.name} - ${call.occurrence.type.toUpperCase()} - ${call.occurrence.peopleCount === '1' ? '1 pessoa' : call.occurrence.peopleCount === '2-3' ? '2-3 pessoas' : 'Mais de 3 pessoas'}`,
          duration: 4000,
        });
      }
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        onClick={handleSimulateCall}
        disabled={isSimulating}
        className={`
          w-14 h-14 rounded-full shadow-2xl border-2 border-white
          ${isSimulating 
            ? 'bg-orange-500 hover:bg-orange-600' 
            : 'bg-red-600 hover:bg-red-700'
          }
          text-white transition-all duration-300 hover:scale-110
          animate-pulse
        `}
        title="Simular Chamado de Emergência (Teste)"
      >
        {isSimulating ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <div className="flex flex-col items-center">
            <TestTube className="w-5 h-5" />
            <div className="text-xs mt-0.5">TEST</div>
          </div>
        )}
      </Button>
      
      {/* Tooltip explicativo */}
      <div className="absolute bottom-16 right-0 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
        <div className="font-medium mb-1">Botão de Teste</div>
        <div>Clique para simular um chamado de emergência chegando ao sistema</div>
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};

export default TestCallButton;