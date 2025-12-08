import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  text-gray-900 px-6">
      <h1
        className="text-[120px] md:text-[180px] font-extrabold tracking-widest drop-shadow-lg 
                     bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-pink-500"
      >
        404
      </h1>

      <div className="w-40 h-1 bg-linear-to-r from-purple-400 to-pink-500 rounded-full animate-pulse mb-6"></div>

      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">
        {t("notfound.title")}
      </h2>

      <p className="text-gray-300 max-w-md text-center mb-8">
        {t("notfound.message")}
      </p>

      <a
        href="/"
        className="px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg 
                   hover:opacity-90 transition-all font-semibold tracking-wide"
      >
        {t("notfound.go_home")}
      </a>

      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-10 right-10 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl"></div>
    </div>
  );
};

export default NotFound;
