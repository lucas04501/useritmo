import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      papel: 'ADMIN' | 'MEMBRO';
      organizacaoId: string;
    } & DefaultSession['user'];
  }
}
