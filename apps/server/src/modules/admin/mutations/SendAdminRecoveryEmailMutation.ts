import { errorConfig } from '@usefaz/shared';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';
import { createTransport } from 'nodemailer';
import crypto from 'crypto';
import dayjs from 'dayjs';

import usefazConnector from '~/database/usefazConnector';
import { AdminModel, AdminPasswordRecoveryRequestModel } from '~/entities';

type sendAdminRecoveryEmailProps = {
  email: string;
  clientMutationId?: string;
};

const sendAdminRecoveryEmail = async ({ email: adminEmail, clientMutationId }: sendAdminRecoveryEmailProps) => {
  const adminEntity = AdminModel(usefazConnector);

  const email = adminEmail.trim();

  const admin = await adminEntity.getAdminByEmail(email);
  if (!admin) {
    throw new Error(errorConfig.admin.notFound.code);
  }

  const adminPasswordRecoveryRequestEntity = AdminPasswordRecoveryRequestModel(usefazConnector);

  const token = crypto.randomUUID();
  const expiresAt = dayjs().add(3, 'day').format();

  const newAdminPasswordRecoveryRequest = await adminPasswordRecoveryRequestEntity.createRequest({
    email: email,
    token,
    expires_at: expiresAt,
  });

  const newAdminPasswordRecoveryRequestGlobalId = toGlobalId(
    'admin_password_recovery_request',
    newAdminPasswordRecoveryRequest.id
  );

  const passwordRecoveryURL = `${process.env.ADMIN_WEB_URL}/#/recuperar-senha/${newAdminPasswordRecoveryRequestGlobalId}/${token}`;

  const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.USEFAZ_EMAIL,
      pass: process.env.USEFAZ_EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Recuperação de senha" <${process.env.USEFAZ_EMAIL}>`,
    to: email.trim(),
    subject: 'Recuperação de senha',
    html: `<b>${passwordRecoveryURL}</b>`,
  });

  return { clientMutationId };
};

const SendAdminRecoveryEmailMutation = mutationWithClientMutationId({
  name: 'SendAdminRecoveryEmailMutation',
  inputFields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {},
  mutateAndGetPayload: sendAdminRecoveryEmail,
});

export default SendAdminRecoveryEmailMutation;
