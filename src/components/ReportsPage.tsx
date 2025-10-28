import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useApp } from '../contexts/AppContext';
import { mockOccurrences, symptomLabels } from '../data/mockData';
import { 
  ArrowLeft, 
  BarChart3,
  Calendar,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  Clock,
  MapPin,
  Heart,
  FileText,
  PieChart,
  Activity,
  Target,
  CheckCircle
} from 'lucide-react';

const ReportsPage: React.FC = () => {
  const { user, setCurrentPage, simulatedOccurrences } = useApp() as any;
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Combinar ocorrências simuladas com mock data para relatórios
  const allOccurrences = simulatedOccurrences && simulatedOccurrences.length > 0 
    ? [...simulatedOccurrences, ...mockOccurrences] 
    : mockOccurrences;

  // Filtrar dados baseado no período selecionado
  const filterByPeriod = (occurrences: any[]) => {
    const now = new Date();
    const startDate = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return occurrences;
    }
    
    return occurrences.filter(occ => new Date(occ.createdAt) >= startDate);
  };

  const filteredOccurrences = filterByPeriod(allOccurrences);

  // Estatísticas gerais
  const totalOccurrences = filteredOccurrences.length;
  const emergencyOccurrences = filteredOccurrences.filter(o => o.type === 'emergencia').length;
  const urgencyOccurrences = filteredOccurrences.filter(o => o.type === 'urgencia').length;
  const completedOccurrences = filteredOccurrences.filter(o => o.status === 'concluido').length;
  const criticalOccurrences = filteredOccurrences.filter(o => o.priority === 'critica').length;

  // Estatísticas por usuário (apenas alunos para monitoramento)
  const studentOccurrences = filteredOccurrences.filter(o => o.user.role === 'aluno');
  const studentStats = studentOccurrences.reduce((acc, occ) => {
    const studentId = occ.user.id;
    if (!acc[studentId]) {
      acc[studentId] = {
        student: occ.user,
        count: 0,
        emergencies: 0,
        critical: 0,
        lastOccurrence: occ.createdAt
      };
    }
    acc[studentId].count++;
    if (occ.type === 'emergencia') acc[studentId].emergencies++;
    if (occ.priority === 'critica') acc[studentId].critical++;
    if (new Date(occ.createdAt) > new Date(acc[studentId].lastOccurrence)) {
      acc[studentId].lastOccurrence = occ.createdAt;
    }
    return acc;
  }, {} as any);

  // Ordenar estudantes por número de ocorrências
  const topStudents = Object.values(studentStats)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10);

  // Estatísticas por sintoma
  const symptomStats = filteredOccurrences.reduce((acc, occ) => {
    occ.symptoms.forEach(symptom => {
      acc[symptom] = (acc[symptom] || 0) + 1;
    });
    return acc;
  }, {} as any);

  const topSymptoms = Object.entries(symptomStats)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 8);

  // Estatísticas por localização
  const locationStats = filteredOccurrences.reduce((acc, occ) => {
    const location = occ.location?.name || 'Local não informado';
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {} as any);

  const topLocations = Object.entries(locationStats)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 6);

  // Taxa de conclusão
  const completionRate = totalOccurrences > 0 ? Math.round((completedOccurrences / totalOccurrences) * 100) : 0;

  // Tempo médio de resposta (simulado)
  const avgResponseTime = '12.5';

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'week': return 'Última semana';
      case 'month': return 'Último mês';
      case 'quarter': return 'Últimos 3 meses';
      case 'year': return 'Último ano';
      default: return 'Todos os períodos';
    }
  };

  const exportReport = () => {
    // Simular exportação de relatório
    const reportData = {
      periodo: getPeriodLabel(selectedPeriod),
      geradoEm: new Date().toLocaleString('pt-BR'),
      estatisticas: {
        totalOcorrencias: totalOccurrences,
        emergencias: emergencyOccurrences,
        urgencias: urgencyOccurrences,
        concluidas: completedOccurrences,
        taxaConclusao: completionRate,
        tempoMedioResposta: avgResponseTime
      },
      estudantesComMaisOcorrencias: topStudents,
      sintomasMaisComuns: topSymptoms,
      locaisComMaisOcorrencias: topLocations
    };

    console.log('Relatório exportado:', reportData);
    alert('Relatório exportado com sucesso! (Funcionalidade simulada)');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCurrentPage('dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-unifio-primary" />
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">
                    Relatórios e Analytics - SOS UNIFIO
                  </h1>
                  <p className="text-sm text-slate-600">
                    Análises e estatísticas do sistema de emergência
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={exportReport} className="bg-green-600 hover:bg-green-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                Exportar Relatório
              </Button>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-600 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros de Relatório
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Período
                </label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Última semana</SelectItem>
                    <SelectItem value="month">Último mês</SelectItem>
                    <SelectItem value="quarter">Últimos 3 meses</SelectItem>
                    <SelectItem value="year">Último ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Tipo de Ocorrência
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="emergencia">Emergências</SelectItem>
                    <SelectItem value="urgencia">Urgências</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <div className="text-sm text-slate-600">
                  <p className="font-medium">Período selecionado:</p>
                  <p>{getPeriodLabel(selectedPeriod)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total de Ocorrências</p>
                  <p className="text-2xl font-semibold text-slate-900">{totalOccurrences}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Emergências Críticas</p>
                  <p className="text-2xl font-semibold text-red-600">{criticalOccurrences}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Taxa de Conclusão</p>
                  <p className="text-2xl font-semibold text-green-600">{completionRate}%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Tempo Médio</p>
                  <p className="text-2xl font-semibold text-orange-600">{avgResponseTime}min</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Distribuição por Tipo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Distribuição por Tipo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-sm">Emergências</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">{emergencyOccurrences}</span>
                    <span className="text-sm text-slate-600 ml-2">
                      ({totalOccurrences > 0 ? Math.round((emergencyOccurrences / totalOccurrences) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="text-sm">Urgências</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">{urgencyOccurrences}</span>
                    <span className="text-sm text-slate-600 ml-2">
                      ({totalOccurrences > 0 ? Math.round((urgencyOccurrences / totalOccurrences) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sintomas Mais Comuns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Sintomas Mais Comuns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topSymptoms.map(([symptom, count], index) => (
                  <div key={symptom} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-5 h-5 bg-unifio-primary text-white rounded-full flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm">{symptomLabels[symptom as keyof typeof symptomLabels]}</span>
                    </div>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estudantes com Mais Ocorrências - Seção de Monitoramento */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Alunos que Requerem Atenção Especial
            </CardTitle>
            <p className="text-sm text-slate-600 mt-1">
              Estudantes com maior frequência de chamados médicos para acompanhamento preventivo
            </p>
          </CardHeader>
          <CardContent>
            {topStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Aluno</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">RA</th>
                      <th className="text-center py-3 px-4 font-medium text-slate-700">Total</th>
                      <th className="text-center py-3 px-4 font-medium text-slate-700">Emergências</th>
                      <th className="text-center py-3 px-4 font-medium text-slate-700">Críticas</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Último Chamado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topStudents.map((studentStat: any, index) => (
                      <tr key={studentStat.student.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs w-6 h-6 rounded-full flex items-center justify-center font-medium ${
                              index < 3 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {index + 1}
                            </span>
                            <span className="font-medium">{studentStat.student.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {studentStat.student.ra}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant={studentStat.count >= 5 ? 'destructive' : studentStat.count >= 3 ? 'default' : 'secondary'}>
                            {studentStat.count}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant={studentStat.emergencies > 0 ? 'destructive' : 'secondary'}>
                            {studentStat.emergencies}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant={studentStat.critical > 0 ? 'destructive' : 'secondary'}>
                            {studentStat.critical}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {new Date(studentStat.lastOccurrence).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600">Nenhum dado disponível para o período selecionado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Locais com Mais Ocorrências */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Locais com Maior Incidência
            </CardTitle>
            <p className="text-sm text-slate-600 mt-1">
              Áreas do campus que requerem atenção especial ou melhorias de segurança
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topLocations.map(([location, count], index) => (
                <div key={location} className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{location}</span>
                    <Badge variant={index < 2 ? 'destructive' : 'secondary'}>
                      {count}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-600">
                    {Math.round(((count as number) / totalOccurrences) * 100)}% do total
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;