import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ServiceWorkerRegister } from './service-worker-register';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const geistMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: 'Ritmo — controle de jornada que parece software de verdade',
  description:
    'Cronômetro em tempo real, banco de horas automático, calendário, estatísticas e relatórios em PDF/Excel. Crie sua conta grátis.',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} ${geistMono.variable} font-sans`}>
        <ServiceWorkerRegister />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
