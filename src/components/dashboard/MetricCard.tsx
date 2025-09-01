import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient: 'primary' | 'orange' | 'purple' | 'success';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const gradientClasses = {
  primary: 'bg-gradient-primary',
  orange: 'bg-gradient-orange', 
  purple: 'bg-gradient-purple',
  success: 'bg-gradient-success'
};

export const MetricCard = ({ title, value, icon: Icon, gradient, trend }: MetricCardProps) => {
  return (
    <div className="bg-card-glass/80 backdrop-blur-sm border border-card-border rounded-lg p-6 shadow-card hover:shadow-float transition-smooth">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
              <span>{trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground">vs mês anterior</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${gradientClasses[gradient]} shadow-card`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};