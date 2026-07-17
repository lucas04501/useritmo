'use client';

import { useSession, signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export function Topbar() {
  const { data: session } = useSession();
  const nome = session?.user?.name ?? '';

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-5">
      <div className="text-sm text-secondary">
        {new Date().toLocaleDateString('pt-BR', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
        })}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-primary">{nome}</span>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="rounded-lg p-1.5 text-secondary transition hover:bg-surface-hover hover:text-primary"
          title="Sair"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
