<div align="center">

# ⏱️ Ritmo

### O controle de jornada que parece software de verdade — não burocracia de RH.

Cronômetro em tempo real, banco de horas automático, calendário visual, estatísticas e relatórios em PDF/Excel — tudo num app instalável que funciona até sem internet.

<br />

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-149ECA?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![NextAuth](https://img.shields.io/badge/Auth.js-NextAuth-8B5CF6?style=for-the-badge&logo=auth0&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Instalável-3DD68C?style=for-the-badge&logo=pwa&logoColor=white)

</div>

<br />

## 💡 O que é o Ritmo

A maioria dos controles de ponto é feita para o RH, não para quem realmente bate o ponto. São sistemas travados, feios, e cheios de cliques desnecessários — ou, no outro extremo, uma planilha que ninguém atualiza direito.

**Ritmo é diferente.** Você clica em "Iniciar Expediente" e pronto: tempo trabalhado, pausas, horas extras e banco de horas são calculados sozinhos, em tempo real, com uma interface que parece um produto de 2026 — não um sistema legado de repartição pública.

Pensado inicialmente para uso pessoal e pequenos escritórios, mas com arquitetura multi-tenant desde o dia 1: qualquer pessoa pode criar sua própria conta e usar hoje mesmo.

<br />

## ✨ Recursos

| | |
|---|---|
| ⏱️ **Cronômetro em tempo real** | Inicie, pause, retome e finalize seu expediente com um clique. Tudo calculado automaticamente. |
| 💰 **Banco de horas automático** | Cada minuto acima ou abaixo da meta entra e sai do seu saldo sozinho. |
| 📅 **Calendário visual** | O mês inteiro colorido por status — completo, incompleto, feriado, ausência — de relance. |
| 📊 **Estatísticas de verdade** | Gráfico por dia da semana, evolução por semana, heatmap de produtividade estilo GitHub e recordes pessoais. |
| 📄 **Relatórios em 1 clique** | Exportação em PDF e Excel por período semanal, mensal, anual ou personalizado. |
| 📶 **Funciona offline** | Sem internet, as ações ficam guardadas localmente e sincronizam sozinhas quando a conexão voltar. |
| 📱 **PWA instalável** | Instala como app no Windows, Android e iPhone, com ícone e tela cheia próprios. |
| 🔐 **Cadastro próprio** | Qualquer pessoa cria sua conta e já entra usando — sem depender de um administrador. |
| 🌗 **Dark & Light mode** | Interface minimalista inspirada em Linear, Vercel e Notion. |

<br />

## 🧱 Stack técnica

| Camada | Tecnologia | Por quê |
|---|---|---|
| Framework | **Next.js 14** (App Router) | Server Components + rotas de API no mesmo projeto, deploy nativo na Vercel |
| Linguagem | **TypeScript** | Segurança de tipos essencial em cálculos de tempo e banco de horas |
| Estilo | **Tailwind CSS** | Velocidade de desenvolvimento sem abrir mão de um design autoral |
| Animações | **Framer Motion** | Micro-interações que dão a sensação de produto premium |
| ORM | **Prisma** | Migrations tipadas e schema declarativo |
| Banco de dados | **PostgreSQL** (Supabase/Neon) | Relacional, confiável, com Row Level Security disponível para o futuro |
| Autenticação | **Auth.js (NextAuth)** | Padrão de mercado para Next.js, pronto para OAuth no futuro |
| Validação | **Zod** | Mesmo schema validando API e formulários |
| Gráficos | **Recharts** | Gráficos de barras, linha e área integrados ao React |
| Relatórios | **pdfkit** + **exceljs** | Geração de PDF e Excel direto no servidor |
| Offline | **IndexedDB (idb)** + **Service Worker** | Fila de ações offline com sincronização automática |

<br />

## 🚀 Como rodar localmente

```bash
# 1. Clone o repositório
git clone <url-do-seu-repositorio>
cd ritmo

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# edite o .env com sua DATABASE_URL e NEXTAUTH_SECRET

# 4. Crie as tabelas no banco
npm run db:generate
npm run db:push

# 5. Rode em desenvolvimento
npm run dev
```

Acesse `http://localhost:3000` — você verá a landing page. Clique em **Criar conta grátis** para começar a usar.

> 📖 Guia completo de configuração, variáveis de ambiente e deploy: [`SETUP.md`](./SETUP.md)
> 📋 Documentação de produto (marca, wireframes, banco de dados, roadmap): [`Ritmo-Documentacao-Produto.md`](./Ritmo-Documentacao-Produto.md)

<br />

## 📁 Estrutura do projeto

```
ritmo/
├── app/
│   ├── (auth)/          → login e cadastro
│   ├── (app)/            → dashboard, histórico, calendário, estatísticas, relatórios, configurações
│   └── api/              → rotas de API (ponto, calendário, relatórios, auth...)
├── components/           → componentes React organizados por feature
├── lib/
│   ├── calculos/         → regras de negócio (tempo trabalhado, banco de horas)
│   ├── pwa/              → fila offline e sincronização
│   └── validations/      → schemas Zod
├── prisma/               → schema do banco e seed
└── public/               → manifest, ícones e service worker do PWA
```

<br />

## 🗺️ Roadmap

- [x] Autenticação e cadastro aberto
- [x] Dashboard com cronômetro em tempo real
- [x] Banco de horas automático
- [x] Histórico com busca
- [x] Calendário mensal
- [x] Configurações (metas, feriados, senha, aparência)
- [x] Estatísticas com gráficos e heatmap
- [x] Relatórios em PDF/Excel
- [x] PWA com fila offline
- [ ] Verificação de e-mail no cadastro
- [ ] Recuperação de senha ("esqueci minha senha")
- [ ] Convite de pessoas para a mesma organização
- [ ] Internacionalização (i18n)

<br />

