import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";

export default function Home() {
  const count = useSignal(3);

  const handleImageUpload = async (event) => {
    event.preventDefault();
    const file = event.target.elements.file.files[0];
    const imageUrl = URL.createObjectURL(file);

    const response = await fetch(`/api/describeImage?imageUrl=${encodeURIComponent(imageUrl)}&lang1=en&lang2=es`);
    const data = await response.json();

    // TODO: Display the image description in the two languages
  };

  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the Fresh logo: a sliced lemon dripping with juice"
        />
        <h1 class="text-4xl font-bold">Welcome to Fresh</h1>
        <p class="my-4">
          Try updating this message in the
          <code class="mx-2">./routes/index.tsx</code> file, and refresh.
        </p>
        <Counter count={count} />

        <form onSubmit={handleImageUpload}>
          <input type="file" name="file" accept="image/*" />
          <button type="submit">Upload Image</button>
        </form>
      </div>
    </div>
  );
}