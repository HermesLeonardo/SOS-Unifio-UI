import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Badge } from './ui/badge';
import { 
  Menu,
  X,
  Home,
  AlertTriangle,
  ClipboardList,
  History,
  FileText,
  LogOut,
  User,
  Settings,
  Bell,
  Activity,
  Users,
  MapPin,
  Shield,
  Heart
} from 'lucide-react';

const MobileNav: React.FC = () => {
  const { user, setCurrentPage, logout, currentPage, incomingCalls } = useApp() as any;
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  // Menu items based on user role
  const getMenuItems = () => {
    const baseItems = [];

    if (user.role === 'aluno') {
      return [
        { icon: AlertTriangle, label: 'Solicitar Atendimento', page: 'new-occurrence', badge: null },
        { icon: History, label: 'Meus Chamados', page: 'my-occurrences', badge: null },
      ];
    }

    if (user.role === 'socorrista') {
      return [
        { icon: Home, label: 'Dashboard', page: 'dashboard', badge: null },
        { icon: Bell, label: 'Chamados Ativos', page: 'active-occurrences', badge: incomingCalls?.length || 0 },
        { icon: ClipboardList, label: 'Meus Atendimentos', page: 'my-assignments', badge: null },
        { icon: History, label: 'Histórico', page: 'history', badge: null },
        { icon: FileText, label: 'Relatórios', page: 'reports', badge: null },
      ];
    }

    if (user.role === 'colaborador') {
      return [
        { icon: Home, label: 'Dashboard', page: 'dashboard', badge: null },
        { icon: AlertTriangle, label: 'Novo Chamado', page: 'new-occurrence', badge: null },
        { icon: Bell, label: 'Chamados Ativos', page: 'active-occurrences', badge: incomingCalls?.length || 0 },
        { icon: History, label: 'Histórico', page: 'history', badge: null },
        { icon: FileText, label: 'Relatórios', page: 'reports', badge: null },
      ];
    }

    if (user.role === 'administrador') {
      return [
        { icon: Home, label: 'Dashboard', page: 'dashboard', badge: null },
        { icon: Shield, label: 'Admin', page: 'admin-overview', badge: null },
        { icon: Bell, label: 'Chamados Ativos', page: 'active-occurrences', badge: incomingCalls?.length || 0 },
        { icon: Users, label: 'Usuários', page: 'users', badge: null },
        { icon: MapPin, label: 'Localizações', page: 'locations', badge: null },
        { icon: FileText, label: 'Relatórios', page: 'reports', badge: null },
        { icon: Settings, label: 'Configurações', page: 'settings', badge: null },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="fixed top-4 left-4 z-50 bg-white shadow-md rounded-full w-12 h-12"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] sm:w-[320px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-unifio-primary rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-unifio-primary">SOS UNIFIO</div>
                <div className="text-xs text-gray-500">Sistema de Emergência</div>
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-8 space-y-1">
            {/* User Info */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-unifio-primary rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;
              
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavigate(item.page)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-unifio-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge > 0 && (
                    <Badge variant="destructive" className="rounded-full h-5 min-w-5 px-1.5">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}

            {/* Logout */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sair</span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;