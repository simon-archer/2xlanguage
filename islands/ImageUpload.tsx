import { useEffect, useState, useRef, useContext } from "preact/hooks";
import { LanguageContext } from './LanguageContext.tsx';


export default function ImageUpload() {
  const videoRef = useRef(null);
  const [imageDescription, setImageDescription] = useState({ lang1: '', lang2: '', imageUrl: '' });
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [facingMode, setFacingMode] = useState(isMobile ? 'environment' : 'user');
  const [isLoading, setIsLoading] = useState(false);

  const { lang1, lang2, setIsLanguageSelectorVisible } = useContext(LanguageContext);

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

    // setLang1("English");
    // setLang2("Norwegian");
    setIsLoading(true);
    const response = await fetch(`/api/describeImage`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: apiImageUrl, lang1, lang2 }),
    });
    const data = await response.json();
    const descriptions = data.lang1.split("\n");
    const lang1Description = descriptions[0].replace("lang1: ", "");
    const lang2Description = descriptions[1].replace("lang2: ", "");
    
    setImageDescription(prevState => ({ ...prevState, imageUrl: displayImageUrl, lang1: lang1Description, lang2: lang2Description }));
    setIsLanguageSelectorVisible(false);
    setIsLoading(false);
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
      {isLoading && (
    <div style={{ 
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)', 
      backgroundColor: 'white', 
      borderRadius: '92px', 
      padding: '32px',
      zIndex: '999',
      alignItems: 'center'
    }}>
    <div className="spinner"></div>
    </div>
    )}
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
      <div style={{
        position: 'absolute',
        bottom: '0',
        width: '100%',
        textAlign: 'center',
        zIndex: 1
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px',
          boxSizing: 'border-box',
          alignItems: 'flex-start'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: 'white', 
            padding: '10px', 
            borderRadius: '32px', 
            visibility: (imageDescription.imageUrl || !isMobile) ? 'hidden' : 'visible'
          }}>
            <button style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} onClick={switchCamera}>
              <i class="material-icons">cameraswitch</i>
            </button>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: 'white', 
            padding: '10px', 
            borderRadius: '32px' 
          }}>
            <button style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} onClick={imageDescription.imageUrl ? resetImage : captureImage}>
              <i class="material-icons">{imageDescription.imageUrl ? 'refresh' : 'camera_alt'}</i>
            </button>
          </div>
        </div>
        { (imageDescription.lang1 || imageDescription.lang2) && (
          <div style={{
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '32px',
            margin: '0px 0px 10px 10px',
            maxWidth: 'calc(100% - 20px)',
            boxSizing: 'border-box'
          }}>
            <p style={{ fontWeight: '' }}>{lang1}: {imageDescription.lang1}</p>
            <p style={{ fontWeight: 'bold' }}>{lang2}: {imageDescription.lang2}</p>
          </div>
        )}
      </div>
    </div>
  );
}