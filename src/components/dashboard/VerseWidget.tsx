import { useState, useEffect } from "react";
import { BookOpen, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const verses = [
  {
    text: "Tudo posso naquele que me fortalece.",
    reference: "Filipenses 4:13"
  },
  {
    text: "O Senhor é o meu pastor; nada me faltará.",
    reference: "Salmo 23:1"
  },
  {
    text: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.",
    reference: "Provérbios 3:5"
  },
  {
    text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais.",
    reference: "Jeremias 29:11"
  },
  {
    text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a minha destra fiel.",
    reference: "Isaías 41:10"
  }
];

export const VerseWidget = () => {
  const [currentVerse, setCurrentVerse] = useState(verses[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshVerse = () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    const randomIndex = Math.floor(Math.random() * verses.length);
    
    setTimeout(() => {
      setCurrentVerse(verses[randomIndex]);
      setIsRefreshing(false);
    }, 300);
  };

  useEffect(() => {
    // Atualizar versículo diariamente
    const dailyRefresh = () => {
      const today = new Date().toDateString();
      const lastRefresh = localStorage.getItem('lastVerseRefresh');
      
      if (lastRefresh !== today) {
        refreshVerse();
        localStorage.setItem('lastVerseRefresh', today);
      }
    };

    dailyRefresh();
  }, []);

  return (
    <div className="bg-card-glass/80 backdrop-blur-sm border border-card-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-purple rounded-lg">
            <BookOpen size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Versículo do Dia</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshVerse}
          disabled={isRefreshing}
          className="hover:bg-secondary/30"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
        </Button>
      </div>
      
      <blockquote className="text-foreground/80 italic mb-3 leading-relaxed">
        "{currentVerse.text}"
      </blockquote>
      
      <p className="text-sm font-medium text-muted-foreground">
        - {currentVerse.reference}
      </p>
    </div>
  );
};