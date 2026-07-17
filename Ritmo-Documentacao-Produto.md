# Ritmo — Sistema de Controle de Jornada de Trabalho

**Documentação de Produto v1.0**
Elaborado como PM Sênior + UX/UI Designer + Arquiteto de Software + Full Stack

---

## Sumário

1. Nome e conceito da marca
2. Identidade visual
3. Wireframes das telas
4. Estrutura de páginas e fluxo do usuário
5. Banco de dados
6. APIs
7. Estrutura de pastas
8. Componentes
9. Regras de negócio
10. Arquitetura
11. Tecnologias e justificativas
12. Roadmap
13. MVP
14. Funcionalidades futuras
15. Melhorias sugeridas (além do que foi pedido)
16. UX detalhada por tela

---

## 1. Nome e Conceito da Marca

### Nome: **Ritmo**

"Ritmo" comunica exatamente o que o produto entrega: cadência, fluxo, regularidade no trabalho — sem soar burocrático como "ponto eletrônico" ou "RH". É curto, fácil de falar, funciona em português e soa bem internacionalmente (rhythm). Domínio sugerido: `ritmo.app` ou `useritmo.com`.

**Tagline:** *"Sua jornada, no seu ritmo."*

**Posicionamento:** Ritmo não é um sistema de ponto para fiscalizar — é uma ferramenta pessoal de acompanhamento de tempo trabalhado, pensada para profissionais que querem clareza sobre banco de horas, produtividade e equilíbrio, começando pequeno (2 pessoas) mas pronta para crescer para escritórios inteiros.

**Personalidade da marca:** calma, precisa, minimalista, confiável — como um Linear ou um Things 3, nunca como um sistema de RH corporativo.

---

## 2. Identidade Visual

### Paleta de cores

**Dark Mode (padrão)**
| Token | Hex | Uso |
|---|---|---|
| `--bg-base` | `#0A0A0B` | Fundo principal |
| `--bg-surface` | `#141416` | Cards, painéis |
| `--bg-surface-hover` | `#1C1C1F` | Hover de cards |
| `--border` | `#242428` | Bordas sutis |
| `--text-primary` | `#F5F5F7` | Texto principal |
| `--text-secondary` | `#9A9AA2` | Texto secundário |
| `--accent` | `#5B8CFF` | Cor primária (ação, links) |
| `--accent-soft` | `#5B8CFF1A` | Fundos suaves de destaque |
| `--success` | `#3DD68C` | Trabalhando / meta batida |
| `--warning` | `#F5B546` | Jornada incompleta / pausa longa |
| `--danger` | `#F0555A` | Ausência / atraso |
| `--info` | `#4EC9F5` | Feriado |

**Light Mode**
| Token | Hex |
|---|---|
| `--bg-base` | `#FAFAFA` |
| `--bg-surface` | `#FFFFFF` |
| `--border` | `#E7E7EA` |
| `--text-primary` | `#111114` |
| `--text-secondary` | `#6E6E76` |
| Demais cores de status seguem os mesmos tons com leve ajuste de saturação para contraste em fundo claro |

A escolha de um azul-violeta (`#5B8CFF`) como accent — em vez do azul genérico de SaaS corporativo — dá personalidade sem cair em clichê. Verde/amarelo/vermelho são usados **só** para status (nunca decorativos), reduzindo poluição visual.

### Tipografia

- **Interface (UI):** `Inter` — leitura excelente em tamanhos pequenos, números tabulares (`font-variant-numeric: tabular-nums`) essenciais para cronômetro e relatórios.
- **Números grandes / cronômetro / dashboard:** `Geist Mono` (ou `JetBrains Mono`) — reforça a sensação "tech/premium" em displays de tempo, como um relógio de verdade.
- **Escala tipográfica:** 12 / 13 / 14 / 16 / 20 / 28 / 40 / 56px, com `line-height` generoso (1.4–1.6) e `letter-spacing` levemente negativo em títulos grandes (estilo Linear/Vercel).

### Princípios visuais
- Muito espaço em branco, cards com `border-radius: 16px`, sombras quase imperceptíveis (`box-shadow` sutil, nunca "material design pesado").
- Micro-animações com Framer Motion: 150–250ms, `ease-out`, nunca bounce exagerado.
- Ícones: `lucide-react` (traço fino, consistente com Linear/Vercel).
- Um único ponto focal de cor por tela — o resto é neutro.

---

## 3. Wireframes das Telas (estrutura textual)

### 3.1 Dashboard (tela principal)

```
┌──────────────────────────────────────────────────────────┐
│  Ritmo            [Busca ⌘K]        🌙  [Lucas ▾]         │
├───────────┬────────────────────────────────────────────┤
│           │   Terça-feira, 14 de julho          14:32:07 │
│  Sidebar  │                                              │
│  • Início │   ┌──────────────────────────────────────┐  │
│  • Hist.  │   │        04:18:52                       │  │
│  • Calend.│   │     tempo trabalhado hoje              │  │
│  • Estat. │   │                                        │  │
│  • Config │   │  [ Pausar ]      [ Finalizar Expediente]│  │
│           │   └──────────────────────────────────────┘  │
│           │                                              │
│           │  ┌────────┐ ┌────────┐ ┌────────┐ ┌───────┐ │
│           │  │Meta hoje│ │H. extra│ │Banco hs│ │Semana │ │
│           │  │ 3h41m  │ │ +0h32m │ │ +6h12m │ │ 32h10m│ │
│           │  │restante│ │        │ │        │ │ /40h  │ │
│           │  └────────┘ └────────┘ └────────┘ └───────┘ │
│           │                                              │
│           │  Linha do tempo de hoje                      │
│           │  ▓▓▓▓▓▓░░▓▓▓▓▓▓▓▓▓░░▓▓▓▓▓▓▓▓▓▓▓▓             │
│           │  08:02        12:00 13:10          18:00     │
└───────────┴────────────────────────────────────────────┘
```

Estado inicial do dia (antes de iniciar expediente): o card central mostra só o relógio e **um único botão grande** "Iniciar Expediente" — reduz a decisão a um clique.

### 3.2 Histórico

```
Histórico                     [Semana ▾] [Mês] [Personalizado] [🔍 buscar]

┌────────────┬────────┬────────┬──────────┬─────────┬────────┬────────────┐
│ Data       │ Entrada│ Saída  │ Trabalhado│ Pausado │ Extra  │ Obs.       │
├────────────┼────────┼────────┼──────────┼─────────┼────────┼────────────┤
│ Seg 13/07  │ 08:02  │ 18:05  │ 08h50m   │ 01h10m  │ +0h50m │ Cliente 9h │
│ Ter 14/07  │ 08:00  │ —      │ 04h18m   │ 00h15m  │ —      │ —          │
└────────────┴────────┴────────┴──────────┴─────────┴────────┴────────────┘
```
Clique na linha expande um painel lateral com detalhes minuto a minuto (entrada, pausas, retorno, saída, observações editáveis).

### 3.3 Calendário

```
        Julho 2026
 Dom Seg Ter Qua Qui Sex Sab
                  1   2   3🟢  4🟢
  5   6🟢 7🟢 8🟢 9🟡 10🟢 11🔵
 12  13🟢 14🟢...
```
Legenda fixa no rodapé: 🟢 completo · 🟡 incompleto · 🔵 feriado · 🔴 ausência. Clique no dia abre modal com o resumo daquele dia (idêntico ao painel do histórico).

### 3.4 Estatísticas

Grid de gráficos (Recharts): barras (horas/dia da semana), linha (evolução do banco de horas no mês), heatmap estilo GitHub (produtividade por dia no ano), cards de recordes (maior/menor jornada).

### 3.5 Configurações

Lista de seções em abas verticais: Perfil · Metas e Jornada · Feriados · Notificações · Aparência (tema/idioma/formato de hora) · Dados (backup/exportar/importar).

---

## 4. Estrutura de Páginas e Fluxo do Usuário

```
/login
/dashboard                → tela principal (protegida)
/historico                → tabela + filtros
/calendario                → visão mensal
/estatisticas              → gráficos
/configuracoes
   /configuracoes/perfil
   /configuracoes/metas
   /configuracoes/feriados
   /configuracoes/notificacoes
   /configuracoes/aparencia
   /configuracoes/dados
/relatorios                → geração de PDF/Excel
```

**Fluxo principal (dia de trabalho):**
1. Usuário abre o PWA → login persistido (Auth.js + JWT) → cai direto no Dashboard.
2. Clica "Iniciar Expediente" → registro criado no banco (`entrada = now()`), cronômetro inicia client-side sincronizado com o timestamp do servidor (evita drift).
3. Ao pausar → registro de pausa criado, cronômetro para, botão vira "Retornar".
4. Ao retornar → pausa fechada (`fim_pausa = now()`), cronômetro retoma.
5. Ao finalizar → `saida = now()`, sistema calcula automaticamente tempo trabalhado, tempo pausado, comparação com meta, e atualiza banco de horas.
6. Notificação inteligente aparece se aplicável ("Você bateu sua meta diária 🎉").

---

## 5. Banco de Dados

Modelagem relacional (PostgreSQL via Supabase + Prisma). Já preparada para multi-tenant (campo `organizacao_id`) mesmo com apenas 2 usuários hoje.

```prisma
model Organizacao {
  id          String   @id @default(cuid())
  nome        String
  criadoEm    DateTime @default(now())
  usuarios    Usuario[]
  feriados    Feriado[]
}

model Usuario {
  id             String   @id @default(cuid())
  organizacaoId  String
  organizacao    Organizacao @relation(fields: [organizacaoId], references: [id])
  nome           String
  email          String   @unique
  senhaHash      String
  papel          Papel    @default(MEMBRO)   // ADMIN | MEMBRO
  tema           String   @default("dark")
  idioma         String   @default("pt-BR")
  formatoHora    String   @default("24h")
  metaDiariaMin  Int      @default(480)      // minutos
  metaSemanalMin Int      @default(2400)
  metaMensalMin  Int?
  criadoEm       DateTime @default(now())

  registros      RegistroPonto[]
  bancoHoras     BancoHoras?

  @@index([organizacaoId])
}

model RegistroPonto {
  id            String   @id @default(cuid())
  usuarioId     String
  usuario       Usuario  @relation(fields: [usuarioId], references: [id])
  data          DateTime @db.Date
  entrada       DateTime?
  saida         DateTime?
  status        StatusDia @default(EM_ANDAMENTO) // COMPLETO | INCOMPLETO | AUSENTE | FERIADO | EM_ANDAMENTO
  minutosTrabalhados Int  @default(0)
  minutosPausados    Int  @default(0)
  minutosExtras      Int  @default(0)
  observacao    String?
  criadoEm      DateTime @default(now())
  atualizadoEm  DateTime @updatedAt

  pausas        Pausa[]

  @@unique([usuarioId, data])
  @@index([usuarioId, data])
}

model Pausa {
  id             String   @id @default(cuid())
  registroId     String
  registro       RegistroPonto @relation(fields: [registroId], references: [id])
  inicio         DateTime
  fim            DateTime?
  motivo         String?

  @@index([registroId])
}

model BancoHoras {
  id             String   @id @default(cuid())
  usuarioId      String   @unique
  usuario        Usuario  @relation(fields: [usuarioId], references: [id])
  saldoMinutos   Int      @default(0)   // pode ser negativo
  atualizadoEm   DateTime @updatedAt
}

model Feriado {
  id             String   @id @default(cuid())
  organizacaoId  String
  organizacao    Organizacao @relation(fields: [organizacaoId], references: [id])
  data           DateTime @db.Date
  nome           String

  @@index([organizacaoId, data])
}

enum Papel { ADMIN MEMBRO }
enum StatusDia { COMPLETO INCOMPLETO AUSENTE FERIADO EM_ANDAMENTO }
```

**Notas de design do schema:**
- `RegistroPonto` é único por `(usuarioId, data)` — um dia, um registro, com N pausas associadas. Isso simplifica o cálculo do calendário (um lookup por dia).
- `BancoHoras` guarda **saldo acumulado**, não o histórico de cálculo (histórico já está implícito na soma de `minutosExtras` de cada `RegistroPonto`). Evita reprocessar tudo a cada consulta.
- Índices compostos em `(usuarioId, data)` cobrem 90% das queries do produto (dashboard, calendário, histórico filtrado por período).
- `organizacaoId` presente desde o dia 1: quando o produto crescer para outros escritórios, não há migração de schema — só passa a haver mais de uma `Organizacao`.

---

## 6. APIs

Todas as rotas abaixo como Route Handlers do Next.js (`app/api/.../route.ts`), autenticadas via sessão Auth.js. Validação de entrada sempre com Zod.

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/ponto/iniciar` | Cria o registro do dia e marca `entrada = now()` |
| `POST` | `/api/ponto/pausar` | Cria uma `Pausa` com `inicio = now()` |
| `POST` | `/api/ponto/retornar` | Fecha a `Pausa` aberta com `fim = now()` |
| `POST` | `/api/ponto/finalizar` | Marca `saida = now()`, dispara cálculo de horas |
| `GET`  | `/api/ponto/hoje` | Retorna o registro do dia corrente + pausas |
| `GET`  | `/api/historico?inicio=&fim=&busca=` | Lista registros no período, com filtro textual em observações |
| `GET`  | `/api/calendario?mes=&ano=` | Retorna status resumido de cada dia do mês |
| `GET`  | `/api/estatisticas?periodo=` | Agregados: médias, recordes, heatmap |
| `GET/PUT` | `/api/configuracoes` | Lê/atualiza metas, feriados, preferências |
| `GET`  | `/api/banco-horas` | Saldo atual e histórico de variação |
| `POST` | `/api/relatorios/pdf` | Gera relatório em PDF (semanal/mensal/anual) |
| `POST` | `/api/relatorios/excel` | Gera planilha Excel equivalente |
| `POST` | `/api/backup/export` | Exporta todos os dados do usuário em JSON |
| `POST` | `/api/backup/import` | Importa dados de um backup JSON |
| `PATCH` | `/api/registro/:id/observacao` | Edita a observação de um registro específico |

Todas as mutações de ponto (`iniciar`, `pausar`, `retornar`, `finalizar`) são **idempotentes por dia**: se o cliente reenviar a requisição (ex: perda de conexão), o servidor verifica o estado atual antes de aplicar a mudança — essencial para o modo offline do PWA.

---

## 7. Estrutura de Pastas

```
ritmo/
├── app/
│   ├── (auth)/login/page.tsx
│   ├── (app)/
│   │   ├── dashboard/page.tsx
│   │   ├── historico/page.tsx
│   │   ├── calendario/page.tsx
│   │   ├── estatisticas/page.tsx
│   │   ├── relatorios/page.tsx
│   │   └── configuracoes/
│   │       ├── perfil/page.tsx
│   │       ├── metas/page.tsx
│   │       ├── feriados/page.tsx
│   │       ├── notificacoes/page.tsx
│   │       ├── aparencia/page.tsx
│   │       └── dados/page.tsx
│   └── api/
│       ├── ponto/{iniciar,pausar,retornar,finalizar,hoje}/route.ts
│       ├── historico/route.ts
│       ├── calendario/route.ts
│       ├── estatisticas/route.ts
│       ├── configuracoes/route.ts
│       ├── banco-horas/route.ts
│       ├── relatorios/{pdf,excel}/route.ts
│       └── backup/{export,import}/route.ts
├── components/
│   ├── ui/                  # shadcn/ui base
│   ├── dashboard/
│   │   ├── RelogioCard.tsx
│   │   ├── CronometroCard.tsx
│   │   ├── IndicadoresGrid.tsx
│   │   └── LinhaDoTempo.tsx
│   ├── historico/TabelaHistorico.tsx
│   ├── calendario/CalendarioMensal.tsx
│   ├── estatisticas/{GraficoBarras,GraficoLinha,Heatmap}.tsx
│   └── shared/{Sidebar,Topbar,BuscaGlobal,ThemeToggle}.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── calculos/
│   │   ├── tempoTrabalhado.ts
│   │   ├── bancoHoras.ts
│   │   └── status.ts
│   ├── validations/          # schemas Zod
│   └── pwa/sync.ts            # fila offline → sync
├── prisma/schema.prisma
├── hooks/
│   ├── useCronometro.ts
│   ├── useRegistroHoje.ts
│   └── useNotificacoes.ts
└── public/
    ├── manifest.json
    └── icons/
```

Separação clara entre **lógica de cálculo** (`lib/calculos`, testável isoladamente, sem dependência de React) e **apresentação** (`components`) — segue o princípio de responsabilidade única (SOLID) e facilita testes automatizados.

---

## 8. Componentes (principais, reutilizáveis)

- `<BotaoJornada estado="parado|trabalhando|pausado" />` — botão único que muda de label/cor/ação conforme o estado (evita múltiplos botões condicionais espalhados pela tela).
- `<Cronometro segundos={...} />` — puramente de apresentação, recebe segundos calculados pelo hook `useCronometro`, que reconcilia com o servidor a cada X segundos para evitar drift.
- `<CardIndicador titulo valor variante="success|warning|danger|neutral" />` — usado nos 4 cards do dashboard e em estatísticas.
- `<CalendarioMensal dias={...} onSelecionarDia={...} />`.
- `<TabelaHistorico colunas registros filtros />` com paginação client-side e busca instantânea (debounce 300ms).
- `<PainelDetalheDia />` — usado tanto no histórico (expandido) quanto no calendário (modal), evitando duplicação de UI para o mesmo conceito.
- `<ToastNotificacao />` — sistema de notificações in-app (usando `sonner` ou shadcn `toast`).

---

## 9. Regras de Negócio

1. **Um registro por dia por usuário.** Se o usuário esquecer de finalizar o expediente e o dia virar, o sistema marca o dia anterior como `INCOMPLETO` e permite edição manual retroativa (com log de auditoria simples: `atualizadoEm`).
2. **Cálculo de horas extras:** `minutosExtras = max(0, minutosTrabalhados - metaDiariaMin)`. Déficit é `min(0, minutosTrabalhados - metaDiariaMin)`.
3. **Banco de horas:** ao finalizar o expediente, `BancoHoras.saldoMinutos += (minutosTrabalhados - metaDiariaMin)`. Pode ficar negativo.
4. **Feriados:** dias marcados como feriado não contam meta e não penalizam banco de horas, mesmo sem registro de ponto.
5. **Pausas:** tempo trabalhado = `(saida - entrada) - soma(pausas)`. Não há limite de pausas por dia.
6. **Status do dia** é derivado automaticamente: `COMPLETO` se `minutosTrabalhados >= metaDiariaMin`; `INCOMPLETO` se houver registro mas abaixo da meta; `AUSENTE` se dia útil sem nenhum registro; `FERIADO` conforme cadastro.
7. **Multiusuário desde o início:** toda query é escopada por `usuarioId` e `organizacaoId` — nunca há risco de um usuário ver dados do outro, mesmo com apenas 2 contas hoje.

---

## 10. Arquitetura

- **Padrão:** Next.js App Router com Server Components para leitura de dados (dashboard, histórico, estatísticas) e Server Actions/Route Handlers para mutações (bater ponto, editar configurações) — reduz JS no cliente e simplifica cache.
- **Camadas:** `app/` (rotas e UI) → `components/` (apresentação pura) → `lib/calculos/` (regras de negócio, sem dependências de framework, 100% testável) → `prisma` (persistência).
- **Autenticação:** Auth.js (NextAuth) com provider de credenciais (email/senha com bcrypt) — suficiente para 2 usuários, com espaço para adicionar OAuth (Google) depois.
- **Offline-first (PWA):** ações de ponto são gravadas primeiro em uma fila local (IndexedDB via `idb`), aplicadas otimisticamente na UI, e sincronizadas com o servidor assim que a conexão volta. Isso é crítico porque bater ponto não pode depender de estar online.
- **Cálculos centralizados:** toda lógica de tempo/banco de horas vive em `lib/calculos`, chamada tanto pelas rotas de API quanto (futuramente) por jobs agendados (ex: fechamento automático de dias esquecidos à meia-noite via Vercel Cron).

---

## 11. Tecnologias e Justificativas

| Tecnologia | Por quê |
|---|---|
| **Next.js 14/15 (App Router)** | Já é a stack dominada por você (LENS, FlowFin); Server Components reduzem JS enviado ao cliente, ótimo para PWA leve. |
| **TypeScript** | Segurança de tipos essencial num sistema que faz cálculos de tempo — erros de tipo em datas/minutos são o bug mais comum desse tipo de app. |
| **Tailwind CSS + shadcn/ui** | Velocidade de desenvolvimento sem sacrificar design custom; shadcn dá componentes acessíveis (Radix) que você customiza livremente, evitando "cara de template". |
| **Framer Motion** | Micro-interações (transição de botão, expandir painel de dia) que dão a sensação "premium" pedida. |
| **Prisma + PostgreSQL (Supabase)** | Já é seu stack no LENS/FlowFin; Prisma facilita migrations e o schema multi-tenant proposto. Supabase dá Postgres gerenciado + Row Level Security nativo, útil quando o produto crescer para outros escritórios. |
| **Auth.js** | Padrão de mercado para Next.js, suporta credenciais hoje e OAuth amanhã sem reescrever nada. |
| **Zod** | Validação de payloads de API e formulários com o mesmo schema (fonte única de verdade). |
| **React Hook Form** | Formulários de configurações performáticos, com validação Zod integrada. |
| **Recharts** | Gráficos de estatísticas (barras, linha, heatmap customizado) com boa integração React. |
| **next-pwa / Serwist** | Camada de service worker para instalar o app e habilitar cache offline. |
| **idb (IndexedDB wrapper)** | Fila de ações offline, para bater ponto sem internet. |
| **Vercel** | Deploy já dominado por você, Edge Functions úteis para o relógio/cron. |

---

## 12. Roadmap

**Fase 1 — Fundação (MVP)**
Login, dashboard com iniciar/pausar/retornar/finalizar, cronômetro em tempo real, cálculo automático de tempo trabalhado/pausado, histórico básico (tabela + filtro por período).

**Fase 2 — Gestão de tempo completa**
Banco de horas, metas configuráveis (diária/semanal/mensal), calendário mensal com indicadores, observações por registro, configurações (feriados, tema, idioma).

**Fase 3 — Inteligência e relatórios**
Estatísticas com gráficos, notificações inteligentes, relatórios PDF/Excel, busca global, exportação/importação de backup.

**Fase 4 — PWA e diferenciais**
Offline-first completo com sincronização, instalação como app (Windows/Android/iPhone), modo foco/Pomodoro, heatmap de produtividade, atalhos de teclado, comparação entre semanas.

**Fase 5 — Preparação para multiempresa (futuro)**
Painel de administração de organização, convite de novos usuários, papéis/permissões (admin vs membro), billing (Stripe) caso vire produto comercial para outros escritórios de contabilidade.

---

## 13. MVP

O MVP ideal é a **Fase 1 completa**: login para 2 usuários, dashboard com os 4 estados do botão de jornada, cronômetro em tempo real, cálculo automático de tempo trabalhado/pausado por dia, e uma tela de histórico simples. Isso já resolve o problema central ("acompanhar o tempo trabalhado diariamente") e pode ser usado em produção por você e sua tia em 1–2 semanas de desenvolvimento, validando o produto antes de investir em banco de horas, relatórios e PWA offline.

---

## 14. Funcionalidades Futuras

- Papéis e permissões (admin do escritório vs colaborador).
- Convite de novos usuários por e-mail (quando expandir para outros escritórios de contabilidade).
- Integração com Google Calendar (bloqueios automáticos de reunião como "ausência justificada").
- App mobile nativo (React Native) reaproveitando a mesma API.
- Billing via Stripe, caso o produto seja comercializado (fits no seu histórico com ReputaçãoAI/FlowFin).
- Assinatura digital de folha de ponto mensal (relevante justamente por vocês serem um escritório de contabilidade).

---

## 15. Melhorias Sugeridas (além do pedido original)

1. **Fila offline com reconciliação por idempotência** (detalhada na arquitetura) — sem isso, um PWA "offline" pode duplicar registros de ponto ao sincronizar, o que é crítico num sistema de horas.
2. **Fechamento automático de dias esquecidos** via cron diário à meia-noite, evitando dias "eternamente em andamento" que quebram os cálculos de banco de horas.
3. **Auditoria simples de edições manuais** (quem editou, quando) — importante num contexto de contabilidade, onde precisão e rastreabilidade importam.
4. **Modo "dois relógios"**: como o sistema já nasce para 2 pessoas, um pequeno indicador no dashboard mostrando se a outra pessoa (tia) está trabalhando agora — sem ser vigilância, apenas contexto de equipe leve, estilo "status" do Slack.
5. **Exportação de relatório mensal já formatado para fins contábeis internos** — dado o contexto do escritório, um relatório "folha de ponto simplificada" em PDF pode ter valor real além do uso pessoal.

---

## 16. UX Detalhada por Tela

### Dashboard
- Um único CTA por estado: parado → "Iniciar Expediente" (verde, grande, centralizado); trabalhando → "Pausar" (âmbar) + "Finalizar" (contorno); pausado → "Retornar" (verde) + "Finalizar" (contorno).
- Cronômetro atualiza a cada segundo via `setInterval`, mas reconcilia com o timestamp do servidor a cada 30s para nunca dessincronizar.
- Cards de indicadores usam animação de contagem (Framer Motion `useSpring`) ao carregar — sensação viva, não estática.
- Linha do tempo do dia: barra horizontal com segmentos coloridos (trabalhado = accent, pausa = cinza), hover mostra o horário exato do segmento.

### Histórico
- Filtro rápido por chips ("Esta semana", "Este mês") + um seletor de período customizado que abre um mini-calendário.
- Busca com debounce, destaca o termo encontrado na coluna de observações.
- Clique na linha expande in-place (accordion), sem navegação — mantém contexto.

### Calendário
- Transição suave entre meses (slide horizontal Framer Motion).
- Dia atual sempre com borda de destaque, mesmo sem status ainda.
- Modal de detalhe do dia reaproveita o mesmo componente do histórico expandido — consistência de UI e menos código.

### Estatísticas
- Heatmap estilo GitHub: 1 quadrado por dia, intensidade de cor proporcional a minutos trabalhados, tooltip com valor exato.
- Comparação entre semanas: duas barras lado a lado com um badge "+12% vs semana passada".

### Configurações
- Navegação por abas verticais fixas na esquerda, conteúdo muda à direita sem reload de página.
- Toggle de tema com animação de "sol/lua" cross-fade (Framer Motion), não apenas troca abrupta de cor.

---

*Documento gerado para orientar o desenvolvimento do Ritmo — pronto para ser usado como prompt-base para Gemini CLI / Antigravity CLI na implementação, seguindo o mesmo fluxo que você já usa no LENS e no FlowFin.*
