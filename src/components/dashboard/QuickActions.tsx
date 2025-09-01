import { Button } from "@/components/ui/button";
import { Plus, FileText, DollarSign, Target } from "lucide-react";

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

export const QuickActions = ({ onActionClick }: QuickActionsProps) => {
  const actions = [
    {
      id: 'add-task',
      label: 'Nova Tarefa',
      icon: Plus,
      gradient: 'bg-gradient-primary',
    },
    {
      id: 'add-note', 
      label: 'Criar Anotação',
      icon: FileText,
      gradient: 'bg-gradient-purple',
    },
    {
      id: 'add-expense',
      label: 'Registrar Gasto',
      icon: DollarSign,
      gradient: 'bg-gradient-orange',
    },
    {
      id: 'set-goal',
      label: 'Definir Meta',
      icon: Target,
      gradient: 'bg-gradient-success',
    },
  ];

  return (
    <div className="bg-card-glass/80 backdrop-blur-sm border border-card-border rounded-lg p-6 shadow-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Ações Rápidas</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              variant="ghost"
              className={`
                h-auto p-4 flex-col gap-2 hover:bg-secondary/30 transition-smooth
                border border-card-border/50 hover:border-card-border
              `}
              onClick={() => onActionClick(action.id)}
            >
              <div className={`p-3 rounded-lg ${action.gradient} shadow-card`}>
                <Icon size={20} className="text-white" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};