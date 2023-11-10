import { createContext, h } from 'preact';
import { useState } from 'preact/hooks';

export const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang1, setLang1] = useState('English');
  const [lang2, setLang2] = useState('Norwegian');

  return (
    <LanguageContext.Provider value={{ lang1, setLang1, lang2, setLang2 }}>
      {children}
    </LanguageContext.Provider>
  );
}