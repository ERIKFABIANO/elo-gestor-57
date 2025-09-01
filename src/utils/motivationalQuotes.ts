export const motivationalQuotes = [
  "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
  "Acredite em si mesmo e todo o resto se encaixará.",
  "A persistência é o caminho do êxito.",
  "Grandes conquistas requerem grandes ambições.",
  "O futuro pertence àqueles que acreditam na beleza de seus sonhos.",
  "Não espere por oportunidades, crie-as.",
  "A disciplina é a ponte entre objetivos e conquistas.",
  "Cada dia é uma nova chance de ser melhor que ontem.",
  "O conhecimento é o investimento que rende os melhores juros.",
  "Seja a mudança que você quer ver no mundo.",
  "A educação é a arma mais poderosa para mudar o mundo.",
  "Sonhe grande e ouse falhar.",
  "O único lugar onde o sucesso vem antes do trabalho é no dicionário.",
  "Você é mais forte do que imagina e mais capaz do que acredita.",
  "A jornada de mil milhas começa com um único passo.",
  "Transforme seus obstáculos em oportunidades.",
  "A excelência não é um ato, mas um hábito.",
  "Seja paciente consigo mesmo. Nada na natureza floresce o ano todo.",
  "O aprendizado nunca esgota a mente.",
  "Foque no progresso, não na perfeição.",
  "Sua única limitação é você mesmo.",
  "Cada erro é uma lição disfarçada.",
  "A motivação te leva longe, mas o hábito te mantém lá.",
  "Seja grato pelo que você tem enquanto trabalha pelo que quer.",
  "O tempo que você gasta estudando hoje é o investimento no seu futuro.",
  "Não desista. O começo é sempre o mais difícil.",
  "Sua dedicação de hoje é o seu sucesso de amanhã.",
  "Acredite no processo, confie no progresso.",
  "Cada página estudada é um passo mais próximo do seu objetivo.",
  "A consistência é mais importante que a perfeição."
];

export const getDailyQuote = (): string => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const quoteIndex = dayOfYear % motivationalQuotes.length;
  return motivationalQuotes[quoteIndex];
};