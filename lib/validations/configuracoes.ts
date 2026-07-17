import { z } from 'zod';

export const configuracoesSchema = z.object({
  nome: z.string().min(1).max(100).optional(),
  metaDiariaMin: z.number().int().min(0).max(1440).optional(),
  metaSemanalMin: z.number().int().min(0).max(10080).optional(),
  tema: z.enum(['dark', 'light']).optional(),
  idioma: z.string().min(2).max(10).optional(),
  formatoHora: z.enum(['24h', '12h']).optional(),
});

export const feriadoSchema = z.object({
  data: z.string().datetime(),
  nome: z.string().min(1).max(100),
});
