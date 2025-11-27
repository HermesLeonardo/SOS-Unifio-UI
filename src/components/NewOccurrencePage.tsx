import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { useApp } from '../contexts/AppContext';
import { mockLocations } from '../data/mockData';
import { Priority } from '../types';
import { ArrowLeft, MapPin, AlertTriangle, CheckCircle, Clock, Phone, QrCode, Info } from 'lucide-react';

const NewOccurrencePage: React.FC = () => {
  const { user, setCurrentPage } = useApp();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [description, setDescription] = useState('');
  const [suggestedPriority, setSuggestedPriority] = useState<Priority>('media');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Sintomas pré-definidos para sugestão de prioridade
  const criticalSymptoms = ['dor no peito', 'dificuldade para respirar', 'desmaio', 'convulsão', 'hemorragia', 'fratura exposta'];
  const urgentSymptoms = ['tontura', 'vômito', 'febre alta', 'corte', 'queda', 'dor intensa'];

  const handleSymptomsChange = (value: string) => {
    setSymptoms(value);
    
    const lowerSymptoms = value.toLowerCase();
    if (criticalSymptoms.some(symptom => lowerSymptoms.includes(symptom))) {
      setSuggestedPriority('alta');
    } else if (urgentSymptoms.some(symptom => lowerSymptoms.includes(symptom))) {
      setSuggestedPriority('media');
    } else if (value.trim()) {
      setSuggestedPriority('baixa');
    } else {
      setSuggestedPriority('media');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation || !symptoms.trim()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setSelectedLocation('');
      setSymptoms('');
      setDescription('');
      setSuggestedPriority('media');
      setCurrentPage('occurrence-status');
    }, 3000);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-700 border-red-200';
      case 'media': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'baixa': return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'alta': return <AlertTriangle className="w-4 h-4" />;
      case 'media': return <Clock className="w-4 h-4" />;
      case 'baixa': return <CheckCircle className="w-4 h-4" />;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center border-slate-200">
          <CardContent className="pt-8 pb-8">
            <div className="mx-auto mb-6 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              Solicitação Enviada
            </h2>
            <p className="text-slate-600 mb-6">
              Seu chamado foi registrado e enviado para a central de atendimento. Você receberá atualizações em tempo real.
            </p>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-700">
                <span className="font-medium">Protocolo:</span> EMG-{Math.random().toString(36).substr(2, 6).toUpperCase()}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Redirecionando para acompanhamento com assistente médico...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentPage('dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                Solicitar Atendimento de Emergência
              </h1>
              <p className="text-sm text-slate-600">
                Preencha as informações necessárias para o atendimento
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Informações da Ocorrência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Localização */}
              <div className="space-y-3">
                <Label htmlFor="location" className="flex items-center gap-2 text-slate-700 font-medium">
                  <MapPin className="w-4 h-4" />
                  Local da Emergência *
                </Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation} required>
                  <SelectTrigger className="h-11 border-slate-300 focus:border-unifio-navy focus:ring-unifio-navy/20">
                    <SelectValue placeholder="Selecione o local onde você está" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLocations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        <div className="py-1">
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm text-slate-500">{location.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Dica:</strong> Use o QR Code localizado nos blocos para seleção automática e mais precisa do local.
                  </AlertDescription>
                </Alert>
              </div>

              {/* Sintomas */}
              <div className="space-y-3">
                <Label htmlFor="symptoms" className="text-slate-700 font-medium">
                  Sintomas ou Situação *
                </Label>
                <Input
                  id="symptoms"
                  placeholder="Descreva brevemente os sintomas (ex: tontura, dor no peito, corte)"
                  value={symptoms}
                  onChange={(e) => handleSymptomsChange(e.target.value)}
                  className="h-11 border-slate-300 focus:border-unifio-navy focus:ring-unifio-navy/20"
                  required
                />
              </div>

              {/* Descrição adicional */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-slate-700 font-medium">
                  Informações Adicionais
                </Label>
                <Textarea
                  id="description"
                  placeholder="Forneça detalhes adicionais que possam ajudar no atendimento..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="border-slate-300 focus:border-unifio-navy focus:ring-unifio-navy/20 resize-none"
                />
              </div>

              {/* Prioridade sugerida */}
              {symptoms && (
                <Alert className="border-slate-200 bg-slate-50">
                  <AlertTriangle className="h-4 w-4 text-slate-600" />
                  <AlertDescription>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-700 font-medium">Prioridade sugerida:</span>
                      <Badge className={`${getPriorityColor(suggestedPriority)} border px-3 py-1`}>
                        {getPriorityIcon(suggestedPriority)}
                        <span className="ml-1">{suggestedPriority.toUpperCase()}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">
                      A equipe médica realizará a triagem final baseada em protocolos clínicos.
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              {/* Informações importantes */}
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <strong className="text-red-800">Instruções Importantes:</strong>
                  <ul className="text-sm mt-2 space-y-1 text-red-700">
                    <li>• <strong>Emergências graves:</strong> Ligue imediatamente <strong>192 (SAMU)</strong> ou <strong>193 (Bombeiros)</strong></li>
                    <li>• <strong>Localização:</strong> Permaneça no local informado até a chegada da equipe</li>
                    <li>• <strong>Comunicação:</strong> Mantenha seu telefone disponível para contato</li>
                    <li>• <strong>Acompanhamento:</strong> Você receberá notificações sobre o status do atendimento</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCurrentPage('dashboard')}
                  className="flex-1 h-11 border-slate-300 hover:bg-slate-50"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={!selectedLocation || !symptoms.trim() || isSubmitting}
                  className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-medium"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Enviando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Enviar Solicitação
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewOccurrencePage;