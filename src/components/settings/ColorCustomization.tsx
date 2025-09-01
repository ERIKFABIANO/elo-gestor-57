import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface ColorScheme {
  name: string;
  primary: string;
  primaryGlow: string;
  accentOrange: string;
  accentPurple: string;
  success: string;
}

const colorSchemes: ColorScheme[] = [
  {
    name: "Azul Oceano",
    primary: "200 95% 55%",
    primaryGlow: "200 100% 70%",
    accentOrange: "25 95% 60%",
    accentPurple: "270 85% 60%",
    success: "140 85% 50%"
  },
  {
    name: "Verde Esmeralda",
    primary: "160 95% 45%",
    primaryGlow: "160 100% 65%",
    accentOrange: "35 95% 60%",
    accentPurple: "280 85% 60%",
    success: "120 85% 50%"
  },
  {
    name: "Roxo Místico",
    primary: "270 95% 60%",
    primaryGlow: "270 100% 75%",
    accentOrange: "30 95% 65%",
    accentPurple: "300 85% 65%",
    success: "150 85% 55%"
  },
  {
    name: "Laranja Vibrante",
    primary: "20 95% 60%",
    primaryGlow: "20 100% 75%",
    accentOrange: "35 95% 65%",
    accentPurple: "280 85% 60%",
    success: "140 85% 50%"
  },
  {
    name: "Rosa Moderno",
    primary: "330 95% 65%",
    primaryGlow: "330 100% 80%",
    accentOrange: "25 95% 60%",
    accentPurple: "290 85% 65%",
    success: "140 85% 50%"
  },
  {
    name: "Ciano Tecnológico",
    primary: "180 95% 55%",
    primaryGlow: "180 100% 70%",
    accentOrange: "30 95% 60%",
    accentPurple: "270 85% 60%",
    success: "140 85% 50%"
  },
  {
    name: "Vermelho Energia",
    primary: "0 85% 60%",
    primaryGlow: "0 90% 75%",
    accentOrange: "25 95% 60%",
    accentPurple: "270 85% 60%",
    success: "140 85% 50%"
  },
  {
    name: "Amarelo Solar",
    primary: "50 95% 60%",
    primaryGlow: "50 100% 75%",
    accentOrange: "35 95% 65%",
    accentPurple: "270 85% 60%",
    success: "140 85% 50%"
  },
  {
    name: "Índigo Profundo",
    primary: "230 85% 55%",
    primaryGlow: "230 90% 70%",
    accentOrange: "25 95% 60%",
    accentPurple: "270 85% 60%",
    success: "140 85% 50%"
  },
  {
    name: "Teal Aquático",
    primary: "170 85% 50%",
    primaryGlow: "170 90% 65%",
    accentOrange: "25 95% 60%",
    accentPurple: "270 85% 60%",
    success: "140 85% 50%"
  },
  {
    name: "Magenta Criativo",
    primary: "300 90% 65%",
    primaryGlow: "300 95% 80%",
    accentOrange: "25 95% 60%",
    accentPurple: "320 85% 65%",
    success: "140 85% 50%"
  },
  {
    name: "Lime Energético",
    primary: "80 90% 55%",
    primaryGlow: "80 95% 70%",
    accentOrange: "25 95% 60%",
    accentPurple: "270 85% 60%",
    success: "140 85% 50%"
  },
  {
    name: "Coral Suave",
    primary: "15 85% 65%",
    primaryGlow: "15 90% 80%",
    accentOrange: "35 95% 65%",
    accentPurple: "270 85% 60%",
    success: "140 85% 50%"
  },
  {
    name: "Turquesa Tropical",
    primary: "175 90% 50%",
    primaryGlow: "175 95% 65%",
    accentOrange: "25 95% 60%",
    accentPurple: "270 85% 60%",
    success: "140 85% 50%"
  },
  {
    name: "Violeta Elegante",
    primary: "260 85% 60%",
    primaryGlow: "260 90% 75%",
    accentOrange: "25 95% 60%",
    accentPurple: "280 85% 65%",
    success: "140 85% 50%"
  }
];

export const ColorCustomization = () => {
  const [selectedScheme, setSelectedScheme] = useState(0);

  const applyColorScheme = (scheme: ColorScheme) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', scheme.primary);
    root.style.setProperty('--primary-glow', scheme.primaryGlow);
    root.style.setProperty('--accent-orange', scheme.accentOrange);
    root.style.setProperty('--accent-purple', scheme.accentPurple);
    root.style.setProperty('--success', scheme.success);
    
    // Atualizar gradientes
    root.style.setProperty('--gradient-primary', `linear-gradient(135deg, hsl(${scheme.primary}), hsl(${scheme.primaryGlow}))`);
    root.style.setProperty('--gradient-orange', `linear-gradient(135deg, hsl(${scheme.accentOrange}), hsl(${scheme.accentOrange}))`);
    root.style.setProperty('--gradient-purple', `linear-gradient(135deg, hsl(${scheme.accentPurple}), hsl(${scheme.accentPurple}))`);
    root.style.setProperty('--gradient-success', `linear-gradient(135deg, hsl(${scheme.success}), hsl(${scheme.success}))`);
  };

  const handleSchemeSelect = (index: number, scheme: ColorScheme) => {
    setSelectedScheme(index);
    applyColorScheme(scheme);
  };

  return (
    <Card className="bg-card-glass/80 backdrop-blur-sm border-card-border">
      <CardHeader>
        <CardTitle>Personalização de Cores</CardTitle>
        <p className="text-muted-foreground">Escolha um esquema de cores para personalizar seu sistema</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {colorSchemes.map((scheme, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-24 p-2 flex flex-col gap-2 relative ${
                selectedScheme === index ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleSchemeSelect(index, scheme)}
            >
              <div className="flex gap-1 flex-1 w-full">
                <div 
                  className="flex-1 rounded-sm"
                  style={{ backgroundColor: `hsl(${scheme.primary})` }}
                />
                <div 
                  className="flex-1 rounded-sm"
                  style={{ backgroundColor: `hsl(${scheme.accentOrange})` }}
                />
                <div 
                  className="flex-1 rounded-sm"
                  style={{ backgroundColor: `hsl(${scheme.accentPurple})` }}
                />
                <div 
                  className="flex-1 rounded-sm"
                  style={{ backgroundColor: `hsl(${scheme.success})` }}
                />
              </div>
              <span className="text-xs font-medium truncate w-full">{scheme.name}</span>
              {selectedScheme === index && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-2 h-2 text-white" />
                </div>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};