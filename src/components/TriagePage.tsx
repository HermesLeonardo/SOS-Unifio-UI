import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useApp } from '../contexts/AppContext';
import { mockOccurrences, mockUsers, symptomLabels } from '../data/mockData';
import { OccurrenceStatus } from '../types';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Clock, 
  User, 
  MapPin, 
  Phone,
  CheckCircle,
  UserCheck,
  RefreshCw,
  Activity,
  Users,
  Heart
} from 'lucide-react';

const TriagePage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [selectedOccurrence, setSelectedOccurrence] = useState<string | null>(null);
  const [selectedSocorrista, setSelectedSocorrista] = useState('');
  const [notes, setNotes] = useState('');

  const availableSocorristas = mockUsers.filter(u => u.role === 'socorrista');

  const getStatusColor = (status: OccurrenceStatus) => {
    switch (status) {
      case 'aberto': return 'bg-red-100 text-red-700 border-red-200';
      case 'triagem': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'em_atendimento': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'a_caminho': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'no_local': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'concluido': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelado': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status: OccurrenceStatus) => {
    switch (status) {
      case 'aberto': return 'Aberto';
      case 'triagem': return 'Em Triagem';
      case 'em_atendimento': return 'Em Atendimento';
      case 'a_caminho': return 'A Caminho';
      case 'no_local': return 'No Local';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergencia': return 'bg-emergency-critical text-white';
      case 'urgencia': return 'bg-emergency-urgent text-white';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleAssignSocorrista = (occurrenceId: string) => {
    if (!selectedSocorrista) return;
    
    console.log(`Atribuindo socorrista ${selectedSocorrista} para ocorrência ${occurrenceId}`);
    setSelectedOccurrence(null);
    setSelectedSocorrista('');
    setNotes('');
  };

  const handleUpdatePriority = (occurrenceId: string, newPriority: string) => {
    console.log(`Atualizando prioridade da ocorrência ${occurrenceId} para ${newPriority}`);
  };

  const activeOccurrences = mockOccurrences.filter(o => 
    ['aberto', 'triagem', 'em_atendimento', 'a_caminho', 'no_local'].includes(o.status)
  );

  const priorityOrder = { 'critica': 0, 'alta': 1, 'media': 2, 'baixa': 3 };
  const sortedOccurrences = activeOccurrences.sort((a, b) => {
    const priorityDiff = (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) - (priorityOrder[b.priority as keyof typeof priorityOrder] || 3);
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return (
    <div className="min-h-screen bg-slate-50">
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
                    Central de Triagem - SOS UNIFIO
                  </h1>
                  <p className="text-sm text-slate-600">
                    Gerenciamento e priorização de ocorrências médicas
                  </p>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-300 hover:bg-slate-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Estatísticas */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Aguardando Triagem</CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-slate-900">
                  {sortedOccurrences.filter(o => o.status === 'aberto').length}
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Necessitam análise
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Emergências</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-red-600">
                  {sortedOccurrences.filter(o => o.type === 'emergencia').length}
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Atendimento imediato
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Em Atendimento</CardTitle>
                <UserCheck className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-blue-600">
                  {sortedOccurrences.filter(o => ['em_atendimento', 'a_caminho', 'no_local'].includes(o.status)).length}
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Socorristas ativos
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Socorristas Disponíveis</CardTitle>
                <Users className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-green-600">{availableSocorristas.length}</div>
                <p className="text-xs text-slate-600 mt-1">
                  Prontos para atender
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Ocorrências */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Activity className="w-5 h-5" />
                  Ocorrências Ativas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sortedOccurrences.map((occurrence) => (
                  <div key={occurrence.id} className="border border-slate-200 rounded-lg p-4 space-y-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <Badge className={`${getTypeColor(occurrence.type)} border px-2 py-1 text-xs`}>
                            {occurrence.type.toUpperCase()}
                          </Badge>
                          <Badge className={`${getPriorityColor(occurrence.priority)} border px-2 py-1 text-xs`}>
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {occurrence.priority.toUpperCase()}
                          </Badge>
                          <Badge className={`${getStatusColor(occurrence.status)} border px-2 py-1 text-xs`}>
                            {getStatusLabel(occurrence.status)}
                          </Badge>
                        </div>
                        
                        <div>
                          <p className="text-slate-900 font-medium">
                            {occurrence.symptoms.map(symptom => symptomLabels[symptom]).join(', ')}
                          </p>
                          {occurrence.description && (
                            <p className="text-sm text-slate-600 mt-1">
                              {occurrence.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {occurrence.location?.name || 'Local não informado'}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {occurrence.user.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(occurrence.createdAt).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <Badge variant="outline" className="text-xs">
                          {Math.floor((Date.now() - new Date(occurrence.createdAt).getTime()) / 60000)}min
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2 border-t border-slate-100">
                      <Select
                        value={occurrence.priority}
                        onValueChange={(value: string) => handleUpdatePriority(occurrence.id, value)}
                      >
                        <SelectTrigger className="w-32 h-9 border-slate-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baixa">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Baixa
                            </div>
                          </SelectItem>
                          <SelectItem value="media">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              Média
                            </div>
                          </SelectItem>
                          <SelectItem value="alta">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              Alta
                            </div>
                          </SelectItem>
                          <SelectItem value="critica">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              Crítica
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      {occurrence.status === 'aberto' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              onClick={() => setSelectedOccurrence(occurrence.id)}
                              className="bg-unifio-primary hover:bg-unifio-primary/90 text-white h-9"
                            >
                              Atribuir
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Atribuir Socorrista</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Socorrista:</label>
                                <Select value={selectedSocorrista} onValueChange={setSelectedSocorrista}>
                                  <SelectTrigger className="h-11 border-slate-300">
                                    <SelectValue placeholder="Selecionar socorrista" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableSocorristas.map((socorrista) => (
                                      <SelectItem key={socorrista.id} value={socorrista.id}>
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-green-600" />
                                          </div>
                                          <div>
                                            <div className="font-medium">{socorrista.name}</div>
                                            <div className="text-xs text-green-600">Disponível</div>
                                          </div>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Observações:</label>
                                <Textarea
                                  placeholder="Instruções ou observações para o socorrista..."
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                  rows={3}
                                  className="border-slate-300 focus:border-unifio-primary focus:ring-unifio-primary/20"
                                />
                              </div>

                              <div className="flex gap-3 pt-4">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setSelectedOccurrence(null)}
                                  className="flex-1 border-slate-300"
                                >
                                  Cancelar
                                </Button>
                                <Button 
                                  onClick={() => handleAssignSocorrista(occurrence.id)}
                                  className="flex-1 bg-unifio-primary hover:bg-unifio-primary/90 text-white"
                                  disabled={!selectedSocorrista}
                                >
                                  Atribuir
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}

                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-slate-300 hover:bg-slate-50 h-9"
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {sortedOccurrences.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                    <p className="font-medium">Nenhuma ocorrência ativa</p>
                    <p className="text-sm">Sistema funcionando normalmente</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Socorristas */}
          <div>
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Users className="w-5 h-5" />
                  Equipe Disponível
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableSocorristas.map((socorrista) => (
                  <div key={socorrista.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{socorrista.name}</p>
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Disponível
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      Livre
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriagePage;