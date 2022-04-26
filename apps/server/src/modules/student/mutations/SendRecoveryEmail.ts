import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { createTransport } from 'nodemailer';

type sendRecoveryEmailProps = {
  RM: string;
  email: string;
  clientMutationId?: string;
};

const sendRecoveryEmail = async ({ RM, email, clientMutationId }: sendRecoveryEmailProps) => {
  const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"Usefaz Escola" <escola.usefaz@usefaz.com.br>',
    to: `${email.trim()}, ${process.env.ADMIN_EMAIL}`,
    subject: 'Recuperação de senha',
    html: `<b>RM: ${RM}</b>`,
  });

  return { clientMutationId };
};

const SendRecoveryEmailMutation = mutationWithClientMutationId({
  name: 'SendRecoveryEmailMutation',
  inputFields: {
    RM: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {},
  mutateAndGetPayload: sendRecoveryEmail,
});

export default SendRecoveryEmailMutation;
