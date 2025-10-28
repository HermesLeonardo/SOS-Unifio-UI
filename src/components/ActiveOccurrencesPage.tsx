import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useApp } from '../contexts/AppContext';
import { mockOccurrences, symptomLabels, peopleCountLabels } from '../data/mockData';
import TestCallButton from './TestCallButton';
import EmergencyCallNotification from './EmergencyCallNotification';
import { 
  ArrowLeft, 
  Search,
  MapPin, 
  User, 
  Clock, 
  AlertTriangle,
  Heart,
  Filter,
  Users,
  UserPlus,
  Stethoscope
} from 'lucide-react';

const ActiveOccurrencesPage: React.FC = () => {
  const { user, setCurrentPage, simulatedOccurrences } = useApp() as any;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedOccurrence, setSelectedOccurrence] = useState<any>(null);

  // Combinar ocorrências simuladas com mock data
  const allOccurrences = simulatedOccurrences && simulatedOccurrences.length > 0 
    ? [...simulatedOccurrences, ...mockOccurrences] 
    : mockOccurrences;

  // Filtrar apenas ocorrências ativas (não concluídas)
  const activeOccurrences = allOccurrences.filter(occurrence => 
    occurrence.status !== 'concluido'
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto': 
      case 'triagem': 
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'em_atendimento': 
      case 'a_caminho': 
      case 'no_local': 
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'concluido': 
        return 'bg-green-100 text-green-700 border-green-200';
      default: 
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aberto': return 'Aguardando';
      case 'triagem': return 'Em Triagem';
      case 'em_atendimento': return 'Designado';
      case 'a_caminho': return 'A Caminho';
      case 'no_local': return 'No Local';
      case 'concluido': return 'Concluído';
      default: return status;
    }
  };

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
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins}min`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}min`;
    }
  };

  const filteredOccurrences = activeOccurrences.filter(occurrence => {
    const matchesSearch = occurrence.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occurrence.location?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occurrence.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || occurrence.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || occurrence.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const criticalOccurrences = filteredOccurrences.filter(o => o.priority === 'critica');

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
                    Chamados Ativos - SOS UNIFIO
                  </h1>
                  <p className="text-sm text-slate-600">
                    Ocorrências aguardando atendimento
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-600">
                  {user?.role === 'socorrista' && 'Socorrista'}
                  {user?.role === 'professor' && 'Professor'}
                  {user?.role === 'colaborador' && 'Colaborador'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Chamados - Master */}
          <div className="lg:col-span-1 space-y-6">
            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Ativos</p>
                      <p className="text-xl font-semibold text-slate-900">{filteredOccurrences.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Críticos</p>
                      <p className="text-xl font-semibold text-slate-900">{criticalOccurrences.length}</p>
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
                  Filtros
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

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="aberto">Aguardando</SelectItem>
                    <SelectItem value="em_atendimento">Designado</SelectItem>
                    <SelectItem value="a_caminho">A Caminho</SelectItem>
                    <SelectItem value="no_local">No Local</SelectItem>
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

            {/* Lista de Chamados */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredOccurrences.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Heart className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <h3 className="font-medium text-slate-900 mb-2">Nenhum chamado ativo</h3>
                    <p className="text-sm text-slate-600">Não há ocorrências aguardando atendimento no momento</p>
                  </CardContent>
                </Card>
              ) : (
                filteredOccurrences.map((occurrence) => (
                  <Card 
                    key={occurrence.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedOccurrence?.id === occurrence.id 
                        ? 'ring-2 ring-unifio-primary bg-blue-50' 
                        : 'hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedOccurrence(occurrence)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex gap-2">
                          <Badge className={`${getStatusColor(occurrence.status)} border text-xs`}>
                            {getStatusLabel(occurrence.status)}
                          </Badge>
                          <Badge className={`${getPriorityColor(occurrence.priority)} border text-xs`}>
                            {occurrence.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-xs text-slate-500">
                          {getTimeElapsed(occurrence.createdAt)}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-3 h-3 text-slate-400" />
                          <span className="font-medium truncate">{occurrence.user.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{occurrence.location?.name || 'Local não informado'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          {occurrence.peopleCount === '1' && <User className="w-3 h-3 text-slate-400" />}
                          {occurrence.peopleCount === '2-3' && <Users className="w-3 h-3 text-slate-400" />}
                          {occurrence.peopleCount === '3+' && <UserPlus className="w-3 h-3 text-slate-400" />}
                          <span className="truncate">{peopleCountLabels[occurrence.peopleCount]}</span>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {occurrence.symptoms.slice(0, 2).map(symptom => (
                          <Badge key={symptom} variant="secondary" className="text-xs">
                            {symptomLabels[symptom]}
                          </Badge>
                        ))}
                        {occurrence.symptoms.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{occurrence.symptoms.length - 2}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Detalhes do Chamado - Detail */}
          <div className="lg:col-span-2">
            {selectedOccurrence ? (
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-unifio-primary" />
                        Detalhes do Chamado
                      </CardTitle>
                      <p className="text-sm text-slate-600 mt-1">
                        Protocolo #{selectedOccurrence.id.toUpperCase().slice(-6)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`${getStatusColor(selectedOccurrence.status)} border`}>
                        {getStatusLabel(selectedOccurrence.status)}
                      </Badge>
                      <Badge className={`${getPriorityColor(selectedOccurrence.priority)} border`}>
                        PRIORIDADE {selectedOccurrence.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Informações Básicas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-3">Solicitante</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-600" />
                            <span className="font-medium">{selectedOccurrence.user.name}</span>
                          </div>
                          <div className="text-sm text-slate-600">
                            {selectedOccurrence.user.role === 'aluno' && selectedOccurrence.user.ra && (
                              <p>RA: {selectedOccurrence.user.ra}</p>
                            )}
                            <p>Email: {selectedOccurrence.user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-900 mb-3">Localização</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-600" />
                            <span>{selectedOccurrence.location?.name}</span>
                          </div>
                          {selectedOccurrence.locationDescription && (
                            <p className="text-sm text-slate-600 ml-6">
                              "{selectedOccurrence.locationDescription}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-3">Horário</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-600" />
                            <span>{new Date(selectedOccurrence.createdAt).toLocaleString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-600" />
                            <span className="text-sm text-slate-600">{getTimeElapsed(selectedOccurrence.createdAt)} atrás</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-900 mb-3">Pessoas que Precisam de Atendimento</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {selectedOccurrence.peopleCount === '1' && <User className="w-4 h-4 text-slate-600" />}
                            {selectedOccurrence.peopleCount === '2-3' && <Users className="w-4 h-4 text-slate-600" />}
                            {selectedOccurrence.peopleCount === '3+' && <UserPlus className="w-4 h-4 text-slate-600" />}
                            <span>{peopleCountLabels[selectedOccurrence.peopleCount]}</span>
                          </div>
                          {(selectedOccurrence.peopleCount === '2-3' || selectedOccurrence.peopleCount === '3+') && (
                            <p className="text-sm text-orange-600 ml-6 font-medium">
                              ⚠️ Múltiplas pessoas - considere recursos adicionais
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sintomas */}
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Sintomas Relatados</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedOccurrence.symptoms.map((symptom: string) => (
                        <Badge key={symptom} variant="secondary">
                          {symptomLabels[symptom]}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Descrição */}
                  {selectedOccurrence.description && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-3">Descrição da Situação</h4>
                      <p className="text-slate-700 bg-slate-50 p-4 rounded-lg">
                        {selectedOccurrence.description}
                      </p>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="border-t pt-6">
                    <div className="flex gap-3">
                      <Button className="bg-unifio-primary hover:bg-unifio-primary/90 text-white">
                        Aceitar Chamado
                      </Button>
                      <Button variant="outline">
                        Atribuir a Outro Socorrista
                      </Button>
                      <Button variant="outline">
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
                    <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      Selecione um chamado
                    </h3>
                    <p className="text-slate-600">
                      Clique em um chamado da lista para ver os detalhes completos
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

export default ActiveOccurrencesPage;