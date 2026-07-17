'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, History, Calendar, BarChart3, FileDown, Settings } from 'lucide-react';
import clsx from 'clsx';

const itens = [
  { href: '/dashboard', label: 'Início', icone: LayoutDashboard },
  { href: '/historico', label: 'Histórico', icone: History },
  { href: '/calendario', label: 'Calendário', icone: Calendar },
  { href: '/estatisticas', label: 'Estatísticas', icone: BarChart3 },
  { href: '/relatorios', label: 'Relatórios', icone: FileDown },
  { href: '/configuracoes', label: 'Configurações', icone: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-surface md:flex md:flex-col">
      <div className="px-5 py-5">
        <span className="text-sm font-semibold text-primary">Ritmo</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {itens.map(({ href, label, icone: Icone }) => {
          const ativo = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition',
                ativo
                  ? 'bg-accent-soft text-accent'
                  : 'text-secondary hover:bg-surface-hover hover:text-primary'
              )}
            >
              <Icone size={17} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
