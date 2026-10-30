import { Button } from '@usefaz/ui/components/ui/button';
import { UploadIcon } from 'lucide-react';
import { useState } from 'react';
import { graphql, useFragment } from 'react-relay';

import UploadDialog from './UploadDialog';
import type { UploadButton_admin$key } from './__generated__/UploadButton_admin.graphql';

type UploadButtonProps = {
  admin: UploadButton_admin$key;
};

export default function UploadButton({ admin }: UploadButtonProps) {
  const data = useFragment<UploadButton_admin$key>(
    graphql`
      fragment UploadButton_admin on Admin {
        ...UploadDialog_admin
      }
    `,
    admin
  );

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleOpenUploadDialog = () => setIsUploadDialogOpen(true);
  const handleCloseUploadDialog = () => setIsUploadDialogOpen(false);

  return (
    <>
      <Button onClick={handleOpenUploadDialog}>
        <UploadIcon />
        Carregar notas
      </Button>

      <UploadDialog open={isUploadDialogOpen} onClose={handleCloseUploadDialog} admin={data} />
    </>
  );
}
