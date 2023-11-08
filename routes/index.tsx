import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";

export default function Home() {
  const count = useSignal(3);

  const handleImageUpload = async (event) => {
    event.preventDefault();
    const file = event.target.elements.file.files[0];
    const lang1 = "en";
    const lang2 = "es";
  
    const formData = new FormData();
    formData.append("image", file);
    formData.append("lang1", lang1);
    formData.append("lang2", lang2);
  
    const response = await fetch("/api/describeImage", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
  
    // TODO: Display the image description in the two languages
  };

  return (
    <div class="px-4 py-8 mx-auto">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <form onSubmit={handleImageUpload}>
          <input type="file" name="file" accept="image/*" />
          <button type="submit">Upload Image</button>
        </form>
      </div>
    </div>
  );
}