import { SimpleButton } from '@usefaz/components';
import { useState } from 'react';
import { graphql, useFragment } from 'react-relay';

import UploadDialog from './UploadDialog';
import { UploadButton_admin$key } from './__generated__/UploadButton_admin.graphql';

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
      <SimpleButton variant="contained" color="primary" onClick={handleOpenUploadDialog}>
        Upload
      </SimpleButton>

      <UploadDialog open={isUploadDialogOpen} onClose={handleCloseUploadDialog} admin={data} />
    </>
  );
}
