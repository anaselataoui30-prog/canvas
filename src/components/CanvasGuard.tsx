import { Component, type ReactNode } from "react";

interface Props {
  fallback: ReactNode;
  children: ReactNode;
}

interface State {
  failed: boolean;
}

/** WebGL failure must degrade to the poster, never crash the page. */
export class CanvasGuard extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(err: unknown) {
    console.warn("3D canvas unavailable, showing poster:", err);
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}
