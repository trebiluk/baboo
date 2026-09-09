import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useDebugStore } from '../store/useDebugStore';

type Props = { children: ReactNode; label?: string };
type State = { crashed: boolean; message: string };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { crashed: false, message: '' };

  static getDerivedStateFromError(err: Error): State {
    return { crashed: true, message: err.message || 'Unknown error' };
  }

  componentDidCatch(err: Error, info: ErrorInfo): void {
    useDebugStore.getState().setLastError(
      `${err.message}\n${info.componentStack?.slice(0, 400) || ''}`.slice(0, 500),
      this.props.label || 'ErrorBoundary',
    );
  }

  render() {
    if (this.state.crashed) {
      return (
        <div className="error-screen" role="alert">
          <strong>Baboo hit a snag</strong>
          <pre>{this.state.message}</pre>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.7, maxWidth: 480, textAlign: 'center' }}>
            Your plan is still saved here. Try again — or ask a teacher if it keeps happening.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              className="primary-btn"
              onClick={() => this.setState({ crashed: false, message: '' })}
            >
              Try recover
            </button>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
