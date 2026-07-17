export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/historico/:path*',
    '/calendario/:path*',
    '/estatisticas/:path*',
    '/relatorios/:path*',
    '/configuracoes/:path*',
  ],
};
