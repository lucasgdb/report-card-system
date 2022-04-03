import { graphql, useFragment } from 'relay-hooks';
import styled from 'styled-components';
import Article from './Article';

import { Articles_system$key } from './__generated__/Articles_system.graphql';

const OuterArticles = styled.div`
  margin-top: 32px;
`;

const fragment = graphql`
  fragment Articles_system on System {
    articles(first: 5) {
      edges {
        node {
          id
          ...Article_article
        }
      }
    }
  }
`;

type ArticlesProps = {
  system: Articles_system$key;
};

export default function Articles({ system }: ArticlesProps) {
  const data = useFragment<Articles_system$key>(fragment, system);

  return (
    <OuterArticles>
      {data.articles?.edges?.map((article) => (
        <Article key={article!.node!.id} article={article!.node!} />
      ))}
    </OuterArticles>
  );
}
