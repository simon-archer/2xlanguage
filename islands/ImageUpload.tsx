import { useEffect, useState, useRef } from "preact/hooks";

export default function ImageUpload() {
  const videoRef = useRef(null);
  const [imageDescription, setImageDescription] = useState({ lang1: '', lang2: '', imageUrl: '' });

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        videoRef.current.srcObject = stream;
      });
  }, []);

  const captureImage = async () => {
    const canvas = document.createElement('canvas');
    const scale = 0.4; // scale down by 80%
    canvas.width = videoRef.current.videoWidth * scale;
    canvas.height = videoRef.current.videoHeight * scale;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL();
    const lang1 = "en";
    const lang2 = "es";

    const response = await fetch(`/api/describeImage`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, lang1, lang2 }),
    });
    const data = await response.json();
    setImageDescription(data);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <video ref={videoRef} autoPlay playsInline style={{ marginBottom: '20px' }}></video>
      <button onClick={captureImage} style={{ marginLeft: '10px' }}>Capture Image</button>
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