import AppRouter from "./AppRouter";
import App from "./App";
import { GlobalProvider } from "./context/global.provider";

export const AppHookContainer = () => {
  return (
    <GlobalProvider>
      <App>
        <AppRouter />
      </App>
    </GlobalProvider>
  );
};
