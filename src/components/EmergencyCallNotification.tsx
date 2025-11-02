import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useApp } from '../contexts/AppContext';
import { symptomLabels, peopleCountLabels } from '../data/mockData';
import { 
  Bell,
  X,
  Check,
  AlertTriangle,
  MapPin,
  User,
  Clock,
  Heart,
  Phone,
  Zap,
  Info,
  ChevronUp,
  Users,
  UserPlus,
  RotateCcw
} from 'lucide-react';
import { toast } from "sonner";

interface EmergencyCallNotificationProps {
  occurrence?: any;
  onClose?: () => void;
}

function EmergencyCallNotification({ occurrence: externalOccurrence, onClose }: EmergencyCallNotificationProps) {
  const { user, incomingCalls, acceptCall, rejectCall, handleCallTimeout, setActiveOccurrence, setCurrentPage } = useApp() as any;
  const [currentCall, setCurrentCall] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(90); // 1.5 minutos = 90 segundos
  const [isPulsing, setIsPulsing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [shouldShowToast, setShouldShowToast] = useState(false);
  const [toastData, setToastData] = useState<any>(null);
  const [hasTimedOut, setHasTimedOut] = useState(false);

 // Escuta global de eventos do socket (vindo do Dashboard)
  useEffect(() => {
    const handleExternalNotification = (e: any) => {
      const data = e.detail;
      if (!data) {
        console.log("[EMERGENCY] Evento sem dados");
        return;
      }

      console.log("[EMERGENCY] handleExternalNotification acionado", data);

      // Evita reabrir o mesmo chamado se já estiver visível
      if (currentCall?.id === data.id && isVisible) {
        console.log("[EMERGENCY] Chamado já está sendo exibido");
        return;
      }

      // Estrutura o chamado conforme esperado pelo componente
      const newCall = {
        id: data.id || data.a02_id,
        occurrence: {
          id: String(data.id || data.a02_id),
          type: data.classificacao || "emergencia",
          priority: data.a02_prioridade || data.prioridade || "alta",
          description: data.a02_descricao || data.descricao || "Sem descrição",
          peopleCount: "2-3",
          user: {
            name: data.usuario_nome || "Usuário",
            role: "aluno",
            email: "usuario@unifio.edu.br",
          },
          location: { name: data.local_nome || "Local não informado" },
          createdAt: data.a02_data_abertura || data.data_abertura || new Date().toISOString(),
          symptoms: data.sintomas || [],
        },
        attemptedRespondersIds: data.attemptedRespondersIds || [],
      };

      console.log("[EMERGENCY] Configurando novo chamado:", newCall);

      setCurrentCall(newCall);
      setIsVisible(true);
      setIsMinimized(false);
      setIsPulsing(true);
      setTimeRemaining(90);
      setHasTimedOut(false);
    };

    console.log("[EMERGENCY] Registrando listener de notificação");
    window.addEventListener("abrirNotificacaoEmergencia", handleExternalNotification);

    return () => {
      console.log("[EMERGENCY] Removendo listener de notificação");
      window.removeEventListener("abrirNotificacaoEmergencia", handleExternalNotification);
    };
  }, [currentCall, isVisible]); 

  // Mostrar notificação quando houver novos chamados
  useEffect(() => {
    if (incomingCalls && incomingCalls.length > 0 && (user?.role === 'socorrista' || user?.role === 'professor' || user?.role === 'colaborador')) {
      const latestCall = incomingCalls[0];
      if (!currentCall || latestCall.id !== currentCall.id) {
        setCurrentCall(latestCall);
        setIsVisible(true);
        setIsMinimized(false);
        setTimeRemaining(90); // Reset timer para 1.5 minutos
        setIsPulsing(false);
        setHasTimedOut(false); // Reset timeout flag
        
        // Preparar dados do toast para próximo efeito
        setToastData({
          name: latestCall.occurrence.user.name,
          type: latestCall.occurrence.type.toUpperCase(),
          peopleCount: peopleCountLabels[latestCall.occurrence.peopleCount as keyof typeof peopleCountLabels]
        });
        setShouldShowToast(true);
      }
    } else if (incomingCalls?.length === 0 && !currentCall) {
      setIsVisible(false);
      setCurrentCall(null);
      setIsMinimized(false);
      setIsPulsing(false);
      setHasTimedOut(false);
    }
  }, [incomingCalls, currentCall, user]);

  // Efeito separado para mostrar toast (evita setState durante render)
  useEffect(() => {
    if (shouldShowToast && toastData) {
      toast('🚨 Novo Chamado de Emergência!', {
        description: `${toastData.name} - ${toastData.type} - ${toastData.peopleCount}`,
        duration: 8000,
      });
      setShouldShowToast(false);
      setToastData(null);
    }
  }, [shouldShowToast, toastData]);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isVisible && currentCall && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVisible, currentCall, timeRemaining]);

  // Efeito separado para lidar com timeout
  useEffect(() => {
    if (timeRemaining === 0 && isVisible && currentCall && !hasTimedOut) {
      setHasTimedOut(true);

      setTimeout(() => {
        if (handleCallTimeout) {
          handleCallTimeout(currentCall.id);
        }
        toast.info('Tempo esgotado', {
          description: 'O chamado foi redirecionado para outro socorrista/colaborador.',
          duration: 5000,
        });

        // 🔧 COMENTAR TEMPORARIAMENTE:
        // setIsVisible(false);
        // setCurrentCall(null);
        // setIsMinimized(false);
        // setIsPulsing(false);
      }, 0);
    }
  }, [timeRemaining, isVisible, currentCall, hasTimedOut, handleCallTimeout]);


  const handleAccept = () => {
    if (currentCall) {
      const acceptedOccurrence = acceptCall(currentCall.id);
      if (acceptedOccurrence) {
        setActiveOccurrence(acceptedOccurrence);
        toast.success('Chamado aceito! Você foi designado para este atendimento.');
        setIsVisible(false);
        setCurrentCall(null);
        setIsMinimized(false);
        setIsPulsing(false);
        setCurrentPage('occurrence-status');
      }
    }
  };

  const handleReject = () => {
    if (currentCall) {
      rejectCall(currentCall.id);
      toast.info('Chamado rejeitado', {
        description: 'O chamado foi redirecionado automaticamente para outro socorrista ou colaborador disponível.',
        duration: 5000,
      });
      setIsVisible(false);
      setCurrentCall(null);
      setIsMinimized(false);
      setIsPulsing(false);
    }
  };

  const handleClose = () => {
    if (timeRemaining > 0) {
      // Se ainda tem tempo, apenas minimizar
      setIsMinimized(true);
    } else {
      // Se o tempo acabou, fechar completamente
      setIsVisible(false);
      setCurrentCall(null);
      setIsMinimized(false);
      setIsPulsing(false);
    }
  };

  const handleExpand = () => {
    setIsMinimized(false);
    setIsPulsing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critica': return 'bg-red-50 text-red-800 border-red-200';
      case 'alta': return 'bg-red-50 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'baixa': return 'bg-green-50 text-green-800 border-green-200';
      default: return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergencia': return 'bg-red-600';
      case 'urgencia': return 'bg-orange-600';
      default: return 'bg-slate-600';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  console.log("[EMERGENCY] Render check", {
    isVisible,
    hasCurrentCall: !!currentCall,
    currentCall,
    userRole: user?.role
  });


  if (isVisible && currentCall) {
    console.log("[EMERGENCY] Exibindo modal de emergência:", currentCall);
  }

  console.log("[EMERGENCY] Render check", { isVisible, hasCurrentCall: !!currentCall, currentCall, userRole: user?.role });
  if (!isVisible || !currentCall) {
    return null;
  }


  const { occurrence, attemptedRespondersIds } = currentCall;
  const isRedirected = attemptedRespondersIds && attemptedRespondersIds.length > 0;
  
  // Função para obter ícone de pessoas
  const getPeopleIcon = (peopleCount: string) => {
    switch (peopleCount) {
      case '1': return User;
      case '2-3': return Users;
      case '3+': return UserPlus;
      default: return User;
    }
  };

  // Versão minimizada redesenhada - mais visível no topo da tela
  if (isMinimized) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div 
          onClick={handleExpand}
          className={`relative cursor-pointer transition-all duration-300 ${
            isPulsing ? 'animate-pulse' : ''
          }`}
        >
          {/* Alerta Principal */}
          <Card className={`
            w-80 border-0 shadow-2xl overflow-hidden transition-all duration-300
            ${getTypeColor(occurrence.type)} text-white
            ${isPulsing ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''}
          `}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {/* Ícone animado */}
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                  ${isPulsing ? 'bg-white/30 animate-bounce' : 'bg-white/20'}
                `}>
                  <Heart className="w-6 h-6 text-white" />
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4" />
                    <span className="font-bold text-sm tracking-wide">
                      CHAMADO PENDENTE
                    </span>
                    {isPulsing && (
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-base mb-1 truncate">
                    {occurrence.user.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{occurrence.location?.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-white/20 text-white border-white/30 text-xs font-medium">
                      PRIORIDADE {occurrence.priority.toUpperCase()}
                    </Badge>
                    <Badge className="bg-white/20 text-white border-white/30 text-xs font-medium">
                      {peopleCountLabels[occurrence.peopleCount as keyof typeof peopleCountLabels].toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Indicador de ação */}
                <div className="flex flex-col items-center gap-1">
                  <ChevronUp className="w-5 h-5 animate-bounce" />
                  <span className="text-xs font-medium">CLIQUE</span>
                </div>
              </div>

              {/* Barra inferior com ações rápidas */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/20">
                <div className="flex gap-2">
                  <Button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      handleReject();
                    }}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 h-7 px-3 text-xs"
                  >
                    Rejeitar
                  </Button>
                  <Button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      handleAccept();
                    }}
                    size="sm"
                    className="bg-white text-red-600 hover:bg-white/90 h-7 px-3 text-xs font-semibold"
                  >
                    Aceitar
                  </Button>
                </div>
                
                <div className="text-xs font-medium">
                  #{occurrence.id.toUpperCase().slice(-4)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Indicador de atenção piscante */}
          {isPulsing && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
              <Bell className="w-3 h-3 text-yellow-800" />
            </div>
          )}

          {/* Sombra especial quando piscando */}
          {isPulsing && (
            <div className="absolute inset-0 bg-yellow-400/20 rounded-lg -z-10 blur-xl animate-pulse" />
          )}
        </div>
      </div>
    );
  }

  // Versão completa (mantida igual)
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg mx-auto border-0 shadow-2xl overflow-hidden">
        {/* Header com Gradiente */}
        <div className={`${getTypeColor(occurrence.type)} px-6 py-4 relative`}>
          {/* Ícone de Emergência */}
          <div className="absolute top-4 left-6">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
          </div>
          
          {/* Timer */}
          {timeRemaining > 0 && (
            <div className="absolute top-4 right-16 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="flex items-center gap-1 text-white text-sm font-medium">
                <Clock className="w-3 h-3" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            </div>
          )}
          
          {/* Botão Fechar/Minimizar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="ml-14">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-white" />
              <span className="text-white font-semibold text-sm tracking-wide">
                CHAMADO DE EMERGÊNCIA
              </span>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-1">
              {occurrence.type === 'emergencia' ? 'EMERGÊNCIA CRÍTICA' : 'URGÊNCIA MÉDICA'}
            </h2>
            
            <div className="flex items-center gap-2">
              <Badge className={`${getPriorityColor(occurrence.priority)} border font-medium text-xs`}>
                PRIORIDADE {occurrence.priority.toUpperCase()}
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 text-xs">
                #{occurrence.id.toUpperCase().slice(-6)}
              </Badge>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Informações do Paciente */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 mb-1">{occurrence.user.name}</h4>
                <div className="text-sm text-slate-600 space-y-1">
                  <p>
                    {occurrence.user.role === 'aluno' ? 'Aluno' : 'Professor'}
                    {occurrence.user.ra && ` • RA: ${occurrence.user.ra}`}
                  </p>
                  <p>{occurrence.user.email}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 mb-1">{occurrence.location?.name}</h4>
                {occurrence.locationDescription && (
                  <p className="text-sm text-slate-600">"{occurrence.locationDescription}"</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 mb-1">Horário do Chamado</h4>
                <p className="text-sm text-slate-600">
                  {new Date(occurrence.createdAt).toLocaleString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                {React.createElement(getPeopleIcon(occurrence.peopleCount), { className: "w-5 h-5 text-orange-600" })}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 mb-1">Pessoas que Precisam de Atendimento</h4>
                <p className="text-sm text-slate-600">
                  {peopleCountLabels[occurrence.peopleCount as keyof typeof peopleCountLabels]} </p>
                {(occurrence.peopleCount === '2-3' || occurrence.peopleCount === '3+') && (
                  <p className="text-xs text-orange-600 mt-1 font-medium">
                    ⚠️ Múltiplas pessoas envolvidas - recursos adicionais podem ser necessários
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sintomas */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-600" />
              <h4 className="font-semibold text-slate-900">Sintomas Relatados</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {occurrence.symptoms.map((symptom: string) => (
                <Badge key={symptom} variant="secondary" className="bg-slate-100 text-slate-700 font-medium">
                  {symptomLabels[symptom as keyof typeof symptomLabels]}
                </Badge>
              ))}
            </div>
          </div>

          {/* Descrição */}
          {occurrence.description && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <h4 className="font-semibold text-slate-900">Descrição da Situação</h4>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-slate-700">{occurrence.description}</p>
              </div>
            </div>
          )}

          {/* Alerta de Urgência */}
          {occurrence.type === 'emergencia' && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800">Emergência Crítica</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Este chamado requer atendimento imediato. Priorize este caso.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Alerta para Múltiplas Pessoas */}
          {(occurrence.peopleCount === '2-3' || occurrence.peopleCount === '3+') && (
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-orange-800">Múltiplas Pessoas Envolvidas</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    {occurrence.peopleCount === '2-3' 
                      ? 'Entre 2 e 3 pessoas precisam de atendimento médico.' 
                      : 'Mais de 3 pessoas precisam de atendimento médico.'
                    } Considere solicitar recursos adicionais.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Alerta de Chamado Redirecionado */}
          {isRedirected && (
            <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-purple-800">Chamado Redirecionado</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    Este chamado já foi enviado para {attemptedRespondersIds.length} {attemptedRespondersIds.length === 1 ? 'outro respondedor' : 'outros respondedores'} que não puderam atender. 
                    Você está recebendo este chamado automaticamente pelo sistema de redirecionamento.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Aviso de tempo */}
          {timeRemaining <= 30 && timeRemaining > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Tempo Limitado</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Este chamado será automaticamente redirecionado para outro socorrista/colaborador em {formatTime(timeRemaining)}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Footer com Botões */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
          <div className="flex gap-3">
            <Button
              onClick={handleReject}
              variant="outline"
              className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
            >
              <X className="w-4 h-4 mr-2" />
              Rejeitar
            </Button>
            
            <Button
              onClick={handleAccept}
              className={`flex-1 font-semibold text-white shadow-lg ${
                occurrence.type === 'emergencia' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-unifio-primary hover:bg-unifio-primary/90'
              }`}
            >
              <Check className="w-4 h-4 mr-2" />
              Aceitar Chamado
            </Button>
          </div>
          
          <div className="flex justify-center mt-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-slate-900 text-xs"
            >
              <Phone className="w-3 h-3 mr-1" />
              Ligar para o solicitante
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Função auxiliar para disparar notificação de emergência vinda do socket
export function showEmergencyNotificationFromSocket(data: any) {
  toast("Novo Chamado de Emergência!", {
    description: `${data.usuario_nome} - ${data.classificacao?.toUpperCase() || "DESCONHECIDO"} - Prioridade ${data.prioridade?.toUpperCase() || "N/A"}`,
    duration: 8000,
  });
}

export default EmergencyCallNotification;
