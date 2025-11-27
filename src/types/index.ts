export type UserRole = 'aluno' | 'colaborador' | 'socorrista' | 'administrador';

export type OccurrenceType = 'urgencia' | 'emergencia';

export type OccurrenceStatus = 'aberto' | 'triagem' | 'em_atendimento' | 'a_caminho' | 'no_local' | 'concluido' | 'cancelado';

export type LocationMethod = 'qr_code' | 'manual' | 'gps';

export type PeopleCount = '1' | '2-3' | '3+';

export type PredefinedSymptom = 
  | 'desmaio'
  | 'dor_peito' 
  | 'dificuldade_respirar'
  | 'sangramento'
  | 'convulsao'
  | 'nausea_vomito'
  | 'dor_cabeca_intensa'
  | 'febre_alta'
  | 'dor_abdominal'
  | 'lesao_trauma'
  | 'reacao_alergica'
  | 'outro';

export interface User {
  id: string;
  name: string;
  email: string;
  ra?: string; // Registro Acadêmico para alunos
  role: UserRole;
  phone?: string;
  department?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  // Campos específicos para administradores
  permissions?: string[]; // Para administradores
  accessLevel?: 'basic' | 'advanced' | 'full'; // Para administradores
}

export interface Location {
  id: string;
  name: string;
  type: 'bloco' | 'sala' | 'laboratorio' | 'area_comum' | 'externa';
  block?: string;
  floor?: string;
  description?: string;
  qrCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isActive: boolean;
}

export interface Occurrence {
  id: string;
  userId: string;
  user: User;
  type: OccurrenceType;
  status: OccurrenceStatus;
  priority: 'baixa' | 'media' | 'alta' | 'critica';
  
  // Location info
  locationId?: string;
  location?: Location;
  locationMethod: LocationMethod;
  locationDescription?: string;
  
  // People count - NEW FIELD
  peopleCount: PeopleCount;
  
  // Symptoms and description
  symptoms: PredefinedSymptom[];
  description?: string;
  additionalInfo?: string;
  
  // Timeline
  createdAt: string;
  updatedAt: string;
  triageAt?: string;
  assignedAt?: string;
  onWayAt?: string;
  arrivedAt?: string;
  completedAt?: string;
  
  // Assignment
  assignedToId?: string;
  assignedTo?: User;
  
  // Additional responders
  responders: {
    userId: string;
    user: User;
    role: 'socorrista' | 'funcionario' | 'professor';
    status: 'notificado' | 'confirmado' | 'a_caminho' | 'no_local' | 'finalizado';
    confirmedAt?: string;
  }[];
  
  // Medical info
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    painLevel?: number; // 0-10 scale
  };
  
  // Notes and observations
  observations: {
    id: string;
    userId: string;
    user: User;
    text: string;
    type: 'triagem' | 'atendimento' | 'observacao' | 'medicacao';
    createdAt: string;
  }[];
  
  // Outcome
  outcome?: {
    diagnosis?: string;
    treatment?: string;
    referral?: string;
    followUp?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
  isTyping?: boolean;
}

export interface TriageResult {
  type: OccurrenceType;
  priority: 'baixa' | 'media' | 'alta' | 'critica';
  reasoning: string;
  immediateActions: string[];
  estimatedResponseTime: number; // in minutes
}

export interface NotificationTarget {
  role: UserRole;
  locationBased?: boolean;
  immediate?: boolean;
}

export interface SystemConfig {
  emergencyContacts: {
    samu: string;
    bombeiros: string;
    campus: string;
  };
  responseTimeTargets: {
    emergencia: number; // minutes
    urgencia: number;
  };
  autoAssignmentRules: {
    maxActiveOccurrences: number;
    distanceRadius: number; // km
  };
}

export interface LocationQRData {
  locationId: string;
  name: string;
  block?: string;
  floor?: string;
  timestamp: string;
}

// Incoming call notification type
export interface IncomingCall {
  id: string;
  occurrence: Occurrence;
  timestamp: string;
}

// App context types
export interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;

  currentPage: string;
  setCurrentPage: (page: string) => void;

  activeOccurrence: Occurrence | null;
  setActiveOccurrence: (occurrence: Occurrence | null) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Chamadas simuladas e ocorrências
  incomingCalls: IncomingCall[];
  setIncomingCalls: (calls: IncomingCall[]) => void;
  simulatedOccurrences: Occurrence[];
  setSimulatedOccurrences: (occurrences: Occurrence[]) => void;

  // Lista de respondedores disponíveis
  availableResponders: User[];

  // Funções de simulação e resposta
  simulateEmergencyCall: () => IncomingCall;
  acceptCall: (callId: string) => Occurrence | null;
  rejectCall: (callId: string) => void;
  handleCallTimeout: (callId: string) => void;

  // Estado e controle de modo admin
  isAdminMode: boolean;
  toggleAdminMode: () => void;

  // Funções de autenticação
  login: (email: string, role: string, ra?: string) => void;
  logout: () => void;

  // Atualizações e navegação
  updateUser: (updates: Partial<User>) => void;
  updateActiveOccurrence: (updates: Partial<Occurrence>) => void;
  hasPermission: (permission: string) => boolean;
  getAppState: () => any;
  goToHomePage: () => void;
}


// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Statistics and reporting types
export interface OccurrenceStats {
  total: number;
  byType: Record<OccurrenceType, number>;
  byStatus: Record<OccurrenceStatus, number>;
  byPriority: Record<string, number>;
  avgResponseTime: number;
  completionRate: number;
}

export interface DashboardStats {
  activeOccurrences: number;
  todayOccurrences: number;
  avgResponseTime: number;
  availableResponders: number;
  recentOccurrences: Occurrence[];
}

// Admin-specific types
export interface SystemUser {
  id: string;
  name: string;
  email: string;
  ra?: string;
  role: UserRole;
  phone?: string;
  department?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  permissions?: string[];
  accessLevel?: 'basic' | 'advanced' | 'full';
}

export interface UserRegistrationData {
  name: string;
  email: string;
  ra?: string;
  role: UserRole;
  phone?: string;
  department?: string;
  password: string;
  permissions?: string[];
  accessLevel?: 'basic' | 'advanced' | 'full';
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalOccurrences: number;
  monthlyOccurrences: number;
  avgResponseTime: number;
  systemUptime: number;
  totalLocations: number;
  activeSocorristas: number;
}