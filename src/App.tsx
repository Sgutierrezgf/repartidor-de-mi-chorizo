import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function App({ children }: Props) {
  return <div className="min-h-screen text-ink">{children}</div>;
}

export default App;
