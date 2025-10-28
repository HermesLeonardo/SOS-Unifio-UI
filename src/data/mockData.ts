import { User, Occurrence, Location, PredefinedSymptom, ChatMessage, PeopleCount } from '../types';

// Mock Users - SOS UNIFIO
export const mockUsers: User[] = [
  // Alunos
  {
    id: '1',
    name: 'João Silva Santos',
    email: 'joao.santos@unifio.edu.br',
    ra: '123456',
    role: 'aluno',
    phone: '(11) 99999-1234',
    department: 'Engenharia',
    isActive: true,
    createdAt: '2024-01-15T08:00:00Z',
    lastLogin: '2024-08-15T09:30:00Z'
  },
  {
    id: '2',
    name: 'Maria Oliveira Costa',
    email: 'maria.costa@unifio.edu.br',
    ra: '234567',
    role: 'aluno',
    phone: '(11) 98888-5678',
    department: 'Medicina',
    isActive: true,
    createdAt: '2023-08-20T10:00:00Z',
    lastLogin: '2024-08-15T08:45:00Z'
  },
  {
    id: '9',
    name: 'Pedro Henrique Lima',
    email: 'pedro.lima@unifio.edu.br',
    ra: '345678',
    role: 'aluno',
    phone: '(11) 97777-8888',
    department: 'Administração',
    isActive: true,
    createdAt: '2024-02-10T09:00:00Z',
    lastLogin: '2024-08-15T07:15:00Z'
  },
  {
    id: '10',
    name: 'Ana Carolina Ferreira',
    email: 'ana.ferreira.aluna@unifio.edu.br',
    ra: '456789',
    role: 'aluno',
    phone: '(11) 96666-7777',
    department: 'Psicologia',
    isActive: true,
    createdAt: '2024-03-05T11:00:00Z',
    lastLogin: '2024-08-15T08:30:00Z'
  },
  {
    id: '11',
    name: 'Lucas Mendes Silva',
    email: 'lucas.mendes@unifio.edu.br',
    ra: '567890',
    role: 'aluno',
    phone: '(11) 95555-6666',
    department: 'Ciências da Computação',
    isActive: true,
    createdAt: '2024-01-20T14:00:00Z',
    lastLogin: '2024-08-15T09:45:00Z'
  },
  
  // Professores
  {
    id: '3',
    name: 'Prof. Dr. Carlos Eduardo Mendes',
    email: 'carlos.mendes@unifio.edu.br',
    role: 'professor',
    phone: '(11) 97777-9999',
    department: 'Engenharia Biomédica',
    isActive: true,
    createdAt: '2020-03-10T14:00:00Z',
    lastLogin: '2024-08-15T07:20:00Z'
  },
  {
    id: '4',
    name: 'Profa. Dra. Ana Paula Ferreira',
    email: 'ana.ferreira@unifio.edu.br',
    role: 'professor',
    phone: '(11) 96666-1111',
    department: 'Ciências da Saúde',
    isActive: true,
    createdAt: '2019-08-15T09:00:00Z',
    lastLogin: '2024-08-15T10:15:00Z'
  },
  
  // Socorristas
  {
    id: '5',
    name: 'Rafael Santos Lima',
    email: 'rafael.lima@unifio.edu.br',
    role: 'socorrista',
    phone: '(11) 95555-2222',
    department: 'Ambulatório',
    isActive: true,
    createdAt: '2021-06-01T08:00:00Z',
    lastLogin: '2024-08-15T06:00:00Z'
  },
  {
    id: '6',
    name: 'Fernanda Rodrigues Silva',
    email: 'fernanda.silva@unifio.edu.br',
    role: 'socorrista',
    phone: '(11) 94444-3333',
    department: 'Ambulatório',
    isActive: true,
    createdAt: '2022-01-10T10:00:00Z',
    lastLogin: '2024-08-15T06:30:00Z'
  },
  
  // Atendentes
  {
    id: '7',
    name: 'Patrícia Almeida Santos',
    email: 'patricia.santos@unifio.edu.br',
    role: 'atendente',
    phone: '(11) 93333-4444',
    department: 'Ambulatório',
    isActive: true,
    createdAt: '2021-09-15T11:00:00Z',
    lastLogin: '2024-08-15T08:00:00Z'
  },
  
  // Administradores
  {
    id: '8',
    name: 'Dr. Roberto Mendes Carvalho',
    email: 'roberto.carvalho@unifio.edu.br',
    role: 'administrador',
    phone: '(11) 92222-5555',
    department: 'Administração Geral',
    isActive: true,
    createdAt: '2020-01-01T08:00:00Z',
    lastLogin: '2024-08-15T07:00:00Z'
  }
];

// Mock Locations - Campus UNIFIO
export const mockLocations: Location[] = [
  // Blocos principais
  {
    id: 'loc-1',
    name: 'Bloco A - Engenharia',
    type: 'bloco',
    block: 'A',
    description: 'Bloco principal de Engenharia - Salas 101 a 350',
    qrCode: 'UNIFIO-BLOCO-A',
    coordinates: { lat: -23.5505, lng: -46.6333 },
    isActive: true
  },
  {
    id: 'loc-2',
    name: 'Bloco B - Ciências da Saúde',
    type: 'bloco',
    block: 'B',
    description: 'Bloco de Ciências da Saúde - Salas 201 a 280',
    qrCode: 'UNIFIO-BLOCO-B',
    coordinates: { lat: -23.5510, lng: -46.6340 },
    isActive: true
  },
  {
    id: 'loc-3',
    name: 'Bloco C - Administração',
    type: 'bloco',
    block: 'C',
    description: 'Bloco Administrativo - Salas 301 a 350',
    qrCode: 'UNIFIO-BLOCO-C',
    coordinates: { lat: -23.5515, lng: -46.6335 },
    isActive: true
  },
  
  // Salas específicas
  {
    id: 'loc-4',
    name: 'Laboratório de Anatomia',
    type: 'laboratorio',
    block: 'B',
    floor: '2º andar',
    description: 'Laboratório de Anatomia Humana - Sala B205',
    qrCode: 'UNIFIO-LAB-ANAT-B205',
    coordinates: { lat: -23.5510, lng: -46.6340 },
    isActive: true
  },
  {
    id: 'loc-5',
    name: 'Auditório Principal',
    type: 'area_comum',
    block: 'A',
    floor: 'Térreo',
    description: 'Auditório com capacidade para 300 pessoas',
    qrCode: 'UNIFIO-AUDIT-PRINCIPAL',
    coordinates: { lat: -23.5505, lng: -46.6333 },
    isActive: true
  },
  {
    id: 'loc-6',
    name: 'Biblioteca Central',
    type: 'area_comum',
    description: 'Biblioteca Central do Campus',
    qrCode: 'UNIFIO-BIBLIOTECA',
    coordinates: { lat: -23.5508, lng: -46.6338 },
    isActive: true
  },
  {
    id: 'loc-7',
    name: 'Quadra Poliesportiva',
    type: 'externa',
    description: 'Quadra coberta para atividades esportivas',
    qrCode: 'UNIFIO-QUADRA-POLI',
    coordinates: { lat: -23.5520, lng: -46.6345 },
    isActive: true
  },
  {
    id: 'loc-8',
    name: 'Ambulatório Médico',
    type: 'area_comum',
    block: 'B',
    floor: '1º andar',
    description: 'Ambulatório médico do campus',
    qrCode: 'UNIFIO-AMBULATORIO',
    coordinates: { lat: -23.5510, lng: -46.6340 },
    isActive: true
  }
];

// Mock Occurrences - Histórico de chamados
export const mockOccurrences: Occurrence[] = [
  {
    id: 'occ-1',
    userId: '1',
    user: mockUsers[0],
    type: 'emergencia',
    status: 'em_atendimento',
    priority: 'alta',
    locationId: 'loc-4',
    location: mockLocations[3],
    locationMethod: 'qr_code',
    peopleCount: '1', // NEW FIELD
    symptoms: ['desmaio', 'dificuldade_respirar'],
    description: 'Aluno desmaiou durante aula prática no laboratório',
    createdAt: '2024-08-15T10:30:00Z',
    updatedAt: '2024-08-15T10:45:00Z',
    triageAt: '2024-08-15T10:32:00Z',
    assignedAt: '2024-08-15T10:35:00Z',
    onWayAt: '2024-08-15T10:40:00Z',
    assignedToId: '5',
    assignedTo: mockUsers[4],
    responders: [
      {
        userId: '5',
        user: mockUsers[4],
        role: 'socorrista',
        status: 'a_caminho',
        confirmedAt: '2024-08-15T10:35:00Z'
      },
      {
        userId: '3',
        user: mockUsers[2],
        role: 'professor',
        status: 'no_local',
        confirmedAt: '2024-08-15T10:31:00Z'
      }
    ],
    vitalSigns: {
      bloodPressure: '110/70',
      heartRate: 95,
      respiratoryRate: 18,
      oxygenSaturation: 97
    },
    observations: [
      {
        id: 'obs-1',
        userId: '7',
        user: mockUsers[6],
        text: 'Chamado recebido via QR Code do laboratório de anatomia',
        type: 'triagem',
        createdAt: '2024-08-15T10:32:00Z'
      },
      {
        id: 'obs-2',
        userId: '3',
        user: mockUsers[2],
        text: 'Aluno consciente, respirando normalmente. Professor permanece no local.',
        type: 'observacao',
        createdAt: '2024-08-15T10:33:00Z'
      }
    ]
  },
  
  {
    id: 'occ-2',
    userId: '2',
    user: mockUsers[1],
    type: 'urgencia',
    status: 'concluido',
    priority: 'media',
    locationId: 'loc-6',
    location: mockLocations[5],
    locationMethod: 'manual',
    peopleCount: '1', // NEW FIELD
    symptoms: ['dor_cabeca_intensa', 'nausea_vomito'],
    description: 'Dor de cabeça forte durante estudo na biblioteca',
    createdAt: '2024-08-15T09:15:00Z',
    updatedAt: '2024-08-15T10:00:00Z',
    triageAt: '2024-08-15T09:17:00Z',
    assignedAt: '2024-08-15T09:20:00Z',
    onWayAt: '2024-08-15T09:25:00Z',
    arrivedAt: '2024-08-15T09:30:00Z',
    completedAt: '2024-08-15T10:00:00Z',
    assignedToId: '6',
    assignedTo: mockUsers[5],
    responders: [
      {
        userId: '6',
        user: mockUsers[5],
        role: 'socorrista',
        status: 'finalizado',
        confirmedAt: '2024-08-15T09:20:00Z'
      }
    ],
    vitalSigns: {
      bloodPressure: '120/80',
      heartRate: 85,
      temperature: 37.2,
      painLevel: 7
    },
    observations: [
      {
        id: 'obs-3',
        userId: '7',
        user: mockUsers[6],
        text: 'Possível enxaqueca. Verificar histórico médico.',
        type: 'triagem',
        createdAt: '2024-08-15T09:17:00Z'
      },
      {
        id: 'obs-4',
        userId: '6',
        user: mockUsers[5],
        text: 'Administrado dipirona 500mg. Sintomas melhoraram após 20 minutos.',
        type: 'medicacao',
        createdAt: '2024-08-15T09:45:00Z'
      }
    ],
    outcome: {
      diagnosis: 'Cefaleia tensional',
      treatment: 'Medicação sintomática - Dipirona 500mg',
      followUp: 'Orientado procurar clínico geral se sintomas persistirem'
    }
  },
  
  {
    id: 'occ-3',
    userId: '9',
    user: mockUsers[2], // Pedro Henrique Lima
    type: 'urgencia',
    status: 'aberto',
    priority: 'baixa',
    locationId: 'loc-7',
    location: mockLocations[6],
    locationMethod: 'gps',
    peopleCount: '2-3', // NEW FIELD - Múltiplas pessoas
    symptoms: ['lesao_trauma'],
    description: 'Entorse no tornozelo durante atividade esportiva - 2 pessoas se machucaram',
    createdAt: '2024-08-15T11:00:00Z',
    updatedAt: '2024-08-15T11:00:00Z',
    responders: [],
    observations: []
  }
];

// Sintomas predefinidos com labels
export const symptomLabels: Record<PredefinedSymptom, string> = {
  desmaio: 'Desmaio / Perda de consciência',
  dor_peito: 'Dor no peito',
  dificuldade_respirar: 'Dificuldade para respirar',
  sangramento: 'Sangramento',
  convulsao: 'Convulsão',
  nausea_vomito: 'Náusea / Vômito',
  dor_cabeca_intensa: 'Dor de cabeça intensa',
  febre_alta: 'Febre alta',
  dor_abdominal: 'Dor abdominal',
  lesao_trauma: 'Lesão / Trauma',
  reacao_alergica: 'Reação alérgica',
  outro: 'Outro'
};

// Labels para quantidade de pessoas
export const peopleCountLabels: Record<PeopleCount, string> = {
  '1': '1 pessoa',
  '2-3': '2 a 3 pessoas',
  '3+': 'Mais de 3 pessoas'
};

// Sintomas críticos que geram emergência automática
export const criticalSymptoms: PredefinedSymptom[] = [
  'desmaio',
  'dor_peito',
  'dificuldade_respirar',
  'convulsao',
  'sangramento',
  'reacao_alergica'
];

// Mock chat messages para demonstração
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'bot',
    content: 'Olá! Sou o assistente médico do SOS UNIFIO. Vou te ajudar enquanto aguarda o socorrista. Como você está se sentindo agora?',
    timestamp: '2024-08-15T10:31:00Z'
  },
  {
    id: 'msg-2',
    role: 'user',
    content: 'Ainda estou um pouco tonto, mas melhor que antes.',
    timestamp: '2024-08-15T10:32:00Z'
  },
  {
    id: 'msg-3',
    role: 'bot',
    content: 'Isso é bom! Continue sentado ou deitado se possível. Evite movimentos bruscos. Alguém está com você no local?',
    timestamp: '2024-08-15T10:32:30Z'
  },
  {
    id: 'msg-4',
    role: 'user',
    content: 'Sim, o professor está aqui comigo.',
    timestamp: '2024-08-15T10:33:00Z'
  }
];

// Configurações do sistema
export const systemConfig = {
  emergencyContacts: {
    samu: '192',
    bombeiros: '193',
    campus: '(11) 4000-1234'
  },
  responseTimeTargets: {
    emergencia: 3, // 3 minutos
    urgencia: 10   // 10 minutos
  },
  autoAssignmentRules: {
    maxActiveOccurrences: 3,
    distanceRadius: 2 // 2km
  }
};

// Função utilitária para classificar automaticamente ocorrências
export const classifyOccurrence = (symptoms: PredefinedSymptom[], peopleCount?: PeopleCount): { type: 'urgencia' | 'emergencia', priority: 'baixa' | 'media' | 'alta' | 'critica' } => {
  const hasCriticalSymptoms = symptoms.some(symptom => criticalSymptoms.includes(symptom));
  const isMultiplePeople = peopleCount === '2-3' || peopleCount === '3+';
  
  if (hasCriticalSymptoms || peopleCount === '3+') {
    return { type: 'emergencia', priority: 'critica' };
  }
  
  if (isMultiplePeople || symptoms.length >= 3) {
    return { type: 'urgencia', priority: 'alta' };
  }
  
  if (symptoms.length >= 2) {
    return { type: 'urgencia', priority: 'media' };
  }
  
  return { type: 'urgencia', priority: 'baixa' };
};