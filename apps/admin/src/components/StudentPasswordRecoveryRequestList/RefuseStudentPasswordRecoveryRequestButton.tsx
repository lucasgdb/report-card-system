import { useMutation } from 'relay-hooks';

import RefuseStudentPasswordRecoveryRequestMutation from '~/modules/admin/RefuseStudentPasswordRecoveryRequestMutation';
import { RefuseStudentPasswordRecoveryRequestMutation as RefuseStudentPasswordRecoveryRequestMutationType } from '~/modules/admin/__generated__/RefuseStudentPasswordRecoveryRequestMutation.graphql';
import MenuItem from './MenuItem';

type RefuseStudentPasswordRecoveryRequestButtonProps = {
  studentPasswordRecoveryRequestId: string;
  onClose(): void;
};

export default function RefuseStudentPasswordRecoveryRequestButton({
  studentPasswordRecoveryRequestId,
  onClose,
}: RefuseStudentPasswordRecoveryRequestButtonProps) {
  const [refuseStudentPasswordRecoveryRequest, { loading }] =
    useMutation<RefuseStudentPasswordRecoveryRequestMutationType>(RefuseStudentPasswordRecoveryRequestMutation);

  const handleClick = () => {
    refuseStudentPasswordRecoveryRequest({
      variables: { input: { studentPasswordRecoveryRequestId } },
      onCompleted() {
        onClose();
      },
    });
  };

  return <MenuItem text="Recusar" disabled={loading} onClick={handleClick} />;
}
