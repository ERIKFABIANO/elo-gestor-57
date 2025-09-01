import { useState } from "react";
import { Button } from "./button";
import { Home, CheckSquare, FileText, DollarSign, Settings, Menu, X, Shield, LogOut } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
// Removed LanguageSelector - using Portuguese directly
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
  { id: 'notes', label: 'Notas', icon: FileText },
  { id: 'finance', label: 'Financeiro', icon: DollarSign },
  { id: 'admin', label: 'Administração', icon: Shield },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export const Navigation = ({ activeSection, onSectionChange }: NavigationProps) => {
  const { profile, signOut, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-card-glass/80 backdrop-blur-sm border border-card-border shadow-card"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-card-glass/95 backdrop-blur-xl border-r border-card-border
        transform transition-transform duration-300 ease-bounce lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-card-border">
            <img src={logo} alt="EloGestor Logo" className="w-12 h-12" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                EloGestor
              </h1>
              <p className="text-sm text-muted-foreground">Sistema de Gestão</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              // Hide admin section for non-admin users
              if (item.id === 'admin' && !isAdmin) {
                return null;
              }
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`
                    w-full justify-start gap-3 h-12 text-left font-medium transition-smooth
                    ${isActive 
                      ? 'bg-gradient-primary text-white shadow-glow hover:shadow-glow' 
                      : 'hover:bg-secondary/50 hover:text-foreground'
                    }
                  `}
                  onClick={() => {
                    onSectionChange(item.id);
                    setIsOpen(false);
                  }}
                >
                  <Icon size={20} />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="mt-auto pt-6 border-t border-card-border space-y-3">
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                {profile?.display_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{profile?.display_name || 'Usuário'}</p>
                <p className="text-xs text-muted-foreground">
                  {isAdmin ? 'Administrador' : 'Usuário'} • Online
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="w-9 h-9 p-0 hover:bg-destructive/10 hover:text-destructive transition-smooth"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};