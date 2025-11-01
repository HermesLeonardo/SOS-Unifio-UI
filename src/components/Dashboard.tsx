import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import TestCallButton from './TestCallButton';
import TestRedirectedCallButton from './TestRedirectedCallButton';
import EmergencyCallNotification from './EmergencyCallNotification';
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
import { mockOccurrences, symptomLabels } from '../data/mockData';

const Dashboard: React.FC = () => {
  const { user, setCurrentPage, setUser, incomingCalls, simulatedOccurrences, isAdminMode, toggleAdminMode } = useApp() as any;

  if (!user) return null;

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const getStatusColor = (status: string) => {
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

  const getStatusLabel = (status: string) => {
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

  // Usar ocorrências simuladas se existirem, senão usar mock data
  const allOccurrences = simulatedOccurrences && simulatedOccurrences.length > 0 
    ? [...simulatedOccurrences, ...mockOccurrences] 
    : mockOccurrences;
  
  const recentOccurrences = allOccurrences.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Notificações de Chamados */}
      <EmergencyCallNotification />
      
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
                  {allOccurrences.filter(o => ['aberto', 'triagem', 'em_atendimento', 'a_caminho', 'no_local'].includes(o.status)).length}
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
                  {allOccurrences.filter(o => o.type === 'emergencia' && o.status !== 'concluido').length}
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
                  {allOccurrences.filter(o => ['em_atendimento', 'no_local'].includes(o.status)).length}
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
                  {allOccurrences.filter(o => o.status === 'concluido').length}
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
                {recentOccurrences.map((occurrence) => (
                  <div key={occurrence.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={`${getTypeColor(occurrence.type)} border text-xs px-2 py-1`}>
                          {occurrence.type.toUpperCase()}
                        </Badge>
                        <Badge className={`${getPriorityColor(occurrence.priority)} border text-xs px-2 py-1`}>
                          {occurrence.priority.toUpperCase()}
                        </Badge>
                        <Badge className={`${getStatusColor(occurrence.status)} border text-xs px-2 py-1`}>
                          {getStatusLabel(occurrence.status)}
                        </Badge>
                        {occurrence.id.startsWith('sim-') && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-1">
                            SIMULADO
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-900 font-medium mb-1">
                        {occurrence.symptoms.map(symptom => symptomLabels[symptom]).join(', ')}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {occurrence.location?.name || 'Local não informado'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {occurrence.user.name}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 mb-1">
                        {new Date(occurrence.createdAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-xs font-medium text-slate-700">
                        {Math.floor((Date.now() - new Date(occurrence.createdAt).getTime()) / 60000)}min atrás
                      </p>
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