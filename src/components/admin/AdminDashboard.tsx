import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { UserManagement } from "./UserManagement";

interface AdminStats {
  totalUsers: number;
  totalTasks: number;
  completedTasks: number;
  dailyAccess: number;
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    dailyAccess: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Get total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total tasks
      const { count: tasksCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true });

      // Get completed tasks - for now using 0 as placeholder
      const completedTasksCount = 0;

      // Get daily access for today
      const today = new Date().toISOString().split('T')[0];
      const { data: dailyAccessData } = await supabase
        .from('daily_access')
        .select('access_count')
        .eq('access_date', today);

      const totalDailyAccess = dailyAccessData?.reduce((sum, record) => sum + record.access_count, 0) || 0;

      setStats({
        totalUsers: usersCount || 0,
        totalTasks: tasksCount || 0,
        completedTasks: completedTasksCount || 0,
        dailyAccess: totalDailyAccess,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total de Usuários",
      value: stats.totalUsers,
      icon: Users,
      gradient: "bg-gradient-primary",
    },
    {
      title: "Total de Tarefas Criadas",
      value: stats.totalTasks,
      icon: ClipboardList,
      gradient: "bg-gradient-orange",
    },
    {
      title: "Total de Tarefas Realizadas",
      value: stats.completedTasks,
      icon: TrendingUp,
      gradient: "bg-gradient-success",
    },
    {
      title: "Acessos Diários",
      value: stats.dailyAccess,
      icon: TrendingUp,
      gradient: "bg-gradient-purple",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Painel Administrativo</h1>
        <p className="text-muted-foreground">Visão Geral do Sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden border-0 shadow-card">
              <div className={`absolute inset-0 ${stat.gradient} opacity-5`} />
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.gradient} bg-opacity-10`}>
                  <Icon className="w-4 h-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl font-bold text-foreground">
                  {stat.value.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* User Management */}
      <UserManagement />
    </div>
  );
};