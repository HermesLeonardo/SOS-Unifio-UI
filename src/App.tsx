import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { Toaster } from './components/ui/sonner';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import NewOccurrencePageStudent from './components/NewOccurrencePageStudent';
import TriagePage from './components/TriagePage';
import OccurrenceStatusPage from './components/OccurrenceStatusPage';
import MyAssignmentsPage from './components/MyAssignmentsPage';
import HistoryPage from './components/HistoryPage';
import ActiveOccurrencesPage from './components/ActiveOccurrencesPage';
import ReportsPage from './components/ReportsPage';

const AppRouter: React.FC = () => {
  const { currentPage, user, isAdminMode } = useApp() as any;

  // Se não estiver logado, sempre mostrar login
  if (!user) {
    return <LoginPage />;
  }

  // Roteamento baseado na página atual e perfil do usuário
  switch (currentPage) {
    case 'login':
      // Se usuário já está logado, redirecionar para página apropriada
      if (user.role === 'aluno') {
        return <NewOccurrencePageStudent />;
      } else if (user.role === 'administrador') {
        return isAdminMode ? <AdminDashboard /> : <Dashboard />;
      } else {
        return <Dashboard />;
      }
    
    case 'dashboard':
      // Alunos não têm acesso ao dashboard, redirecionam para criação de chamado
      if (user.role === 'aluno') {
        return <NewOccurrencePageStudent />;
      }
      // Administradores podem alternar entre dashboard padrão e admin
      if (user.role === 'administrador') {
        return isAdminMode ? <AdminDashboard /> : <Dashboard />;
      }
      return <Dashboard />;
    
    case 'new-occurrence':
      // Interface específica para alunos e colaboradores
      if (user.role === 'aluno' || user.role === 'colaborador') {
        return <NewOccurrencePageStudent />;
      }
      // Administradores podem criar ocorrências
      if (user.role === 'administrador') {
        return <NewOccurrencePageStudent />;
      }
      // Outros perfis não podem criar ocorrências
      return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-red-600">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Restrito</h2>
            <p className="text-gray-600 mb-6">
              Apenas alunos e colaboradores podem abrir chamados de emergência médica.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-unifio-primary text-white px-6 py-2 rounded-lg hover:bg-unifio-primary/90 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>;
    
    case 'triage':
      // Apenas socorristas e administradores podem acessar triagem
      if (user.role === 'socorrista' || user.role === 'administrador') {
        return <TriagePage />;
      }
      return user.role === 'administrador' ? <AdminDashboard /> : <Dashboard />;
    
    case 'occurrence-status':
      // Página de acompanhamento do chamado com chatbot
      return <OccurrenceStatusPage />;

    case 'my-occurrences':
      return <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Meus Chamados</h2>
            <p className="text-gray-600 mb-8">Histórico de chamados de emergência</p>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <p className="text-gray-500">
                Esta funcionalidade está em desenvolvimento e será disponibilizada em breve.
              </p>
              {user.role === 'aluno' && (
                <button
                  onClick={() => window.history.back()}
                  className="mt-4 bg-unifio-primary text-white px-6 py-2 rounded-lg hover:bg-unifio-primary/90 transition-colors"
                >
                  Voltar para Solicitar Atendimento
                </button>
              )}
            </div>
          </div>
        </div>
      </div>;
    
    case 'active-occurrences':
      // Página funcional para socorristas, colaboradores e administradores
      if (user.role === 'socorrista' || user.role === 'colaborador' || user.role === 'administrador') {
        return <ActiveOccurrencesPage />;
      }
      return <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Chamados Ativos</h2>
            <p className="text-gray-600 mb-8">
              Acesso restrito a equipe de resposta
            </p>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <p className="text-gray-500">
                Acesso restrito a socorristas e colaboradores.
              </p>
            </div>
          </div>
        </div>
      </div>;
    
    case 'my-assignments':
      // Página funcional para socorristas e administradores
      if (user.role === 'socorrista' || user.role === 'administrador') {
        return <MyAssignmentsPage />;
      }
      return <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Meus Atendimentos</h2>
            <p className="text-gray-600 mb-8">Apenas socorristas têm acesso a esta área</p>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <p className="text-gray-500">
                Acesso restrito a socorristas.
              </p>
            </div>
          </div>
        </div>
      </div>;
    
    case 'queue':
      return <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Fila de Espera</h2>
            <p className="text-gray-600 mb-8">Gerenciamento da fila de atendimento</p>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <p className="text-gray-500">
                Sistema de fila em desenvolvimento...
              </p>
            </div>
          </div>
        </div>
      </div>;
    
    case 'reports':
      // Página de relatórios para colaboradores, socorristas e administradores
      if (user.role === 'colaborador' || user.role === 'socorrista' || user.role === 'administrador') {
        return <ReportsPage />;
      }
      return <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Relatórios</h2>
            <p className="text-gray-600 mb-8">Acesso restrito</p>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <p className="text-gray-500">
                Apenas colaboradores, socorristas e administradores têm acesso aos relatórios.
              </p>
            </div>
          </div>
        </div>
      </div>;
    
    case 'history':
      // Página funcional para socorristas e administradores
      if (user.role === 'socorrista' || user.role === 'administrador') {
        return <HistoryPage />;
      }
      return <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Histórico</h2>
            <p className="text-gray-600 mb-8">Histórico completo de ocorrências</p>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <p className="text-gray-500">
                Histórico detalhado em desenvolvimento...
              </p>
              {user.role === 'aluno' && (
                <button
                  onClick={() => window.history.back()}
                  className="mt-4 bg-unifio-primary text-white px-6 py-2 rounded-lg hover:bg-unifio-primary/90 transition-colors"
                >
                  Voltar para Solicitar Atendimento
                </button>
              )}
            </div>
          </div>
        </div>
      </div>;

    // Páginas administrativas - AGORA DISPONÍVEIS PARA ADMINISTRADORES
    case 'admin-overview':
    case 'admin-users':
    case 'admin-locations':
    case 'admin-settings':
    case 'overview':
    case 'users':
    case 'locations':
    case 'settings':
      if (user.role === 'administrador') {
        return <AdminDashboard />;
      }
      return user.role === 'aluno' ? <NewOccurrencePageStudent /> : <Dashboard />;
    
    // Página de erro para rotas não encontradas
    default:
      return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-gray-500">🔍</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Página não encontrada</h2>
            <p className="text-gray-600 mb-6">A página que você está procurando não existe ou foi movida.</p>
            <button
              onClick={() => {
                if (user.role === 'aluno') {
                  window.location.href = '#new-occurrence';
                } else {
                  window.location.href = '#dashboard';
                }
                window.location.reload();
              }}
              className="bg-unifio-primary text-white px-6 py-2 rounded-lg hover:bg-unifio-primary/90 transition-colors"
            >
              {user.role === 'aluno' ? 'Ir para Solicitar Atendimento' : 'Voltar ao Dashboard'}
            </button>
          </div>
        </div>
      </div>;
  }
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50">
        <AppRouter />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1a1a1a',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
            },
          }}
        />
      </div>
    </AppProvider>
  );
}