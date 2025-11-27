# Sistema de Redirecionamento Automático de Chamados - SOS UNIFIO

## 📋 Visão Geral

O sistema SOS UNIFIO implementa um mecanismo inteligente de redirecionamento automático que garante que nenhum chamado de emergência médica fique sem atendimento. Quando um socorrista não pode aceitar um chamado (seja por rejeição manual ou por timeout), o sistema automaticamente redireciona para outro profissional disponível.

## 🔄 Fluxo de Funcionamento

### 1. Criação do Chamado
```
Aluno/Professor solicita atendimento
    ↓
Sistema cria ocorrência com priorização automática
    ↓
Notificação enviada para primeiro socorrista disponível
```

### 2. Notificação ao Socorrista
- **Pop-up em tela cheia** com todas as informações do chamado
- **Timer de 90 segundos** (1min 30s) iniciado
- **Duas opções**: Aceitar ou Rejeitar

### 3. Cenários de Redirecionamento

#### Cenário A: Rejeição Manual 🚫
```
Socorrista clica em "Rejeitar"
    ↓
Sistema registra tentativa
    ↓
Busca próximo respondedor (Socorrista → Colaborador)
    ↓
Envia notificação para próximo na fila
    ↓
Toast: "Redirecionado para [Nome] ([Cargo])"
```

#### Cenário B: Timer Expirado ⏱️
```
90 segundos → Pop-up minimiza e pisca
    ↓
0 segundos → Redirecionamento automático
    ↓
Busca próximo respondedor disponível
    ↓
Envia notificação para próximo na fila
    ↓
Toast: "Tempo esgotado - Redirecionado"
```

#### Cenário C: Todos Notificados ⚠️
```
Nenhum respondedor disponível
    ↓
Chamado permanece ativo na fila
    ↓
Alerta: "Considere contatar SAMU (192)"
```

## 🎯 Priorização de Respondedores

O sistema segue esta ordem hierárquica:

1. **Socorristas Disponíveis** (Prioridade Alta)
   - Profissionais treinados em primeiros socorros
   - Equipe do ambulatório

2. **Colaboradores Disponíveis** (Prioridade Média)
   - Professores de enfermagem
   - Equipe de apoio médico

## 🔧 Implementação Técnica

### AppContext.tsx
```typescript
// Rastreamento de tentativas
attemptedRespondersIds: string[] 

// Função de redirecionamento
redirectCallToNextResponder(call: IncomingCall)

// Função de timeout
handleCallTimeout(callId: string)
```

### EmergencyCallNotification.tsx
```typescript
// Timer com redirecionamento
useEffect(() => {
  if (timeRemaining <= 0) {
    handleCallTimeout(currentCall.id);
  }
}, [timeRemaining]);
```

### Estrutura de Dados
```typescript
interface IncomingCall {
  id: string;
  occurrence: Occurrence;
  timestamp: string;
  attemptedRespondersIds?: string[]; // ← Rastreamento
}
```

## 📊 Lista de Respondedores Mock

### Socorristas (4 disponíveis)
1. Rafael Santos Lima - Ambulatório
2. Fernanda Rodrigues Silva - Ambulatório

### Colaboradores (2 disponíveis)
3. Dr. Carlos Eduardo Mendes - Enfermagem
4. Ana Paula Ferreira - Ambulatório

## 🎨 Feedback Visual

### Notificações Toast
- ✅ **Verde**: Redirecionamento bem-sucedido
- ⚠️ **Amarelo**: Todos respondedores notificados
- ℹ️ **Azul**: Informações gerais

### Estados do Pop-up
1. **Normal** (90s-31s): Pop-up completo em tela
2. **Alerta** (30s-1s): Aviso amarelo de tempo limitado
3. **Crítico** (0s): Redirecionamento automático

## 🧪 Como Testar

### Teste 1: Rejeição Manual
1. Faça login como socorrista
2. Clique em "Simular Chamado" (botão flutuante)
3. Clique em "Rejeitar" no pop-up
4. ✓ Observe toast: "Redirecionado para [próximo socorrista]"

### Teste 2: Timer Expirado
1. Faça login como socorrista
2. Clique em "Simular Chamado"
3. Aguarde 90 segundos sem interagir
4. ✓ Observe pop-up minimizar e piscar
5. ✓ Observe redirecionamento automático

### Teste 3: Múltiplos Redirecionamentos
1. Simule múltiplos chamados
2. Rejeite todos sequencialmente
3. ✓ Observe rotação entre respondedores
4. ✓ Observe quando todos foram notificados

## 📝 Logs do Sistema

O sistema registra no console:
```javascript
console.log(`Chamado redirecionado para ${nextResponder.name} (${nextResponder.role})`);
console.warn('Nenhum respondedor disponível. Chamado permanece na fila.');
```

## 🚀 Melhorias Futuras

### Integração Real
- [ ] Conectar com banco de dados de respondedores reais
- [ ] Implementar sistema de disponibilidade (online/offline)
- [ ] Geolocalização para priorizar por proximidade

### Notificações
- [ ] Push notifications reais (FCM/APNs)
- [ ] SMS/WhatsApp para casos críticos
- [ ] Email de backup

### Analytics
- [ ] Taxa de aceitação por respondedor
- [ ] Tempo médio de resposta
- [ ] Histórico de redirecionamentos

### Escalação
- [ ] Escalar para ambulância após X tentativas
- [ ] Contato automático com SAMU em emergências críticas
- [ ] Notificação para administradores em casos extremos

## 📞 Contatos de Emergência

- **SAMU**: 192
- **Bombeiros**: 193
- **Campus UNIFIO**: (11) 4000-1234

---

**Desenvolvido para**: SOS UNIFIO - Sistema de Emergência Médica  
**Versão**: 2.0  
**Data**: Outubro 2024
