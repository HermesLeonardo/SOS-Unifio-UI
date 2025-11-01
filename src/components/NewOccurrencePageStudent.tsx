import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useApp } from '../contexts/AppContext';
import { symptomLabels, classifyOccurrence, peopleCountLabels } from '../data/mockData';
import { locationService } from "../services/locationService";
import { PredefinedSymptom, LocationMethod, Location, Occurrence, PeopleCount } from '../types';
import MobileNav from './MobileNav';
import { 
  MapPin, 
  Heart,
  Clock,
  MessageCircle,
  CheckCircle,
  Info,
  LogOut,
  Phone,
  Building,
  Activity,
  Zap,
  Brain,
  Eye,
  Thermometer,
  Droplets,
  Wind,
  Users,
  Stethoscope,
  Shield,
  AlertCircle,
  ChevronRight,
  AlertTriangle,
  User,
  UserPlus,
  Check,
  Flame,
  HelpCircle
} from 'lucide-react';
import { toast } from "sonner";
import { occurrenceService } from "../services/occurrenceService";


const NewOccurrencePageStudent: React.FC = () => {
  const { user, setCurrentPage, setActiveOccurrence, setUser } = useApp();
  const [step, setStep] = useState<'location' | 'symptoms' | 'confirmation'>('location');
  
  // Location data
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [locationDescription, setLocationDescription] = useState<string>('');
  
  // People count data - NEW: moved to location step
  const [selectedPeopleCount, setSelectedPeopleCount] = useState<PeopleCount | ''>('');
  
  // Symptoms data - SIMPLIFIED: now just category selection
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [symptomsDescription, setSymptomsDescription] = useState<string>(''); // NEW: Required field
  
  // Classification result (hidden from student UI)
  const [classification, setClassification] = useState<{ type: 'urgencia' | 'emergencia', priority: string } | null>(null);
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-classify when category or people count change (for backend processing only)
  useEffect(() => {
    if (selectedCategory && selectedPeopleCount) {
      // Map category to symptom for classification
      const symptomMapping: Record<string, PredefinedSymptom> = {
        'lesoes-traumas': 'lesao_trauma',
        'queimaduras-intoxicacoes': 'outro',
        'dificuldades-respiratorias': 'dificuldade_respirar',
        'mal-estar-subito': 'nausea_vomito',
        'crises-neurologicas': 'convulsao'
      };
      
      const mappedSymptom = symptomMapping[selectedCategory];
      if (mappedSymptom) {
        const result = classifyOccurrence([mappedSymptom], selectedPeopleCount as PeopleCount);
        setClassification(result);
      }
    } else {
      setClassification(null);
    }
  }, [selectedCategory, selectedPeopleCount]);

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const handleSubmit = async () => {
    if (!user || !selectedPeopleCount || !symptomsDescription.trim() || !selectedCategory) return;

    setIsSubmitting(true);

    try {
      const tipoOcorrenciaMapping: Record<string, number> = {
        "lesoes-traumas": 1,
        "queimaduras-intoxicacoes": 2,
        "dificuldades-respiratorias": 3,
        "mal-estar-subito": 4,
        "crises-neurologicas": 5,
      };

      const tipoOcorrenciaId = tipoOcorrenciaMapping[selectedCategory] || 1;

      const result = await occurrenceService.abrirOcorrencia(
        Number(selectedLocationId),
        selectedPeopleCount === "1" ? 1 : selectedPeopleCount === "2-3" ? 2 : 3,
        tipoOcorrenciaId,
        symptomsDescription,
        locationDescription
      );
      

      console.log("Ocorrência criada:", result);
      console.log("Dados do chamado enviado:", {
        locationId: Number(selectedLocationId),
        peopleCount: selectedPeopleCount === "1" ? 1 : selectedPeopleCount === "2-3" ? 2 : 3,
        occurrenceType: tipoOcorrenciaId,
        description: symptomsDescription,
        locationDescription: locationDescription
      });
      
      toast.success("Chamado enviado com sucesso!");
      if (result?.id || result?.a02_id) {
        setActiveOccurrence({
          id: String(result?.id || result?.a02_id || "0"),
          userId: String(user?.id || "0"),
          status: "aberto",
          type: "urgencia",
          priority: "alta",
          locationMethod: "manual",
          peopleCount: "1" as PeopleCount,
          user: {
            id: String(user?.id || "0"),
            name: user?.name || "Usuário",
            email: user?.email || "",
            role: user?.role || "aluno",
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          location: {
            id: String(0),
            name: "Local não informado",
            type: "bloco",
            isActive: true,
          },
          responders: [],
          observations: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          description: "",
          symptoms: [],
        });
      }
      setStep("confirmation");
    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao enviar chamado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const data = await locationService.getAll();
        setLocations(data);
        console.log("Locais carregados:", data);
      } catch (err) {
        console.error("Erro ao buscar locais:", err);
      }
    }
    fetchLocations();
  }, []);

  // NEW: Simplified main categories only
  const symptomCategories = [
    {
      id: 'lesoes-traumas',
      title: 'Lesões, Traumas e Sangramentos',
      description: 'Quedas, cortes, machucados, fraturas, entorses, pancadas, acidentes físicos e sangramentos em geral.',
      icon: AlertTriangle,
      color: 'from-red-50 to-red-100',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200'
    },
    {
      id: 'queimaduras-intoxicacoes',
      title: 'Queimaduras e Intoxicações',
      description: 'Queimaduras térmicas, químicas ou elétricas, contato com substâncias tóxicas, intoxicação por alimentos, bebidas ou produtos químicos.',
      icon: Flame,
      color: 'from-orange-50 to-orange-100',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    },
    {
      id: 'dificuldades-respiratorias',
      title: 'Dificuldades Respiratórias',
      description: 'Falta de ar, crises de asma, engasgos, sufocamento, tosse intensa ou dor ao respirar.',
      icon: Wind,
      color: 'from-blue-50 to-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      id: 'mal-estar-subito',
      title: 'Mal-Estar Súbito',
      description: 'Febre, náuseas, vômitos, tontura, desmaios, dor de cabeça intensa, fraqueza ou indisposição repentina.',
      icon: Activity,
      color: 'from-green-50 to-green-100',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      id: 'crises-neurologicas',
      title: 'Crises Neurológicas ou Psicológicas',
      description: 'Convulsões, perda de consciência, confusão mental, ansiedade intensa, ataques de pânico ou comportamento alterado.',
      icon: Brain,
      color: 'from-purple-50 to-purple-100',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    }
  ];

  const renderLocationStep = () => (
    <Card className="border-gray-200 shadow-unifio">
      <CardHeader className="pb-4 lg:pb-6">
        <CardTitle className="flex items-center gap-2 lg:gap-3 text-unifio-primary text-lg lg:text-xl">
          <MapPin className="w-5 h-5 lg:w-6 lg:h-6" />
          Onde você está?
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm lg:text-base">
          Selecione o bloco, informe sua localização específica e quantas pessoas precisam de atendimento
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 lg:space-y-8">
        {/* Block Selection */}
        <div className="space-y-3 lg:space-y-4">
          <Label htmlFor="location-select" className="text-sm lg:text-base">
            <div className="flex items-center gap-2 lg:gap-3">
              <Building className="w-4 h-4 lg:w-5 lg:h-5 text-unifio-primary" />
              Selecione o bloco
            </div>
          </Label>
          <Select value={selectedLocationId} onValueChange={setSelectedLocationId}>
            <SelectTrigger className="h-12 lg:h-14 bg-white border-gray-200 hover:border-unifio-primary transition-colors">
              <SelectValue placeholder="Escolha o bloco onde você está" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={String(location.id)}>
                  <div className="flex items-center gap-3 py-2">
                    <Building className="w-4 h-4 text-unifio-primary" />
                    <div>
                      <div className="font-medium">{location.name}</div>
                      {location.description && (
                        <div className="text-sm text-gray-500">{location.description}</div>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Additional Location Information */}
        <div className="space-y-4">
          <Label htmlFor="location-details" className="text-base">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-unifio-primary" />
              Informações adicionais sobre sua localização
            </div>
          </Label>
          <Textarea
            id="location-details"
            placeholder="Ex: Sala 205, 2º andar, próximo à escada principal..."
            value={locationDescription}
            onChange={(e) => setLocationDescription(e.target.value)}
            className="min-h-[80px] bg-white border-gray-200 focus:border-unifio-primary focus:ring-unifio-primary/20 resize-none"
          />
          <p className="text-sm text-gray-500 flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 text-gray-400" />
            Seja específico para facilitar a localização: número da sala, andar, pontos de referência próximos
          </p>
        </div>

        {/* People Count - MOVED HERE */}
        <div className="space-y-4">
          <Label htmlFor="people-count" className="text-base">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-unifio-primary" />
              Quantas pessoas precisam de atendimento?
            </div>
          </Label>
            <Select
              value={selectedPeopleCount}
              onValueChange={(value: string) => setSelectedPeopleCount(value as PeopleCount)}
            >
            <SelectTrigger className="h-14 bg-white border-gray-200 hover:border-unifio-primary transition-colors">
              <SelectValue placeholder="Selecione a quantidade de pessoas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">
                <div className="flex items-center gap-3 py-2">
                  <User className="w-4 h-4 text-unifio-primary" />
                  <div>
                    <div className="font-medium">1 pessoa</div>
                    <div className="text-sm text-gray-500">Apenas eu preciso de atendimento</div>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="2-3">
                <div className="flex items-center gap-3 py-2">
                  <Users className="w-4 h-4 text-unifio-primary" />
                  <div>
                    <div className="font-medium">2 a 3 pessoas</div>
                    <div className="text-sm text-gray-500">Somos 2 ou 3 pessoas que precisam de atendimento</div>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="3+">
                <div className="flex items-center gap-3 py-2">
                  <UserPlus className="w-4 h-4 text-unifio-primary" />
                  <div>
                    <div className="font-medium">Mais de 3 pessoas</div>
                    <div className="text-sm text-gray-500">Mais de 3 pessoas precisam de atendimento médico</div>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {selectedPeopleCount && (
            <p className="text-sm text-unifio-primary font-medium flex items-center gap-2">
              <Info className="w-4 h-4" />
              {peopleCountLabels[selectedPeopleCount]} - Nossa equipe será notificada adequadamente
            </p>
          )}
        </div>

        {/* Selected Location Summary */}
        {selectedLocationId && selectedPeopleCount && (
          <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100/50">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="font-semibold mb-1">Resumo:</div>
              <div className="text-blue-700">
              <strong>Local:</strong> {locations.find(l => String(l.id) === selectedLocationId)?.name}
              </div>
              <div className="text-blue-700">
                <strong>Pessoas:</strong> {peopleCountLabels[selectedPeopleCount]}
              </div>
              {locationDescription && (
                <div className="text-sm mt-2 text-blue-600 bg-white/60 rounded p-2">
                  <strong>Detalhes:</strong> {locationDescription}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end pt-4">
          <Button 
            onClick={() => setStep('symptoms')}
            disabled={!selectedLocationId || !selectedPeopleCount}
            className="bg-unifio-primary hover:bg-unifio-primary/90 h-12 px-8 text-base"
          >
            Próximo: Sintomas
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderSymptomsStep = () => (
    <Card className="border-gray-200 shadow-unifio">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-unifio-primary text-xl">
          <Stethoscope className="w-6 h-6" />
          Como você está se sentindo?
        </CardTitle>
        <CardDescription className="text-gray-600 text-base">
          Selecione o tipo de situação que melhor descreve seu problema e forneça detalhes para que nossa equipe possa se preparar adequadamente.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Main Categories - Clickable Cards */}
        <div className="space-y-4">
          <Label className="text-base">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-unifio-primary" />
              Selecione o tipo de situação <span className="text-red-500">*</span>
            </div>
          </Label>
          
          <div className="grid grid-cols-1 gap-4">
            {symptomCategories.map((category) => {
              const isSelected = selectedCategory === category.id;
              const IconComponent = category.icon;
              
              return (
                <div
                  key={category.id}
                  className={`
                    relative group cursor-pointer transition-all duration-300 ease-out
                    ${isSelected ? 'scale-[1.01] z-10' : 'hover:scale-[1.005] hover:z-10'}
                  `}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className={`
                    relative p-6 rounded-xl border-2 transition-all duration-300 ease-out
                    ${isSelected
                      ? 'bg-white border-unifio-primary shadow-unifio ring-2 ring-unifio-primary/20'
                      : 'bg-white border-gray-200 hover:border-unifio-primary/60 hover:shadow-md group-hover:bg-gray-50/50'
                    }
                  `}>
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-unifio-primary rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`
                        p-4 rounded-xl transition-all duration-300 flex-shrink-0
                        ${isSelected
                          ? 'bg-unifio-primary text-white shadow-md'
                          : `bg-gradient-to-r ${category.color} ${category.iconColor} group-hover:scale-105`
                        }
                      `}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className={`
                          font-semibold text-lg transition-colors duration-300 mb-2
                          ${isSelected ? 'text-unifio-primary' : 'text-gray-900 group-hover:text-unifio-primary'}
                        `}>
                          {category.title}
                        </div>
                        <div className={`
                          text-sm transition-colors duration-300 leading-relaxed
                          ${isSelected ? 'text-gray-700' : 'text-gray-600'}
                        `}>
                          {category.description}
                        </div>
                        {isSelected && (
                          <div className="text-sm text-unifio-primary font-medium mt-3 flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            Categoria selecionada
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* REQUIRED Description Field */}
        <div className="space-y-4">
          <Label htmlFor="symptoms-description" className="text-base">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-unifio-primary" />
              Descreva detalhadamente os sintomas <span className="text-red-500">*</span>
            </div>
          </Label>
          <Textarea
            id="symptoms-description"
            placeholder="Descreva exatamente o que você está sentindo, onde dói, como começou, quando aconteceu, intensidade da dor, etc. Seja bem específico para que nossa equipe possa se preparar adequadamente..."
            value={symptomsDescription}
            onChange={(e) => setSymptomsDescription(e.target.value)}
            className="min-h-[140px] bg-white border-gray-200 focus:border-unifio-primary focus:ring-unifio-primary/20 resize-none"
            required
          />
          <p className="text-sm text-gray-500 flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 text-gray-400" />
            <span>
              <strong>Campo obrigatório.</strong> Informe detalhes como: localização da dor, intensidade, quando começou, 
              o que estava fazendo, outros sintomas associados, etc. Essas informações são essenciais para o atendimento.
            </span>
          </p>
          {symptomsDescription.trim() && (
            <div className="text-sm text-unifio-primary font-medium">
              ✓ Descrição preenchida ({symptomsDescription.length} caracteres)
            </div>
          )}
        </div>

        {/* Selected Category Summary */}
        {selectedCategory && (
          <div className="bg-gradient-to-r from-unifio-primary/5 to-blue-50 p-6 rounded-xl border border-unifio-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-unifio-primary rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-unifio-primary">
                  Categoria Selecionada
                </h4>
                <p className="text-sm text-gray-600">Esta informação será enviada à equipe médica</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge 
                className="bg-white/80 text-unifio-primary border border-unifio-primary/30 hover:bg-unifio-primary/10 transition-colors px-3 py-1"
              >
                {symptomCategories.find(cat => cat.id === selectedCategory)?.title}
              </Badge>
            </div>
          </div>
        )}

        {/* Medical Team Alert */}
        {selectedCategory && symptomsDescription.trim() && (
          <Alert className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <Shield className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold mb-2">
                    Informações Completas - Pronto para Envio
                  </div>
                  <div className="text-sm text-green-700">
                    Nossa equipe médica receberá todas as informações detalhadas e virá te atender no local informado. 
                    Permaneça calmo e aguarde.
                  </div>
                </div>
                <Users className="w-6 h-6 text-green-600 mt-0.5" />
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-unifio-primary" />
            Resumo da Solicitação
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <span className="font-medium text-gray-900">Local:</span>
                <div className="text-gray-600 mt-1">
                    {selectedLocationId 
                      ? locations.find(l => String(l.id) === selectedLocationId)?.name
                      : 'Não informado'
                    }
                </div>
                {locationDescription && (
                  <div className="text-sm text-gray-500 mt-1 p-2 bg-gray-50 rounded">
                    "{locationDescription}"
                  </div>
                )}
              </div>
            </div>

            {selectedPeopleCount && (
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <span className="font-medium text-gray-900">Pessoas que precisam de atendimento:</span>
                  <div className="text-gray-600 mt-1">
                    {peopleCountLabels[selectedPeopleCount]}
                  </div>
                </div>
              </div>
            )}
            
            {selectedCategory && (
              <div className="flex items-start gap-3">
                <Stethoscope className="w-5 h-5 text-gray-500 mt-0.5" />
                <div className="flex-1">
                  <span className="font-medium text-gray-900">
                    Tipo de Situação:
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge 
                      variant="secondary"
                      className="text-xs bg-gray-100 text-gray-700 border border-gray-200"
                    >
                      {symptomCategories.find(cat => cat.id === selectedCategory)?.title}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {symptomsDescription.trim() && (
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-gray-500 mt-0.5" />
                <div className="flex-1">
                  <span className="font-medium text-gray-900">Descrição dos Sintomas:</span>
                  <div className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded border-l-4 border-unifio-primary">
                    {symptomsDescription}
                  </div>
                </div>
              </div>
            )}
            
            {selectedCategory && symptomsDescription.trim() && (
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <span className="font-medium text-gray-900">Status:</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200 ml-2">
                    PRONTO PARA ENVIO
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <Button 
            variant="outline" 
            onClick={() => setStep('location')}
            className="border-gray-300 hover:bg-gray-50 h-12 px-6"
          >
            Voltar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedCategory || !symptomsDescription.trim() || isSubmitting}
            className="bg-unifio-primary hover:bg-unifio-primary/90 h-12 px-8 text-base disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              <>
                Enviar Chamado
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderConfirmationStep = () => (
    <Card className="border-gray-200 shadow-unifio">
      <CardHeader className="pb-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-unifio-primary text-2xl">
          Chamado Enviado com Sucesso!
        </CardTitle>
        <CardDescription className="text-gray-600 text-base">
          Nossa equipe médica foi notificada e está a caminho
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Alert className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <Shield className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="font-semibold mb-2">
              Equipe médica notificada com sucesso
            </div>
            <div className="text-sm text-green-700">
              Permaneça no local informado e mantenha a calma. Nossa equipe chegará em breve para te atender.
            </div>
          </AlertDescription>
        </Alert>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={() => setCurrentPage('occurrence-status')}
            className="bg-unifio-primary hover:bg-unifio-primary/90 h-12 px-8 text-base"
          >
            Acompanhar Status do Chamado
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Navigation */}
      <MobileNav />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 lg:py-4">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-unifio-primary rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base lg:text-lg font-semibold text-gray-900">SOS UNIFIO</h1>
                <p className="text-xs lg:text-sm text-gray-600 hidden sm:block">Solicitação de Atendimento Médico</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-4">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-600">
                  {user?.role === 'aluno' && user.ra && `RA: ${user.ra}`}
                  {user?.role === 'colaborador' && 'Colaborador'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 hidden lg:flex"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Step 1: Location & People */}
            <div className="flex items-center gap-1 lg:gap-2">
              <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-medium transition-colors ${
                step === 'location' 
                  ? 'bg-unifio-primary text-white' 
                  : step === 'symptoms' || step === 'confirmation'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
              }`}>
                {step === 'symptoms' || step === 'confirmation' ? (
                  <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                ) : (
                  '1'
                )}
              </div>
              <span className={`text-xs lg:text-sm font-medium hidden sm:inline ${
                step === 'location' ? 'text-unifio-primary' : 'text-gray-600'
              }`}>
                Local & Pessoas
              </span>
            </div>

            <div className={`flex-1 h-0.5 ${
              step === 'symptoms' || step === 'confirmation' ? 'bg-green-200' : 'bg-gray-200'
            }`} />

            {/* Step 2: Symptoms */}
            <div className="flex items-center gap-1 lg:gap-2">
              <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-medium transition-colors ${
                step === 'symptoms' 
                  ? 'bg-unifio-primary text-white' 
                  : step === 'confirmation'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
              }`}>
                {step === 'confirmation' ? (
                  <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                ) : (
                  '2'
                )}
              </div>
              <span className={`text-xs lg:text-sm font-medium hidden sm:inline ${
                step === 'symptoms' ? 'text-unifio-primary' : 'text-gray-600'
              }`}>
                Sintomas
              </span>
            </div>

            <div className={`flex-1 h-0.5 ${
              step === 'confirmation' ? 'bg-green-200' : 'bg-gray-200'
            }`} />

            {/* Step 3: Confirmation */}
            <div className="flex items-center gap-1 lg:gap-2">
              <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-medium transition-colors ${
                step === 'confirmation' 
                  ? 'bg-unifio-primary text-white' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {step === 'confirmation' ? (
                  <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                ) : (
                  '3'
                )}
              </div>
              <span className={`text-xs lg:text-sm font-medium hidden sm:inline ${
                step === 'confirmation' ? 'text-unifio-primary' : 'text-gray-600'
              }`}>
                Confirmação
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {step === 'location' && renderLocationStep()}
        {step === 'symptoms' && renderSymptomsStep()}
        {step === 'confirmation' && renderConfirmationStep()}
      </div>

      {/* Emergency Contact */}
      <div className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6">
        <Button
          className="bg-red-600 hover:bg-red-700 text-white shadow-lg h-12 lg:h-14 px-4 lg:px-6 rounded-full text-sm lg:text-base"
          onClick={() => {
            toast('Em caso de emergência extrema, ligue 192 (SAMU) ou 193 (Bombeiros)', {
              duration: 6000,
            });
          }}
        >
          <Phone className="w-5 h-5 mr-2" />
          Emergência: 192
        </Button>
      </div>
    </div>
  );
};

export default NewOccurrencePageStudent;