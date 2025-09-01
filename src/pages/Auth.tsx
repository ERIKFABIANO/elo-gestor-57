import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
// Removed language context - using Portuguese directly
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        }
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Verifique seu email para confirmar o cadastro');
        }
      }
    } catch (error) {
      toast.error('Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* Background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple via-primary to-accent-orange bg-[length:400%_400%] animate-pulse"></div>
      
      {/* Animated background shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-accent-purple/30 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br from-accent-orange/20 to-transparent rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-6xl flex items-center justify-center">
          <Card className="w-full max-w-md bg-card-glass/80 backdrop-blur-xl border-card-border/50 shadow-float">
            <div className="p-8">
              {/* Back button */}
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-smooth"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>

              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {isLogin ? 'Entrar no sistema' : 'Criar conta'}
                </h1>
                <p className="text-muted-foreground">
                  {isLogin ? 'Por favor, insira suas informações de login ou' : 'Preencha os dados para criar sua conta ou'}
                  {!isLogin && (
                    <button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      className="text-primary hover:underline ml-1"
                    >
                      clique aqui para entrar
                    </button>
                  )}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div>
                    <Label htmlFor="displayName" className="text-foreground">
                      Nome completo
                    </Label>
                    <Input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="mt-1 bg-input/50 border-card-border/50"
                      placeholder="Seu nome completo"
                      required={!isLogin}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="email" className="text-foreground">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 bg-input/50 border-card-border/50"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-foreground">
                    Senha
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10 bg-input/50 border-card-border/50"
                      placeholder="Digite sua senha"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isLogin && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(!!checked)}
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      Lembrar de mim
                    </Label>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105"
                >
                  {loading
                    ? 'Carregando...'
                    : isLogin
                    ? 'Entrar'
                    : 'Criar conta'
                  }
                </Button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setEmail('');
                      setPassword('');
                      setDisplayName('');
                    }}
                    className="text-primary hover:underline ml-1 font-medium"
                  >
                    {isLogin ? 'Cadastre-se aqui' : 'Entre aqui'}
                  </button>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;