'use client';

import { openDB, type IDBPDatabase } from 'idb';

export interface AcaoPendente {
  id?: number;
  acao: 'iniciar' | 'pausar' | 'retornar' | 'finalizar';
  criadoEm: number;
}

const NOME_DB = 'ritmo-offline';
const NOME_STORE = 'fila-ponto';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (typeof window === 'undefined') {
    throw new Error('IndexedDB só está disponível no cliente.');
  }
  if (!dbPromise) {
    dbPromise = openDB(NOME_DB, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(NOME_STORE)) {
          db.createObjectStore(NOME_STORE, { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  }
  return dbPromise;
}

/** Enfileira uma ação de ponto para ser sincronizada quando a conexão voltar. */
export async function adicionarAcaoPendente(acao: AcaoPendente['acao']) {
  const db = await getDb();
  await db.add(NOME_STORE, { acao, criadoEm: Date.now() });
}

/** Lista as ações pendentes na ordem em que foram criadas (mais antiga primeiro). */
export async function listarAcoesPendentes(): Promise<AcaoPendente[]> {
  const db = await getDb();
  const todas = await db.getAll(NOME_STORE);
  return todas.sort((a, b) => a.criadoEm - b.criadoEm);
}

export async function removerAcaoPendente(id: number) {
  const db = await getDb();
  await db.delete(NOME_STORE, id);
}

export async function contarAcoesPendentes(): Promise<number> {
  const db = await getDb();
  return db.count(NOME_STORE);
}
