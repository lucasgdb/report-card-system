import { Button } from '@usefaz/ui/components/ui/button';
import { DownloadIcon } from 'lucide-react';

import { useInstallPrompt } from '~/pwa/installPrompt';

/**
 * Offers installing the app, only when the browser supports it and it isn't installed yet.
 * On small screens only the icon shows; the label stays available to assistive technology.
 */
export default function InstallButton() {
  const { canInstall, install } = useInstallPrompt();

  if (!canInstall) {
    return null;
  }

  return (
    <Button size="sm" onClick={install} className="shrink-0 max-[639px]:size-9 max-[639px]:px-0">
      <DownloadIcon aria-hidden />
      <span className="max-[639px]:sr-only">Instalar app</span>
    </Button>
  );
}
