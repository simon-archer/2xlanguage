import { useContext } from 'preact/hooks';
import { LanguageContext } from './LanguageContext.tsx';

export default function LanguageSelector() {
  const { lang1, setLang1, lang2, setLang2 } = useContext(LanguageContext);


  const languages = ['English', 'Norwegian', 'Spanish', 'French', 'German', 'Chinese', 'Hindi', 'Japanese']; // Add more languages as needed

  return (
    <div style={{ 
      position: 'absolute', 
      top: '2%', 
      left: '50%', 
      transform: 'translateX(-50%)', 
      display: 'flex', 
      justifyContent: 'space-between', 
      backgroundColor: '#fff', 
      borderRadius: '48px', 
      padding: '10px', 
      zIndex: 9999
    }}>
      <div style={{borderWidth: '3px', borderColor: 'black', backgroundColor: 'white', borderRadius: '32px', margin: '5px', padding: '10px'}}>
        <select value={lang1} onChange={(e) => setLang1(e.target.value)}>
          {languages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>
      <div style={{borderWidth: '3px', borderColor: 'black', backgroundColor: 'white', borderRadius: '32px', margin: '5px', padding: '10px'}}>
        <select value={lang2} onChange={(e) => setLang2(e.target.value)}>
          {languages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>
    </div>
  );
}