import { handleMutationError } from '@usefaz/shared';
import { toastErrors } from '@usefaz/ui/lib/toast-errors';
import { environment } from '@usefaz/relay';
import { authorizedFetch } from '@usefaz/shared/browser';
import { Button } from '@usefaz/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@usefaz/ui/components/ui/dialog';
import { toast } from '@usefaz/ui/components/ui/sonner';
import { cn } from '@usefaz/ui/lib/utils';
import { ImageUpIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Area } from 'react-easy-crop';
import { commitLocalUpdate, graphql, useFragment, useMutation } from 'react-relay';

import RemoveAvatarMutation from '~/modules/student/RemoveAvatarMutation';
import type { RemoveAvatarMutation as RemoveAvatarMutationType } from '~/modules/student/__generated__/RemoveAvatarMutation.graphql';
import { cropImage } from '~/utils/cropImage';
import type { AvatarPhotoDialog_student$key } from './__generated__/AvatarPhotoDialog_student.graphql';
import AvatarCropper from './AvatarCropper';
import AvatarImage from './AvatarImage';

type Step = 'view' | 'edit' | 'confirm-remove';

const COPY: Record<Step, { title: string; description: string }> = {
  view: {
    title: 'Foto de perfil',
    description: 'Escolha uma imagem do seu dispositivo para usar como foto.',
  },
  edit: {
    title: 'Ajustar foto',
    description: 'Arraste a imagem para posicionar e use o zoom para enquadrar seu rosto.',
  },
  'confirm-remove': {
    title: 'Remover foto atual?',
    description: 'Sua foto será removida e as iniciais do seu nome aparecerão no lugar.',
  },
};

type AvatarPhotoDialogProps = {
  student: AvatarPhotoDialog_student$key;
  open: boolean;
  onOpenChange(open: boolean): void;
};

export default function AvatarPhotoDialog({ student, open, onOpenChange }: AvatarPhotoDialogProps) {
  const data = useFragment<AvatarPhotoDialog_student$key>(
    graphql`
      fragment AvatarPhotoDialog_student on Student {
        id
        avatarURL
        ...AvatarImage_student
      }
    `,
    student
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>('view');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cropArea, setCropArea] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);

  const [removeAvatar, removing] = useMutation<RemoveAvatarMutationType>(RemoveAvatarMutation);

  // Each step swaps the title and the buttons (the clicked one disappears), so focus moves to the new
  // title and screen readers announce where the student is. The first step keeps the dialog's own focus.
  const titleRef = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(step);
  useEffect(() => {
    if (previousStep.current !== step) {
      titleRef.current?.focus();
    }
    previousStep.current = step;
  }, [step]);

  const discardImage = () => {
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
    }
    setImageSrc(null);
    setCropArea(null);
  };

  const close = () => onOpenChange(false);

  const chooseImage = () => inputRef.current?.click();

  const handleImageChosen = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    event.target.value = '';
    if (!file) {
      return;
    }

    discardImage();
    setImageSrc(URL.createObjectURL(file));
    setStep('edit');
  };

  const cancelEdit = () => {
    discardImage();
    setStep('view');
  };

  const saveImage = async () => {
    if (!imageSrc || !cropArea) {
      return;
    }

    setUploading(true);
    try {
      const blob = await cropImage(imageSrc, cropArea);

      const formData = new FormData();
      formData.append('avatar', blob, 'avatar.webp');

      const response = await authorizedFetch(`${process.env.SERVER_BASE_URL}/avatar/upload`, {
        method: 'POST',
        body: formData,
      });
      const { avatarURL } = await response.json();

      commitLocalUpdate(environment, (store) => {
        store.get(data.id)?.setValue(avatarURL, 'avatarURL');
      });

      toast.success('Foto atualizada.');
      close();
    } catch {
      toast.error('Não foi possível salvar a foto. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const confirmRemove = () =>
    removeAvatar({
      variables: { input: {} },
      onCompleted: ({ removeAvatar }) => {
        if (handleMutationError(toastErrors, removeAvatar?.error)) {
          return;
        }
        toast.success('Foto removida.');
        close();
      },
      onError: (error) => handleMutationError(toastErrors, error),
    });

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) {
          discardImage();
          setStep('view');
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle ref={titleRef} tabIndex={-1} className="outline-none">
            {COPY[step].title}
          </DialogTitle>
          <DialogDescription>{COPY[step].description}</DialogDescription>
        </DialogHeader>

        <input ref={inputRef} type="file" accept="image/*" onChange={handleImageChosen} hidden />

        {step === 'edit' && imageSrc ? (
          <AvatarCropper src={imageSrc} onCropComplete={setCropArea} />
        ) : (
          <div className="flex justify-center py-4">
            <div
              className={cn(
                'flex size-48 items-center justify-center overflow-hidden rounded-full ring-4 ring-primary/80 transition-opacity duration-200 motion-reduce:transition-none',
                step === 'confirm-remove' && 'opacity-50 grayscale'
              )}
            >
              <AvatarImage student={data} />
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 'view' && (
            <>
              {data.avatarURL && (
                <Button variant="destructive" onClick={() => setStep('confirm-remove')} className="sm:mr-auto">
                  <Trash2Icon />
                  Remover foto
                </Button>
              )}
              <Button variant="outline" onClick={chooseImage}>
                <ImageUpIcon />
                Escolher foto
              </Button>
            </>
          )}

          {step === 'edit' && (
            <>
              <Button variant="ghost" onClick={chooseImage} disabled={uploading} className="sm:mr-auto">
                <ImageUpIcon />
                Escolher outra
              </Button>
              <Button variant="outline" onClick={cancelEdit} disabled={uploading}>
                Cancelar
              </Button>
              <Button onClick={saveImage} loading={uploading} disabled={!cropArea}>
                Salvar foto
              </Button>
            </>
          )}

          {step === 'confirm-remove' && (
            <>
              <Button variant="outline" onClick={() => setStep('view')} disabled={removing}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmRemove} loading={removing}>
                <Trash2Icon />
                Remover foto
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
