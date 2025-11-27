# SOS UNIFIO - Diretrizes do Sistema

## Sistema de Redirecionamento Automático de Chamados

### Visão Geral
O sistema possui um mecanismo inteligente de redirecionamento automático que garante que nenhum chamado de emergência fique sem atendimento.

### Como Funciona

#### 1. Notificação Inicial
- Quando um chamado é criado, o primeiro socorrista disponível recebe uma notificação
- Timer de 90 segundos (1 minuto e 30 segundos) começa a contar
- Pop-up em tela cheia exibe todos os detalhes do chamado

#### 2. Cenários de Redirecionamento

**Cenário A: Rejeição Manual**
- Socorrista clica em "Rejeitar"
- Sistema automaticamente redireciona para próximo respondedor disponível
- Mensagem: "O chamado foi redirecionado automaticamente para outro socorrista ou colaborador disponível"

**Cenário B: Timer Expirado**
- 90 segundos se passam sem resposta
- Pop-up minimiza e começa a piscar (alertando o socorrista)
- Ao chegar em 0 segundos, chamado é automaticamente redirecionado
- Mensagem: "Tempo esgotado - O chamado foi redirecionado para outro socorrista/colaborador"

#### 3. Priorização de Respondedores

O sistema segue esta ordem de prioridade:
1. **Socorristas** - Primeira prioridade (profissionais treinados)
2. **Colaboradores** - Segunda prioridade (equipe de apoio)

#### 4. Controle de Tentativas
- Sistema mantém registro de quem já recebeu o chamado
- Evita enviar repetidamente para mesmo respondedor
- Campo `attemptedRespondersIds` rastreia todas as tentativas

#### 5. Última Instância
Se todos os respondedores disponíveis já foram notificados:
- Chamado permanece ativo na fila
- Alerta exibido: "Todos os respondedores foram notificados"
- Sugestão para contatar SAMU (192) em casos críticos

### Respondedores Disponíveis (Mock)

#### Socorristas
1. Rafael Santos Lima - Ambulatório
2. Fernanda Rodrigues Silva - Ambulatório

#### Colaboradores
3. Dr. Carlos Eduardo Mendes - Enfermagem
4. Ana Paula Ferreira - Ambulatório

### Notificações do Sistema
- Toast verde: Redirecionamento bem-sucedido
- Toast amarelo: Todos respondedores notificados
- Toast azul: Informações gerais

---

## Botões de Teste do Sistema

O sistema possui dois botões de teste visíveis para facilitar o desenvolvimento e demonstração:

### 1. Botão de Teste Vermelho (Chamado Novo)
- **Visível para:** Apenas Socorristas
- **Localização:** Canto inferior direito
- **Função:** Simula um chamado completamente novo chegando ao sistema
- **Ícone:** TestTube com texto "TEST"
- **Comportamento:**
  - Cria uma nova ocorrência aleatória
  - Notifica o socorrista logado
  - Não possui IDs em `attemptedRespondersIds`
  - Útil para testar o fluxo completo de aceitação

### 2. Botão de Teste Roxo (Chamado Redirecionado) 
- **Visível para:** Socorristas e Colaboradores
- **Localização:** Abaixo do botão vermelho (canto inferior direito)
- **Função:** Simula um chamado que já foi rejeitado por outros respondedores
- **Ícone:** RotateCcw (seta circular) com texto "REDIR"
- **Comportamento:**
  - Cria uma ocorrência que já existe há ~5 minutos
  - Possui 1-2 IDs no campo `attemptedRespondersIds`
  - Mostra no toast quais respondedores já receberam
  - Útil para testar o sistema de redirecionamento automático

### Como Usar para Testes

1. **Testar Fluxo Normal:**
   - Login como socorrista
   - Clique no botão vermelho (TEST)
   - Aceite ou rejeite o chamado
   - Observe o comportamento

2. **Testar Redirecionamento:**
   - Login como colaborador ou socorrista
   - Clique no botão roxo (REDIR)
   - Observe que o chamado já tem histórico de tentativas
   - Rejeite para ver o próximo redirecionamento
   - Ou deixe o timer expirar

3. **Testar Limite de Respondedores:**
   - Clique no botão roxo várias vezes
   - Rejeite todos os chamados
   - Observe quando aparecer "Todos respondedores notificados"

### Logs no Console
Os botões de teste geram logs úteis no console do navegador:
```
🔄 CHAMADO REDIRECIONADO SIMULADO: {
  callId: "call-redirect-...",
  occurrenceId: "sim-redirect-...",
  attemptedRespondersIds: ["resp-1", "resp-2"],
  currentUser: "resp-3",
  scenario: "Descrição do cenário"
}
```

<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:


## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->
