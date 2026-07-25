import "./i18n";
import AppRouter from "./AppRouter";
import App from "./App";
import { GlobalProvider } from "./context/global.provider";
import { ThemeProvider } from "./context/ThemeProvider";

export const AppHookContainer = () => {
  return (
    <ThemeProvider>
      <GlobalProvider>
        <App>
          <AppRouter />
        </App>
      </GlobalProvider>
    </ThemeProvider>
  );
};
