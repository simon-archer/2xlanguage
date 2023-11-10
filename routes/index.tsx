// routes/index.tsx
import ImageUpload from "../islands/ImageUpload.tsx";
import LanguageSelector from "../islands/LanguageSelector.tsx";
import { LanguageProvider, LanguageContext } from '../islands/LanguageContext.tsx';
import { useContext } from 'preact/hooks';

export default function Home() {
  return (
    <LanguageProvider>
      <Content />
    </LanguageProvider>
  );
}

function Content() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("Content must be used within a LanguageProvider");
  }

  const { isLanguageSelectorVisible } = context;

  return (
    <>
      {isLanguageSelectorVisible && <LanguageSelector key={Math.random()} />}
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <ImageUpload />
      </div>
    </>
  );
}