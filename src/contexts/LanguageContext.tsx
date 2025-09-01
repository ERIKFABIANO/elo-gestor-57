import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'pt' | 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  pt: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.tasks': 'Tarefas',
    'nav.notes': 'Notas',
    'nav.finance': 'Financeiro',
    'nav.admin': 'Administração',
    'nav.settings': 'Configurações',
    
    // Authentication
    'auth.loginTitle': 'Entrar no sistema',
    'auth.signupTitle': 'Criar conta',
    'auth.loginSubtitle': 'Por favor, insira suas informações de login ou',
    'auth.signupSubtitle': 'Preencha os dados para criar sua conta ou',
    'auth.clickHereLogin': 'clique aqui para entrar',
    'auth.email': 'E-mail',
    'auth.password': 'Senha',
    'auth.displayName': 'Nome completo',
    'auth.emailPlaceholder': 'seu@email.com',
    'auth.passwordPlaceholder': 'Digite sua senha',
    'auth.displayNamePlaceholder': 'Seu nome completo',
    'auth.rememberMe': 'Lembrar de mim',
    'auth.login': 'Entrar',
    'auth.signup': 'Criar conta',
    'auth.noAccount': 'Não tem uma conta?',
    'auth.hasAccount': 'Já tem uma conta?',
    'auth.signupHere': 'Cadastre-se aqui',
    'auth.loginHere': 'Entre aqui',
    'auth.checkEmail': 'Verifique seu email para confirmar o cadastro',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Bem-vindo ao EloGestor',
    'dashboard.overview': 'Visão Geral',
    'dashboard.completedTasks': 'Tarefas Concluídas',
    'dashboard.pendingTasks': 'Tarefas Pendentes',
    'dashboard.dailyTasks': 'Tarefas do Dia',
    'dashboard.totalScore': 'Pontuação Total',
    'dashboard.weeklyProgress': 'Progresso Semanal',
    'dashboard.monday': 'Segunda',
    'dashboard.tuesday': 'Terça',
    'dashboard.wednesday': 'Quarta',
    'dashboard.thursday': 'Quinta',
    'dashboard.friday': 'Sexta',
    'dashboard.saturday': 'Sábado',
    'dashboard.sunday': 'Domingo',
    
    // Admin
    'admin.title': 'Painel Administrativo',
    'admin.users': 'Usuários',
    'admin.totalUsers': 'Total de Usuários',
    'admin.totalTasks': 'Total de Tarefas',
    'admin.dailyAccess': 'Acessos Diários',
    'admin.userManagement': 'Gerenciamento de Usuários',
    'admin.name': 'Nome',
    'admin.email': 'E-mail',
    'admin.role': 'Função',
    'admin.createdAt': 'Criado em',
    'admin.actions': 'Ações',
    'admin.edit': 'Editar',
    'admin.delete': 'Excluir',
    'admin.editUser': 'Editar Usuário',
    'admin.newPassword': 'Nova Senha',
    'admin.profilePhoto': 'Foto do Perfil',
    'admin.save': 'Salvar',
    'admin.cancel': 'Cancelar',
    'admin.confirmDelete': 'Confirmar Exclusão',
    'admin.deleteMessage': 'Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.',
    'admin.loading': 'Carregando...',
    'admin.noUsers': 'Nenhum usuário encontrado',
    
    // Common
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Excluir',
    'common.edit': 'Editar',
    'common.close': 'Fechar',
    
    // Settings
    'settings.language': 'Idioma',
    'settings.selectLanguage': 'Selecionar idioma',
    'settings.portuguese': 'Português',
    'settings.spanish': 'Espanhol',
    'settings.english': 'Inglês',
    
    // Common
    'common.back': 'Voltar',
  },
  
  es: {
    // Navigation
    'nav.dashboard': 'Panel',
    'nav.tasks': 'Tareas',
    'nav.notes': 'Notas',
    'nav.finance': 'Finanzas',
    'nav.admin': 'Administración',
    'nav.settings': 'Configuración',
    
    // Authentication
    'auth.loginTitle': 'Iniciar sesión',
    'auth.signupTitle': 'Crear cuenta',
    'auth.loginSubtitle': 'Por favor, ingrese su información de inicio de sesión o',
    'auth.signupSubtitle': 'Complete los datos para crear su cuenta o',
    'auth.clickHereLogin': 'haga clic aquí para iniciar sesión',
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.displayName': 'Nombre completo',
    'auth.emailPlaceholder': 'su@email.com',
    'auth.passwordPlaceholder': 'Ingrese su contraseña',
    'auth.displayNamePlaceholder': 'Su nombre completo',
    'auth.rememberMe': 'Recordarme',
    'auth.login': 'Iniciar sesión',
    'auth.signup': 'Crear cuenta',
    'auth.noAccount': '¿No tienes cuenta?',
    'auth.hasAccount': '¿Ya tienes cuenta?',
    'auth.signupHere': 'Regístrate aquí',
    'auth.loginHere': 'Inicia sesión aquí',
    'auth.checkEmail': 'Revisa tu email para confirmar el registro',
    
    // Dashboard
    'dashboard.title': 'Panel de Control',
    'dashboard.welcome': 'Bienvenido a EloGestor',
    'dashboard.overview': 'Vista General',
    'dashboard.completedTasks': 'Tareas Completadas',
    'dashboard.pendingTasks': 'Tareas Pendientes',
    'dashboard.dailyTasks': 'Tareas del Día',
    'dashboard.totalScore': 'Puntuación Total',
    'dashboard.weeklyProgress': 'Progreso Semanal',
    'dashboard.monday': 'Lunes',
    'dashboard.tuesday': 'Martes',
    'dashboard.wednesday': 'Miércoles',
    'dashboard.thursday': 'Jueves',
    'dashboard.friday': 'Viernes',
    'dashboard.saturday': 'Sábado',
    'dashboard.sunday': 'Domingo',
    
    // Admin
    'admin.title': 'Panel Administrativo',
    'admin.users': 'Usuarios',
    'admin.totalUsers': 'Total de Usuarios',
    'admin.totalTasks': 'Total de Tareas',
    'admin.dailyAccess': 'Accesos Diarios',
    'admin.userManagement': 'Gestión de Usuarios',
    'admin.name': 'Nombre',
    'admin.email': 'Correo',
    'admin.role': 'Rol',
    'admin.createdAt': 'Creado en',
    'admin.actions': 'Acciones',
    'admin.edit': 'Editar',
    'admin.delete': 'Eliminar',
    'admin.editUser': 'Editar Usuario',
    'admin.newPassword': 'Nueva Contraseña',
    'admin.profilePhoto': 'Foto de Perfil',
    'admin.save': 'Guardar',
    'admin.cancel': 'Cancelar',
    'admin.confirmDelete': 'Confirmar Eliminación',
    'admin.deleteMessage': '¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.',
    'admin.loading': 'Cargando...',
    'admin.noUsers': 'No se encontraron usuarios',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.close': 'Cerrar',
    
    // Settings
    'settings.language': 'Idioma',
    'settings.selectLanguage': 'Seleccionar idioma',
    'settings.portuguese': 'Portugués',
    'settings.spanish': 'Español',
    'settings.english': 'Inglés',
    
    // Common
    'common.back': 'Volver',
  },
  
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.tasks': 'Tasks',
    'nav.notes': 'Notes',
    'nav.finance': 'Finance',
    'nav.admin': 'Administration',
    'nav.settings': 'Settings',
    
    // Authentication
    'auth.loginTitle': 'Login to system',
    'auth.signupTitle': 'Create account',
    'auth.loginSubtitle': 'Please enter your login information or',
    'auth.signupSubtitle': 'Fill in the details to create your account or',
    'auth.clickHereLogin': 'click here to login',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.displayName': 'Full name',
    'auth.emailPlaceholder': 'your@email.com',
    'auth.passwordPlaceholder': 'Enter your password',
    'auth.displayNamePlaceholder': 'Your full name',
    'auth.rememberMe': 'Remember me',
    'auth.login': 'Log in',
    'auth.signup': 'Sign up',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.signupHere': 'Sign up here',
    'auth.loginHere': 'Log in here',
    'auth.checkEmail': 'Check your email to confirm registration',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome to EloGestor',
    'dashboard.overview': 'Overview',
    'dashboard.completedTasks': 'Completed Tasks',
    'dashboard.pendingTasks': 'Pending Tasks',
    'dashboard.dailyTasks': 'Daily Tasks',
    'dashboard.totalScore': 'Total Score',
    'dashboard.weeklyProgress': 'Weekly Progress',
    'dashboard.monday': 'Monday',
    'dashboard.tuesday': 'Tuesday',
    'dashboard.wednesday': 'Wednesday',
    'dashboard.thursday': 'Thursday',
    'dashboard.friday': 'Friday',
    'dashboard.saturday': 'Saturday',
    'dashboard.sunday': 'Sunday',
    
    // Admin
    'admin.title': 'Administrative Panel',
    'admin.users': 'Users',
    'admin.totalUsers': 'Total Users',
    'admin.totalTasks': 'Total Tasks',
    'admin.dailyAccess': 'Daily Access',
    'admin.userManagement': 'User Management',
    'admin.name': 'Name',
    'admin.email': 'Email',
    'admin.role': 'Role',
    'admin.createdAt': 'Created at',
    'admin.actions': 'Actions',
    'admin.edit': 'Edit',
    'admin.delete': 'Delete',
    'admin.editUser': 'Edit User',
    'admin.newPassword': 'New Password',
    'admin.profilePhoto': 'Profile Photo',
    'admin.save': 'Save',
    'admin.cancel': 'Cancel',
    'admin.confirmDelete': 'Confirm Deletion',
    'admin.deleteMessage': 'Are you sure you want to delete this user? This action cannot be undone.',
    'admin.loading': 'Loading...',
    'admin.noUsers': 'No users found',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    
    // Settings
    'settings.language': 'Language',
    'settings.selectLanguage': 'Select language',
    'settings.portuguese': 'Portuguese',
    'settings.spanish': 'Spanish',
    'settings.english': 'English',
    
    // Common
    'common.back': 'Back',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language') as Language;
    return stored || 'pt';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};