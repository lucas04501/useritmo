'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const resultado = await signIn('credentials', {
      email,
      senha,
      redirect: false,
    });

    setCarregando(false);

    if (resultado?.error) {
      setErro('E-mail ou senha incorretos.');
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-base px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-card bg-accent-soft">
            <span className="text-lg font-semibold text-accent">R</span>
          </div>
          <h1 className="text-xl font-semibold text-primary">Ritmo</h1>
          <p className="mt-1 text-sm text-secondary">Sua jornada, no seu ritmo.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-card border border-border bg-surface p-6 shadow-sm"
        >
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-secondary">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@ritmo.app"
              className="w-full rounded-lg border border-border bg-base px-3 py-2.5 text-sm text-primary outline-none transition focus:border-accent"
            />
          </div>

          <div className="mb-5">
            <label className="mb-1.5 block text-xs font-medium text-secondary">Senha</label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-base px-3 py-2.5 text-sm text-primary outline-none transition focus:border-accent"
            />
          </div>

          {erro && (
            <p className="mb-4 rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{erro}</p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="mt-4 text-center text-xs text-secondary">
            Ainda não tem conta?{' '}
            <Link href="/cadastro" className="text-accent hover:underline">
              Criar conta gratuita
            </Link>
          </p>
        </form>

        <p className="mt-4 text-center text-xs text-secondary">
          <Link href="/" className="hover:text-primary hover:underline">
            ← Voltar para o site
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
