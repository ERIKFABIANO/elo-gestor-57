import { CheckSquare, Clock, Target, TrendingUp, Calendar } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { QuickActions } from "./QuickActions";
import { VerseWidget } from "./VerseWidget";
import { useEffect, useState } from "react";
import { getDailyQuote } from "@/utils/motivationalQuotes";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardProps {
  onNavigateToSection?: (section: string) => void;
}

export const Dashboard = ({ onNavigateToSection }: DashboardProps) => {
  const { profile } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }));

  const [dailyQuote] = useState(getDailyQuote());

  // Simular dados das tarefas (posteriormente conectar com estado global)
  const [taskStats, setTaskStats] = useState({
    completed: 0,
    pending: 0,
    dailyTasks: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleActionClick = (action: string) => {
    const sectionMap: Record<string, string> = {
      'add-task': 'tasks',
      'add-note': 'notes', 
      'add-expense': 'finance',
      'set-goal': 'tasks'
    };
    
    const targetSection = sectionMap[action];
    if (targetSection && onNavigateToSection) {
      onNavigateToSection(targetSection);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com Data/Hora */}
      <div className="bg-card-glass/80 backdrop-blur-sm border border-card-border rounded-lg p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Bem-vindo, {profile?.display_name || 'Usuário'} 👋
            </h1>
            <p className="text-muted-foreground italic">"{dailyQuote}"</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">{currentTime}</span>
            </div>
            <div className="text-xs text-muted-foreground">Atualização em tempo real</div>
          </div>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Tarefas Concluídas"
          value={taskStats.completed}
          icon={CheckSquare}
          gradient="success"
        />
        <MetricCard
          title="Tarefas Pendentes"
          value={taskStats.pending}
          icon={Clock}
          gradient="orange"
        />
        <MetricCard
          title="Tarefas do Dia"
          value={taskStats.dailyTasks}
          icon={Target}
          gradient="purple"
        />
        <MetricCard
          title="Pontuação Total"
          value={0}
          icon={TrendingUp}
          gradient="primary"
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda - Ações Rápidas */}
        <div className="lg:col-span-1">
          <QuickActions onActionClick={handleActionClick} />
        </div>

        {/* Coluna Direita - Versículo */}
        <div className="lg:col-span-2">
          <VerseWidget />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progresso Semanal - Valores zerados inicialmente */}
        <div className="lg:col-span-3 bg-card-glass/80 backdrop-blur-sm border border-card-border rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Seu Progresso Semanal</h3>
          <div className="space-y-3">
            {[
              'Segunda', 
              'Terça', 
              'Quarta', 
              'Quinta', 
              'Sexta', 
              'Sábado', 
              'Domingo'
            ].map((day, index) => {
              const isToday = index === new Date().getDay() - 1;
              
              return (
                <div key={day} className="flex items-center gap-3">
                  <div className={`w-16 text-sm font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                    {day}
                  </div>
                  <div className="flex-1 bg-secondary/30 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000 bg-secondary/50"
                      style={{ width: '0%' }}
                    />
                  </div>
                  <div className="w-12 text-sm text-muted-foreground text-right">
                    0%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};