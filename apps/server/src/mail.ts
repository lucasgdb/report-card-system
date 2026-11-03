import { createTransport } from 'nodemailer';

import env from '#/env.ts';
import logger from '#/logger.ts';

// Gmail SMTP with the account's (app) password.
const smtp = createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: { user: env.USEFAZ_EMAIL, pass: env.USEFAZ_EMAIL_PASSWORD },
});

type Mail = { from: string; to: string; subject: string; html: string };

const transporter = {
  async sendMail(mail: Mail) {
    if (env.MAIL_DRIVER === 'log') {
      logger.info({ to: mail.to, subject: mail.subject, html: mail.html }, 'e-mail (not sent: MAIL_DRIVER=log)');
      return;
    }
    await smtp.sendMail(mail);
  },
};

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

const linkEmail = ({
  greeting,
  text,
  url,
  action,
}: {
  greeting: string;
  text: string;
  url: string;
  action: string;
}) => `
  <p>${escapeHtml(greeting)}</p>
  <p>${escapeHtml(text)}</p>
  <p><a href="${escapeHtml(url)}">${escapeHtml(action)}</a></p>
  <p>O link vale por 3 dias e só pode ser usado uma vez. Se você não pediu isso, ignore este e-mail.</p>
`;

/** A link for an admin to choose a new password. */
export function sendAdminPasswordResetEmail(to: string, url: string) {
  return transporter.sendMail({
    from: `"Usefaz" <${env.USEFAZ_EMAIL}>`,
    to,
    subject: 'Redefinição de senha',
    html: linkEmail({
      greeting: 'Olá!',
      text: 'Recebemos um pedido para redefinir a senha da sua conta de administrador.',
      url,
      action: 'Redefinir minha senha',
    }),
  });
}

/** A link for a student to choose a new password, sent once an admin approves the request. */
export function sendStudentPasswordResetEmail(to: string, { firstname, url }: { firstname: string; url: string }) {
  return transporter.sendMail({
    from: `"Usefaz" <${env.USEFAZ_EMAIL}>`,
    to,
    subject: 'Redefinição de senha do boletim',
    html: linkEmail({
      greeting: `Olá, ${firstname}!`,
      text: 'Seu pedido de recuperação de senha foi aprovado. Use o link abaixo para criar uma nova senha.',
      url,
      action: 'Criar nova senha',
    }),
  });
}
