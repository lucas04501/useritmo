import { z } from 'zod';

export const trocarSenhaSchema = z.object({
  senhaAtual: z.string().min(1, 'Informe a senha atual.'),
  novaSenha: z.string().min(8, 'A nova senha precisa ter pelo menos 8 caracteres.'),
});
