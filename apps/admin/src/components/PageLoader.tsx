import { PageLoader as BasePageLoader } from '@usefaz/ui/components/page-loader';

/** Page loader below the navbar (56px on mobile, 78px on desktop). */
export default function PageLoader() {
  return <BasePageLoader className="h-[calc(100vh-56px)] min-[1200px]:h-[calc(100vh-78px)]" />;
}
