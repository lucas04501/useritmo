import { z } from 'zod';

export const cadastroSchema = z.object({
  nome: z.string().min(2, 'Informe seu nome.').max(100),
  email: z.string().email('E-mail inválido.'),
  senha: z.string().min(8, 'A senha precisa ter pelo menos 8 caracteres.'),
  nomeOrganizacao: z.string().max(100).optional(),
});
