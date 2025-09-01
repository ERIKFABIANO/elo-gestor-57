import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Link, Upload, Calendar as CalendarIcon, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  links?: string[];
  files?: File[];
}

export const TaskCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    links: '',
    files: [] as File[]
  });

  const todayTasks = tasks.filter(task => 
    task.date.toDateString() === new Date().toDateString()
  );

  const completedToday = todayTasks.filter(task => task.status === 'completed').length;
  const pendingToday = todayTasks.filter(task => task.status !== 'completed').length;

  const selectedDateTasks = tasks.filter(task => 
    selectedDate && task.date.toDateString() === selectedDate.toDateString()
  );

  const handleAddTask = () => {
    if (!newTask.title || !selectedDate) {
      toast.error("Título e data são obrigatórios!");
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      date: selectedDate,
      priority: newTask.priority,
      status: 'pending',
      links: newTask.links ? newTask.links.split(',').map(link => link.trim()) : [],
      files: newTask.files
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', priority: 'medium', links: '', files: [] });
    setIsAddingTask(false);
    toast.success("Tarefa adicionada com sucesso!");
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const nextStatus = task.status === 'completed' ? 'pending' : 
                          task.status === 'pending' ? 'in-progress' : 'completed';
        return { ...task, status: nextStatus };
      }
      return task;
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      file.type === 'application/pdf' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    
    if (validFiles.length !== files.length) {
      toast.error("Apenas arquivos PDF e DOCX são permitidos!");
    }
    
    setNewTask({ ...newTask, files: [...newTask.files, ...validFiles] });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-accent-orange text-white';
      case 'low': return 'bg-success text-white';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-accent-orange" />;
      default: return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Resumo do Dia */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card-glass/80 backdrop-blur-sm border-card-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-success" />
              <div>
                <p className="text-2xl font-bold text-foreground">{completedToday}</p>
                <p className="text-sm text-muted-foreground">Concluídas Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card-glass/80 backdrop-blur-sm border-card-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-accent-orange" />
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingToday}</p>
                <p className="text-sm text-muted-foreground">Pendentes Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card-glass/80 backdrop-blur-sm border-card-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{todayTasks.length}</p>
                <p className="text-sm text-muted-foreground">Total do Dia</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendário */}
        <Card className="bg-card-glass/80 backdrop-blur-sm border-card-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Calendário de Tarefas</span>
              <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-primary hover:shadow-glow">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Tarefa
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Título da tarefa"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                    <Textarea
                      placeholder="Descrição (opcional)"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                    <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Links (separados por vírgula)"
                      value={newTask.links}
                      onChange={(e) => setNewTask({ ...newTask, links: e.target.value })}
                    />
                    <div>
                      <label className="block text-sm font-medium mb-2">Arquivos (PDF/DOCX)</label>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.docx"
                        onChange={handleFileUpload}
                        className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                      {newTask.files.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {newTask.files.map((file, index) => (
                            <p key={index} className="text-xs text-muted-foreground">
                              📎 {file.name}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddTask} className="flex-1 bg-gradient-primary">
                        Adicionar
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Lista de Tarefas */}
        <Card className="bg-card-glass/80 backdrop-blur-sm border-card-border">
          <CardHeader>
            <CardTitle>
              Tarefas - {selectedDate?.toLocaleDateString('pt-BR')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedDateTasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma tarefa para esta data
                </p>
              ) : (
                selectedDateTasks.map((task) => (
                  <div key={task.id} className="p-3 bg-secondary/20 rounded-lg border border-card-border">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={task.status === 'completed'}
                        onCheckedChange={() => toggleTaskStatus(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {task.title}
                          </h4>
                          {getStatusIcon(task.status)}
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                          </Badge>
                          {task.links && task.links.length > 0 && (
                            <Badge variant="outline">
                              <Link className="w-3 h-3 mr-1" />
                              {task.links.length} link(s)
                            </Badge>
                          )}
                          {task.files && task.files.length > 0 && (
                            <Badge variant="outline">
                              <Upload className="w-3 h-3 mr-1" />
                              {task.files.length} arquivo(s)
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};