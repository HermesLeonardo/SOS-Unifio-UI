import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { io } from "socket.io-client";
import { API_URL } from "../services/api"; 
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import TestCallButton from './TestCallButton';
import TestRedirectedCallButton from './TestRedirectedCallButton';
import EmergencyCallNotification from './EmergencyCallNotification';
import { showEmergencyNotificationFromSocket } from './EmergencyCallNotification';
import MobileNav from './MobileNav';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Users, 
  MapPin,
  Phone,
  LogOut,
  Settings,
  Activity,
  TrendingUp,
  Shield,
  Bell,
  MessageSquare,
  Heart,
  UserCog
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';

declare global {
  interface Window {
    __EMERGENCY_EVENT_LOCK__?: boolean;
  }
}


const Dashboard: React.FC = () => {
  const { user, setCurrentPage, setUser, incomingCalls, simulatedOccurrences, isAdminMode, toggleAdminMode } = useApp() as any;

  if (!user) return null;

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'aluno': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'professor': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'colaborador': return 'bg-green-100 text-green-800 border-green-200';
      case 'socorrista': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'aluno': return 'Aluno';
      case 'professor': return 'Professor';
      case 'colaborador': return 'Colaborador';
      case 'socorrista': return 'Socorrista';
      default: return role;
    }
  };

  const renderQuickActions = () => {
    // Para administradores, mostrar ações baseadas no role ou no modo admin
    const effectiveRole = user.role === 'administrador' ? 
      (isAdminMode ? 'administrador' : 'colaborador') : 
      user.role;

    switch (effectiveRole) {
      case 'professor':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-6">
            <Button 
              onClick={() => setCurrentPage('new-occurrence')} 
              className="h-16 lg:h-20 flex flex-col gap-1 lg:gap-2 bg-emergency-critical hover:bg-emergency-critical/90 text-white font-medium shadow-unifio"
            >
              <Heart className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="text-sm lg:text-base">Solicitar Atendimento</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage('active-occurrences')}
              className="h-16 lg:h-20 flex flex-col gap-1 lg:gap-2 border-unifio-primary hover:bg-unifio-primary/5 text-unifio-primary border-2"
            >
              <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="text-sm lg:text-base">Ver Chamados Ativos</span>
            </Button>
          </div>
        );

      case 'colaborador':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-6">
            <Button 
              onClick={() => setCurrentPage('new-occurrence')} 
              className="h-16 lg:h-20 flex flex-col gap-1 lg:gap-2 bg-emergency-critical hover:bg-emergency-critical/90 text-white font-medium shadow-unifio"
            >
              <Heart className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="text-sm lg:text-base">Solicitar Atendimento</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage('active-occurrences')}
              className="h-16 lg:h-20 flex flex-col gap-1 lg:gap-2 border-unifio-primary hover:bg-unifio-primary/5 text-unifio-primary border-2"
            >
              <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="text-sm lg:text-base">Ver Chamados Ativos</span>
            </Button>
          </div>
        );
      
      case 'socorrista':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
            <Button 
              onClick={() => setCurrentPage('active-occurrences')} 
              className="h-14 lg:h-16 flex flex-col gap-1 bg-unifio-primary hover:bg-unifio-primary/90 text-white"
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="text-xs lg:text-sm">Chamados Ativos</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage('my-assignments')}
              className="h-14 lg:h-16 flex flex-col gap-1 border-slate-300 hover:bg-slate-50"
            >
              <Users className="w-5 h-5 text-slate-600" />
              <span className="text-xs lg:text-sm text-slate-700">Meus Atendimentos</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage('history')}
              className="h-14 lg:h-16 flex flex-col gap-1 border-slate-300 hover:bg-slate-50"
            >
              <CheckCircle className="w-5 h-5 text-slate-600" />
              <span className="text-xs lg:text-sm text-slate-700">Histórico</span>
            </Button>
          </div>
        );
      
      case 'administrador':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            <Button 
              onClick={() => setCurrentPage('admin-users')} 
              className="h-14 lg:h-16 flex flex-col gap-1 bg-unifio-primary hover:bg-unifio-primary/90 text-white"
            >
              <Users className="w-5 h-5" />
              <span className="text-xs lg:text-sm">Gerenciar Usuários</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage('admin-settings')}
              className="h-14 lg:h-16 flex flex-col gap-1 border-slate-300 hover:bg-slate-50"
            >
              <Settings className="w-5 h-5 text-slate-600" />
              <span className="text-xs lg:text-sm text-slate-700">Configurações</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage('reports')}
              className="h-14 lg:h-16 flex flex-col gap-1 border-green-600 hover:bg-green-50 text-green-700"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs lg:text-sm">Relatórios Completos</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage('active-occurrences')}
              className="h-14 lg:h-16 flex flex-col gap-1 border-red-600 hover:bg-red-50 text-red-700"
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="text-xs lg:text-sm">Monitoramento</span>
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Busca ocorrências recentes do backend + escuta tempo real
  const [recentOccurrences, setRecentOccurrences] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    ativos: 0,
    emergencias: 0,
    emAtendimento: 0,
    concluidosHoje: 0,
  });

  // useEffect(() => {
  //   toast.success(" Sistema de notificação ativo!");
  // }, []);

  useEffect(() => {
    async function carregarDashboard() {
      const data = await dashboardService.getDashboard();

      if (!data) return;

      setRecentOccurrences(
        (data.recentes || []).map((o: any) => ({
          a02_id: o.a02_id,
          classificacao: o.classificacao,
          tipo_ocorrencia: o.tipo_ocorrencia,
          a02_prioridade: o.a02_prioridade,
          situacao: o.situacao,
          usuario_nome: o.usuario_nome,
          local_nome: o.local_nome,
          a02_descricao: o.a02_descricao,
          a02_data_abertura: o.a02_data_abertura
        }))
      );





      setMetrics({
        ativos: data.status.abertas,
        emergencias: data.status.emergencias,
        emAtendimento: data.status.em_andamento,
        concluidosHoje: data.status.finalizadas, 
      });
    }

    carregarDashboard();


    // Conecta ao servidor WebSocket usando a URL centralizada
    const socket = io(API_URL, { transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("[SOCKET] Conectado ao Socket.IO:", socket.id);
    });

    // Recebe novas ocorrências em tempo real
   // Recebe novas ocorrências em tempo real
    socket.on("nova_ocorrencia", (novaOcorrencia) => {
      console.log("[SOCKET] Nova ocorrência recebida:", novaOcorrencia);
      
      // Toast rápido de notificação
      showEmergencyNotificationFromSocket(novaOcorrencia);

      // Estrutura os dados para o evento
      const eventData = {
        id: novaOcorrencia.a02_id || novaOcorrencia.id,
        a02_id: novaOcorrencia.a02_id || novaOcorrencia.id,
        classificacao: novaOcorrencia.classificacao,
        a02_prioridade: novaOcorrencia.a02_prioridade || novaOcorrencia.prioridade,
        prioridade: novaOcorrencia.prioridade,
        a02_descricao: novaOcorrencia.a02_descricao || novaOcorrencia.descricao,
        descricao: novaOcorrencia.descricao,
        usuario_nome: novaOcorrencia.usuario_nome,
        local_nome: novaOcorrencia.local_nome,
        a02_data_abertura: novaOcorrencia.a02_data_abertura || novaOcorrencia.data_abertura,
        data_abertura: novaOcorrencia.data_abertura,
        sintomas: novaOcorrencia.sintomas || [],
        attemptedRespondersIds: novaOcorrencia.attemptedRespondersIds || [],
      };

      console.log("[SOCKET] Dados estruturados para evento:", eventData);

      // Dispara o evento customizado
      console.log("[SOCKET] Disparando evento abrirNotificacaoEmergencia");
      const event = new CustomEvent("abrirNotificacaoEmergencia", { 
        detail: eventData 
      });
      window.dispatchEvent(event);

      // Atualiza a lista de ocorrências recentes
      setRecentOccurrences((prev) => [novaOcorrencia, ...prev].slice(0, 5));
      setMetrics(prev => ({
        ...prev,
        ativos: prev.ativos + 1,
      }));

    });




    socket.on("disconnect", () => {
      console.log("[SOCKET] Desconectado do Socket.IO");
    });

    //  Cleanup
    return () => {
      socket.disconnect();
    };

  }, []);

  useEffect(() => {
    console.log("Renderizando ocorrências:", recentOccurrences);
  }, [recentOccurrences]);


  console.log("Renderizando ocorrências:", recentOccurrences);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Navigation */}
      <MobileNav />
      
      {/* Botão de Teste para Socorristas */}
      <TestCallButton />
      
      {/* Botão de Teste de Redirecionamento para Socorristas e Colaboradores */}
      <TestRedirectedCallButton />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2 lg:gap-4">
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 lg:w-8 lg:h-8 text-emergency-critical" />
                <div className="text-xl lg:text-2xl font-bold">
                  <span className="text-unifio-primary">SOS</span>
                </div>
              </div>
              <div className="hidden sm:block border-l border-slate-300 pl-4">
                <div className="text-base lg:text-lg font-bold">
                  <span className="text-unifio-primary">UNI</span>
                  <span className="text-unifio-secondary">FI</span>
                  <span className="text-unifio-primary">O</span>
                </div>
                <p className="text-xs lg:text-sm text-slate-600">
                  Sistema de Emergência Médica
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="hidden lg:block text-right mr-3">
                <p className="text-sm font-medium text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-600">{user.email}</p>
              </div>
              
              {/* Indicador de notificações para equipe de resposta */}
              {(user.role === 'socorrista' || user.role === 'professor' || user.role === 'colaborador') && (
                <div className="relative hidden lg:block">
                  <Button variant="ghost" size="sm" className="text-slate-600">
                    <Bell className="w-4 h-4" />
                  </Button>
                  {incomingCalls && incomingCalls.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">{incomingCalls.length}</span>
                    </div>
                  )}
                </div>
              )}
              
              <Badge className={`${getRoleColor(user.role)} border px-2 py-1 text-xs hidden sm:flex`}>
                <Shield className="w-3 h-3 mr-1" />
                {getRoleLabel(user.role)}
                {user.role === 'administrador' && isAdminMode && (
                  <span className="ml-1 text-xs">• ADMIN</span>
                )}
              </Badge>

              {/* Botão de Toggle Modo Admin - apenas para administradores */}
              {user.role === 'administrador' && (
                <Button 
                  variant={isAdminMode ? "default" : "outline"} 
                  size="sm" 
                  onClick={toggleAdminMode}
                  className={`hidden lg:flex ${
                    isAdminMode 
                      ? "bg-unifio-primary hover:bg-unifio-primary/90 text-white" 
                      : "border-unifio-primary text-unifio-primary hover:bg-unifio-primary/5"
                  }`}
                  title={isAdminMode ? "Sair do Modo Admin" : "Entrar no Modo Admin"}
                >
                  <UserCog className="w-4 h-4" />
                </Button>
              )}

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout} 
                className="text-slate-600 hover:text-red-600 hidden lg:flex"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="space-y-4 lg:space-y-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs lg:text-sm font-medium text-slate-600">Chamados Ativos</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-xl lg:text-2xl font-semibold text-slate-900">
                  {metrics.ativos}
                </div>
                <p className="text-[10px] lg:text-xs text-slate-600 mt-1">
                  Aguardando atendimento
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs lg:text-sm font-medium text-slate-600">Emergências</CardTitle>
                <Heart className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl lg:text-2xl font-semibold text-red-600">
                  {metrics.emergencias}
                </div>
                <p className="text-[10px] lg:text-xs text-slate-600 mt-1">
                  Alta prioridade
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs lg:text-sm font-medium text-slate-600">Em Atendimento</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-xl lg:text-2xl font-semibold text-blue-600">
                  {metrics.emAtendimento}
                </div>
                <p className="text-[10px] lg:text-xs text-slate-600 mt-1">
                  Socorristas ativos
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs lg:text-sm font-medium text-slate-600">Concluídos Hoje</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-xl lg:text-2xl font-semibold text-green-600">
                  {metrics.concluidosHoje}
                </div>
                <p className="text-[10px] lg:text-xs text-slate-600 mt-1">
                  Atendimentos finalizados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base lg:text-lg text-slate-900 font-semibold">
                Ações Rápidas
                {user.role === 'socorrista' && (
                  <span className="hidden lg:inline ml-2 text-sm font-normal text-slate-600">
                    • Botões de teste: vermelho (novo chamado) e roxo (redirecionado)
                  </span>
                )}
                {user.role === 'colaborador' && (
                  <span className="hidden lg:inline ml-2 text-sm font-normal text-slate-600">
                    • Use o botão roxo para simular chamados redirecionados
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderQuickActions()}
            </CardContent>
          </Card>

          {/* Recent Occurrences */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base lg:text-lg text-slate-900 font-semibold">
                Ocorrências Recentes
                {simulatedOccurrences && simulatedOccurrences.length > 0 && (
                  <Badge className="ml-2 bg-blue-100 text-blue-700 text-xs">
                    {simulatedOccurrences.length} simulados
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                
          {Array.isArray(recentOccurrences) && recentOccurrences.map((occurrence: any) => (
          <div
            key={occurrence.a02_id}
            className="p-4 bg-slate-50 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all"
          >
            {/* Linha de badges (tipo / prioridade / status) */}
            <div className="flex items-center gap-2 mb-3">
            {/* Classificação (urgência / emergência) */}
            <Badge
              className={`${
                !occurrence.classificacao
                  ? 'bg-slate-400 text-white'
                  : occurrence.classificacao?.toLowerCase() === 'emergencia'
                  ? 'bg-red-600 text-white'
                  : 'bg-orange-500 text-white'
              } text-xs font-semibold px-3 py-1 uppercase tracking-wide`}
            >
              {(occurrence.classificacao || 'DESCONHECIDO').toUpperCase()}
            </Badge>

              {/* Prioridade */}
              <Badge
                className={`${
                  !occurrence.a02_prioridade
                    ? 'bg-slate-400 text-white'
                    : occurrence.a02_prioridade === 'alta'
                    ? 'bg-red-100 text-red-700 border-red-200'
                    : occurrence.a02_prioridade === 'media'
                    ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                    : occurrence.a02_prioridade === 'baixa'
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-slate-400 text-white'
                } border text-xs font-medium px-3 py-1`}
              >
                {(occurrence.a02_prioridade || 'INDEFINIDA').toUpperCase()}
              </Badge>


              {/* Situação */}
              <Badge
                className={`${
                  !occurrence.situacao
                    ? 'bg-slate-400 text-white'
                    : occurrence.situacao === 'aberta'
                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : occurrence.situacao === 'em_triagem'
                    ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                    : occurrence.situacao === 'em_andamento'
                    ? 'bg-orange-100 text-orange-700 border-orange-200'
                    : occurrence.situacao === 'finalizada'
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : occurrence.situacao === 'cancelada'
                    ? 'bg-slate-300 text-slate-700 border-slate-400'
                    : 'bg-slate-400 text-white'
                } border text-xs font-medium px-3 py-1`}
              >
                {(occurrence.situacao || 'DESCONHECIDO')
                  .replace('_', ' ')
                  .replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </Badge>
            </div>

            {/* Tipo de situação (ex: Lesões, Traumas e Sangramentos) */}
            <p className="text-slate-900 font-semibold mb-1 text-[15px] leading-snug">
              {occurrence.tipo_ocorrencia || "Tipo não informado"}
            </p>

            {/* Descrição do chamado */}
            <p className="text-slate-700 text-sm mb-3">
              {occurrence.a02_descricao || "Sem descrição"}
            </p>

            {/* Linha inferior: local + usuário + hora */}
            <div className="flex justify-between items-center text-xs text-slate-600">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {occurrence.local_nome || "Local não informado"}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-slate-500" />
                  {occurrence.usuario_nome || "Usuário não identificado"}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">
                  {new Date(occurrence.a02_data_abertura).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-xs font-medium text-slate-700">
                  {Math.floor(
                    (Date.now() - new Date(occurrence.a02_data_abertura).getTime()) / 60000
                  )}min atrás
                </p>
              </div>
            </div>
          </div>
        ))}


                {recentOccurrences.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                    <p className="font-medium">Nenhuma ocorrência recente</p>
                    <p className="text-sm">Sistema funcionando normalmente</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;