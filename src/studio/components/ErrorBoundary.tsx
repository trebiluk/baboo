import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useDebugStore } from '../store/useDebugStore';
import { useProjectStore } from '../store/useProjectStore';
import { t, tipLoc } from '../data/i18n';

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
      // 2.13.66: the crash screen reads in the student's language.
      let loc = tipLoc(null);
      try {
        loc = tipLoc(useProjectStore.getState().doc.settings);
      } catch {
        /* store itself may be what broke; English is fine */
      }
      return (
        <div className="error-screen" role="alert">
          <strong>{t(loc, 'crash.title')}</strong>
          <pre>{this.state.message}</pre>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.7, maxWidth: 480, textAlign: 'center' }}>
            {t(loc, 'crash.body')}
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              className="primary-btn"
              onClick={() => this.setState({ crashed: false, message: '' })}
            >
              {t(loc, 'crash.recover')}
            </button>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => window.location.reload()}
            >
              {t(loc, 'crash.reload')}
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
