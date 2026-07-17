'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Timer,
  Wallet,
  CalendarDays,
  LineChart,
  FileDown,
  WifiOff,
  ArrowRight,
  Check,
} from 'lucide-react';

const RECURSOS = [
  {
    icone: Timer,
    titulo: 'Cronômetro em tempo real',
    texto:
      'Clique em Iniciar e pronto. O Ritmo cuida da conta: tempo trabalhado, pausas e horas extras calculados automaticamente, ao segundo.',
  },
  {
    icone: Wallet,
    titulo: 'Banco de horas automático',
    texto:
      'Cada minuto acima ou abaixo da meta entra e sai do seu banco de horas sozinho. Sem calculadora, sem planilha, sem "deixa eu ver isso depois".',
  },
  {
    icone: CalendarDays,
    titulo: 'Calendário visual',
    texto:
      'Um olhar mostra o mês inteiro: dias completos, incompletos, feriados e ausências, coloridos para você entender tudo em segundos.',
  },
  {
    icone: LineChart,
    titulo: 'Estatísticas de verdade',
    texto:
      'Gráficos de horas por dia da semana, heatmap de produtividade e comparação entre semanas — não só números, entendimento do seu tempo.',
  },
  {
    icone: FileDown,
    titulo: 'Relatórios em 1 clique',
    texto:
      'Gere PDF ou Excel do período que quiser, prontos para enviar ou arquivar. Sem copiar e colar nada manualmente.',
  },
  {
    icone: WifiOff,
    titulo: 'Funciona até sem internet',
    texto:
      'Bateu o ponto sem sinal? O Ritmo guarda localmente e sincroniza sozinho assim que a conexão voltar. Nenhum registro se perde.',
  },
];

const PASSOS = [
  {
    numero: '01',
    titulo: 'Crie sua conta gratuita',
    texto: 'Leva menos de um minuto. Só nome, e-mail e senha.',
  },
  {
    numero: '02',
    titulo: 'Defina sua meta e comece',
    texto: 'Configure sua meta diária e clique em "Iniciar Expediente".',
  },
  {
    numero: '03',
    titulo: 'Acompanhe tudo sozinho',
    texto: 'Banco de horas, extras, relatórios — tudo calculado automaticamente.',
  },
];

const COMPARACAO = [
  { item: 'Calcula banco de horas sozinho', ritmo: true, planilha: false, rh: true },
  { item: 'Bonito e rápido de usar', ritmo: true, planilha: false, rh: false },
  { item: 'Funciona offline', ritmo: true, planilha: true, rh: false },
  { item: 'Gráficos e estatísticas', ritmo: true, planilha: false, rh: 'às vezes' },
  { item: 'Sem burocracia de RH corporativo', ritmo: true, planilha: true, rh: false },
];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.5, delay, ease: 'easeOut' as const },
  };
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-base">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-base/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft">
              <span className="text-sm font-semibold text-accent">R</span>
            </div>
            <span className="text-sm font-semibold text-primary">Ritmo</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm text-secondary transition hover:text-primary"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Criar conta grátis
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-20 md:pt-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-primary md:text-5xl">
              O controle de jornada que parece software de verdade —{' '}
              <span className="text-accent">não burocracia de RH.</span>
            </h1>
            <p className="mt-5 text-lg text-secondary">
              Ritmo calcula seu tempo trabalhado, banco de horas e horas extras sozinho, enquanto
              você só clica em Iniciar. Sem planilha, sem esquecimento, sem letra miúda.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/cadastro"
                className="flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Criar conta gratuita
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-primary transition hover:bg-surface-hover"
              >
                Já tenho conta
              </Link>
            </div>
            <p className="mt-4 text-xs text-secondary">Grátis para começar. Leva menos de um minuto.</p>
          </motion.div>

          {/* Mockup visual do dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-card border border-border bg-surface p-8 text-center shadow-sm"
          >
            <p className="text-sm text-secondary">14:32:07</p>
            <p className="mt-2 font-mono text-5xl font-medium tracking-tight text-primary">04:18:52</p>
            <p className="mt-1 text-xs text-secondary">tempo trabalhado hoje</p>
            <div className="mt-6 flex justify-center gap-3">
              <span className="rounded-lg bg-warning px-5 py-2.5 text-sm font-medium text-black">Pausar</span>
              <span className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-primary">
                Finalizar
              </span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-border bg-base p-3 text-left">
                <p className="text-[11px] text-secondary">Banco de horas</p>
                <p className="font-mono text-sm text-success">+6h12m</p>
              </div>
              <div className="rounded-lg border border-border bg-base p-3 text-left">
                <p className="text-[11px] text-secondary">Semana</p>
                <p className="font-mono text-sm text-primary">32h10m / 40h</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recursos */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <motion.div {...fadeUp()} className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-2xl font-semibold text-primary md:text-3xl">
            Tudo que um controle de ponto deveria ter — e normalmente não tem
          </h2>
          <p className="mt-3 text-secondary">
            Nada de planilha manual. Nada de sistema travado de 2010. Só o essencial, bem feito.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {RECURSOS.map(({ icone: Icone, titulo, texto }, i) => (
            <motion.div
              key={titulo}
              {...fadeUp(i * 0.05)}
              className="rounded-card border border-border bg-surface p-6"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft">
                <Icone size={18} className="text-accent" />
              </div>
              <h3 className="text-sm font-semibold text-primary">{titulo}</h3>
              <p className="mt-1.5 text-sm text-secondary">{texto}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section className="border-y border-border bg-surface/50 py-16">
        <div className="mx-auto max-w-4xl px-5">
          <motion.h2 {...fadeUp()} className="mb-10 text-center text-2xl font-semibold text-primary md:text-3xl">
            Do zero ao primeiro registro em 3 passos
          </motion.h2>
          <div className="grid gap-8 md:grid-cols-3">
            {PASSOS.map((passo, i) => (
              <motion.div key={passo.numero} {...fadeUp(i * 0.1)} className="text-center md:text-left">
                <span className="font-mono text-3xl font-semibold text-accent">{passo.numero}</span>
                <h3 className="mt-2 text-sm font-semibold text-primary">{passo.titulo}</h3>
                <p className="mt-1.5 text-sm text-secondary">{passo.texto}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparação */}
      <section className="mx-auto max-w-4xl px-5 py-16">
        <motion.div {...fadeUp()} className="mb-10 text-center">
          <h2 className="text-2xl font-semibold text-primary md:text-3xl">Por que não continuar com o que você já usa?</h2>
          <p className="mt-3 text-secondary">Planilha e sistema de RH resolvem parte do problema. O Ritmo resolve tudo.</p>
        </motion.div>

        <motion.div {...fadeUp(0.1)} className="overflow-hidden rounded-card border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-secondary">
                <th className="px-4 py-3 text-left font-medium"> </th>
                <th className="px-4 py-3 font-medium text-accent">Ritmo</th>
                <th className="px-4 py-3 font-medium">Planilha</th>
                <th className="px-4 py-3 font-medium">Ponto de RH</th>
              </tr>
            </thead>
            <tbody>
              {COMPARACAO.map((linha) => (
                <tr key={linha.item} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-primary">{linha.item}</td>
                  <td className="px-4 py-3 text-center">
                    {linha.ritmo === true ? <Check size={16} className="mx-auto text-success" /> : linha.ritmo}
                  </td>
                  <td className="px-4 py-3 text-center text-secondary">
                    {linha.planilha === true ? (
                      <Check size={16} className="mx-auto text-secondary" />
                    ) : linha.planilha === false ? (
                      '—'
                    ) : (
                      linha.planilha
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-secondary">
                    {linha.rh === true ? (
                      <Check size={16} className="mx-auto text-secondary" />
                    ) : linha.rh === false ? (
                      '—'
                    ) : (
                      linha.rh
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-4xl px-5 py-16 text-center">
        <motion.div {...fadeUp()}>
          <h2 className="text-2xl font-semibold text-primary md:text-3xl">
            Comece a acompanhar seu tempo hoje
          </h2>
          <p className="mx-auto mt-3 max-w-md text-secondary">
            Gratuito para começar. Sem cartão de crédito. Leva menos de um minuto para criar sua conta.
          </p>
          <Link
            href="/cadastro"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Criar conta gratuita
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-secondary md:flex-row">
          <span>Ritmo — sua jornada, no seu ritmo.</span>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-primary">
              Entrar
            </Link>
            <Link href="/cadastro" className="hover:text-primary">
              Criar conta
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
