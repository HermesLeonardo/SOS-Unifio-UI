import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useApp } from '../contexts/AppContext';
import { mockOccurrences } from '../data/mockData';
import { UserRole, SystemUser, UserRegistrationData, AdminStats } from '../types';
import { 
  Crown,
  Users,
  Heart,
  TrendingUp,
  Activity,
  Shield,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  Settings,
  BarChart3,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Phone,
  Building,
  Stethoscope,
  FileText,
  Download,
  Calendar,
  LogOut,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  GraduationCap,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const AdminDashboard: React.FC = () => {
  const { user, setCurrentPage, setUser, toggleAdminMode } = useApp() as any;
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [showAddUser, setShowAddUser] = useState(false);

  // Mock data para demonstração
  const adminStats: AdminStats = {
    totalUsers: 1247,
    activeUsers: 1180,
    totalOccurrences: 342,
    monthlyOccurrences: 28,
    avgResponseTime: 4.2,
    systemUptime: 99.8,
    totalLocations: 45,
    activeSocorristas: 12
  };

  const mockUsers: SystemUser[] = [
    {
      id: '1',
      name: 'Dr. João Silva',
      email: '123456@unifio.edu.br',
      ra: '123456',
      role: 'socorrista',
      department: 'Ambulatório',
      phone: '(11) 99999-9999',
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      lastLogin: '2024-01-27T14:30:00Z'
    },
    {
      id: '2',
      name: 'Enf. Maria Santos',
      email: '234567@unifio.edu.br',
      ra: '234567',
      role: 'socorrista',
      department: 'Enfermagem',
      phone: '(11) 88888-8888',
      isActive: true,
      createdAt: '2024-01-10T09:00:00Z',
      lastLogin: '2024-01-27T13:45:00Z'
    },
    {
      id: '3',
      name: 'Prof. Ana Costa',
      email: '345678@unifio.edu.br',
      ra: '345678',
      role: 'colaborador',
      department: 'Medicina',
      phone: '(11) 77777-7777',
      isActive: true,
      createdAt: '2024-01-08T08:00:00Z',
      lastLogin: '2024-01-26T16:20:00Z'
    },
    {
      id: '4',
      name: 'Carlos Brigadista',
      email: '456789@unifio.edu.br',
      ra: '456789',
      role: 'colaborador',
      department: 'Segurança',
      phone: '(11) 66666-6666',
      isActive: true,
      createdAt: '2024-01-05T07:30:00Z',
      lastLogin: '2024-01-27T12:10:00Z'
    }
  ];

  const [newUser, setNewUser] = useState<UserRegistrationData>({
    name: '',
    email: '',
    ra: '',
    role: 'colaborador',
    phone: '',
    department: '',
    password: '',
    permissions: [],
    accessLevel: 'basic'
  });

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Simular criação de usuário
    toast.success(`Usuário ${newUser.name} criado com sucesso!`);
    setShowAddUser(false);
    setNewUser({
      name: '',
      email: '',
      ra: '',
      role: 'colaborador',
      phone: '',
      department: '',
      password: '',
      permissions: [],
      accessLevel: 'basic'
    });
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'aluno': return GraduationCap;
      case 'colaborador': return UserCheck;
      case 'socorrista': return Shield;
      case 'administrador': return Crown;
      default: return Users;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'aluno': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'colaborador': return 'bg-green-100 text-green-800 border-green-200';
      case 'socorrista': return 'bg-red-100 text-red-800 border-red-200';
      case 'administrador': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'aluno': return 'Aluno';
      case 'colaborador': return 'Colaborador';
      case 'socorrista': return 'Socorrista';
      case 'administrador': return 'Administrador';
      default: return role;
    }
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.ra?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Painel Administrativo</h1>
                <p className="text-sm text-slate-600">Sistema de Emergência Médica - UNIFIO</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAdminMode}
                className="border-unifio-primary text-unifio-primary hover:bg-unifio-primary/5"
                title="Voltar ao Dashboard Normal"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Modo Normal
              </Button>
              
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-600">Modo Administrador</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-600 hover:text-slate-900"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="occurrences" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Ocorrências
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Relatórios
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            {/* Estatísticas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total de Usuários</p>
                      <p className="text-2xl font-semibold text-slate-900">{adminStats.totalUsers}</p>
                      <p className="text-xs text-green-600">+{adminStats.totalUsers - adminStats.activeUsers} inativos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Ocorrências Total</p>
                      <p className="text-2xl font-semibold text-slate-900">{adminStats.totalOccurrences}</p>
                      <p className="text-xs text-blue-600">{adminStats.monthlyOccurrences} este mês</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Tempo Médio Resposta</p>
                      <p className="text-2xl font-semibold text-slate-900">{adminStats.avgResponseTime}min</p>
                      <p className="text-xs text-green-600">-0.8min vs mês anterior</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Socorristas Ativos</p>
                      <p className="text-2xl font-semibold text-slate-900">{adminStats.activeSocorristas}</p>
                      <p className="text-xs text-green-600">Sistema: {adminStats.systemUptime}% uptime</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Operações frequentes do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 justify-start"
                    onClick={() => setActiveTab('users')}
                  >
                    <UserPlus className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Adicionar Usuário</div>
                      <div className="text-sm text-slate-500">Cadastrar socorrista ou colaborador</div>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-auto p-4 justify-start"
                    onClick={() => setCurrentPage('active-occurrences')}
                  >
                    <Heart className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Ver Ocorrências</div>
                      <div className="text-sm text-slate-500">Monitorar chamados ativos</div>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-auto p-4 justify-start"
                    onClick={() => setActiveTab('reports')}
                  >
                    <FileText className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Gerar Relatório</div>
                      <div className="text-sm text-slate-500">Exportar dados do sistema</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestão de Usuários */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Gestão de Usuários</h2>
                <p className="text-sm text-slate-600">Gerenciar socorristas, colaboradores e seus acessos</p>
              </div>
              <Button onClick={() => setShowAddUser(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Adicionar Usuário
              </Button>
            </div>

            {/* Filtros */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar por nome, email, RA ou departamento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filtrar por papel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Papéis</SelectItem>
                      <SelectItem value="socorrista">Socorristas</SelectItem>
                      <SelectItem value="colaborador">Colaboradores</SelectItem>
                      <SelectItem value="administrador">Administradores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Usuários */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left p-4 font-medium text-slate-900">Usuário</th>
                        <th className="text-left p-4 font-medium text-slate-900">Papel</th>
                        <th className="text-left p-4 font-medium text-slate-900">Departamento</th>
                        <th className="text-left p-4 font-medium text-slate-900">Último Login</th>
                        <th className="text-left p-4 font-medium text-slate-900">Status</th>
                        <th className="text-right p-4 font-medium text-slate-900">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => {
                        const RoleIcon = getRoleIcon(user.role);
                        return (
                          <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                                  <RoleIcon className="w-4 h-4 text-slate-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-slate-900">{user.name}</div>
                                  <div className="text-sm text-slate-500">{user.email}</div>
                                  {user.ra && (
                                    <div className="text-xs text-slate-400">RA: {user.ra}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className={`${getRoleColor(user.role)} border`}>
                                {getRoleLabel(user.role)}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <span className="text-slate-700">{user.department || '-'}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-slate-600">
                                {user.lastLogin 
                                  ? new Date(user.lastLogin).toLocaleDateString('pt-BR')
                                  : 'Nunca'
                                }
                              </span>
                            </td>
                            <td className="p-4">
                              <Badge className={user.isActive 
                                ? "bg-green-100 text-green-800 border-green-200" 
                                : "bg-red-100 text-red-800 border-red-200"
                              }>
                                {user.isActive ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Modal Adicionar Usuário */}
            {showAddUser && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle>Adicionar Novo Usuário</CardTitle>
                    <CardDescription>Cadastrar socorrista ou colaborador no sistema</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        placeholder="Digite o nome completo"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        placeholder="email@unifio.edu.br"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ra">RA/ID</Label>
                      <Input
                        id="ra"
                        value={newUser.ra}
                        onChange={(e) => setNewUser({...newUser, ra: e.target.value})}
                        placeholder="123456"
                        maxLength={6}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Papel *</Label>
                      <Select 
                        value={newUser.role} 
                        onValueChange={(value: UserRole) => setNewUser({...newUser, role: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="socorrista">Socorrista</SelectItem>
                          <SelectItem value="colaborador">Colaborador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Departamento</Label>
                      <Input
                        id="department"
                        value={newUser.department}
                        onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                        placeholder="Ex: Enfermagem, Segurança, etc."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Senha Inicial *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        placeholder="Senha temporária"
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddUser(false)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleAddUser}
                        className="flex-1 bg-unifio-primary hover:bg-unifio-primary/90"
                      >
                        Criar Usuário
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Outras abas podem ser implementadas aqui */}
          <TabsContent value="occurrences">
            <Card>
              <CardContent className="p-8 text-center">
                <Heart className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Gestão de Ocorrências</h3>
                <p className="text-slate-600 mb-4">
                  Visualização completa e gestão de todas as ocorrências do sistema
                </p>
                <Button onClick={() => setCurrentPage('active-occurrences')}>
                  Ver Ocorrências Ativas
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Relatórios Avançados</h3>
                <p className="text-slate-600 mb-4">
                  Geração de relatórios detalhados e análises do sistema
                </p>
                <Button onClick={() => setCurrentPage('reports')}>
                  Acessar Relatórios
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Configurações do Sistema</h2>
              <p className="text-sm text-slate-600">Gerenciamento de parâmetros globais do SOS UNIFIO</p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="general">Geral</TabsTrigger>
                <TabsTrigger value="emergency">Emergência</TabsTrigger>
                <TabsTrigger value="notifications">Notificações</TabsTrigger>
                <TabsTrigger value="security">Segurança</TabsTrigger>
                <TabsTrigger value="locations">Localizações</TabsTrigger>
                <TabsTrigger value="maintenance">Manutenção</TabsTrigger>
              </TabsList>

              {/* Configurações Gerais */}
              <TabsContent value="general" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações do Sistema</CardTitle>
                    <CardDescription>Configurações básicas e informações do SOS UNIFIO</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="system-name">Nome do Sistema</Label>
                        <Input id="system-name" defaultValue="SOS UNIFIO" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="institution">Instituição</Label>
                        <Input id="institution" defaultValue="Centro Universitário UNIFIO" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Email de Contato</Label>
                        <Input id="contact-email" type="email" defaultValue="ambulatorio@unifio.edu.br" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergency-phone">Telefone de Emergência</Label>
                        <Input id="emergency-phone" defaultValue="(11) 4004-9999" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="campus-address">Endereço do Campus</Label>
                      <Input id="campus-address" defaultValue="Rua das Flores, 123 - Centro - Osasco/SP" />
                    </div>
                    <div className="flex justify-end">
                      <Button>Salvar Alterações</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Interface</CardTitle>
                    <CardDescription>Personalização da experiência do usuário</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="max-concurrent-calls">Máx. Chamados Simultâneos</Label>
                        <Input id="max-concurrent-calls" type="number" defaultValue="10" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="session-timeout">Timeout de Sessão (min)</Label>
                        <Input id="session-timeout" type="number" defaultValue="30" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="dark-mode" defaultChecked={false} />
                      <Label htmlFor="dark-mode">Permitir modo escuro</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="sounds" defaultChecked={true} />
                      <Label htmlFor="sounds">Ativar sons de notificação</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Configurações de Emergência */}
              <TabsContent value="emergency" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Parâmetros de Resposta</CardTitle>
                    <CardDescription>Configuração de tempos limite e prioridades</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="critical-response-time">Resposta Crítica (min)</Label>
                        <Input id="critical-response-time" type="number" defaultValue="2" />
                        <p className="text-xs text-slate-500">Tempo máximo para casos críticos</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="urgent-response-time">Resposta Urgente (min)</Label>
                        <Input id="urgent-response-time" type="number" defaultValue="5" />
                        <p className="text-xs text-slate-500">Tempo máximo para casos urgentes</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="normal-response-time">Resposta Normal (min)</Label>
                        <Input id="normal-response-time" type="number" defaultValue="15" />
                        <p className="text-xs text-slate-500">Tempo máximo para casos normais</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="auto-escalate-time">Auto-escalação (min)</Label>
                        <Input id="auto-escalate-time" type="number" defaultValue="10" />
                        <p className="text-xs text-slate-500">Tempo para escalação automática</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="min-socorristas">Mín. Socorristas Ativos</Label>
                        <Input id="min-socorristas" type="number" defaultValue="2" />
                        <p className="text-xs text-slate-500">Número mínimo de socorristas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Critérios de Triagem</CardTitle>
                    <CardDescription>Configuração de priorização automática</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Palavras-chave que automaticamente classificam como CRÍTICO
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-2">
                      <Label htmlFor="critical-keywords">Palavras-chave Críticas</Label>
                      <Input 
                        id="critical-keywords" 
                        defaultValue="parada cardíaca, convulsão, sangramento abundante, desmaio, dificuldade respirar"
                        placeholder="Separar por vírgulas"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="urgent-keywords">Palavras-chave Urgentes</Label>
                      <Input 
                        id="urgent-keywords" 
                        defaultValue="dor peito, náusea intensa, tontura severa, febre alta"
                        placeholder="Separar por vírgulas"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="auto-triage" defaultChecked={true} />
                      <Label htmlFor="auto-triage">Ativar triagem automática por palavras-chave</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Configurações de Notificações */}
              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Notificações por Email</CardTitle>
                    <CardDescription>Configuração de alertas por email</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-server">Servidor SMTP</Label>
                        <Input id="smtp-server" defaultValue="smtp.unifio.edu.br" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-port">Porta SMTP</Label>
                        <Input id="smtp-port" type="number" defaultValue="587" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="email-critical" defaultChecked={true} />
                        <Label htmlFor="email-critical">Email para emergências críticas</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="email-reports" defaultChecked={false} />
                        <Label htmlFor="email-reports">Email para relatórios diários</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="email-maintenance" defaultChecked={true} />
                        <Label htmlFor="email-maintenance">Email para manutenções do sistema</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notificações Push</CardTitle>
                    <CardDescription>Configuração de notificações em tempo real</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="push-socorristas" defaultChecked={true} />
                        <Label htmlFor="push-socorristas">Push para socorristas em novos chamados</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="push-administradores" defaultChecked={true} />
                        <Label htmlFor="push-administradores">Push para administradores em emergências</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="push-solicitante" defaultChecked={true} />
                        <Label htmlFor="push-solicitante">Push para solicitante sobre status</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Configurações de Segurança */}
              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Políticas de Senha</CardTitle>
                    <CardDescription>Requisitos de segurança para senhas de usuários</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="min-password-length">Comprimento mínimo</Label>
                        <Input id="min-password-length" type="number" defaultValue="8" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-expiry">Expiração (dias)</Label>
                        <Input id="password-expiry" type="number" defaultValue="90" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="require-uppercase" defaultChecked={true} />
                        <Label htmlFor="require-uppercase">Exigir letras maiúsculas</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="require-numbers" defaultChecked={true} />
                        <Label htmlFor="require-numbers">Exigir números</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="require-symbols" defaultChecked={false} />
                        <Label htmlFor="require-symbols">Exigir símbolos especiais</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Controle de Acesso</CardTitle>
                    <CardDescription>Configurações de autenticação e autorização</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="max-login-attempts">Máx. tentativas de login</Label>
                        <Input id="max-login-attempts" type="number" defaultValue="3" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lockout-duration">Duração bloqueio (min)</Label>
                        <Input id="lockout-duration" type="number" defaultValue="15" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="force-password-change" defaultChecked={true} />
                        <Label htmlFor="force-password-change">Forçar mudança de senha no primeiro login</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="audit-log" defaultChecked={true} />
                        <Label htmlFor="audit-log">Manter log de auditoria</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Configurações de Localizações */}
              <TabsContent value="locations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Locais do Campus</CardTitle>
                    <CardDescription>Gerenciamento de prédios e salas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Locais Cadastrados</Label>
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Local
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg">
                        <div className="p-3 bg-slate-50 border-b">
                          <h4 className="font-medium">Prédio Principal</h4>
                        </div>
                        <div className="p-3 space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span>Ambulatório - Térreo</span>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Recepção - Térreo</span>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Laboratórios - 1º Andar</span>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg">
                        <div className="p-3 bg-slate-50 border-b">
                          <h4 className="font-medium">Prédio de Esportes</h4>
                        </div>
                        <div className="p-3 space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span>Quadra Principal</span>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Vestiários</span>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pontos de Encontro</CardTitle>
                    <CardDescription>Locais de encontro para emergências</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-meeting-point">Ponto de Encontro Principal</Label>
                      <Input id="primary-meeting-point" defaultValue="Pátio Central - próximo à fonte" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondary-meeting-point">Ponto de Encontro Secundário</Label>
                      <Input id="secondary-meeting-point" defaultValue="Estacionamento Principal - Entrada A" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency-exit">Saída de Emergência</Label>
                      <Input id="emergency-exit" defaultValue="Portão Principal + Portão Lateral (Esportes)" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Configurações de Manutenção */}
              <TabsContent value="maintenance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Status do Sistema</CardTitle>
                    <CardDescription>Informações sobre o funcionamento atual</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="font-medium">Sistema Online</span>
                        </div>
                        <p className="text-sm text-slate-600">Uptime: 99.8%</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-5 h-5 text-blue-500" />
                          <span className="font-medium">Performance</span>
                        </div>
                        <p className="text-sm text-slate-600">Resposta: 120ms</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Building className="w-5 h-5 text-purple-500" />
                          <span className="font-medium">Servidor</span>
                        </div>
                        <p className="text-sm text-slate-600">CPU: 15% | RAM: 4.2GB</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Backup e Manutenção</CardTitle>
                    <CardDescription>Configurações de backup automático e manutenção</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="backup-frequency">Frequência de Backup</Label>
                        <Select defaultValue="daily">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">A cada hora</SelectItem>
                            <SelectItem value="daily">Diário</SelectItem>
                            <SelectItem value="weekly">Semanal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="backup-retention">Retenção (dias)</Label>
                        <Input id="backup-retention" type="number" defaultValue="30" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="auto-backup" defaultChecked={true} />
                        <Label htmlFor="auto-backup">Backup automático ativado</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="maintenance-window" defaultChecked={true} />
                        <Label htmlFor="maintenance-window">Janela de manutenção: 02:00 - 04:00</Label>
                      </div>
                    </div>

                    <div className="pt-4 space-y-2">
                      <div className="flex gap-2">
                        <Button variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Backup Manual
                        </Button>
                        <Button variant="outline">
                          <Activity className="w-4 h-4 mr-2" />
                          Teste do Sistema
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500">
                        Último backup: hoje às 03:00 | Próximo backup: amanhã às 03:00
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Logs do Sistema</CardTitle>
                    <CardDescription>Registros de atividade e erros</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="log-level">Nível de Log</Label>
                        <Select defaultValue="info">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="error">Apenas Erros</SelectItem>
                            <SelectItem value="warn">Avisos e Erros</SelectItem>
                            <SelectItem value="info">Informações</SelectItem>
                            <SelectItem value="debug">Debug (Completo)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="log-retention">Retenção de Logs (dias)</Label>
                        <Input id="log-retention" type="number" defaultValue="90" />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Ver Logs
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar Logs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <div className="flex justify-end pt-6">
                <Button onClick={() => toast.success('Configurações salvas com sucesso!')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Salvar Todas as Configurações
                </Button>
              </div>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;