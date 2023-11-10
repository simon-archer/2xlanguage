import ImageUpload from "../islands/ImageUpload.tsx";
import LanguageSelector from "../islands/LanguageSelector.tsx";
import { LanguageProvider } from '../islands/LanguageContext.tsx';

export default function Home() {
  return (
    <LanguageProvider>
      <LanguageSelector />
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <ImageUpload />
      </div>
    </LanguageProvider>
  );
}