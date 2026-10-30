import { Button } from '@usefaz/ui/components/ui/button';
import { CameraIcon } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import { graphql, useFragment } from 'react-relay';

import type { OpenUploadAvatarModalButton_student$key } from './__generated__/OpenUploadAvatarModalButton_student.graphql';

// The photo editor (cropper included) is only downloaded when the student goes for the button.
const loadAvatarPhotoDialog = () => import('./AvatarPhotoDialog');
const AvatarPhotoDialog = lazy(loadAvatarPhotoDialog);

type OpenUploadAvatarModalButtonProps = {
  student: OpenUploadAvatarModalButton_student$key;
};

export default function OpenUploadAvatarModalButton({ student }: OpenUploadAvatarModalButtonProps) {
  const data = useFragment<OpenUploadAvatarModalButton_student$key>(
    graphql`
      fragment OpenUploadAvatarModalButton_student on Student {
        ...AvatarPhotoDialog_student
      }
    `,
    student
  );

  const [isOpen, setIsOpen] = useState(false);
  // Stays mounted after the first open, so closing still animates.
  const [hasOpened, setHasOpened] = useState(false);

  return (
    <>
      <Button
        size="icon-lg"
        className="absolute right-0 bottom-0 rounded-full"
        onPointerEnter={loadAvatarPhotoDialog}
        onFocus={loadAvatarPhotoDialog}
        onClick={() => {
          setHasOpened(true);
          setIsOpen(true);
        }}
        aria-label="Alterar foto de perfil"
        aria-haspopup="dialog"
      >
        <CameraIcon />
      </Button>

      {hasOpened && (
        <Suspense>
          <AvatarPhotoDialog student={data} open={isOpen} onOpenChange={setIsOpen} />
        </Suspense>
      )}
    </>
  );
}
