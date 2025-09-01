import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, HelpCircle, Palette } from "lucide-react";
import { ColorCustomization } from "./ColorCustomization";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

export const SettingsManager = () => {
  const { t, language } = useLanguage();
  const [supportForm, setSupportForm] = useState({
    email: '',
    phone: '',
    message: ''
  });

  const handleSupportSubmit = () => {
    if (!supportForm.message.trim()) {
      toast.error("Por favor, digite sua mensagem");
      return;
    }

    // Simular envio para o email profissional
    const subject = "Suporte EloGestor - Nova Solicitação";
    const body = `Email: ${supportForm.email}\nTelefone: ${supportForm.phone}\n\nMensagem:\n${supportForm.message}`;
    
    // Em uma implementação real, isso seria enviado via API
    console.log("Enviando para erikfabiano082@gmail.com:", { subject, body });
    
    toast.success("Sua solicitação foi enviada com sucesso!");
    setSupportForm({ email: '', phone: '', message: '' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-card-glass/80 backdrop-blur-sm border border-card-border rounded-lg p-6 shadow-card">
        <h1 className="text-2xl font-bold text-foreground mb-2">{t('nav.settings')}</h1>
        <p className="text-muted-foreground">Gerencie sua conta e preferências do sistema</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Conta
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Suporte
          </TabsTrigger>
          <TabsTrigger value="personalization" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Personalização
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className="bg-card-glass/80 backdrop-blur-sm border-card-border">
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" placeholder="Seu nome completo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" />
                </div>
              </div>
              <Button className="bg-gradient-primary hover:shadow-glow">
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card className="bg-card-glass/80 backdrop-blur-sm border-card-border">
            <CardHeader>
              <CardTitle>Suporte Técnico</CardTitle>
              <p className="text-muted-foreground">
                Precisa de ajuda ou tem sugestões? Entre em contato conosco!
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="support-email">E-mail (opcional)</Label>
                  <Input
                    id="support-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={supportForm.email}
                    onChange={(e) => setSupportForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-phone">Telefone (opcional)</Label>
                  <Input
                    id="support-phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={supportForm.phone}
                    onChange={(e) => setSupportForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-message">Sua mensagem</Label>
                <Textarea
                  id="support-message"
                  placeholder="Descreva sua dúvida, sugestão ou problema..."
                  className="min-h-32"
                  value={supportForm.message}
                  onChange={(e) => setSupportForm(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
              <Button 
                onClick={handleSupportSubmit}
                className="w-full bg-gradient-primary hover:shadow-glow"
              >
                Enviar Mensagem
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Sua mensagem será enviada diretamente para nossa equipe de suporte
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personalization">
          <div className="space-y-6">
            <ColorCustomization />
            
            <Card className="bg-card-glass/80 backdrop-blur-sm border-card-border">
              <CardHeader>
                <CardTitle>Outras Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="language">{t('settings.language')}</Label>
                  <LanguageSelector />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};