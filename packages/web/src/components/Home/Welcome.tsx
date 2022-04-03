import { graphql, useFragment } from 'relay-hooks';

import LogoutButton from '../LogoutButton';
import { Welcome_viewer$key } from './__generated__/Welcome_viewer.graphql';

const fragment = graphql`
  fragment Welcome_viewer on User {
    fullname
    email
  }
`;

type WelcomeProps = {
  viewer: Welcome_viewer$key;
};

export default function Welcome({ viewer }: WelcomeProps) {
  const data = useFragment<Welcome_viewer$key>(fragment, viewer);

  return (
    <div>
      <p>
        Hello, {data.fullname}! Your e-mail is {data.email}!
      </p>

      <LogoutButton />
    </div>
  );
}
