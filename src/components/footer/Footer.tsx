import { useTranslation } from "react-i18next";


export const Footer = () => {
  const {t} = useTranslation();
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white-800 text-black p-4 text-center dark:bg-gray-900 dark:text-white">
      {t("footer.rights")}
    </footer>
  )
}
