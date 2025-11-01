# Correção de Warnings React - setState Durante Render

## Problema Identificado

```
Warning: Cannot update a component while rendering a different component.
```

Este aviso ocorria porque o componente `EmergencyCallNotification` estava chamando `toast()` e atualizando states durante o ciclo de renderização, violando as regras do React.

## Causa Raiz

### 1. Toast Síncrono no useEffect
O toast era chamado diretamente dentro de um useEffect que monitora `incomingCalls`, causando atualização de estado durante o render:

```typescript
// ❌ ANTES (Problemático)
useEffect(() => {
  if (newCall) {
    toast('Novo Chamado!'); // Chamado durante render
  }
}, [incomingCalls]);
```

### 2. Múltiplas Chamadas de Toast no Context
As funções `redirectCallToNextResponder` no `AppContext.tsx` chamavam toast diretamente durante updates de estado:

```typescript
// ❌ ANTES (Problemático)
setIncomingCalls([...]);
toast.success('Redirecionado'); // Imediatamente após setState
```

### 3. Timeout sem Guard
O efeito de timeout podia executar múltiplas vezes sem proteção:

```typescript
// ❌ ANTES (Problemático)
useEffect(() => {
  if (timeRemaining === 0) {
    handleTimeout(); // Podia executar múltiplas vezes
  }
}, [timeRemaining]);
```

## Solução Implementada

### 1. Toast Assíncrono com Estado Intermediário

**EmergencyCallNotification.tsx**
```typescript
// ✅ DEPOIS (Correto)
const [shouldShowToast, setShouldShowToast] = useState(false);
const [toastData, setToastData] = useState(null);

// Primeiro efeito: prepara dados
useEffect(() => {
  if (newCall) {
    setToastData({...});
    setShouldShowToast(true);
  }
}, [incomingCalls]);

// Segundo efeito: mostra toast (separado)
useEffect(() => {
  if (shouldShowToast && toastData) {
    toast('Novo Chamado!', { description: toastData });
    setShouldShowToast(false);
  }
}, [shouldShowToast, toastData]);
```

### 2. setTimeout para Toast no Context

**AppContext.tsx**
```typescript
// ✅ DEPOIS (Correto)
setIncomingCalls([...]);

// Toast agendado para após o render
setTimeout(() => {
  toast.success('Redirecionado');
}, 0);
```

### 3. Guard de Timeout com Flag

**EmergencyCallNotification.tsx**
```typescript
// ✅ DEPOIS (Correto)
const [hasTimedOut, setHasTimedOut] = useState(false);

useEffect(() => {
  if (timeRemaining === 0 && !hasTimedOut) {
    setHasTimedOut(true); // Previne execução múltipla
    
    setTimeout(() => {
      handleCallTimeout(currentCall.id);
      toast.info('Tempo esgotado');
      // ... cleanup
    }, 0);
  }
}, [timeRemaining, hasTimedOut]);
```

## Mudanças nos Arquivos

### `/components/EmergencyCallNotification.tsx`
- ✅ Adicionado `shouldShowToast` e `toastData` states
- ✅ Adicionado `hasTimedOut` flag
- ✅ Separado efeito de toast em useEffect independente
- ✅ Adicionado setTimeout no handler de timeout
- ✅ Reset de `hasTimedOut` quando novo chamado chega

### `/contexts/AppContext.tsx`
- ✅ Envolvido toast.success() em setTimeout(, 0)
- ✅ Envolvido toast.warning() em setTimeout(, 0)
- ✅ Mantida lógica de redirecionamento intacta

## Benefícios

1. **Sem Warnings**: Elimina completamente os avisos do React
2. **Melhor Performance**: Separa operações síncronas de assíncronas
3. **Mais Previsível**: Guards previnem execuções duplicadas
4. **Mantém Funcionalidade**: Todos os recursos continuam funcionando perfeitamente

## Padrão Recomendado

Para evitar problemas similares no futuro:

### ✅ FAZER
```typescript
// Usar setTimeout para side effects após setState
setState(newValue);
setTimeout(() => toast('Success'), 0);

// Usar efeitos separados para notificações
useEffect(() => setFlag(true), [dependency]);
useEffect(() => { if (flag) toast(); }, [flag]);

// Usar flags para prevenir execuções múltiplas
const [processed, setProcessed] = useState(false);
if (condition && !processed) {
  setProcessed(true);
  doSomething();
}
```

### ❌ NÃO FAZER
```typescript
// Não chamar toast diretamente após setState
setState(newValue);
toast('Success'); // ❌

// Não atualizar estado durante render
useEffect(() => {
  setState(...);
  toast(...); // ❌
}, [deps]);

// Não permitir execuções múltiplas sem guard
useEffect(() => {
  if (condition) doSomething(); // ❌ Pode executar múltiplas vezes
}, [condition]);
```

## Testes Realizados

- ✅ Simular chamado → Toast aparece corretamente
- ✅ Rejeitar chamado → Redirecionamento funciona
- ✅ Timer expirar → Timeout executa uma única vez
- ✅ Múltiplos chamados → Sem warnings no console
- ✅ Aceitar chamado → Transição suave sem erros

## Conclusão

Todas as warnings foram corrigidas seguindo as melhores práticas do React. O sistema continua funcionando perfeitamente, agora com código mais robusto e previsível.
