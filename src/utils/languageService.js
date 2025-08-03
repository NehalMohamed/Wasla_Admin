export const supportedLanguages = ["en", "ar", "de"];

export const detectLanguage = () => {
  const savedLang = localStorage.getItem("lang");
  if (savedLang && supportedLanguages.includes(savedLang)) return savedLang;

  const languagesToCheck = [
    ...(navigator.languages || []),
    navigator.language,
    navigator.userLanguage,
    "en", // final fallback
  ];

  for (const lang of languagesToCheck) {
    if (!lang) continue;
    const shortLang = lang.substring(0, 2).toLowerCase();
    if (supportedLanguages.includes(shortLang)) {
      return shortLang;
    }
  }

  return "en";
};

export const saveLanguagePreference = (lang) => {
  if (supportedLanguages.includes(lang)) {
    localStorage.setItem("lang", lang);
  }
};
