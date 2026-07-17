'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nomeOrganizacao, setNomeOrganizacao] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      const res = await fetch('/api/auth/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, nomeOrganizacao }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErro(json.erro ?? 'Não foi possível criar sua conta.');
        setCarregando(false);
        return;
      }

      const resultado = await signIn('credentials', { email, senha, redirect: false });
      if (resultado?.error) {
        router.push('/login');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setErro('Algo deu errado. Tente novamente.');
      setCarregando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-base px-4 py-10">
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
          <h1 className="text-xl font-semibold text-primary">Crie sua conta</h1>
          <p className="mt-1 text-sm text-secondary">Gratuito para começar. Leva menos de um minuto.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-card border border-border bg-surface p-6 shadow-sm"
        >
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-secondary">Seu nome</label>
            <input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Lucas Brandão"
              className="w-full rounded-lg border border-border bg-base px-3 py-2.5 text-sm text-primary outline-none transition focus:border-accent"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-secondary">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@exemplo.com"
              className="w-full rounded-lg border border-border bg-base px-3 py-2.5 text-sm text-primary outline-none transition focus:border-accent"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-secondary">Senha</label>
            <input
              type="password"
              required
              minLength={8}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="mínimo 8 caracteres"
              className="w-full rounded-lg border border-border bg-base px-3 py-2.5 text-sm text-primary outline-none transition focus:border-accent"
            />
          </div>

          <div className="mb-5">
            <label className="mb-1.5 block text-xs font-medium text-secondary">
              Nome do escritório/negócio <span className="text-secondary/60">(opcional)</span>
            </label>
            <input
              value={nomeOrganizacao}
              onChange={(e) => setNomeOrganizacao(e.target.value)}
              placeholder="Ex: Escritório Brandão Contabilidade"
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
            {carregando ? 'Criando conta...' : 'Criar conta gratuita'}
          </button>

          <p className="mt-4 text-center text-xs text-secondary">
            Já tem conta?{' '}
            <Link href="/login" className="text-accent hover:underline">
              Entrar
            </Link>
          </p>
        </form>
      </motion.div>
    </main>
  );
}
