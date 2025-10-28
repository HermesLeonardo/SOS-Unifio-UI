import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Occurrence, AppContextType } from '../types';
import { mockLocations, symptomLabels } from '../data/mockData';

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

interface IncomingCall {
  id: string;
  occurrence: Occurrence;
  timestamp: string;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('login');
  const [activeOccurrence, setActiveOccurrence] = useState<Occurrence | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [incomingCalls, setIncomingCalls] = useState<IncomingCall[]>([]);
  const [simulatedOccurrences, setSimulatedOccurrences] = useState<Occurrence[]>([]);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // Carregar dados persistidos do localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('sos-unifio-user');
      const savedPage = localStorage.getItem('sos-unifio-page');
      const savedOccurrence = localStorage.getItem('sos-unifio-active-occurrence');
      const savedAdminMode = localStorage.getItem('sos-unifio-admin-mode');

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        
        // Restaurar modo admin se salvado
        if (savedAdminMode && parsedUser.role === 'administrador') {
          setIsAdminMode(JSON.parse(savedAdminMode));
        }
        
        // Definir página inicial baseada no perfil do usuário
        if (savedPage && savedPage !== 'login') {
          setCurrentPage(savedPage);
        } else {
          // Redirecionar baseado no perfil
          if (parsedUser.role === 'aluno') {
            setCurrentPage('new-occurrence');
          } else if (parsedUser.role === 'administrador') {
            setCurrentPage('dashboard');
          } else {
            setCurrentPage('dashboard');
          }
        }
      }

      if (savedOccurrence) {
        const parsedOccurrence = JSON.parse(savedOccurrence);
        setActiveOccurrence(parsedOccurrence);
      }
    } catch (error) {
      console.error('Erro ao carregar dados salvos:', error);
      // Limpar dados corrompidos
      localStorage.removeItem('sos-unifio-user');
      localStorage.removeItem('sos-unifio-page');
      localStorage.removeItem('sos-unifio-active-occurrence');
      localStorage.removeItem('sos-unifio-admin-mode');
    }
  }, []);

  // Função para simular chamado de emergência
  const simulateEmergencyCall = () => {
    const mockStudents = [
      'Ana Silva', 'Bruno Santos', 'Carla Oliveira', 'Diego Costa', 'Elena Ferreira',
      'Felipe Lima', 'Gabriela Rocha', 'Henrique Alves', 'Isabela Cruz', 'João Pedro'
    ];

    const mockSymptoms = [
      ['lesao_trauma', 'sangramento'],
      ['dor_peito', 'dificuldade_respirar'],
      ['desmaio'],
      ['dor_cabeca_intensa'],
      ['dor_abdominal', 'nausea_vomito'],
      ['febre_alta'],
      ['convulsao'],
      ['reacao_alergica'],
      ['outro']
    ];

    const mockDescriptions = [
      'Estava subindo a escada quando senti uma dor forte no peito',
      'Comecei a passar mal durante a aula de educação física',
      'Senti uma tontura muito forte e quase desmaiei',
      'Começou uma dor abdominal intensa do nada',
      'Estou com febre muito alta e me sentindo muito fraco',
      'Tenho uma dor de cabeça terrível e visão embaçada',
      'Não consigo respirar direito e estou muito ansioso'
    ];

    const peopleCountOptions = ['1', '2-3', '3+'];

    const randomStudent = mockStudents[Math.floor(Math.random() * mockStudents.length)];
    const randomSymptoms = mockSymptoms[Math.floor(Math.random() * mockSymptoms.length)];
    const randomDescription = mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)];
    const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
    const randomRA = String(Math.floor(Math.random() * 900000) + 100000);
    const randomPeopleCount = peopleCountOptions[Math.floor(Math.random() * peopleCountOptions.length)];

    // Determinar tipo e prioridade baseado nos sintomas
    const criticalSymptoms = ['dor_peito', 'dificuldade_respirar', 'desmaio', 'convulsao', 'sangramento'];
    const hasCriticalSymptom = randomSymptoms.some(s => criticalSymptoms.includes(s));
    
    const occurrenceType = hasCriticalSymptom ? 'emergencia' : 'urgencia';
    let priority = hasCriticalSymptom ? 'critica' : Math.random() > 0.5 ? 'alta' : 'media';
    
    // Aumentar prioridade se múltiplas pessoas
    if (randomPeopleCount === '2-3' || randomPeopleCount === '3+') {
      priority = priority === 'media' ? 'alta' : priority === 'alta' ? 'critica' : priority;
    }

    const newOccurrence: Occurrence = {
      id: `sim-${Date.now()}`,
      userId: `aluno-${randomRA}`,
      user: {
        id: `aluno-${randomRA}`,
        name: randomStudent,
        email: `aluno${randomRA}@unifio.edu.br`,
        ra: randomRA,
        role: 'aluno',
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      },
      type: occurrenceType,
      status: 'aberto',
      priority: priority as any,
      locationId: randomLocation.id,
      location: randomLocation,
      locationMethod: 'manual',
      locationDescription: `Próximo à ${randomLocation.name}`,
      peopleCount: randomPeopleCount as any,
      symptoms: randomSymptoms as any,
      description: randomDescription,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responders: [],
      observations: []
    };

    // Adicionar à lista de chamadas recebidas
    const incomingCall: IncomingCall = {
      id: `call-${Date.now()}`,
      occurrence: newOccurrence,
      timestamp: new Date().toISOString()
    };

    setIncomingCalls(prev => [incomingCall, ...prev]);
    setSimulatedOccurrences(prev => [newOccurrence, ...prev]);

    return incomingCall;
  };

  // Função para aceitar chamado
  const acceptCall = (callId: string) => {
    const call = incomingCalls.find(c => c.id === callId);
    if (call && user) {
      // Atualizar status da ocorrência
      const updatedOccurrence = {
        ...call.occurrence,
        status: 'em_atendimento' as any,
        assignedTo: user,
        responders: [user],
        updatedAt: new Date().toISOString()
      };

      // Atualizar nas listas
      setSimulatedOccurrences(prev => 
        prev.map(occ => occ.id === call.occurrence.id ? updatedOccurrence : occ)
      );

      // Remover da lista de chamadas pendentes
      setIncomingCalls(prev => prev.filter(c => c.id !== callId));

      return updatedOccurrence;
    }
    return null;
  };

  // Função para rejeitar chamado
  const rejectCall = (callId: string) => {
    setIncomingCalls(prev => prev.filter(c => c.id !== callId));
  };

  // Função customizada para definir usuário com redirecionamento inteligente
  const setUserWithRedirect = (newUser: User | null) => {
    setUser(newUser);
    
    if (newUser) {
      // Atualizar último login
      const updatedUser = { ...newUser, lastLogin: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem('sos-unifio-user', JSON.stringify(updatedUser));
      
      // Redirecionar baseado no perfil
      if (newUser.role === 'aluno') {
        setCurrentPage('new-occurrence');
      } else if (newUser.role === 'administrador') {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('dashboard');
      }
    } else {
      localStorage.removeItem('sos-unifio-user');
      setCurrentPage('login');
    }
  };

  // Persistir dados no localStorage
  useEffect(() => {
    if (user && currentPage !== 'login') {
      localStorage.setItem('sos-unifio-page', currentPage);
    }
  }, [currentPage, user]);

  useEffect(() => {
    if (activeOccurrence) {
      localStorage.setItem('sos-unifio-active-occurrence', JSON.stringify(activeOccurrence));
    } else {
      localStorage.removeItem('sos-unifio-active-occurrence');
    }
  }, [activeOccurrence]);

  // Função para alternar modo admin (apenas para administradores)
  const toggleAdminMode = () => {
    if (user?.role === 'administrador') {
      const newAdminMode = !isAdminMode;
      setIsAdminMode(newAdminMode);
      localStorage.setItem('sos-unifio-admin-mode', JSON.stringify(newAdminMode));
    }
  };

  // Função para logout
  const logout = () => {
    setUser(null);
    setActiveOccurrence(null);
    setCurrentPage('login');
    setIncomingCalls([]);
    setSimulatedOccurrences([]);
    setIsAdminMode(false);
    localStorage.clear();
  };

  // Função para navegação segura baseada no perfil - CORRIGIDA
  const navigateToPage = (page: string) => {
    // Página de login é sempre acessível
    if (page === 'login') {
      setCurrentPage(page);
      return;
    }

    if (!user) {
      setCurrentPage('login');
      return;
    }

    // Validar acesso baseado no perfil do usuário
    const rolePermissions: Record<string, string[]> = {
      aluno: [
        'login',
        'new-occurrence',
        'occurrence-status',
        'my-occurrences',
        'history'
      ],
      colaborador: [
        'login',
        'dashboard',
        'new-occurrence',
        'my-occurrences',
        'occurrence-status',
        'active-occurrences',
        'history',
        'reports'
      ],
      socorrista: [
        'login',
        'dashboard',
        'active-occurrences',
        'my-assignments',
        'occurrence-details',
        'occurrence-status',
        'history',
        'triage',
        'reports'
      ],
      administrador: [
        'login',
        'dashboard',
        'new-occurrence',
        'active-occurrences',
        'my-assignments',
        'occurrence-details',
        'occurrence-status',
        'history',
        'triage',
        'reports',
        'admin-overview',
        'admin-users',
        'admin-locations',
        'admin-settings',
        'overview',
        'users',
        'locations',
        'settings'
      ]
    };

    const allowedPages = rolePermissions[user.role] || [];
    
    if (allowedPages.includes(page)) {
      setCurrentPage(page);
    } else {
      console.warn(`Usuário ${user.role} não tem permissão para acessar ${page}`);
      // Redirecionar para página padrão do perfil
      if (user.role === 'aluno') {
        setCurrentPage('new-occurrence');
      } else {
        setCurrentPage('dashboard');
      }
    }
  };

  // Função para atualizar dados do usuário
  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('sos-unifio-user', JSON.stringify(updatedUser));
    }
  };

  // Função para atualizar ocorrência ativa
  const updateActiveOccurrence = (updates: Partial<Occurrence>) => {
    if (activeOccurrence) {
      const updatedOccurrence = { 
        ...activeOccurrence, 
        ...updates,
        updatedAt: new Date().toISOString()
      };
      setActiveOccurrence(updatedOccurrence);
    }
  };

  // Função para verificar se o usuário tem permissão específica
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    const permissions: Record<string, string[]> = {
      aluno: ['create_occurrence', 'view_own_occurrences'],
      colaborador: ['create_occurrence', 'view_own_occurrences', 'help_others', 'view_reports'],
      socorrista: ['view_all_occurrences', 'respond_occurrences', 'update_status', 'simulate_calls', 'view_reports'],
      administrador: [
        'create_occurrence', 
        'view_own_occurrences', 
        'view_all_occurrences', 
        'respond_occurrences', 
        'update_status', 
        'simulate_calls', 
        'view_reports',
        'manage_users',
        'manage_system',
        'admin_access',
        'full_reports',
        'system_settings'
      ]
    };

    return permissions[user.role]?.includes(permission) || false;
  };

  // Função para ir para página inicial do usuário
  const goToHomePage = () => {
    if (!user) {
      setCurrentPage('login');
      return;
    }

    if (user.role === 'aluno') {
      setCurrentPage('new-occurrence');
    } else if (user.role === 'administrador') {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('dashboard');
    }
  };

  // Estado da aplicação para debug
  const getAppState = () => ({
    user: user ? { id: user.id, name: user.name, role: user.role } : null,
    currentPage,
    activeOccurrence: activeOccurrence ? { id: activeOccurrence.id, status: activeOccurrence.status } : null,
    isLoading,
    incomingCallsCount: incomingCalls.length,
    simulatedOccurrencesCount: simulatedOccurrences.length
  });

  // Função de login simples atualizada para incluir administrador
  const login = (email: string, role: string, ra?: string) => {
    const now = new Date().toISOString();
    const userId = `${role}-${Date.now()}`;
    
    const userNames = {
      aluno: 'João da Silva',
      colaborador: 'Prof. Ana Maria',
      socorrista: 'Dr. Carlos Santos',
      administrador: 'Admin. Ricardo Silva'
    };
    
    const newUser: User = {
      id: userId,
      name: userNames[role as keyof typeof userNames] || 'Usuário',
      email,
      role: role as any,
      ra: ra || (role === 'aluno' ? '123456' : undefined),
      isActive: true,
      createdAt: now,
      lastLogin: now,
      // Campos específicos para administradores
      ...(role === 'administrador' && {
        permissions: ['manage_users', 'manage_system', 'admin_access', 'full_reports', 'system_settings'],
        accessLevel: 'full' as const
      })
    };

    setUserWithRedirect(newUser);
  };

  const contextValue: AppContextType = {
    user,
    setUser: setUserWithRedirect,
    currentPage,
    setCurrentPage: navigateToPage,
    activeOccurrence,
    setActiveOccurrence,
    isLoading,
    setIsLoading,
    // Novas funções para simulação
    incomingCalls,
    simulatedOccurrences,
    simulateEmergencyCall,
    acceptCall,
    rejectCall,
    // Estado do modo admin
    isAdminMode,
    toggleAdminMode,
    // Funções extras
    login,
    logout,
    updateUser,
    updateActiveOccurrence,
    hasPermission,
    getAppState,
    goToHomePage
  } as any;

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
};

// Hook personalizado para verificar se o usuário está logado - atualizado
export const useAuth = () => {
  const { user } = useApp();
  return {
    isAuthenticated: !!user,
    user,
    isAluno: user?.role === 'aluno',
    isColaborador: user?.role === 'colaborador',
    isSocorrista: user?.role === 'socorrista',
    isAdministrador: user?.role === 'administrador'
  };
};

// Hook para gerenciar ocorrências - atualizado
export const useOccurrences = () => {
  const { activeOccurrence, setActiveOccurrence, updateActiveOccurrence, user, simulatedOccurrences } = useApp() as any;
  
  const createOccurrence = (occurrence: Occurrence) => {
    setActiveOccurrence(occurrence);
  };

  const closeOccurrence = () => {
    if (activeOccurrence) {
      updateActiveOccurrence({ 
        status: 'concluido' as any,
        completedAt: new Date().toISOString()
      });
    }
  };

  const canCreateOccurrence = user?.role === 'aluno' || user?.role === 'colaborador' || user?.role === 'administrador';
  const canRespondOccurrence = user?.role === 'socorrista' || user?.role === 'colaborador' || user?.role === 'administrador';
  const canSimulateCalls = user?.role === 'socorrista' || user?.role === 'administrador';
  const canManageUsers = user?.role === 'administrador';
  const canAccessReports = user?.role === 'colaborador' || user?.role === 'socorrista' || user?.role === 'administrador';

  return {
    activeOccurrence,
    simulatedOccurrences,
    createOccurrence,
    closeOccurrence,
    updateOccurrence: updateActiveOccurrence,
    canCreateOccurrence,
    canRespondOccurrence,
    canSimulateCalls,
    canManageUsers,
    canAccessReports
  };
};