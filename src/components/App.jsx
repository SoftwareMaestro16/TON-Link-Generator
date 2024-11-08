import { useState, useEffect } from 'react';
import WebAppSDK from '@twa-dev/sdk';
import { QRCodeSVG } from 'qrcode.react';
import { MainButton } from '../tg/MainButton/MainButton';
import '../styles/App.css';

function App() {
  const [isTg, setIsTg] = useState(false);
  const [activeButton, setActiveButton] = useState('Toncoin');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [text, setText] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [jettonAddress, setJettonAddress] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [decimals, setDecimals] = useState('');

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleJettonAddressChange = (e) => {
    setJettonAddress(e.target.value);
  };

  const handleSenderAddressChange = (e) => {
    setSenderAddress(e.target.value);
  };

  const handleDecimalsChange = (e) => {
    setDecimals(e.target.value);
  };

  const generateQrLink = () => {
    if (activeButton === 'Toncoin' && address && amount) {
      const link = `ton://transfer/${address}?amount=${amount * 10 ** 9}&text=${encodeURIComponent(text)}`;
      setGeneratedLink(link);
    } else if (activeButton === 'Jetton' && senderAddress && jettonAddress && amount && decimals) {
      const link = `ton://transfer/${senderAddress}?jetton=${jettonAddress}&amount=${amount * 10 ** decimals}&fee-amount=60000000&forward-amount=60000000&text=${encodeURIComponent(text)}`;
      setGeneratedLink(link);
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    alert("Link copied to clipboard!");
  };

  const saveQrImage = (format = 'png') => {
    const svg = document.querySelector('svg');
    if (svg) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const img = new Image();
  
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
  
      img.onload = () => {
        const margin = 5;
        canvas.width = img.width + margin * 2; // Add margin
        canvas.height = img.height + margin * 2; // Add margin
        context.fillStyle = 'white'; // Set background color to white
        context.fillRect(0, 0, canvas.width, canvas.height); // Fill the background
        context.drawImage(img, margin, margin); 
  
        canvas.toBlob((blob) => {
          const link = document.createElement('a');
          const fileExtension = format === 'jpg' ? 'jpg' : 'png';
          link.href = URL.createObjectURL(blob);
          link.download = `qr_code.${fileExtension}`;
  
          // Trigger the download
          link.click();
  
          // Display a message that the file has been downloaded
          alert('QR code image has been saved successfully!');
        }, format === 'jpg' ? 'image/jpeg' : 'image/png');
      };
  
      img.src = url;
    }
  };
  

  useEffect(() => {
    const isTgCheck = Boolean(window.Telegram?.WebApp?.initData);
    if (isTgCheck) {
      setIsTg(true);
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.headerColor = "#303030";
      document.body.style.backgroundColor = 'var(--tg-theme-bg-color)';
      document.body.style.setProperty('background-color', '#ffffff', 'important');
    } else {
      console.warn('Приложение не открыто в Telegram');
    }
  }, []);

  return (
    <>
      {!isTg ? (
        <div className="denied-container"></div>
      ) : (
        <div className="tg-container">
          <h1 className='main-text'>Generate QR and TON Link for Payment</h1>
          <div className="container-buttons">
            <button
              onClick={() => handleButtonClick('Toncoin')}
              className={activeButton === 'Toncoin' ? 'active' : ''}
            >
              Toncoin
            </button>
            <button
              onClick={() => handleButtonClick('Jetton')}
              className={activeButton === 'Jetton' ? 'active' : ''}
            >
              Jetton
            </button>
          </div>

          {activeButton === 'Toncoin' && (
            <div className='form-toncoin'>
              <div className='address-container-toncoin'>
                <h2>Receiver Address:</h2>
                <input
                  type="text"
                  value={address}
                  placeholder="UQC3...bqch"
                  onChange={handleAddressChange}
                />
              </div>
              <div className='amount-container-toncoin'>
                <h2>Toncoin Amount:</h2>
                <input
                  type="number"
                  value={amount}
                  placeholder="13.37"
                  onChange={handleAmountChange}
                />
              </div>
              <div className='text-container-toncoin'>
                <h2>Text (Optional):</h2>
                <input
                  type="text"
                  value={text}
                  placeholder="Enter a comment..."
                  onChange={handleTextChange}
                />
              </div>
            </div>
          )}

          {activeButton === 'Jetton' && (
            <div className='form-jetton'>
              <div className='address-container-jetton'>
                <h2>Receiver Address:</h2>
                <input
                  type="text"
                  value={senderAddress}
                  placeholder="UQC3...bqch"
                  onChange={handleSenderAddressChange}
                />
              </div>
              <div className='jetton-address-container'>
                <h2>Jetton Address:</h2>
                <input
                  type="text"
                  value={jettonAddress}
                  placeholder="EQAE...SXwR"
                  onChange={handleJettonAddressChange}
                />
              </div>
              <div className='amount-container-jetton'>
                <h2>Jetton Amount:</h2>
                <input
                  type="number"
                  value={amount}
                  placeholder="13.37"
                  onChange={handleAmountChange}
                />
              </div>
              <div className='decimals-container'>
                <h2>Decimals:</h2>
                <input
                  type="number"
                  value={decimals}
                  placeholder="9"
                  onChange={handleDecimalsChange}
                />
              </div>
              <div className='text-container-jetton'>
                <h2>Text (Optional):</h2>
                <input
                  type="text"
                  value={text}
                  placeholder="Enter a comment..."
                  onChange={handleTextChange}
                />
              </div>
            </div>
          )}

          {generatedLink && (
            <div className="generated-link">
              <QRCodeSVG value={generatedLink} />
              <h2 className='link'>{generatedLink.slice(0, 19)}...</h2>

              <div className="container-buttons-generated">
                <button onClick={saveQrImage} className="button-save">
                  Save QR
                </button>
                <button onClick={copyToClipboard} className="button-copy">
                  Copy Link
                </button>
              </div>
            </div>
          )}

          <MainButton
            text="Generate"
            onClick={generateQrLink}
            color="#303030"
            textColor="#FFFFFF"
            disabled={false}
          />
        </div>
      )}
    </>
  );
}

export default App;
