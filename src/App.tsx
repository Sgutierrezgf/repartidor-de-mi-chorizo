import type { ReactNode } from "react";


interface Props {
  children: ReactNode;
}
function App({children}: Props) {
  return (
<div className="min-h-screen flex flex-col bg-linear-to-b from-gray-100 to-gray-200  text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-white">
  <main
    className="flex-1 pt-8 pb-20 w-full max-w-6xl mx-auto px-4 py-6sm:px-6 md:px-8 lg:py-10">
    {children}
  </main>
</div>

  );
}

export default App;
