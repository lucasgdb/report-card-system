import { DefaultErrorPage } from '@usefaz/components';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <DefaultErrorPage
      title="Ooops!"
      description="Page not found."
      information="The page you are accessing does not exist or is temporarily unavailable. In the meantime, how about accessing one of the options below?"
      actionText="Home page"
      onActionClick={() => navigate('/')}
      disableOptionalButton
    />
  );
}
