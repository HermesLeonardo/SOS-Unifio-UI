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
import CallCompletionForm from './CallCompletionForm';
import { 
  ArrowLeft, 
  Search,
  MapPin, 
  User, 
  Clock, 
  AlertTriangle,
  Phone,
  Navigation,
  Heart,
  Filter,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Users,
  Stethoscope,
  FileText,
  Calendar,
  ClipboardCheck,
  UserPlus
} from 'lucide-react';

const MyAssignmentsPage: React.FC = () => {
  const { user, setCurrentPage, simulatedOccurrences } = useApp() as any;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [showCompletionForm, setShowCompletionForm] = useState(false);

  // Combinar ocorrências simuladas com mock data
  const allOccurrences = simulatedOccurrences && simulatedOccurrences.length > 0 
    ? [...simulatedOccurrences, ...mockOccurrences] 
    : mockOccurrences;

  // Filtrar ocorrências atribuídas ao socorrista atual
  const myAssignments = allOccurrences.filter(occurrence => 
    occurrence.assignedTo?.id === user?.id || 
    occurrence.responders?.some(responder => responder.id === user?.id)
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

  const filteredAssignments = myAssignments.filter(assignment => {
    const matchesSearch = assignment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.location?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || assignment.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const activeAssignments = filteredAssignments.filter(a => a.status !== 'concluido');
  const completedAssignments = filteredAssignments.filter(a => a.status === 'concluido');

  const handleUpdateStatus = (newStatus: string) => {
    if (selectedAssignment) {
      const updatedAssignment = {
        ...selectedAssignment,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
      setSelectedAssignment(updatedAssignment);
    }
  };

  const handleCompleteCall = () => {
    setShowCompletionForm(true);
  };

  const handleCompletionFormClose = () => {
    setShowCompletionForm(false);
  };

  const handleCompletionFormComplete = () => {
    setShowCompletionForm(false);
    // Atualizar o assignment para concluído
    if (selectedAssignment) {
      setSelectedAssignment({
        ...selectedAssignment,
        status: 'concluido',
        completedAt: new Date().toISOString()
      });
    }
  };

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
                    Meus Atendimentos - SOS UNIFIO
                  </h1>
                  <p className="text-sm text-slate-600">
                    Chamados atribuídos a você
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
          {/* Lista de Atendimentos - Master */}
          <div className="lg:col-span-1 space-y-6">
            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Play className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Ativos</p>
                      <p className="text-xl font-semibold text-slate-900">{activeAssignments.length}</p>
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
                      <p className="text-xl font-semibold text-slate-900">{completedAssignments.length}</p>
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
                    <SelectItem value="concluido">Concluído</SelectItem>
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

            {/* Lista de Atendimentos */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredAssignments.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Heart className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <h3 className="font-medium text-slate-900 mb-2">Nenhum atendimento encontrado</h3>
                    <p className="text-sm text-slate-600">Não há chamados atribuídos a você no momento</p>
                  </CardContent>
                </Card>
              ) : (
                filteredAssignments.map((assignment) => (
                  <Card 
                    key={assignment.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedAssignment?.id === assignment.id 
                        ? 'ring-2 ring-unifio-primary bg-blue-50' 
                        : 'hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedAssignment(assignment)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex gap-2">
                          <Badge className={`${getStatusColor(assignment.status)} border text-xs`}>
                            {getStatusLabel(assignment.status)}
                          </Badge>
                          <Badge className={`${getPriorityColor(assignment.priority)} border text-xs`}>
                            {assignment.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-xs text-slate-500">
                          {getTimeElapsed(assignment.createdAt)}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-3 h-3 text-slate-400" />
                          <span className="font-medium truncate">{assignment.user.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{assignment.location?.name || 'Local não informado'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          {assignment.peopleCount === '1' && <User className="w-3 h-3 text-slate-400" />}
                          {assignment.peopleCount === '2-3' && <Users className="w-3 h-3 text-slate-400" />}
                          {assignment.peopleCount === '3+' && <UserPlus className="w-3 h-3 text-slate-400" />}
                          <span className="truncate">{peopleCountLabels[assignment.peopleCount]}</span>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {assignment.symptoms.slice(0, 2).map(symptom => (
                          <Badge key={symptom} variant="secondary" className="text-xs">
                            {symptomLabels[symptom]}
                          </Badge>
                        ))}
                        {assignment.symptoms.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{assignment.symptoms.length - 2}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Detalhes do Atendimento - Detail */}
          <div className="lg:col-span-2">
            {selectedAssignment ? (
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-unifio-primary" />
                        Detalhes do Atendimento
                      </CardTitle>
                      <p className="text-sm text-slate-600 mt-1">
                        Protocolo #{selectedAssignment.id.toUpperCase().slice(-6)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`${getStatusColor(selectedAssignment.status)} border`}>
                        {getStatusLabel(selectedAssignment.status)}
                      </Badge>
                      <Badge className={`${getPriorityColor(selectedAssignment.priority)} border`}>
                        PRIORIDADE {selectedAssignment.priority.toUpperCase()}
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
                            <span className="font-medium">{selectedAssignment.user.name}</span>
                          </div>
                          <div className="text-sm text-slate-600">
                            {selectedAssignment.user.role === 'aluno' && selectedAssignment.user.ra && (
                              <p>RA: {selectedAssignment.user.ra}</p>
                            )}
                            <p>Email: {selectedAssignment.user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-900 mb-3">Localização</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-600" />
                            <span>{selectedAssignment.location?.name}</span>
                          </div>
                          {selectedAssignment.locationDescription && (
                            <p className="text-sm text-slate-600 ml-6">
                              "{selectedAssignment.locationDescription}"
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
                            <span>{new Date(selectedAssignment.createdAt).toLocaleString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Navigation className="w-4 h-4 text-slate-600" />
                            <span className="text-sm text-slate-600">{getTimeElapsed(selectedAssignment.createdAt)} atrás</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-900 mb-3">Atribuição</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-600" />
                            <span>Atribuído a você</span>
                          </div>
                          {selectedAssignment.assignedAt && (
                            <p className="text-sm text-slate-600 ml-6">
                              Em {new Date(selectedAssignment.assignedAt).toLocaleString('pt-BR')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pessoas Envolvidas */}
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Pessoas que Precisam de Atendimento</h4>
                    <div className="flex items-center gap-2 mb-2">
                      {selectedAssignment.peopleCount === '1' && <User className="w-5 h-5 text-slate-600" />}
                      {selectedAssignment.peopleCount === '2-3' && <Users className="w-5 h-5 text-slate-600" />}
                      {selectedAssignment.peopleCount === '3+' && <UserPlus className="w-5 h-5 text-slate-600" />}
                      <span className="font-medium">{peopleCountLabels[selectedAssignment.peopleCount]}</span>
                    </div>
                    {(selectedAssignment.peopleCount === '2-3' || selectedAssignment.peopleCount === '3+') && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <p className="text-sm text-orange-800 font-medium">
                          ⚠️ Múltiplas pessoas envolvidas - considere mobilizar recursos adicionais
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Sintomas */}
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Sintomas Relatados</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAssignment.symptoms.map((symptom: string) => (
                        <Badge key={symptom} variant="secondary">
                          {symptomLabels[symptom]}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Descrição */}
                  {selectedAssignment.description && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-3">Descrição da Situação</h4>
                      <p className="text-slate-700 bg-slate-50 p-4 rounded-lg">
                        {selectedAssignment.description}
                      </p>
                    </div>
                  )}

                  {/* Atualizar Status */}
                  {selectedAssignment.status !== 'concluido' && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-3">Atualizar Status</h4>
                      <div className="flex gap-2 flex-wrap">
                        {selectedAssignment.status === 'em_atendimento' && (
                          <Button
                            onClick={() => handleUpdateStatus('a_caminho')}
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            <Navigation className="w-4 h-4 mr-2" />
                            Estou a Caminho
                          </Button>
                        )}
                        
                        {selectedAssignment.status === 'a_caminho' && (
                          <Button
                            onClick={() => handleUpdateStatus('no_local')}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            Chegue no Local
                          </Button>
                        )}
                        
                        {selectedAssignment.status === 'no_local' && (
                          <Button
                            onClick={() => handleUpdateStatus('concluido')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Concluir Atendimento
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="border-t pt-6">
                    <div className="flex gap-3">
                      <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                        <Phone className="w-4 h-4 mr-2" />
                        Ligar para Solicitante
                      </Button>

                      <Button variant="outline">
                        <Navigation className="w-4 h-4 mr-2" />
                        Ver no Mapa
                      </Button>

                      <Button variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Adicionar Observação
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <Stethoscope className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      Selecione um atendimento
                    </h3>
                    <p className="text-slate-600">
                      Clique em um atendimento da lista para ver os detalhes e atualizar o status
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Conclusão */}
      {showCompletionForm && selectedAssignment && (
        <CallCompletionForm
          occurrence={selectedAssignment}
          onComplete={handleCompletionFormComplete}
          onCancel={handleCompletionFormClose}
        />
      )}
    </div>
  );
};

export default MyAssignmentsPage;