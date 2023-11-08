import { useEffect } from "preact/hooks";

export default function ImageUpload() {
  const handleImageUpload = async (event) => {
        event.preventDefault();
        const file = event.target.elements.file.files[0];
        const lang1 = "en";
        const lang2 = "es";
        const imageType = file.type.split("/")[1]; // Get the image type (jpeg or png)
      
        const formData = new FormData();
        formData.append("image", file);
        formData.append("lang1", lang1);
        formData.append("lang2", lang2);
      
        const response = await fetch(`/api/describeImage?imageType=${imageType}`, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
      
        // TODO: Display the image description in the two languages
      };
    

  useEffect(() => {
    // Add event listener when component mounts
    const form = document.getElementById('imageUploadForm');
    form.addEventListener('submit', handleImageUpload);

    // Cleanup when component unmounts
    return () => {
      form.removeEventListener('submit', handleImageUpload);
    };
  }, []);

  return (
    <form id="imageUploadForm">
      <input type="file" name="file" accept="image/*" />
      <button type="submit">Upload Image</button>
    </form>
  );
}