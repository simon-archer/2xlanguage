import { useSignal } from "@preact/signals";
import ImageUpload from "../islands/ImageUpload.tsx";

export default function Home() {
  const count = useSignal(3);

  return (
    <div>
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <ImageUpload />
      </div>
    </div>
  );
}