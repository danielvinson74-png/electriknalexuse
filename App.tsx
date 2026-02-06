
import React, { useState, useCallback, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CyberInput, CyberButton, CyberFrame, RaffleSticker } from './components/CyberUI';
import { UserData, CyberResponse } from './types';
import { COMPANY_DATA, DEFAULT_AMOUNT } from './constants';
import { getCyberAuditLog } from './services/geminiService';
import { generateRaffleImage } from './services/imageService';
import { saveToGoogleSheet } from './services/googleSheetsService';

const App: React.FC = () => {
  const [step, setStep] = useState<'form' | 'qr'>('form');
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [carImageLoading, setCarImageLoading] = useState(true);
  const [carImageUrl, setCarImageUrl] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    instagram: '',
    phone: '',
  });
  const [cyberLog, setCyberLog] = useState<CyberResponse | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchImage = async () => {
      setCarImageLoading(true);
      const url = await generateRaffleImage();
      if (mounted) {
        setCarImageUrl(url);
        setCarImageLoading(false);
      }
    };
    fetchImage();
    return () => { mounted = false; };
  }, []);

  const generateSberQRString = useCallback(() => {
    const purpose = `Payment: ${userData.name} (${userData.instagram})`;
    const parts = [
      'ST00011',
      `Name=${COMPANY_DATA.name}`,
      `PersonalAcc=${COMPANY_DATA.personalAcc}`,
      `BankName=${COMPANY_DATA.bankName}`,
      `BIC=${COMPANY_DATA.bic}`,
      `CorrespAcc=${COMPANY_DATA.correspAcc}`,
      `Sum=${DEFAULT_AMOUNT}`,
      `Purpose=${purpose}`,
      `Phone=${userData.phone}`
    ];
    return parts.join('|');
  }, [userData]);

  const handleSubmit = async () => {
    if (!userData.name || !userData.phone) {
      alert("ВНИМАНИЕ: Требуется авторизация пользователя.");
      return;
    }
    
    setLoading(true);
    
    try {
      setLoadingStatus('UPLOADING TO GRID...');
      await saveToGoogleSheet(userData);

      setLoadingStatus('QUERYING ORACLE...');
      const response = await getCyberAuditLog(userData);
      setCyberLog(response);
      
      setStep('qr');
    } catch (err) {
      console.error("Process interrupted:", err);
      alert("Критический сбой протокола. Попробуйте снова.");
    } finally {
      setLoading(false);
      setLoadingStatus('');
    }
  };

  const handleReset = () => {
    setStep('form');
    setCyberLog(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,#1a1a1a_0%,#050505_100%)]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00f3ff] rounded-full blur-[150px] animate-pulse opacity-10"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#ff00ff] rounded-full blur-[150px] animate-pulse delay-1000 opacity-10"></div>
      </div>

      <div className="w-full max-w-sm z-10">
        <header className="text-center mb-6">
          <h1 className="orbitron text-2xl font-black text-[#00f3ff] italic tracking-tighter glitch-hover uppercase">
            electriknalexuse <span className="text-[#ff00ff]">v2.5</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 bg-[#00f3ff] rounded-full animate-ping"></span>
            <p className="text-[8px] uppercase tracking-[0.4em] text-[#ff00ff] font-bold">Neural Link: Active</p>
          </div>
        </header>

        {step === 'form' ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
            <RaffleSticker imageUrl={carImageUrl} isLoading={carImageLoading} />
            <CyberFrame title="AUTH_SEQUENCE">
              <CyberInput 
                label="Full Name / Имя" 
                value={userData.name} 
                onChange={(val) => setUserData({...userData, name: val})}
                placeholder="ИВАН ИВАНОВ"
              />
              <CyberInput 
                label="Instagram / Логин" 
                value={userData.instagram} 
                onChange={(val) => setUserData({...userData, instagram: val})}
                placeholder="@username"
              />
              <CyberInput 
                label="Phone / Телефон" 
                value={userData.phone} 
                onChange={(val) => setUserData({...userData, phone: val})}
                placeholder="+7 (000) 000-00-00"
                type="tel"
              />
              
              <div className="mt-4">
                <CyberButton onClick={handleSubmit} disabled={loading}>
                  {loading ? (loadingStatus || 'CONNECTING...') : 'INITIATE UPLINK'}
                </CyberButton>
              </div>
            </CyberFrame>
          </div>
        ) : (
          <div className="animate-in zoom-in-95 duration-300">
            <CyberFrame title="AUTH_SUCCESS">
              <div className="flex flex-col items-center gap-4">
                <div className="text-center bg-black/70 p-3 border-x border-[#00f3ff]/30 w-full">
                  <p className="orbitron text-[#00f3ff] text-[8px] uppercase tracking-[0.3em] mb-1 opacity-70">
                    TARGET: {COMPANY_DATA.name}
                  </p>
                  <p className="orbitron text-white text-md font-black uppercase tracking-tight">
                    PAYMENT_GATEWAY
                  </p>
                  <p className="text-[#ff00ff] text-[10px] mt-0.5 font-mono tracking-widest">{DEFAULT_AMOUNT / 100} RUB</p>
                </div>

                <div className="relative p-3 bg-white rounded-none shadow-[0_0_30px_rgba(0,243,255,0.3)]">
                  <QRCodeSVG 
                    value={generateSberQRString()} 
                    size={160}
                    fgColor="#000000"
                    bgColor="#ffffff"
                    level="H"
                  />
                  <div className="absolute -top-1.5 -left-1.5 bg-[#00f3ff] text-black text-[7px] px-1.5 py-0.5 orbitron font-black">SECURE</div>
                  <div className="absolute -bottom-1.5 -right-1.5 bg-[#ff00ff] text-black text-[7px] px-1.5 py-0.5 orbitron font-black">CORE</div>
                </div>

                <div className="w-full bg-zinc-900/90 p-3 border-l-2 border-[#00f3ff] font-mono">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1 h-1 bg-[#00f3ff] animate-pulse"></div>
                    <span className="text-[#00f3ff] text-[8px] orbitron tracking-[0.2em] uppercase">AUDIT: {cyberLog?.status}</span>
                  </div>
                  <p className="text-zinc-300 text-[10px] leading-tight lowercase italic">
                    &gt; {cyberLog?.log || 'analyzing stream...'}
                  </p>
                </div>

                <CyberButton onClick={handleReset}>
                  EXIT_TERMINAL
                </CyberButton>
              </div>
            </CyberFrame>
          </div>
        )}

        <footer className="mt-8 text-center text-[8px] text-zinc-600 orbitron uppercase tracking-[0.3em]">
          Integrated Intelligence v2.5
        </footer>
      </div>
    </div>
  );
};

export default App;
