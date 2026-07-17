'use client';

import { useEffect, useState, useCallback } from 'react';
import clsx from 'clsx';
import { Trash2 } from 'lucide-react';

interface Config {
  nome: string;
  email: string;
  metaDiariaMin: number;
  metaSemanalMin: number;
  tema: 'dark' | 'light';
  idioma: string;
  formatoHora: '24h' | '12h';
}

interface Feriado {
  id: string;
  data: string;
  nome: string;
}

const ABAS = ['Perfil', 'Metas', 'Feriados', 'Aparência'] as const;
type Aba = (typeof ABAS)[number];

export function ConfiguracoesForm() {
  const [aba, setAba] = useState<Aba>('Perfil');
  const [config, setConfig] = useState<Config | null>(null);
  const [feriados, setFeriados] = useState<Feriado[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [novoFeriado, setNovoFeriado] = useState({ data: '', nome: '' });

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [statusSenha, setStatusSenha] = useState<{ tipo: 'ok' | 'erro'; texto: string } | null>(null);
  const [trocandoSenha, setTrocandoSenha] = useState(false);

  const carregarConfig = useCallback(async () => {
    const res = await fetch('/api/configuracoes');
    if (res.ok) setConfig(await res.json());
  }, []);

  const carregarFeriados = useCallback(async () => {
    const res = await fetch('/api/feriados');
    if (res.ok) setFeriados(await res.json());
  }, []);

  useEffect(() => {
    carregarConfig();
    carregarFeriados();
  }, [carregarConfig, carregarFeriados]);

  async function salvar(dados: Partial<Config>) {
    setSalvando(true);
    setSalvo(false);
    const res = await fetch('/api/configuracoes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    if (res.ok) {
      setConfig(await res.json());
      setSalvo(true);
      setTimeout(() => setSalvo(false), 2000);
    }
    setSalvando(false);
  }

  async function adicionarFeriado(e: React.FormEvent) {
    e.preventDefault();
    if (!novoFeriado.data || !novoFeriado.nome) return;
    const res = await fetch('/api/feriados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: new Date(novoFeriado.data).toISOString(),
        nome: novoFeriado.nome,
      }),
    });
    if (res.ok) {
      setNovoFeriado({ data: '', nome: '' });
      carregarFeriados();
    }
  }

  async function removerFeriado(id: string) {
    await fetch(`/api/feriados/${id}`, { method: 'DELETE' });
    carregarFeriados();
  }

  async function trocarSenha(e: React.FormEvent) {
    e.preventDefault();
    setStatusSenha(null);
    setTrocandoSenha(true);
    try {
      const res = await fetch('/api/usuario/senha', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatusSenha({ tipo: 'erro', texto: json.erro ?? 'Não foi possível trocar a senha.' });
        return;
      }
      setStatusSenha({ tipo: 'ok', texto: 'Senha atualizada com sucesso.' });
      setSenhaAtual('');
      setNovaSenha('');
    } finally {
      setTrocandoSenha(false);
    }
  }

  if (!config) {
    return <p className="text-sm text-secondary">Carregando...</p>;
  }

  return (
    <div className="mx-auto flex max-w-3xl gap-8">
      <nav className="w-40 shrink-0 space-y-1">
        {ABAS.map((item) => (
          <button
            key={item}
            onClick={() => setAba(item)}
            className={clsx(
              'block w-full rounded-lg px-3 py-2 text-left text-sm transition',
              aba === item
                ? 'bg-accent-soft text-accent'
                : 'text-secondary hover:bg-surface-hover hover:text-primary'
            )}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="flex-1 rounded-card border border-border bg-surface p-6">
        {aba === 'Perfil' && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-primary">Perfil</h2>
            <div>
              <label className="mb-1.5 block text-xs text-secondary">Nome</label>
              <input
                defaultValue={config.nome}
                onBlur={(e) => salvar({ nome: e.target.value })}
                className="w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-primary outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-secondary">E-mail</label>
              <input
                disabled
                value={config.email}
                className="w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-secondary"
              />
            </div>

            <form onSubmit={trocarSenha} className="space-y-3 border-t border-border pt-4">
              <p className="text-xs font-medium text-secondary">Trocar senha</p>
              <div>
                <label className="mb-1.5 block text-xs text-secondary">Senha atual</label>
                <input
                  type="password"
                  required
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  className="w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-primary outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-secondary">Nova senha (mínimo 8 caracteres)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-primary outline-none focus:border-accent"
                />
              </div>
              {statusSenha && (
                <p
                  className={`rounded-lg px-3 py-2 text-xs ${
                    statusSenha.tipo === 'ok' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                  }`}
                >
                  {statusSenha.texto}
                </p>
              )}
              <button
                type="submit"
                disabled={trocandoSenha}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {trocandoSenha ? 'Salvando...' : 'Atualizar senha'}
              </button>
            </form>
          </div>
        )}

        {aba === 'Metas' && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-primary">Metas de jornada</h2>
            <div>
              <label className="mb-1.5 block text-xs text-secondary">Meta diária (minutos)</label>
              <input
                type="number"
                defaultValue={config.metaDiariaMin}
                onBlur={(e) => salvar({ metaDiariaMin: Number(e.target.value) })}
                className="w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-primary outline-none focus:border-accent"
              />
              <p className="mt-1 text-xs text-secondary">Ex: 480 = 8 horas</p>
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-secondary">Meta semanal (minutos)</label>
              <input
                type="number"
                defaultValue={config.metaSemanalMin}
                onBlur={(e) => salvar({ metaSemanalMin: Number(e.target.value) })}
                className="w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-primary outline-none focus:border-accent"
              />
              <p className="mt-1 text-xs text-secondary">Ex: 2400 = 40 horas</p>
            </div>
          </div>
        )}

        {aba === 'Feriados' && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-primary">Feriados</h2>
            <form onSubmit={adicionarFeriado} className="flex gap-2">
              <input
                type="date"
                value={novoFeriado.data}
                onChange={(e) => setNovoFeriado((f) => ({ ...f, data: e.target.value }))}
                className="rounded-lg border border-border bg-base px-3 py-2 text-sm text-primary outline-none focus:border-accent"
              />
              <input
                placeholder="Nome do feriado"
                value={novoFeriado.nome}
                onChange={(e) => setNovoFeriado((f) => ({ ...f, nome: e.target.value }))}
                className="flex-1 rounded-lg border border-border bg-base px-3 py-2 text-sm text-primary outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                Adicionar
              </button>
            </form>

            <ul className="divide-y divide-border">
              {feriados.length === 0 && (
                <li className="py-3 text-sm text-secondary">Nenhum feriado cadastrado.</li>
              )}
              {feriados.map((f) => (
                <li key={f.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-primary">
                    {new Date(f.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    {' — '}
                    {f.nome}
                  </span>
                  <button
                    onClick={() => removerFeriado(f.id)}
                    className="rounded-lg p-1.5 text-secondary transition hover:bg-surface-hover hover:text-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {aba === 'Aparência' && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-primary">Aparência</h2>
            <div>
              <label className="mb-1.5 block text-xs text-secondary">Tema</label>
              <select
                defaultValue={config.tema}
                onChange={(e) => salvar({ tema: e.target.value as 'dark' | 'light' })}
                className="w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-primary outline-none focus:border-accent"
              >
                <option value="dark">Escuro</option>
                <option value="light">Claro</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-secondary">Formato de hora</label>
              <select
                defaultValue={config.formatoHora}
                onChange={(e) => salvar({ formatoHora: e.target.value as '24h' | '12h' })}
                className="w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-primary outline-none focus:border-accent"
              >
                <option value="24h">24 horas</option>
                <option value="12h">12 horas (AM/PM)</option>
              </select>
            </div>
          </div>
        )}

        {(salvando || salvo) && (
          <p className="mt-4 text-xs text-secondary">{salvando ? 'Salvando...' : 'Salvo.'}</p>
        )}
      </div>
    </div>
  );
}
