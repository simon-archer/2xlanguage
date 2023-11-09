import { useEffect, useState, useRef } from "preact/hooks";

export default function ImageUpload() {
  const videoRef = useRef(null);
  const [imageDescription, setImageDescription] = useState({ lang1: '', lang2: '', imageUrl: '' });
  const [facingMode, setFacingMode] = useState('user');

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      .then(stream => {
        videoRef.current.srcObject = stream;
      });
  }, [facingMode]);

  const switchCamera = () => {
    setFacingMode(prevState => prevState === 'environment' ? 'user' : 'environment');
  };

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
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1 }}>
        <button onClick={switchCamera}>Switch Camera</button>
        <button onClick={captureImage} style={{ marginLeft: '10px' }}>Capture Image</button>
      </div>
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        style={{ 
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          transform: facingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)' 
        }}
      ></video>
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