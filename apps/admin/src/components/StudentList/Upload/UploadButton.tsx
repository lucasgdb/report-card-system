import { SimpleButton } from '@usefaz/components';
import { useState } from 'react';
import UploadDialog from './UploadDialog';

export default function UploadButton() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleOpenUploadDialog = () => setIsUploadDialogOpen(true);
  const handleCloseUploadDialog = () => setIsUploadDialogOpen(false);

  return (
    <>
      <SimpleButton variant="contained" color="primary" onClick={handleOpenUploadDialog}>
        Upload
      </SimpleButton>

      <UploadDialog open={isUploadDialogOpen} onClose={handleCloseUploadDialog} />
    </>
  );
}
