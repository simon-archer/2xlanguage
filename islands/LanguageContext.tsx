import { createContext } from 'preact';
import { useState } from 'preact/hooks';

type LanguageContextType = {
  lang1: string;
  setLang1: (lang: string) => void;
  lang2: string;
  setLang2: (lang: string) => void;
  isLanguageSelectorVisible: boolean;
  setIsLanguageSelectorVisible: (visible: boolean) => void;
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }) => {
  const [lang1, setLang1] = useState('English');
  const [lang2, setLang2] = useState('Norwegian');
  const [isLanguageSelectorVisible, setIsLanguageSelectorVisible] = useState(true);

  return (
    <LanguageContext.Provider value={{ lang1, setLang1, lang2, setLang2, isLanguageSelectorVisible, setIsLanguageSelectorVisible }}>
      {children}
    </LanguageContext.Provider>
  );
};