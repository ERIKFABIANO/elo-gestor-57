import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { TaskCalendar } from "@/components/tasks/TaskCalendar";
import { NotesManager } from "@/components/notes/NotesManager";
import { FinanceDashboard } from "@/components/finance/FinanceDashboard";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { SettingsManager } from "@/components/settings/SettingsManager";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
// Removed language context - using Portuguese directly

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onNavigateToSection={setActiveSection} />;
      case 'tasks':
        return <TaskCalendar />;
      case 'notes':
        return <NotesManager />;
      case 'finance':
        return <FinanceDashboard />;
      case 'admin':
        return isAdmin ? <AdminDashboard /> : <Dashboard onNavigateToSection={setActiveSection} />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <Dashboard onNavigateToSection={setActiveSection} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Entrar no sistema</h1>
          <Button onClick={() => navigate('/auth')}>
            Entrar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="lg:ml-64 p-4 lg:p-8 pt-16 lg:pt-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
