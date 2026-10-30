import { Badge } from '@usefaz/ui/components/ui/badge';
import { WifiOffIcon } from 'lucide-react';

export default function OfflineBadge() {
  return (
    <Badge variant="destructive">
      <WifiOffIcon aria-hidden />
      Offline
    </Badge>
  );
}
