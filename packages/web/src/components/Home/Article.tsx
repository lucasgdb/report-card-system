import { graphql, useFragment } from 'relay-hooks';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { Article_article$key } from './__generated__/Article_article.graphql';

const OuterArticle = styled.div``;

const Title = styled.h1`
  font: normal normal normal 22px/26px Roboto;
  color: #333;
  margin-bottom: 0;
`;

const CreatedAt = styled.p`
  font: normal normal normal 12px/14px Roboto;
  color: #333;

  margin: 8px 0 0;
`;

const Text = styled.p`
  font: normal normal normal 16px/19px Roboto;
  color: #333;
`;

const fragment = graphql`
  fragment Article_article on Article {
    id
    title
    text
    created_at
  }
`;

type ArticleProps = {
  article: Article_article$key;
};

export default function Article({ article }: ArticleProps) {
  const data = useFragment<Article_article$key>(fragment, article);

  return (
    <OuterArticle>
      <Title>{data.title}</Title>
      <CreatedAt>Publication date: {dayjs(data.created_at).format('DD/MM/YYYY')}</CreatedAt>
      <Text>{data.text}</Text>
    </OuterArticle>
  );
}
