# 🧪 Guia de Teste: Sistema de Redirecionamento Automático

## Objetivo
Este guia explica como testar o sistema de redirecionamento automático de chamados usando os botões de teste implementados no sistema SOS UNIFIO.

---

## 📍 Localizando os Botões de Teste

### Botão Vermelho (Chamado Novo) - "TEST"
- **Localização:** Canto inferior direito da tela
- **Visível para:** Apenas Socorristas
- **Função:** Simula um chamado completamente novo
- **Ícone:** Tubo de ensaio (TestTube)

### Botão Roxo (Chamado Redirecionado) - "REDIR"
- **Localização:** Logo abaixo do botão vermelho
- **Visível para:** Socorristas e Colaboradores
- **Função:** Simula um chamado já redirecionado
- **Ícone:** Seta circular (RotateCcw)

---

## 🔬 Cenários de Teste

### 1. Testar Chamado Novo (Botão Vermelho)
**Como fazer:**
1. Faça login como socorrista (ex: rafael.lima@unifio.edu.br)
2. Vá para o Dashboard
3. Clique no botão vermelho "TEST" no canto inferior direito
4. Aguarde o pop-up de notificação aparecer

**O que observar:**
- Pop-up em tela cheia com todos os detalhes do chamado
- Timer de 90 segundos começando
- Badges mostrando tipo, prioridade e quantidade de pessoas
- **NÃO deve ter** badge roxa de "TENTATIVAS"
- **NÃO deve ter** alerta roxo de "Chamado Redirecionado"

### 2. Testar Chamado Redirecionado (Botão Roxo) ⭐
**Como fazer:**
1. Faça login como colaborador (ex: carlos.mendes@unifio.edu.br) **OU** socorrista
2. Vá para o Dashboard
3. Clique no botão roxo "REDIR"
4. Leia o toast que aparece mostrando quem já recebeu o chamado

**O que observar:**
- ✅ **Badge roxa** no cabeçalho: "🔄 X TENTATIVAS" (onde X = 1 ou 2)
- ✅ **Alerta roxo** dentro do pop-up: "Chamado Redirecionado"
- ✅ Texto: "Este chamado já foi enviado para X outros respondedores..."
- ✅ Toast mostra: "Já enviado para: [nomes]"
- ✅ No console do navegador: objeto com `attemptedRespondersIds`

### 3. Testar Redirecionamento Manual (Rejeição)
**Como fazer:**
1. Gere um chamado usando o botão roxo
2. Clique em "Rejeitar"
3. **Imediatamente** faça login com outro usuário (ex: fernanda.silva@unifio.edu.br)
4. Observe se o chamado chega para o próximo respondedor

**O que observar:**
- Toast: "O chamado foi redirecionado automaticamente..."
- No console: mensagem de redirecionamento
- Chamado deve aparecer para o próximo usuário
- Campo `attemptedRespondersIds` deve ter mais um ID

### 4. Testar Redirecionamento Automático (Timer Expirado)
**Como fazer:**
1. Gere um chamado usando qualquer botão
2. **NÃO clique** em aceitar ou rejeitar
3. Aguarde os 90 segundos terminarem
4. Observe o comportamento

**O que observar:**
- Timer conta de 90 até 0
- Quando chegar em 0: toast "Tempo esgotado"
- Pop-up fecha automaticamente
- Sistema redireciona para próximo respondedor
- Se logar como outro usuário, deve ver o chamado

### 5. Testar Limite de Respondedores
**Como fazer:**
1. Gere vários chamados redirecionados (clique 3-4 vezes no botão roxo)
2. Rejeite TODOS os chamados que aparecerem
3. Continue rejeitando até não ter mais respondedores

**O que observar:**
- Toast amarelo: "Atenção: Todos os respondedores foram notificados"
- Mensagem sugere contatar SAMU (192)
- Chamado permanece na fila
- Console mostra: "Nenhum respondedor disponível"

---

## 🔍 O que Verificar no Console do Navegador

Abra as DevTools (F12) e veja a aba Console. Você verá logs úteis:

```javascript
🔄 CHAMADO REDIRECIONADO SIMULADO: {
  callId: "call-redirect-1234567890",
  occurrenceId: "sim-redirect-1234567890",
  attemptedRespondersIds: ["resp-1", "resp-2"],  // ⭐ IMPORTANTE!
  attemptedCount: 2,
  currentUser: "resp-3",
  scenario: "Descrição do cenário...",
  howToTest: {
    action1: "Aceite o chamado para testar o fluxo de aceitação",
    action2: "Rejeite o chamado para testar o próximo redirecionamento",
    action3: "Deixe o timer expirar (90s) para testar redirecionamento automático"
  }
}
```

---

## 👥 Usuários Mock Disponíveis

### Socorristas (Prioridade 1)
1. **rafael.lima@unifio.edu.br** - Rafael Santos Lima (ID: resp-1)
2. **fernanda.silva@unifio.edu.br** - Fernanda Rodrigues Silva (ID: resp-2)

### Colaboradores (Prioridade 2)
3. **carlos.mendes@unifio.edu.br** - Dr. Carlos Eduardo Mendes (ID: resp-3)
4. **ana.ferreira@unifio.edu.br** - Ana Paula Ferreira (ID: resp-4)

**Senha para todos:** (usar a senha padrão do sistema)

---

## ✅ Checklist de Teste

### Funcionalidades Básicas
- [ ] Botão roxo aparece para socorristas
- [ ] Botão roxo aparece para colaboradores
- [ ] Botão roxo **não** aparece para alunos
- [ ] Pop-up mostra badge roxa de tentativas
- [ ] Pop-up mostra alerta roxo de redirecionamento
- [ ] Toast mostra quem já recebeu o chamado

### Redirecionamento
- [ ] Rejeição manual redireciona automaticamente
- [ ] Timer expirado redireciona automaticamente
- [ ] Sistema mantém registro em `attemptedRespondersIds`
- [ ] Não envia repetidamente para mesmo respondedor
- [ ] Prioriza socorristas sobre colaboradores
- [ ] Alerta quando todos foram notificados

### Interface
- [ ] Badge roxa aparece no header do pop-up
- [ ] Alerta roxo aparece no corpo do pop-up
- [ ] Toast tem cor e ícone corretos
- [ ] Contador de tentativas está correto
- [ ] Ícone de redirecionamento (RotateCcw) aparece

---

## 🐛 Problemas Comuns

### "Não vejo o botão roxo"
- Verifique se está logado como socorrista ou colaborador
- Botão só aparece no Dashboard
- Alunos não podem ver este botão

### "O chamado não está sendo redirecionado"
- Verifique o console do navegador para erros
- Certifique-se de que há outros respondedores disponíveis
- Tente fazer login com outro usuário para verificar

### "attemptedRespondersIds está vazio"
- Se usar o botão vermelho, é normal (chamado novo)
- Use o botão roxo para simular redirecionamento
- Ou rejeite um chamado para criar redirecionamento real

---

## 📊 Fluxograma do Sistema

```
Chamado Criado
    ↓
Notifica Socorrista 1
    ↓
90 segundos / Rejeição
    ↓
Adiciona ID ao attemptedRespondersIds
    ↓
Procura Próximo Respondedor
    ↓
   ├─→ Socorristas disponíveis? → Notifica próximo socorrista
   ├─→ Não? Colaboradores disponíveis? → Notifica colaborador
   └─→ Nenhum disponível? → Mantém na fila + Alerta
```

---

## 📝 Notas Importantes

1. **attemptedRespondersIds** é o campo-chave que rastreia os redirecionamentos
2. Os chamados redirecionados têm timestamp de ~5 minutos atrás
3. O sistema prioriza socorristas sobre colaboradores
4. Cada redirecionamento adiciona um ID à lista
5. Logs detalhados aparecem no console para debugging

---

**Criado em:** Outubro 2025  
**Sistema:** SOS UNIFIO v1.0  
**Última atualização:** Implementação do botão de teste de redirecionamento
