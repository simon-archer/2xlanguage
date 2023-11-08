import { useEffect, useState } from "preact/hooks";

export default function ImageUpload() {
  const [imageDescription, setImageDescription] = useState({ lang1: '', lang2: '', imageUrl: '' });
  const handleImageUpload = async (event) => {
        event.preventDefault();
        const file = event.target.elements.file.files[0];
        const lang1 = "en";
        const lang2 = "es";
      
        const formData = new FormData();
        formData.append("image", file);
        formData.append("lang1", lang1);
        formData.append("lang2", lang2);
      
        const response = await fetch(`/api/describeImage`, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setImageDescription(data);
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <form id="imageUploadForm" style={{ marginBottom: '20px' }}>
        <input type="file" name="file" accept="image/*" />
        <button type="submit" style={{ marginLeft: '10px' }}>Upload Image</button>
      </form>
      {imageDescription.imageUrl && (
        <div style={{ textAlign: 'center' }}>
          <img src={imageDescription.imageUrl} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />
          <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{imageDescription.lang1}</p>
          <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{imageDescription.lang2}</p>
        </div>
      )}
    </div>
  );
}