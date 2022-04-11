import * as React from 'react';
import DefaultErrorPage from './DefaultErrorPage/DefaultErrorPage';

type ErrorBoundaryProps = { children: React.ReactNode; onActionClick: () => void };

type StateType = { error: Error | null };

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, StateType> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error: Error) {
    this.setState({ error });
  }

  render() {
    const { error } = this.state;
    const { children, onActionClick } = this.props;

    if (error) {
      return (
        <DefaultErrorPage
          title="Ooops!"
          description="Aconteceu um problema."
          information="A página que você está procurando está temporariamente indisponível. Já estamos atuando para solucionar o mais breve possível, enquanto isso, que tal acessar uma das opções abaixo?"
          actionText="Tentar novamente"
          onActionClick={onActionClick}
          disableOptionalButton
        />
      );
    }

    return children;
  }
}
