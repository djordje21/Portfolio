import en from './en.json';
import sr from './sr.json';
import ru from './ru.json';

export const languages = {
  sr: { label: 'SR', name: 'Srpski', htmlLang: 'sr-Latn', ogLocale: 'sr_RS' },
  en: { label: 'EN', name: 'English', htmlLang: 'en', ogLocale: 'en_GB' },
  ru: { label: 'RU', name: 'Русский', htmlLang: 'ru', ogLocale: 'ru_RU' },
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';
export const langs = Object.keys(languages) as Lang[];

const dictionaries = { en, sr, ru };
export type Dict = typeof en;

/**
 * Oznaka [CHECK] u tekstovima služi tebi da znaš šta treba proveriti.
 * U dev režimu se vidi na sajtu, a u produkcijskom build-u se automatski uklanja.
 */
function stripCheck<T>(value: T): T {
  if (import.meta.env.DEV) return value;
  return JSON.parse(JSON.stringify(value).replace(/\s*\[CHECK\]/g, ''));
}

export function useTranslations(lang: Lang): Dict {
  return stripCheck(dictionaries[lang] as Dict);
}

/** Putanja ka istoj stranici na drugom jeziku: /en/pre-opening/ -> /sr/pre-opening/ */
export function localizePath(path: string, lang: Lang): string {
  const parts = path.split('/').filter(Boolean);
  if (parts.length && langs.includes(parts[0] as Lang)) parts.shift();
  return `/${[lang, ...parts].join('/')}/`;
}
