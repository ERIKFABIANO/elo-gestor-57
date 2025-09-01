import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Brain, 
  AlertTriangle 
} from "lucide-react";
import { toast } from "sonner";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  PieChart as RechartsPieChart,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: Date;
}

interface AIInsight {
  type: 'warning' | 'suggestion' | 'tip';
  message: string;
  category?: string;
  impact: number;
}

export const FinanceDashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [newTransaction, setNewTransaction] = useState<{
    type: 'income' | 'expense';
    amount: string;
    description: string;
    category: string;
  }>({
    type: 'expense',
    amount: '',
    description: '',
    category: ''
  });

  const expenseCategories = [
    'Alimentação', 'Transporte', 'Academia', 'Faculdade', 'Uber', 'Lazer', 
    'Saúde', 'Compras', 'Contas', 'Outros'
  ];

  const incomeCategories = [
    'Salário', 'Freelance', 'Investimentos', 'Outros'
  ];

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const generateAIInsights = (): AIInsight[] => {
    const insights: AIInsight[] = [];
    
    // Análise de gastos por categoria
    const sortedExpenses = Object.entries(expensesByCategory)
      .sort(([,a], [,b]) => b - a);

    if (sortedExpenses.length > 0) {
      const highestCategory = sortedExpenses[0];
      const percentage = (highestCategory[1] / totalExpenses) * 100;
      
      if (percentage > 30) {
        insights.push({
          type: 'warning',
          message: `Você está gastando ${percentage.toFixed(1)}% do seu orçamento com ${highestCategory[0]}. Considere reduzir esses gastos.`,
          category: highestCategory[0],
          impact: percentage
        });
      }

      // Sugestões específicas por categoria
      if (expensesByCategory['Uber'] > expensesByCategory['Transporte'] * 0.5) {
        insights.push({
          type: 'suggestion',
          message: 'Seus gastos com Uber são altos. Considere usar transporte público ou compartilhar viagens.',
          category: 'Uber',
          impact: 15
        });
      }

      if (expensesByCategory['Alimentação'] > totalExpenses * 0.25) {
        insights.push({
          type: 'suggestion',
          message: 'Gastos com alimentação estão elevados. Cozinhar em casa pode economizar até 40%.',
          category: 'Alimentação',
          impact: 25
        });
      }
    }

    // Análise de saldo
    if (balance < 0) {
      insights.push({
        type: 'warning',
        message: 'Você está gastando mais do que ganha este mês. É hora de revisar seus gastos!',
        impact: 50
      });
    } else if (balance < totalIncome * 0.1) {
      insights.push({
        type: 'tip',
        message: 'Sua margem de economia está baixa. Tente economizar pelo menos 20% da sua renda.',
        impact: 20
      });
    }

    return insights;
  };

  const handleAddTransaction = () => {
    if (!newTransaction.amount || !newTransaction.description || !newTransaction.category) {
      toast.error("Todos os campos são obrigatórios!");
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount),
      description: newTransaction.description,
      category: newTransaction.category,
      date: new Date()
    };

    setTransactions([transaction, ...transactions]);
    setNewTransaction({ type: 'expense', amount: '', description: '', category: '' });
    setIsAddingTransaction(false);
    toast.success("Transação adicionada com sucesso!");
  };

  const getCategoryColor = (category: string, index: number) => {
    const colors = [
      'bg-primary', 'bg-accent-orange', 'bg-accent-purple', 'bg-success',
      'bg-destructive', 'bg-secondary', 'bg-accent'
    ];
    return colors[index % colors.length];
  };

  const insights = generateAIInsights();

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card-glass/80 backdrop-blur-sm border-card-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-success" />
              <div>
                <p className="text-2xl font-bold text-foreground">
                  R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground">Total Ganho</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card-glass/80 backdrop-blur-sm border-card-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-8 h-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold text-foreground">
                  R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground">Total Gasto</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card-glass/80 backdrop-blur-sm border-card-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className={`w-8 h-8 ${balance >= 0 ? 'text-success' : 'text-destructive'}`} />
              <div>
                <p className={`text-2xl font-bold ${balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                  R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground">Saldo</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card-glass/80 backdrop-blur-sm border-card-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <PieChart className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{transactions.length}</p>
                <p className="text-sm text-muted-foreground">Transações</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Gastos por Categoria */}
        <Card className="bg-card-glass/80 backdrop-blur-sm border-card-border">
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(expensesByCategory)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([category, amount], index) => {
                  const percentage = (amount / totalExpenses) * 100;
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{category}</span>
                        <span>R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="text-xs text-muted-foreground text-right">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* IA Insights */}
        <Card className="bg-card-glass/80 backdrop-blur-sm border-card-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-accent-purple" />
              Insights da IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {insights.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Adicione mais transações para receber insights personalizados
                  </p>
                ) : (
                  insights.map((insight, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      insight.type === 'warning' ? 'bg-destructive/10 border-destructive/20' :
                      insight.type === 'suggestion' ? 'bg-accent-orange/10 border-accent-orange/20' :
                      'bg-success/10 border-success/20'
                    }`}>
                      <div className="flex items-start gap-2">
                        {insight.type === 'warning' && <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />}
                        {insight.type === 'suggestion' && <Brain className="w-4 h-4 text-accent-orange mt-0.5" />}
                        {insight.type === 'tip' && <TrendingUp className="w-4 h-4 text-success mt-0.5" />}
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{insight.message}</p>
                          {insight.category && (
                            <Badge variant="outline" className="mt-1">
                              {insight.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Transações Recentes */}
      <Card className="bg-card-glass/80 backdrop-blur-sm border-card-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Transações Recentes</span>
            <Dialog open={isAddingTransaction} onOpenChange={setIsAddingTransaction}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:shadow-glow">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Transação
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Transação</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={newTransaction.type === 'income' ? 'default' : 'outline'}
                      onClick={() => setNewTransaction({ ...newTransaction, type: 'income', category: '' })}
                      className={newTransaction.type === 'income' ? 'bg-gradient-success' : ''}
                    >
                      Ganho
                    </Button>
                    <Button
                      variant={newTransaction.type === 'expense' ? 'default' : 'outline'}
                      onClick={() => setNewTransaction({ ...newTransaction, type: 'expense', category: '' })}
                      className={newTransaction.type === 'expense' ? 'bg-gradient-orange' : ''}
                    >
                      Gasto
                    </Button>
                  </div>
                  <Input
                    type="number"
                    placeholder="Valor"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  />
                  <Input
                    placeholder="Descrição"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  />
                  <Select value={newTransaction.category} onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {(newTransaction.type === 'expense' ? expenseCategories : incomeCategories).map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button onClick={handleAddTransaction} className="flex-1 bg-gradient-primary">
                      Adicionar
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingTransaction(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {transactions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma transação ainda
                </p>
              ) : (
                transactions.slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${transaction.type === 'income' ? 'bg-success' : 'bg-destructive'}`} />
                      <div>
                        <p className="font-medium text-foreground">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                        {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.date.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};