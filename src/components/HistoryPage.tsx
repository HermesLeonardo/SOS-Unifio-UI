import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useApp } from '../contexts/AppContext';
import { mockOccurrences, symptomLabels } from '../data/mockData';
import TestCallButton from './TestCallButton';
import EmergencyCallNotification from './EmergencyCallNotification';
import { 
  ArrowLeft, 
  Search,
  MapPin, 
  User, 
  Clock, 
  AlertTriangle,
  Calendar,
  TrendingUp,
  Heart,
  Filter,
  CheckCircle,
  BarChart3,
  FileText,
  Users,
  Stethoscope,
  Navigation
} from 'lucide-react';

const HistoryPage: React.FC = () => {
  const { user, setCurrentPage, simulatedOccurrences } = useApp() as any;
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // Combinar ocorrências simuladas com mock data
  const allOccurrences = simulatedOccurrences && simulatedOccurrences.length > 0 
    ? [...simulatedOccurrences, ...mockOccurrences] 
    : mockOccurrences;

  // Filtrar histórico de ocorrências do socorrista
  const myHistory = allOccurrences.filter(occurrence => 
    occurrence.assignedTo?.id === user?.id || 
    occurrence.responders?.some(responder => responder.id === user?.id)
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critica': return 'bg-red-100 text-red-700 border-red-200';
      case 'alta': return 'bg-red-100 text-red-700 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'baixa': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTimeElapsed = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hoje';
    } else if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays < 7) {
      return `${diffDays} dias atrás`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} semana${weeks > 1 ? 's' : ''} atrás`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months} m${months > 1 ? 'eses' : 'ês'} atrás`;
    }
  };

  const filterByPeriod = (occurrence: any) => {
    if (periodFilter === 'all') return true;
    
    const now = new Date();
    const occurrenceDate = new Date(occurrence.createdAt);
    const diffDays = Math.floor((now.getTime() - occurrenceDate.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (periodFilter) {
      case 'today': return diffDays === 0;
      case 'week': return diffDays <= 7;
      case 'month': return diffDays <= 30;
      case 'quarter': return diffDays <= 90;
      default: return true;
    }
  };

  const filteredHistory = myHistory.filter(occurrence => {
    const matchesSearch = occurrence.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occurrence.location?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occurrence.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPeriod = filterByPeriod(occurrence);
    const matchesPriority = priorityFilter === 'all' || occurrence.priority === priorityFilter;
    
    return matchesSearch && matchesPeriod && matchesPriority;
  });

  // Estatísticas do histórico
  const totalAtendimentos = myHistory.length;
  const atendimentosConcluidos = myHistory.filter(h => h.status === 'concluido').length;
  const tempoMedioResposta = '8.5'; // Simulado
  const atendimentosCriticos = myHistory.filter(h => h.priority === 'critica').length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Notificações de Chamados */}
      <EmergencyCallNotification />
      
      {/* Botão de Teste para Socorristas */}
      <TestCallButton />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCurrentPage('dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-emergency-critical" />
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">
                    Histórico de Atendimentos - SOS UNIFIO
                  </h1>
                  <p className="text-sm text-slate-600">
                    Seu registro completo de atendimentos realizados
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-600">Socorrista</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Histórico - Master */}
          <div className="lg:col-span-1 space-y-6">
            {/* Estatísticas do Período */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total</p>
                      <p className="text-xl font-semibold text-slate-900">{totalAtendimentos}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Concluídos</p>
                      <p className="text-xl font-semibold text-slate-900">{atendimentosConcluidos}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros de Histórico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Select value={periodFilter} onValueChange={setPeriodFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Períodos</SelectItem>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="week">Esta Semana</SelectItem>
                    <SelectItem value="month">Este Mês</SelectItem>
                    <SelectItem value="quarter">Últimos 3 Meses</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Prioridades</SelectItem>
                    <SelectItem value="critica">Crítica</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Lista de Histórico */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredHistory.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <h3 className="font-medium text-slate-900 mb-2">Nenhum registro encontrado</h3>
                    <p className="text-sm text-slate-600">Não há atendimentos no período selecionado</p>
                  </CardContent>
                </Card>
              ) : (
                filteredHistory.map((record) => (
                  <Card 
                    key={record.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedRecord?.id === record.id 
                        ? 'ring-2 ring-unifio-primary bg-blue-50' 
                        : 'hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedRecord(record)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex gap-2">
                          <Badge className={`${record.status === 'concluido' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-700 border-slate-200'} border text-xs`}>
                            {record.status === 'concluido' ? 'Concluído' : 'Em Andamento'}
                          </Badge>
                          <Badge className={`${getPriorityColor(record.priority)} border text-xs`}>
                            {record.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-xs text-slate-500">
                          {getTimeElapsed(record.createdAt)}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-3 h-3 text-slate-400" />
                          <span className="font-medium truncate">{record.user.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{record.location?.name || 'Local não informado'}</span>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {record.symptoms.slice(0, 2).map(symptom => (
                          <Badge key={symptom} variant="secondary" className="text-xs">
                            {symptomLabels[symptom]}
                          </Badge>
                        ))}
                        {record.symptoms.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{record.symptoms.length - 2}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Detalhes do Histórico - Detail */}
          <div className="lg:col-span-2">
            {selectedRecord ? (
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-slate-600" />
                        Detalhes do Atendimento Histórico
                      </CardTitle>
                      <p className="text-sm text-slate-600 mt-1">
                        Protocolo #{selectedRecord.id.toUpperCase().slice(-6)} • {new Date(selectedRecord.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`${selectedRecord.status === 'concluido' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-700 border-slate-200'} border`}>
                        {selectedRecord.status === 'concluido' ? 'Concluído' : 'Em Andamento'}
                      </Badge>
                      <Badge className={`${getPriorityColor(selectedRecord.priority)} border`}>
                        PRIORIDADE {selectedRecord.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Informações do Solicitante */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-3">Solicitante</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-600" />
                            <span className="font-medium">{selectedRecord.user.name}</span>
                          </div>
                          <div className="text-sm text-slate-600">
                            {selectedRecord.user.role === 'aluno' && selectedRecord.user.ra && (
                              <p>RA: {selectedRecord.user.ra}</p>
                            )}
                            <p>Email: {selectedRecord.user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-900 mb-3">Localização</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-600" />
                            <span>{selectedRecord.location?.name}</span>
                          </div>
                          {selectedRecord.locationDescription && (
                            <p className="text-sm text-slate-600 ml-6">
                              "{selectedRecord.locationDescription}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-3">Timeline do Atendimento</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-600" />
                            <div>
                              <p className="font-medium text-sm">Criado em</p>
                              <p className="text-sm text-slate-600">{new Date(selectedRecord.createdAt).toLocaleString('pt-BR')}</p>
                            </div>
                          </div>
                          
                          {selectedRecord.assignedAt && (
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-slate-600" />
                              <div>
                                <p className="font-medium text-sm">Atribuído em</p>
                                <p className="text-sm text-slate-600">{new Date(selectedRecord.assignedAt).toLocaleString('pt-BR')}</p>
                              </div>
                            </div>
                          )}
                          
                          {selectedRecord.completedAt && (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <div>
                                <p className="font-medium text-sm">Concluído em</p>
                                <p className="text-sm text-slate-600">{new Date(selectedRecord.completedAt).toLocaleString('pt-BR')}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-900 mb-3">Métricas</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Duração total:</span>
                            <span className="font-medium text-sm">{Math.floor(Math.random() * 45 + 15)}min</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Tempo resposta:</span>
                            <span className="font-medium text-sm">{Math.floor(Math.random() * 10 + 3)}min</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Resultado:</span>
                            <Badge className="bg-green-100 text-green-700 text-xs">Bem-sucedido</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sintomas */}
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Sintomas Relatados</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecord.symptoms.map((symptom: string) => (
                        <Badge key={symptom} variant="secondary">
                          {symptomLabels[symptom]}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Descrição */}
                  {selectedRecord.description && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-3">Descrição da Situação</h4>
                      <p className="text-slate-700 bg-slate-50 p-4 rounded-lg">
                        {selectedRecord.description}
                      </p>
                    </div>
                  )}

                  {/* Observações */}
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Observações do Atendimento</h4>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-sm text-slate-700 mb-2">
                        • Paciente encontrado consciente e responsivo
                      </p>
                      <p className="text-sm text-slate-700 mb-2">
                        • Sinais vitais estáveis durante todo o atendimento
                      </p>
                      <p className="text-sm text-slate-700">
                        • Situação resolvida com sucesso, paciente liberado
                      </p>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="border-t pt-6">
                    <div className="flex gap-3">
                      <Button variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Exportar Relatório
                      </Button>

                      <Button variant="outline">
                        <Navigation className="w-4 h-4 mr-2" />
                        Ver no Mapa
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      Selecione um registro
                    </h3>
                    <p className="text-slate-600">
                      Clique em um atendimento da lista para ver o histórico completo
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;