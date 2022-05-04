import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { createTransport } from 'nodemailer';

type sendStudentRecoveryEmailProps = {
  RM: string;
  email: string;
  clientMutationId?: string;
};

const sendStudentRecoveryEmail = async ({ RM, email, clientMutationId }: sendStudentRecoveryEmailProps) => {
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
    from: `"Usefaz Escola" <${process.env.USEFAZ_EMAIL}>`,
    to: process.env.USEFAZ_EMAIL,
    subject: 'Recuperação de senha',
    html: `<b>RM: ${RM}</b><br /><b>${email.trim()}</b>`,
  });

  return { clientMutationId };
};

const SendStudentRecoveryEmailMutation = mutationWithClientMutationId({
  name: 'SendStudentRecoveryEmailMutation',
  inputFields: {
    RM: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {},
  mutateAndGetPayload: sendStudentRecoveryEmail,
});

export default SendStudentRecoveryEmailMutation;
