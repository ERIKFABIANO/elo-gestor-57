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

      {/* 3D Background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 animate-pulse"></div>
      
      {/* 3D Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dollar Icon */}
        <div className="absolute top-32 left-24 w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl shadow-2xl transform rotate-12 animate-bounce delay-100 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">$</span>
        </div>
        
        {/* Tasks Icon */}
        <div className="absolute top-64 right-32 w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-3xl shadow-2xl transform -rotate-12 animate-bounce delay-300 flex items-center justify-center">
          <span className="text-white text-2xl">✓</span>
        </div>
        
        {/* Chart Icon */}
        <div className="absolute top-48 left-1/2 w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-2xl transform rotate-45 animate-bounce delay-500 flex items-center justify-center">
          <span className="text-white text-xl">📊</span>
        </div>
        
        {/* Settings Icon */}
        <div className="absolute bottom-48 left-32 w-18 h-18 bg-gradient-to-br from-pink-400 to-red-500 rounded-full shadow-2xl transform rotate-6 animate-bounce delay-700 flex items-center justify-center p-4">
          <span className="text-white text-xl">⚙️</span>
        </div>
        
        {/* Diamond Icon */}
        <div className="absolute top-80 right-64 w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 shadow-2xl transform rotate-45 animate-bounce delay-900" style={{clipPath: 'polygon(50% 0%, 0% 50%, 50% 100%, 100% 50%)'}}>
        </div>
        
        {/* Additional floating elements */}
        <div className="absolute bottom-32 right-24 w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl shadow-2xl transform -rotate-6 animate-bounce delay-1100 flex items-center justify-center">
          <span className="text-white text-xl">📱</span>
        </div>
        
        {/* Animated particles */}
        <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-white/30 rounded-full animate-ping delay-200"></div>
        <div className="absolute top-3/4 left-2/3 w-2 h-2 bg-white/20 rounded-full animate-ping delay-400"></div>
        <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-white/25 rounded-full animate-ping delay-600"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-7xl flex items-center justify-between px-8">
          
          {/* Left side - Welcome Section */}
          <div className="hidden lg:block flex-1 text-white pr-16">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold mb-4 animate-fade-in">
                Sistema Seguro
              </h1>
              <p className="text-xl text-white/90 leading-relaxed animate-fade-in delay-200">
                Gerencie suas finanças, tarefas e vida espiritual com segurança e praticidade
              </p>
              
              {/* Feature icons */}
              <div className="flex space-x-8 mt-8 animate-fade-in delay-400">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl shadow-lg flex items-center justify-center mb-3 transform hover:scale-110 transition-transform">
                    <span className="text-white text-2xl font-bold">$</span>
                  </div>
                  <p className="text-sm text-white/80">Financeiro</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl shadow-lg flex items-center justify-center mb-3 transform hover:scale-110 transition-transform">
                    <span className="text-white text-2xl">✓</span>
                  </div>
                  <p className="text-sm text-white/80">Tarefas</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl shadow-lg flex items-center justify-center mb-3 transform hover:scale-110 transition-transform">
                    <span className="text-white text-2xl">✨</span>
                  </div>
                  <p className="text-sm text-white/80">Fé</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Login Form */}
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-2xl border-white/20 shadow-2xl animate-scale-in">
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