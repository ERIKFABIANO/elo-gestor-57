import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, BookOpen, Brain, Calendar, Search, Tag } from "lucide-react";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  content: string;
  date: Date;
  subject: string;
  tags: string[];
  mindMap?: MindMapNode;
}

interface MindMapNode {
  id: string;
  text: string;
  children: MindMapNode[];
  x: number;
  y: number;
}

export const NotesManager = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    subject: '',
    tags: ''
  });

  const [showMindMap, setShowMindMap] = useState(false);

  const subjects = ['Matemática', 'Português', 'História', 'Geografia', 'Ciências', 'Inglês', 'Outros'];

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNote = () => {
    if (!newNote.title || !newNote.content) {
      toast.error("Título e conteúdo são obrigatórios!");
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      date: new Date(),
      subject: newNote.subject || 'Outros',
      tags: newNote.tags ? newNote.tags.split(',').map(tag => tag.trim()) : []
    };

    setNotes([note, ...notes]);
    setNewNote({ title: '', content: '', subject: '', tags: '' });
    setIsAddingNote(false);
    toast.success("Anotação adicionada com sucesso!");
  };

  const generateMindMap = (note: Note) => {
    // Análise simples do conteúdo para gerar mapa mental
    const sentences = note.content.split('.').filter(s => s.trim().length > 0);
    const keywords = sentences.map((sentence, index) => ({
      id: `node-${index}`,
      text: sentence.trim().substring(0, 50) + (sentence.length > 50 ? '...' : ''),
      children: [],
      x: 200 + (index % 3) * 150,
      y: 100 + Math.floor(index / 3) * 80
    }));

    const mindMap: MindMapNode = {
      id: 'root',
      text: note.title,
      children: keywords,
      x: 250,
      y: 50
    };

    const updatedNote = { ...note, mindMap };
    setNotes(notes.map(n => n.id === note.id ? updatedNote : n));
    setSelectedNote(updatedNote);
    setShowMindMap(true);
    toast.success("Mapa mental gerado!");
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      'Matemática': 'bg-accent-orange text-white',
      'Português': 'bg-accent-purple text-white',
      'História': 'bg-destructive text-destructive-foreground',
      'Geografia': 'bg-success text-white',
      'Ciências': 'bg-primary text-primary-foreground',
      'Inglês': 'bg-accent text-accent-foreground',
      'Outros': 'bg-secondary text-secondary-foreground'
    };
    return colors[subject] || colors['Outros'];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Diário de Estudos</h1>
            <p className="text-muted-foreground">Organize suas anotações de aula</p>
          </div>
        </div>
        <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:shadow-glow">
              <Plus className="w-4 h-4 mr-2" />
              Nova Anotação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Anotação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Título da aula"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              />
              <select
                className="w-full p-2 border border-input rounded-md bg-background"
                value={newNote.subject}
                onChange={(e) => setNewNote({ ...newNote, subject: e.target.value })}
              >
                <option value="">Selecione a matéria</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <Textarea
                placeholder="Conteúdo da anotação..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="min-h-32"
              />
              <Input
                placeholder="Tags (separadas por vírgula)"
                value={newNote.tags}
                onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddNote} className="flex-1 bg-gradient-primary">
                  Salvar Anotação
                </Button>
                <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <Card className="bg-card-glass/80 backdrop-blur-sm border-card-border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Pesquisar anotações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Anotações */}
        <Card className="bg-card-glass/80 backdrop-blur-sm border-card-border">
          <CardHeader>
            <CardTitle>Anotações ({filteredNotes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {filteredNotes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    {searchTerm ? 'Nenhuma anotação encontrada' : 'Nenhuma anotação ainda'}
                  </p>
                ) : (
                  filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        selectedNote?.id === note.id
                          ? 'bg-primary/10 border-primary'
                          : 'bg-secondary/20 border-card-border hover:bg-secondary/30'
                      }`}
                      onClick={() => setSelectedNote(note)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-foreground line-clamp-1">
                          {note.title}
                        </h3>
                        <Badge className={getSubjectColor(note.subject)}>
                          {note.subject}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {note.date.toLocaleDateString('pt-BR')}
                        </div>
                        {note.tags.length > 0 && (
                          <div className="flex gap-1">
                            {note.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Tag className="w-2 h-2 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Visualizador de Anotação */}
        <Card className="bg-card-glass/80 backdrop-blur-sm border-card-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {selectedNote ? selectedNote.title : 'Selecione uma anotação'}
              </span>
              {selectedNote && (
                <Button
                  size="sm"
                  onClick={() => generateMindMap(selectedNote)}
                  className="bg-gradient-purple hover:shadow-glow"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Mapa Mental
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedNote ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getSubjectColor(selectedNote.subject)}>
                    {selectedNote.subject}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {selectedNote.date.toLocaleString('pt-BR')}
                  </span>
                </div>
                <ScrollArea className="h-64">
                  <div className="whitespace-pre-wrap text-sm text-foreground">
                    {selectedNote.content}
                  </div>
                </ScrollArea>
                {selectedNote.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {selectedNote.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Selecione uma anotação para visualizar</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mapa Mental */}
      {showMindMap && selectedNote?.mindMap && (
        <Dialog open={showMindMap} onOpenChange={setShowMindMap}>
          <DialogContent className="max-w-4xl h-96">
            <DialogHeader>
              <DialogTitle>Mapa Mental - {selectedNote.title}</DialogTitle>
            </DialogHeader>
            <div className="relative w-full h-full bg-secondary/10 rounded-lg overflow-hidden">
              <svg className="w-full h-full">
                {/* Nó central */}
                <circle cx={selectedNote.mindMap.x} cy={selectedNote.mindMap.y} r="40" className="fill-primary" />
                <text x={selectedNote.mindMap.x} y={selectedNote.mindMap.y} textAnchor="middle" className="fill-primary-foreground text-sm">
                  {selectedNote.mindMap.text.substring(0, 10)}...
                </text>
                
                {/* Nós filhos */}
                {selectedNote.mindMap.children.map((child, index) => (
                  <g key={child.id}>
                    <line
                      x1={selectedNote.mindMap.x}
                      y1={selectedNote.mindMap.y}
                      x2={child.x}
                      y2={child.y}
                      className="stroke-primary stroke-2"
                    />
                    <circle cx={child.x} cy={child.y} r="25" className="fill-accent-orange" />
                    <text x={child.x} y={child.y} textAnchor="middle" className="fill-white text-xs">
                      {index + 1}
                    </text>
                  </g>
                ))}
              </svg>
              
              {/* Legenda */}
              <div className="absolute bottom-4 left-4 bg-background/90 p-3 rounded-lg max-w-xs">
                <h4 className="font-medium mb-2">Conceitos Principais:</h4>
                <div className="space-y-1 text-sm">
                  {selectedNote.mindMap.children.slice(0, 3).map((child, index) => (
                    <p key={child.id} className="text-muted-foreground">
                      {index + 1}. {child.text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};