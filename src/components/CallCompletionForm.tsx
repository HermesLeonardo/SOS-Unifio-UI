import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { useApp } from '../contexts/AppContext';
import { symptomLabels } from '../data/mockData';
import { 
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  FileText,
  Heart,
  Stethoscope,
  AlertCircle,
  X,
  Save,
  Send,
  Activity,
  MapPin,
  Phone
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CallCompletionFormProps {
  occurrence: any;
  onComplete: () => void;
  onCancel: () => void;
}

const CallCompletionForm: React.FC<CallCompletionFormProps> = ({ 
  occurrence, 
  onComplete, 
  onCancel 
}) => {
  const { user, updateActiveOccurrence } = useApp() as any;
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dados do formulário
  const [outcome, setOutcome] = useState('');
  const [treatment, setTreatment] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [referral, setReferral] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [medicationsGiven, setMedicationsGiven] = useState<string[]>([]);
  const [vitalSigns, setVitalSigns] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    painLevel: ''
  });
  const [requiresFollowUp, setRequiresFollowUp] = useState(false);
  const [requiresTransport, setRequiresTransport] = useState(false);
  const [patientStable, setPatientStable] = useState(true);
  const [additionalObservations, setAdditionalObservations] = useState('');

  const medicationOptions = [
    'Dipirona',
    'Paracetamol',
    'Ibuprofeno',
    'Buscopan',
    'Plasil',
    'Soro fisiológico',
    'Glicose',
    'Omeprazol',
    'Dorflex',
    'Não foi administrado medicamento'
  ];

  const outcomesOptions = [
    'Paciente estabilizado no local',
    'Paciente liberado sem necessidade de transporte',
    'Paciente encaminhado para unidade de saúde',
    'Paciente recusou atendimento médico',
    'Falso alarme - sem necessidade de atendimento',
    'Atendimento de primeiros socorros realizado',
    'Encaminhamento para SAMU',
    'Outro'
  ];

  const handleMedicationChange = (medication: string, checked: boolean) => {
    if (checked) {
      setMedicationsGiven([...medicationsGiven, medication]);
    } else {
      setMedicationsGiven(medicationsGiven.filter(m => m !== medication));
    }
  };

  const handleSubmit = async () => {
    // Validação básica
    if (!outcome || !treatment) {
      toast.error('Por favor, preencha os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Atualizar ocorrência com dados de conclusão
      const completionData = {
        status: 'concluido' as any,
        completedAt: new Date().toISOString(),
        outcome: {
          diagnosis,
          treatment,
          referral,
          followUp,
          patientCondition: patientStable ? 'Estável' : 'Instável',
          medicationsAdministered: medicationsGiven,
          requiresFollowUp,
          requiresTransport,
          finalOutcome: outcome
        },
        vitalSigns: {
          ...vitalSigns,
          heartRate: vitalSigns.heartRate ? parseInt(vitalSigns.heartRate) : undefined,
          temperature: vitalSigns.temperature ? parseFloat(vitalSigns.temperature) : undefined,
          respiratoryRate: vitalSigns.respiratoryRate ? parseInt(vitalSigns.respiratoryRate) : undefined,
          oxygenSaturation: vitalSigns.oxygenSaturation ? parseInt(vitalSigns.oxygenSaturation) : undefined,
          painLevel: vitalSigns.painLevel ? parseInt(vitalSigns.painLevel) : undefined
        },
        observations: [
          ...occurrence.observations,
          {
            id: `obs-${Date.now()}`,
            userId: user.id,
            user: user,
            text: additionalObservations || 'Atendimento concluído sem observações adicionais.',
            type: 'atendimento' as any,
            createdAt: new Date().toISOString()
          }
        ]
      };

      updateActiveOccurrence(completionData);
      
      toast.success('Chamado concluído com sucesso!');
      onComplete();
      
    } catch (error) {
      toast.error('Erro ao concluir chamado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-green-50 border-b border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-green-800">
                  Concluir Atendimento
                </CardTitle>
                <p className="text-sm text-green-700 mt-1">
                  Protocolo: EMG-{occurrence.id.toUpperCase().slice(-6)} • {occurrence.user.name}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-green-700 hover:bg-green-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-8">
            {/* Resumo do Chamado */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-3">Resumo do Chamado</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Paciente:</span>
                    <span>{occurrence.user.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Local:</span>
                    <span>{occurrence.location?.name}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="font-medium">Início:</span>
                    <span>{new Date(occurrence.createdAt).toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">Sintomas:</span>
                    <span>{occurrence.symptoms.map((s: string) => symptomLabels[s]).join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Lado Esquerdo - Informações Médicas */}
              <div className="space-y-6">
                {/* Sinais Vitais */}
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-slate-900 mb-4">
                    <Heart className="w-5 h-5 text-red-600" />
                    Sinais Vitais (Finais)
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bloodPressure">Pressão Arterial</Label>
                      <Input
                        id="bloodPressure"
                        placeholder="120/80"
                        value={vitalSigns.bloodPressure}
                        onChange={(e) => setVitalSigns({...vitalSigns, bloodPressure: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="heartRate">Freq. Cardíaca (bpm)</Label>
                      <Input
                        id="heartRate"
                        type="number"
                        placeholder="75"
                        value={vitalSigns.heartRate}
                        onChange={(e) => setVitalSigns({...vitalSigns, heartRate: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="temperature">Temperatura (°C)</Label>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        placeholder="36.5"
                        value={vitalSigns.temperature}
                        onChange={(e) => setVitalSigns({...vitalSigns, temperature: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="respiratoryRate">Freq. Respiratória</Label>
                      <Input
                        id="respiratoryRate"
                        type="number"
                        placeholder="16"
                        value={vitalSigns.respiratoryRate}
                        onChange={(e) => setVitalSigns({...vitalSigns, respiratoryRate: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="oxygenSaturation">Saturação O2 (%)</Label>
                      <Input
                        id="oxygenSaturation"
                        type="number"
                        placeholder="98"
                        value={vitalSigns.oxygenSaturation}
                        onChange={(e) => setVitalSigns({...vitalSigns, oxygenSaturation: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="painLevel">Nível de Dor (0-10)</Label>
                      <Input
                        id="painLevel"
                        type="number"
                        min="0"
                        max="10"
                        placeholder="0"
                        value={vitalSigns.painLevel}
                        onChange={(e) => setVitalSigns({...vitalSigns, painLevel: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Medicamentos Administrados */}
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-slate-900 mb-4">
                    <Stethoscope className="w-5 h-5 text-blue-600" />
                    Medicamentos Administrados
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {medicationOptions.map((medication) => (
                      <div key={medication} className="flex items-center space-x-2">
                        <Checkbox
                          id={medication}
                          checked={medicationsGiven.includes(medication)}
                          onCheckedChange={(checked) => 
                            handleMedicationChange(medication, checked as boolean)
                          }
                        />
                        <Label htmlFor={medication} className="text-sm font-normal">
                          {medication}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estado do Paciente */}
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-slate-900 mb-4">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    Estado do Paciente
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="patientStable"
                        checked={patientStable}
                        onCheckedChange={setPatientStable}
                      />
                      <Label htmlFor="patientStable">Paciente estável</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requiresTransport"
                        checked={requiresTransport}
                        onCheckedChange={setRequiresTransport}
                      />
                      <Label htmlFor="requiresTransport">Requer transporte para unidade de saúde</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requiresFollowUp"
                        checked={requiresFollowUp}
                        onCheckedChange={setRequiresFollowUp}
                      />
                      <Label htmlFor="requiresFollowUp">Requer acompanhamento médico</Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lado Direito - Relatório */}
              <div className="space-y-6">
                {/* Resultado do Atendimento */}
                <div>
                  <Label htmlFor="outcome" className="flex items-center gap-2 font-semibold text-slate-900">
                    <FileText className="w-5 h-5 text-green-600" />
                    Resultado do Atendimento *
                  </Label>
                  <Select value={outcome} onValueChange={setOutcome}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione o resultado" />
                    </SelectTrigger>
                    <SelectContent>
                      {outcomesOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Diagnóstico */}
                <div>
                  <Label htmlFor="diagnosis">Diagnóstico/Avaliação</Label>
                  <Textarea
                    id="diagnosis"
                    placeholder="Descreva o diagnóstico ou avaliação clínica..."
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="mt-2 h-20"
                  />
                </div>

                {/* Tratamento Realizado */}
                <div>
                  <Label htmlFor="treatment">Tratamento Realizado *</Label>
                  <Textarea
                    id="treatment"
                    placeholder="Descreva o tratamento e procedimentos realizados..."
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="mt-2 h-20"
                  />
                </div>

                {/* Encaminhamento */}
                <div>
                  <Label htmlFor="referral">Encaminhamento</Label>
                  <Textarea
                    id="referral"
                    placeholder="Descreva encaminhamentos para outros profissionais ou unidades..."
                    value={referral}
                    onChange={(e) => setReferral(e.target.value)}
                    className="mt-2 h-16"
                  />
                </div>

                {/* Recomendações de Acompanhamento */}
                <div>
                  <Label htmlFor="followUp">Recomendações</Label>
                  <Textarea
                    id="followUp"
                    placeholder="Recomendações para acompanhamento e cuidados..."
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    className="mt-2 h-16"
                  />
                </div>

                {/* Observações Adicionais */}
                <div>
                  <Label htmlFor="additionalObservations">Observações Adicionais</Label>
                  <Textarea
                    id="additionalObservations"
                    placeholder="Qualquer informação adicional relevante..."
                    value={additionalObservations}
                    onChange={(e) => setAdditionalObservations(e.target.value)}
                    className="mt-2 h-20"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 bg-slate-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-600">
              <span className="font-medium">Campos obrigatórios marcados com *</span>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="border-slate-300"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !outcome || !treatment}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Finalizando...
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Concluir Atendimento
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CallCompletionForm;