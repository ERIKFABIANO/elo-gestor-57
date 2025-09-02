import { useState, useEffect } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const SettingsManager = () => {
  const { t, language } = useLanguage();
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    display_name: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    city: '',
    zip_code: ''
  });

  const [supportForm, setSupportForm] = useState({
    email: '',
    phone: '',
    message: ''
  });

  // Load profile data on component mount
  useEffect(() => {
    if (profile) {
      setProfileForm({
        display_name: profile.display_name || '',
        email: profile.email || '',
        phone: (profile as any).phone || '',
        address: (profile as any).address || '',
        state: (profile as any).state || '',
        city: (profile as any).city || '',
        zip_code: (profile as any).zip_code || ''
      });
    }
  }, [profile]);

  const handleProfileSave = async () => {
    if (!user || !profile) {
      toast.error("Usuário não encontrado");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: profileForm.display_name,
          email: profileForm.email,
          phone: profileForm.phone,
          address: profileForm.address,
          state: profileForm.state,
          city: profileForm.city,
          zip_code: profileForm.zip_code,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso!");
      
      // Force a page reload to update the auth context
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

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
              <p className="text-sm text-muted-foreground">
                Gerencie suas informações pessoais e de contato
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="display_name">Nome Completo *</Label>
                    <Input 
                      id="display_name" 
                      value={profileForm.display_name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, display_name: e.target.value }))}
                      placeholder="Seu nome completo" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile_email">E-mail *</Label>
                    <Input 
                      id="profile_email" 
                      type="email" 
                      value={profileForm.email}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="seu@email.com" 
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Informações de Contato */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contato</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(11) 99999-9999" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input 
                      id="state" 
                      value={profileForm.state}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="São Paulo" 
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Endereço Completo</Label>
                    <Input 
                      id="address" 
                      value={profileForm.address}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Rua das Flores, 123, Centro" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input 
                      id="city" 
                      value={profileForm.city}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="São Paulo" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip_code">CEP</Label>
                    <Input 
                      id="zip_code" 
                      value={profileForm.zip_code}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, zip_code: e.target.value }))}
                      placeholder="01234-567" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  * Campos obrigatórios
                </p>
                <Button 
                  onClick={handleProfileSave}
                  disabled={loading || !profileForm.display_name || !profileForm.email}
                  className="bg-gradient-primary hover:shadow-glow"
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
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