export type Role = "Aluno" | "Colaborador" | "Socorrista" | "Administrador";

export const ROLES: Role[] = ["Aluno", "Colaborador", "Socorrista", "Administrador"];

export type Permissions = {
  canAccessPanel: boolean;    // pode abrir o painel
  canViewCalls: boolean;      // pode ver chamados
  canAcceptCalls: boolean;    // pode aceitar chamados
  canViewReports: boolean;    // pode ver relatórios
  canCreateReports: boolean;  // pode criar relatórios
  canViewConfig: boolean;     // pode acessar configurações
  isAdmin: boolean;           // privilégios de admin
};

export const PERMISSIONS: Record<Role, Permissions> = {
  Aluno: {
    canAccessPanel: false,
    canViewCalls: false,
    canAcceptCalls: false,
    canViewReports: false,
    canCreateReports: false,
    canViewConfig: false,
    isAdmin: false,
  },
  Colaborador: {
    canAccessPanel: true,
    canViewCalls: true,
    canAcceptCalls: true,
    canViewReports: true,
    canCreateReports: true,
    canViewConfig: false,
    isAdmin: false,
  },
  Socorrista: {
    canAccessPanel: true,
    canViewCalls: true,
    canAcceptCalls: true,
    canViewReports: true,
    canCreateReports: true,
    canViewConfig: false,
    isAdmin: false,
  },
  Administrador: {
    canAccessPanel: true,
    canViewCalls: true,
    canAcceptCalls: true,
    canViewReports: true,
    canCreateReports: true,
    canViewConfig: true,
    isAdmin: true,
  },
};
