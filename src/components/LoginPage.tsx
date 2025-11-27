import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useApp } from '../contexts/AppContext';
import { 
  Heart, 
  User, 
  Lock, 
  Users, 
  GraduationCap, 
  UserCheck, 
  Shield,
  Building,
  Eye,
  EyeOff,
  Crown,
  Settings
} from 'lucide-react';
import { loginUser } from '../services/api';

const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [ra, setRa] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'aluno' | 'colaborador' | 'socorrista' | 'administrador'>('aluno');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  console.log("LoginPage carregado");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ra || !password) return;

    // validação de matrícula (ex.: 6 dígitos)
    if (!/^[A-Za-z0-9]{5,10}$/.test(ra)) {
      alert("Matrícula inválida.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await loginUser(ra, password);

      if (!data || !data.usuario || !data.token) {
        alert("Resposta inválida do servidor.");
        setIsLoading(false);
        return;
      }

      const { token, usuario } = data;

      // salva token JWT localmente
      localStorage.setItem("token", token);

      // aguarda um ciclo de renderização antes de trocar o contexto
      setTimeout(() => {
        login(usuario.nome, usuario.tipo, ra);
      }, 0);
    } catch (err: any) {
      const msg =
        err?.message || "Erro ao realizar login. Tente novamente.";
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    {
      id: 'aluno' as const,
      name: 'Aluno',
      description: 'Estudantes da UNIFIO',
      icon: GraduationCap,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-800',
      selectedColor: 'bg-blue-100 border-blue-400 text-blue-900'
    },
    {
      id: 'colaborador' as const,
      name: 'Colaboradores',
      description: 'Professores, brigadistas e funcionários',
      icon: UserCheck,
      color: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-800',
      selectedColor: 'bg-green-100 border-green-400 text-green-900'
    },
    {
      id: 'socorrista' as const,
      name: 'Socorrista',
      description: 'Equipe médica especializada',
      icon: Shield,
      color: 'bg-red-50 hover:bg-red-100 border-red-200 text-red-800',
      selectedColor: 'bg-red-100 border-red-400 text-red-900'
    },
    {
      id: 'administrador' as const,
      name: 'Administrador',
      description: 'Reitores, suporte e gestão do sistema',
      icon: Crown,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-800',
      selectedColor: 'bg-purple-100 border-purple-400 text-purple-900'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-unifio-primary via-unifio-blue-light to-unifio-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <Heart className="w-10 h-10 text-emergency-critical" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SOS UNIFIO</h1>
          <p className="text-unifio-white/90">
            Sistema de Emergência Médica
          </p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-slate-900">
              Acessar o Sistema
            </CardTitle>
            <p className="text-center text-sm text-slate-600">
              Selecione seu perfil e faça login
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Seleção de Perfil */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">
                Tipo de Usuário
              </label>
              <div className="grid grid-cols-1 gap-2">
                {roleOptions.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        isSelected ? role.selectedColor : role.color
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{role.name}</div>
                          <div className="text-xs opacity-75 truncate">
                            {role.description}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-2 h-2 bg-current rounded-full flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Alerta especial para Administradores */}
            {selectedRole === 'administrador' && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Settings className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-purple-800">
                    <p className="font-medium mb-1">Acesso Administrativo</p>
                    <p className="text-xs text-purple-700">
                      Destinado exclusivamente para reitores, suporte técnico e gestores do sistema com permissões especiais.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Formulário de Login */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  {selectedRole === 'administrador' ? 'ID do Sistema' : 'RA (Registro Acadêmico)'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder={selectedRole === 'administrador' ? 'Digite seu ID (6 dígitos)' : 'Digite seu RA (6 dígitos)'}
                    value={ra}
                    onChange={(e) => {
                      // Permitir apenas números e limitar a 6 dígitos
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setRa(value);
                    }}
                    className="pl-10 bg-white text-center tracking-wider"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-xs text-slate-500 text-center">
                  {selectedRole === 'administrador' ? 'Exemplo: 999999' : 'Exemplo: 123456'}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-unifio-primary hover:bg-unifio-primary/90 text-white font-medium py-2.5"
                disabled={isLoading || !ra || !password || ra.length !== 6}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Entrando...
                  </div>
                ) : (
                  selectedRole === 'administrador' ? 'Acessar Painel Administrativo' : 'Entrar no Sistema'
                )}
              </Button>
            </form>

            {/* Informações Adicionais */}
            <div className="text-center space-y-2">
              <p className="text-xs text-slate-600">
                {selectedRole === 'administrador' 
                  ? 'Problemas de acesso? Contate o suporte técnico'
                  : 'Esqueceu sua senha? Entre em contato com a TI'
                }
              </p>
              <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                <Shield className="w-3 h-3" />
                <span>Sistema seguro e criptografado</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rodapé */}
        <div className="text-center mt-6 text-unifio-white/80 text-sm">
          <p>© 2024 UNIFIO - Centro Universitário</p>
          <p>Sistema de Emergência Médica</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;