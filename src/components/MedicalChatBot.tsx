import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Bot, 
  User, 
  Send, 
  Heart, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Stethoscope,
  Phone
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  priority?: 'low' | 'medium' | 'high';
  instructions?: string[];
}

interface MedicalChatBotProps {
  userSymptoms?: string;
  occurrenceId?: string;
  priority?: 'baixa' | 'media' | 'alta';
}

const MedicalChatBot: React.FC<MedicalChatBotProps> = ({ 
  userSymptoms = '', 
  occurrenceId = '',
  priority = 'media'
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Base de conhecimento médico simplificada
  const medicalKnowledge = {
    'dor no peito': {
      priority: 'high',
      instructions: [
        'Sente-se em posição confortável, preferencialmente com as costas apoiadas',
        'Afrouxe roupas apertadas ao redor do pescoço e peito',
        'Respire lenta e profundamente',
        'NÃO tome medicamentos sem orientação médica',
        'Se a dor piorar ou você sentir falta de ar, chame 192 imediatamente'
      ]
    },
    'dificuldade para respirar': {
      priority: 'high',
      instructions: [
        'Mantenha-se calmo, o pânico pode piorar a respiração',
        'Sente-se ereto ou ligeiramente inclinado para frente',
        'Afrouxe roupas apertadas',
        'Respire lentamente pelo nariz e expire pela boca',
        'Se tiver inalador prescrito, use conforme orientação médica'
      ]
    },
    'desmaio': {
      priority: 'high',
      instructions: [
        'Se sentir tontura, sente-se ou deite-se imediatamente',
        'Eleve as pernas acima do nível do coração se possível',
        'Mantenha a cabeça baixa entre os joelhos se estiver sentado',
        'Respire lenta e profundamente',
        'Não tente se levantar rapidamente'
      ]
    },
    'tontura': {
      priority: 'medium',
      instructions: [
        'Sente-se ou deite-se lentamente',
        'Evite movimentos bruscos da cabeça',
        'Mantenha-se hidratado com pequenos goles de água',
        'Fixe o olhar em um ponto fixo',
        'Respire calmamente'
      ]
    },
    'vômito': {
      priority: 'medium',
      instructions: [
        'Mantenha-se hidratado com pequenos goles de água',
        'Sente-se ereto ou deite-se de lado',
        'Evite alimentos sólidos por enquanto',
        'Respire pelo nariz para reduzir náuseas',
        'Tenha um recipiente próximo se necessário'
      ]
    },
    'corte': {
      priority: 'medium',
      instructions: [
        'Aplique pressão direta no ferimento com um pano limpo',
        'Eleve a área ferida acima do nível do coração se possível',
        'NÃO retire objetos que possam estar no ferimento',
        'Mantenha pressão constante até a chegada do socorro',
        'Se o sangramento não parar, aplique mais pressão'
      ]
    },
    'febre': {
      priority: 'low',
      instructions: [
        'Mantenha-se bem hidratado',
        'Use roupas leves',
        'Descanse em local fresco e arejado',
        'Você pode usar compressas frias na testa',
        'Evite atividades físicas'
      ]
    }
  };

  const getSymptomInstructions = (symptom: string) => {
    const lowerSymptom = symptom.toLowerCase();
    for (const [key, value] of Object.entries(medicalKnowledge)) {
      if (lowerSymptom.includes(key)) {
        return value;
      }
    }
    return null;
  };

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Analisar sintomas mencionados
    let response = '';
    let instructions: string[] = [];
    let messagePriority: 'low' | 'medium' | 'high' = 'low';

    // Respostas para diferentes tipos de mensagens
    if (lowerMessage.includes('pior') || lowerMessage.includes('dor aumentou') || lowerMessage.includes('não consigo')) {
      response = '⚠️ Entendo que seus sintomas estão piorando. Isso é importante para nossa equipe saber. Vou anotar essa informação. ';
      messagePriority = 'high';
      
      if (lowerMessage.includes('respirar')) {
        response += 'Para dificuldade respiratória:';
        instructions = medicalKnowledge['dificuldade para respirar'].instructions;
      } else if (lowerMessage.includes('peito') || lowerMessage.includes('coração')) {
        response += 'Para dor no peito:';
        instructions = medicalKnowledge['dor no peito'].instructions;
      } else {
        response += 'Enquanto aguardamos o socorrista, tente manter a calma e siga estas orientações gerais:';
        instructions = [
          'Mantenha-se em posição confortável',
          'Respire lenta e profundamente',
          'Não tente se automedicar',
          'Se os sintomas se tornarem críticos, ligue 192'
        ];
      }
    } else if (lowerMessage.includes('melhor') || lowerMessage.includes('passou')) {
      response = '😊 Fico feliz em saber que você está se sentindo melhor! Isso é um bom sinal. Continue seguindo as orientações e aguarde nosso socorrista para uma avaliação completa.';
    } else if (lowerMessage.includes('quanto tempo') || lowerMessage.includes('demora')) {
      response = '⏱️ Nosso socorrista está a caminho. O tempo estimado depende de sua localização e prioridade do chamado. Você receberá uma notificação quando ele estiver próximo. Enquanto isso, continue seguindo as orientações médicas.';
    } else if (lowerMessage.includes('medo') || lowerMessage.includes('nervoso') || lowerMessage.includes('ansioso')) {
      response = '💙 É completamente normal se sentir ansioso em uma situação como esta. Vamos fazer alguns exercícios de respiração juntos:';
      instructions = [
        'Respire fundo pelo nariz contando até 4',
        'Segure a respiração por 4 segundos',
        'Expire lentamente pela boca contando até 6',
        'Repita este ciclo 5 vezes',
        'Lembre-se: nossa equipe está vindo para ajudá-lo'
      ];
    } else {
      // Analisar sintomas mencionados na mensagem
      const symptomInfo = getSymptomInstructions(userMessage);
      if (symptomInfo) {
        messagePriority = symptomInfo.priority;
        response = `📋 Entendi que você está relatando: "${userMessage}". Aqui estão algumas orientações importantes:`;
        instructions = symptomInfo.instructions;
      } else {
        response = '🤖 Obrigado por compartilhar essa informação. Nossa equipe médica foi notificada. Há algo específico que você gostaria de saber sobre seus sintomas ou primeiros socorros?';
      }
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      priority: messagePriority,
      instructions: instructions.length > 0 ? instructions : undefined
    };
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simular delay de digitação do bot
    setTimeout(() => {
      const botResponse = generateBotResponse(message);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  // Mensagem inicial baseada nos sintomas
  useEffect(() => {
    const initialMessage: Message = {
      id: 'initial',
      type: 'bot',
      content: '👋 Olá! Eu sou o assistente médico virtual da UNIFIO. Recebi sua solicitação de atendimento e nossa equipe já foi notificada.',
      timestamp: new Date()
    };

    const symptomMessage: Message = {
      id: 'symptoms',
      type: 'bot',
      content: userSymptoms 
        ? `📋 Vejo que você relatou: "${userSymptoms}". Enquanto aguarda nosso socorrista, posso ajudá-lo com orientações de primeiros socorros. Como você está se sentindo agora?`
        : '🩺 Como você está se sentindo? Descreva seus sintomas para que eu possa oferecer as melhores orientações enquanto aguardamos o socorrista.',
      timestamp: new Date()
    };

    setMessages([initialMessage, symptomMessage]);

    // Se há sintomas iniciais, fornecer instruções
    if (userSymptoms) {
      setTimeout(() => {
        const symptomInfo = getSymptomInstructions(userSymptoms);
        if (symptomInfo) {
          const instructionMessage: Message = {
            id: 'initial-instructions',
            type: 'bot',
            content: '💡 Baseado em seus sintomas, aqui estão algumas orientações importantes:',
            timestamp: new Date(),
            priority: symptomInfo.priority,
            instructions: symptomInfo.instructions
          };
          setMessages(prev => [...prev, instructionMessage]);
        }
      }, 2000);
    }
  }, [userSymptoms]);

  // Auto scroll para a última mensagem
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <Card className="border-slate-200 h-[600px] flex flex-col">
      <CardHeader className="border-b border-slate-200 pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 bg-unifio-navy rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Assistente Médico</h3>
            <p className="text-sm text-slate-600">Orientações enquanto aguarda o atendimento</p>
          </div>
          <div className="ml-auto">
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Online
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
                {message.type === 'bot' && (
                  <div className="w-8 h-8 bg-unifio-navy rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-unifio-navy text-white ml-12' 
                      : 'bg-slate-100 text-slate-900'
                  }`}>
                    <p className="leading-relaxed">{message.content}</p>
                    
                    {message.instructions && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <div className="space-y-2">
                          {message.instructions.map((instruction, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-slate-700">{instruction}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {message.priority && (
                      <div className="mt-2">
                        <Badge className={`${getPriorityColor(message.priority)} text-xs`}>
                          {message.priority === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {message.priority === 'medium' && <Clock className="w-3 h-3 mr-1" />}
                          {message.priority === 'low' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {message.priority.toUpperCase()}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className={`text-xs text-slate-500 mt-1 ${
                    message.type === 'user' ? 'text-right' : ''
                  }`}>
                    {message.timestamp.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-unifio-navy rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-100 rounded-lg p-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Action Buttons */}
        <div className="border-t border-slate-200 p-3">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => sendMessage('Como estou me sentindo agora')}
              className="text-xs border-slate-300 hover:bg-slate-50"
            >
              Como me sinto
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => sendMessage('Quanto tempo vai demorar?')}
              className="text-xs border-slate-300 hover:bg-slate-50"
            >
              Tempo de espera
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem ou descreva como se sente..."
              className="flex-1 border-slate-300 focus:border-unifio-navy focus:ring-unifio-navy/20"
            />
            <Button 
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim()}
              className="bg-unifio-navy hover:bg-unifio-navy/90 text-white px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="border-t border-red-200 bg-red-50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-red-800">
              <AlertTriangle className="w-4 h-4" />
              <span>Emergência grave?</span>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-100"
              onClick={() => window.open('tel:192')}
            >
              <Phone className="w-4 h-4 mr-1" />
              Ligar 192
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalChatBot;