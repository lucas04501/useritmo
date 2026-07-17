import { z } from 'zod';

export const observacaoSchema = z.object({
  observacao: z.string().max(500).optional(),
});

export const pausaSchema = z.object({
  motivo: z.string().max(200).optional(),
});

export const historicoQuerySchema = z.object({
  inicio: z.string().datetime().optional(),
  fim: z.string().datetime().optional(),
  busca: z.string().max(200).optional(),
});
