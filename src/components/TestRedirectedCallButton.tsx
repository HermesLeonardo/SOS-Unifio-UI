import React, { useState } from 'react';
import { Button } from './ui/button';
import { useApp } from '../contexts/AppContext';
import { 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { classifyOccurrence, mockLocations, symptomLabels } from '../data/mockData';
import { Occurrence, PeopleCount, PredefinedSymptom } from '../types';

const TestRedirectedCallButton: React.FC = () => {
  const { user, setIncomingCalls, setSimulatedOccurrences, availableResponders } = useApp() as any;
  const [isSimulating, setIsSimulating] = useState(false);

  // Mostrar apenas para socorristas e colaboradores
  if (!user || (user.role !== 'socorrista' && user.role !== 'colaborador')) {
    return null;
  }

  const handleSimulateRedirectedCall = async () => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    
    try {
      // Simular delay
      toast('🔄 Simulando chamado REDIRECIONADO chegando...', {
        description: 'Este chamado já foi rejeitado por outros respondedores',
        duration: 2500,
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Criar um chamado simulado
      const scenarios = [
        {
          symptoms: ['dor_peito', 'dificuldade_respirar'] as PredefinedSymptom[],
          peopleCount: '1' as PeopleCount,
          description: 'Paciente com dor no peito e falta de ar - CHAMADO REDIRECIONADO',
          location: mockLocations[0],
          user: {
            id: 'test-user-1',
            name: 'Carlos Alberto Silva',
            email: 'carlos.silva@unifio.edu.br',
            role: 'aluno' as const,
            phone: '(11) 98765-4321',
            department: 'Administração',
            ra: '789123',
            isActive: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          }
        },
        {
          symptoms: ['desmaio', 'sangramento'] as PredefinedSymptom[],
          peopleCount: '2-3' as PeopleCount,
          description: 'Duas pessoas desmaiaram no laboratório - CHAMADO REDIRECIONADO',
          location: mockLocations[3],
          user: {
            id: 'test-user-2',
            name: 'Marina Costa Oliveira',
            email: 'marina.oliveira@unifio.edu.br',
            role: 'professor' as const,
            phone: '(11) 97654-3210',
            department: 'Ciências da Saúde',
            isActive: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          }
        },
        {
          symptoms: ['convulsao'] as PredefinedSymptom[],
          peopleCount: '1' as PeopleCount,
          description: 'Aluno em convulsão na biblioteca - CHAMADO REDIRECIONADO',
          location: mockLocations[5],
          user: {
            id: 'test-user-3',
            name: 'Bruno Henrique Santos',
            email: 'bruno.santos@unifio.edu.br',
            role: 'aluno' as const,
            phone: '(11) 96543-2109',
            department: 'Engenharia',
            ra: '654321',
            isActive: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          }
        }
      ];

      const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      const classification = classifyOccurrence(scenario.symptoms, scenario.peopleCount);

      const newOccurrence: Occurrence = {
        id: `sim-redirect-${Date.now()}`,
        userId: scenario.user.id,
        user: scenario.user,
        type: classification.type,
        status: 'aberto',
        priority: classification.priority,
        locationId: scenario.location.id,
        location: scenario.location,
        locationMethod: 'qr_code',
        peopleCount: scenario.peopleCount,
        symptoms: scenario.symptoms,
        description: scenario.description,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutos atrás
        updatedAt: new Date().toISOString(),
        responders: [],
        observations: []
      };

      // Simular que este chamado já foi enviado para 1-2 respondedores
      // Selecionar aleatoriamente respondedores que já "receberam" este chamado
      const respondersArray = Array.isArray(availableResponders) ? availableResponders : [];
      const shuffled = [...respondersArray].sort(() => 0.5 - Math.random());
      const attemptedCount = Math.floor(Math.random() * 2) + 1; // 1 ou 2 respondedores
      const attemptedRespondersIds = shuffled
        .slice(0, attemptedCount)
        .filter((r: any) => r.id !== user.id) // Não incluir o usuário atual
        .map((r: any) => r.id);

      // Se não conseguiu pegar nenhum (improvável), adicionar pelo menos um mock
      if (attemptedRespondersIds.length === 0) {
        attemptedRespondersIds.push('already-attempted-1');
      }

      const incomingCall = {
        id: `call-redirect-${Date.now()}`,
        occurrence: newOccurrence,
        timestamp: new Date().toISOString(),
        attemptedRespondersIds: attemptedRespondersIds // CAMPO IMPORTANTE - indica redirecionamento
      };

      setIncomingCalls((prev: any) => [incomingCall, ...prev]);
      setSimulatedOccurrences((prev: any) => [newOccurrence, ...prev]);

      // Mostrar quais respondedores já receberam
      const attemptedNames = respondersArray
        .filter((r: any) => attemptedRespondersIds.includes(r.id))
        .map((r: any) => r.name)
        .join(', ') || 'Respondedores anteriores';

      toast.success('📞 Chamado REDIRECIONADO simulado!', {
        description: `${scenario.user.name} - ${classification.type.toUpperCase()} - Já enviado para: ${attemptedNames}`,
        duration: 6000,
      });

      console.log('🔄 CHAMADO REDIRECIONADO SIMULADO:', {
        callId: incomingCall.id,
        occurrenceId: newOccurrence.id,
        attemptedRespondersIds: attemptedRespondersIds,
        attemptedCount: attemptedRespondersIds.length,
        currentUser: user.id,
        scenario: scenario.description,
        createdAt: newOccurrence.createdAt,
        howToTest: {
          action1: 'Aceite o chamado para testar o fluxo de aceitação',
          action2: 'Rejeite o chamado para testar o próximo redirecionamento',
          action3: 'Deixe o timer expirar (90s) para testar redirecionamento automático',
          note: 'Observe o campo attemptedRespondersIds sendo atualizado a cada redirecionamento'
        }
      });

    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <Button
        onClick={handleSimulateRedirectedCall}
        disabled={isSimulating}
        className={`
          w-14 h-14 rounded-full shadow-2xl border-2 border-white
          ${isSimulating 
            ? 'bg-orange-500 hover:bg-orange-600' 
            : 'bg-purple-600 hover:bg-purple-700'
          }
          text-white transition-all duration-300 hover:scale-110
        `}
        title="Simular Chamado Redirecionado (Teste)"
      >
        {isSimulating ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <div className="flex flex-col items-center">
            <RotateCcw className="w-5 h-5" />
            <div className="text-xs mt-0.5">REDIR</div>
          </div>
        )}
      </Button>
      
      {/* Tooltip explicativo */}
      <div className="absolute bottom-16 right-0 w-56 bg-purple-900 text-white text-xs rounded-lg p-2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
        <div className="font-medium mb-1">🔄 Teste de Redirecionamento</div>
        <div className="mb-1">Simula um chamado que já foi rejeitado por outros respondedores e está sendo redirecionado para você.</div>
        <div className="text-purple-200 text-[10px] mt-1">
          ⚠️ Este chamado terá IDs no campo attemptedRespondersIds
        </div>
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-900"></div>
      </div>
    </div>
  );
};

export default TestRedirectedCallButton;
