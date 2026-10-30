import * as React from 'react';

import { ErrorPage } from './error-page';

type ErrorBoundaryProps = { children: React.ReactNode; onActionClick: () => void };

type ErrorBoundaryState = { error: Error | null };

/** Shows the error page when anything below it throws while rendering. */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorPage
          title="Ooops!"
          description="Aconteceu um problema."
          information="Esta página está temporariamente indisponível e já estamos trabalhando para resolver. Tente novamente em alguns instantes."
          actionText="Tentar novamente"
          onActionClick={this.props.onActionClick}
          disableOptionalButton
        />
      );
    }

    return this.props.children;
  }
}
