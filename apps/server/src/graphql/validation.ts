import { z } from 'zod';

/** Zod schemas shared by the mutations. Messages are shown to the user as they are (pt-BR). */

export const requiredText = (message: string) => z.string().trim().min(1, message);

export const RM = requiredText('Informe o número de matrícula.').max(50, 'O número de matrícula é longo demais.');

export const email = (requiredMessage: string) =>
  requiredText(requiredMessage).pipe(z.email('Digite um e-mail válido, como nome@exemplo.com.'));

/** Passwords being created (sign-in only checks they're filled in). */
export const newPassword = z
  .string()
  .min(8, 'A senha precisa ter pelo menos 8 caracteres.')
  .max(128, 'A senha pode ter no máximo 128 caracteres.');

/** A new password typed twice: the confirmation has to match. */
export const passwordWithConfirmation = z
  .object({
    password: z.string().min(1, 'Informe a nova senha.').pipe(newPassword),
    passwordConfirmation: z.string().min(1, 'Confirme a nova senha.'),
  })
  .refine((input) => input.password === input.passwordConfirmation, {
    message: 'As senhas não são iguais. Digite a mesma senha nos dois campos.',
    path: ['passwordConfirmation'],
  });
