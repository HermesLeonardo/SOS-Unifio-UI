import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useApp } from '../contexts/AppContext';
import { mockOccurrences, symptomLabels } from '../data/mockData';
import MedicalChatBot from './MedicalChatBot';
import CallCompletionForm from './CallCompletionForm';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Phone,
  MessageSquare,
  Activity,
  Timer,
  Stethoscope,
  Navigation,
  Heart,
  UserCheck,
  Shield,
  ClipboardCheck,
  Send
} from 'lucide-react';

const OccurrenceStatusPage: React.FC = () => {
  const { user, setCurrentPage, activeOccurrence } = useApp();
  const [showChat, setShowChat] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  
  // Usar ocorrência ativa ou a primeira da lista para demonstração
  const occurrence = activeOccurrence || mockOccurrences[0];
  
  // Estados simplificados: apenas 3 etapas
  const statusSteps = [
    { 
      key: 'aberto', 
      label: 'Chamado Recebido', 
      description: 'Sua solicitação foi recebida pelo sistema',
      completed: true 
    },
    { 
      key: 'aceito', 
      label: 'Chamado Aceito', 
      description: 'Socorrista designado e a caminho',
      completed: ['em_atendimento', 'a_caminho', 'no_local', 'concluido'].includes(occurrence.status) 
    },
    { 
      key: 'concluido', 
      label: 'Chamado Concluído', 
      description: 'Atendimento finalizado com sucesso',
      completed: occurrence.status === 'concluido' 
    }
  ];

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
      case 'aberto': 
      case 'triagem': 
        return 'Chamado Recebido';
      case 'em_atendimento': 
      case 'a_caminho': 
      case 'no_local': 
        return 'Chamado Aceito';
      case 'concluido': 
        return 'Chamado Concluído';
      default: 
        return 'Processando';
    }
  };

  const getCurrentStep = () => {
    if (occurrence.status === 'concluido') return 2;
    if (['em_atendimento', 'a_caminho', 'no_local'].includes(occurrence.status)) return 1;
    return 0;
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

  const getProgressPercentage = () => {
    const currentStep = getCurrentStep();
    return ((currentStep + 1) / statusSteps.length) * 100;
  };

  const getEstimatedTime = () => {
    switch (occurrence.status) {
      case 'aberto': 
      case 'triagem': 
        return 'Aguardando designação de socorrista';
      case 'em_atendimento': 
        return 'Socorrista sendo direcionado';
      case 'a_caminho': 
        return '5-10 minutos para chegada';
      case 'no_local': 
        return 'Em atendimento no local';
      case 'concluido': 
        return 'Atendimento finalizado';
      default: 
        return 'Calculando...';
    }
  };

  const getStepIcon = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: return <Shield className="w-4 h-4" />;
      case 1: return <UserCheck className="w-4 h-4" />;
      case 2: return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Atualizar tempo atual a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const elapsedTime = Math.floor((currentTime.getTime() - new Date(occurrence.createdAt).getTime()) / 60000);

  // Verificar se o usuário é socorrista e se pode concluir o chamado
  const canCompleteCall = user?.role === 'socorrista' && 
    ['em_atendimento', 'no_local'].includes(occurrence.status) &&
    occurrence.assignedTo?.id === user.id;

  const handleCompleteCall = () => {
    setShowCompletionForm(true);
  };

  const handleCompletionFormClose = () => {
    setShowCompletionForm(false);
  };

  const handleCompletionFormComplete = () => {
    setShowCompletionForm(false);
    // O contexto já foi atualizado pelo formulário
  };

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
                    Status do Atendimento - SOS UNIFIO
                  </h1>
                  <p className="text-sm text-slate-600">
                    Protocolo: EMG-{occurrence.id.toUpperCase().slice(-6)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Botão de Conclusão para Socorristas */}
              {canCompleteCall && (
                <Button
                  onClick={handleCompleteCall}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  Concluir Atendimento
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChat(!showChat)}
                className={`border-slate-300 ${showChat ? 'bg-unifio-primary text-white' : 'hover:bg-slate-50'}`}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {showChat ? 'Fechar Chat' : 'Assistente Médico'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-700 hover:bg-red-50"
                onClick={() => window.open('tel:192')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Emergência: 192
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações da Ocorrência */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Atual - Simplificado */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-slate-900">Status Atual</span>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getTypeColor(occurrence.type)} border px-3 py-1`}>
                      {occurrence.type.toUpperCase()}
                    </Badge>
                    <Badge className={`${getStatusColor(occurrence.status)} border px-3 py-1`}>
                      <Activity className="w-3 h-3 mr-1" />
                      {getStatusLabel(occurrence.status)}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Barra de Progresso */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Progresso do Atendimento</span>
                    <span className="text-sm text-slate-600">{Math.round(getProgressPercentage())}%</span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-3" />
                </div>

                {/* Etapas Simplificadas */}
                <div className="space-y-6">
                  {statusSteps.map((step, index) => (
                    <div key={step.key} className="flex items-start gap-4">
                      {/* Indicador da Etapa */}
                      <div className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                        step.completed 
                          ? 'bg-unifio-primary border-unifio-primary text-white shadow-unifio' 
                          : getCurrentStep() === index
                            ? 'bg-orange-100 border-orange-300 text-orange-600'
                            : 'bg-slate-100 border-slate-300 text-slate-500'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : getCurrentStep() === index ? (
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                        ) : (
                          getStepIcon(index)
                        )}
                        
                        {/* Linha de Conexão */}
                        {index < statusSteps.length - 1 && (
                          <div className={`absolute top-12 left-1/2 w-0.5 h-8 transform -translate-x-1/2 ${
                            step.completed ? 'bg-unifio-primary' : 'bg-slate-300'
                          }`} />
                        )}
                      </div>
                      
                      {/* Conteúdo da Etapa */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${
                            step.completed ? 'text-unifio-primary' : 
                            getCurrentStep() === index ? 'text-orange-600' : 'text-slate-500'
                          }`}>
                            {step.label}
                          </h3>
                          {step.completed && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                              Concluído
                            </Badge>
                          )}
                          {getCurrentStep() === index && !step.completed && (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                              Em andamento
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm ${
                          step.completed || getCurrentStep() === index ? 'text-slate-700' : 'text-slate-500'
                        }`}>
                          {step.description}
                        </p>
                        
                        {/* Status específico para etapa atual */}
                        {getCurrentStep() === index && !step.completed && (
                          <div className="mt-2 text-sm text-orange-600 font-medium">
                            {getEstimatedTime()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detalhes da Ocorrência */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Informações do Chamado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-slate-700">Prioridade:</span>
                      <Badge className={`${getPriorityColor(occurrence.priority)} border text-xs`}>
                        {occurrence.priority.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-slate-700">Local:</span>
                      <span className="text-sm text-slate-900">{occurrence.location?.name || 'Local não informado'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-slate-700">Solicitante:</span>
                      <span className="text-sm text-slate-900">{occurrence.user.name}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-slate-700">Hora do Chamado:</span>
                      <span className="text-sm text-slate-900">
                        {new Date(occurrence.createdAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-slate-700">Tempo Decorrido:</span>
                      <span className="text-sm text-slate-900">{elapsedTime} minutos</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-slate-700">Situação:</span>
                      <span className="text-sm text-slate-900">{getEstimatedTime()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="space-y-2">
                    <h4 className="font-medium text-slate-900">Sintomas Relatados:</h4>
                    <div className="flex flex-wrap gap-2">
                      {occurrence.symptoms.map(symptom => (
                        <Badge 
                          key={symptom} 
                          variant="secondary" 
                          className="bg-slate-100 text-slate-700"
                        >
                          {symptomLabels[symptom]}
                        </Badge>
                      ))}
                    </div>
                    
                    {occurrence.description && (
                      <>
                        <h4 className="font-medium text-slate-900 mt-4">Descrição Adicional:</h4>
                        <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">{occurrence.description}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Equipe Designada */}
                {occurrence.assignedTo && (
                  <div className="pt-4 border-t border-slate-200">
                    <h4 className="font-medium text-slate-900 mb-2">Socorrista Designado:</h4>
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{occurrence.assignedTo.name}</p>
                        <p className="text-sm text-green-600">Socorrista Responsável</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instruções de Segurança */}
            <Card className="border-blue-200 bg-blue-50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Stethoscope className="w-5 h-5" />
                  Instruções Importantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    Permaneça no local informado até a chegada do socorrista
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    Mantenha seu telefone disponível para contato
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    Se os sintomas piorarem, use o assistente médico ou ligue 192
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    Você receberá notificações em tempo real sobre o andamento
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* ChatBot */}
          <div className="lg:col-span-1">
            {showChat ? (
              <MedicalChatBot 
                userSymptoms={occurrence.symptoms.map(s => symptomLabels[s]).join(', ')}
                occurrenceId={occurrence.id}
                priority={occurrence.priority}
              />
            ) : (
              <Card className="border-slate-200 h-[600px] flex flex-col shadow-sm">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-slate-900">Assistente Médico</CardTitle>
                  <p className="text-sm text-slate-600">
                    Clique em "Assistente Médico" para receber orientações personalizadas
                    baseadas em seus sintomas enquanto aguarda o atendimento.
                  </p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center items-center">
                  <div className="text-center space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                        <Heart className="w-4 h-4" />
                        <span>IA especializada em emergências</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Instruções de primeiros socorros</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                        <Clock className="w-4 h-4" />
                        <span>Disponível 24/7</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => setShowChat(true)}
                      className="bg-unifio-primary hover:bg-unifio-primary/90 text-white shadow-unifio"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Iniciar Conversa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Conclusão */}
      {showCompletionForm && (
        <CallCompletionForm
          occurrence={occurrence}
          onComplete={handleCompletionFormComplete}
          onCancel={handleCompletionFormClose}
        />
      )}
    </div>
  );
};

export default OccurrenceStatusPage;