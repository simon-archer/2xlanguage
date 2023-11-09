import { useEffect, useState, useRef } from "preact/hooks";

export default function ImageUpload() {
  const videoRef = useRef(null);
  const [imageDescription, setImageDescription] = useState({ lang1: '', lang2: '', imageUrl: '' });
  const [facingMode, setFacingMode] = useState('user');

  const switchCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setFacingMode(prevState => prevState === 'environment' ? 'user' : 'environment');
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      } 
    })
    .then(stream => {
      if (videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      videoRef.current.srcObject = stream;
    });
  }, [facingMode]);

  const captureImage = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const displayImageUrl = canvas.toDataURL();
    setImageDescription(prevState => ({ ...prevState, imageUrl: displayImageUrl }));

    const apiCanvas = document.createElement('canvas');
    const scale = 0.4;
    apiCanvas.width = videoRef.current.videoWidth * scale;
    apiCanvas.height = videoRef.current.videoHeight * scale;
    apiCanvas.getContext('2d').drawImage(videoRef.current, 0, 0, apiCanvas.width, apiCanvas.height);
    const apiImageUrl = apiCanvas.toDataURL();

    const lang1 = "en";
    const lang2 = "es";

    const response = await fetch(`/api/describeImage`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: apiImageUrl, lang1, lang2 }),
    });
    const data = await response.json();
    setImageDescription({...data, imageUrl: displayImageUrl});
  };

  const resetImage = () => {
    setImageDescription({ lang1: '', lang2: '', imageUrl: '' });
    navigator.mediaDevices.getUserMedia({ video: { facingMode } })
      .then(stream => {
        videoRef.current.srcObject = stream;
      });
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1 }}>
        <button onClick={switchCamera}>Switch Camera</button>
        {!imageDescription.imageUrl ? (
        <button onClick={captureImage} style={{ marginLeft: '10px' }}>Capture Image</button>
      ) : (
        <button onClick={resetImage} style={{ marginLeft: '10px' }}>Take New</button>
      )}
      </div>
      {!imageDescription.imageUrl ? (
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
      ) : (
        <img src={imageDescription.imageUrl} alt="Captured" style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
      {imageDescription.imageUrl && (
        <div style={{ 
          position: 'absolute', 
          bottom: '10px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          zIndex: 1, 
          backgroundColor: 'white', 
          padding: '10px', 
          textAlign: 'center' 
        }}>
          <p style={{ fontWeight: 'bold' }}>{imageDescription.lang1}</p>
          <p style={{ fontWeight: 'bold' }}>{imageDescription.lang2}</p>
        </div>
      )}
    </div>
  );
}