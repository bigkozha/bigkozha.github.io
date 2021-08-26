import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          registry: {
            performers: "Perfomers",
            creationName: "Title",
            musicAuthor: "Music author",
            lyricsAuthor: "Lyrics Author",
          },
          common: {
            search: "Search",
          },
          leftMenu: {
            registry: "Register of works of right holders",
          },
        },
      },
      ru: {
        translation: {
          registry: {
            performers: "Исполнители",
            creationName: "Название произведения",
            musicAuthor: "Автор музыки",
            lyricsAuthor: "Автор текста",
          },
          common: {
            search: "Поиск",
          },
          leftMenu: {
            registry: "Реестр произведений правообладателей",
          },
        },
      },
      kz: {
        translation: {
          registry: {
            performers: "Шығарманы орындаушы",
            creationName: "Жұмыстың атауы",
            musicAuthor: "Музыка авторы",
            lyricsAuthor: "Мәтіннің авторы",
          },
          common: {
            search: "Іздеу",
          },
          leftMenu: {
            registry: "Құқықтардың жұмысын тіркеу",
          },
        },
      },
    },
  });

export default i18n;

export const isEnglish = i18n.language === "en";
