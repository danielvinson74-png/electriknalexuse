
import React from 'react';

interface CyberInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
}

export const CyberInput: React.FC<CyberInputProps> = ({ label, value, onChange, placeholder, type = "text" }) => {
  return (
    <div className="mb-4 group">
      <label className="block text-[10px] orbitron font-bold uppercase tracking-widest text-[#ff00ff] mb-1 group-hover:text-[#00f3ff] transition-colors">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-black border-2 border-[#ff00ff] p-2 text-[#00f3ff] text-sm focus:outline-none focus:border-[#00f3ff] transition-all focus:shadow-[0_0_10px_rgba(0,243,255,0.4)]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)' }}
        />
        <div className="absolute top-0 right-0 w-1 h-full bg-[#ff00ff] group-hover:bg-[#00f3ff]"></div>
      </div>
    </div>
  );
};

interface CyberButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export const CyberButton: React.FC<CyberButtonProps> = ({ onClick, children, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full py-3 orbitron font-black text-lg uppercase tracking-tighter transition-all 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-95'}
        bg-[#00f3ff] text-black border-none shadow-[3px_3px_0px_#ff00ff] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]`}
      style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 70%, 95% 100%, 0 100%, 0 30%)' }}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export const CyberFrame: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className="relative p-6 bg-black/40 border-l-2 border-t-2 border-[#00f3ff] backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-8 h-2 bg-[#ff00ff]"></div>
      <div className="absolute bottom-0 left-0 w-16 h-0.5 bg-[#00f3ff]"></div>
      {title && (
        <h2 className="orbitron text-lg font-bold mb-4 text-[#00f3ff] flex items-center gap-3">
          <span className="w-6 h-[1px] bg-[#ff00ff]"></span>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

interface RaffleStickerProps {
  imageUrl: string | null;
  isLoading: boolean;
}

export const RaffleSticker: React.FC<RaffleStickerProps> = ({ imageUrl, isLoading }) => {
  return (
    <div className="relative mb-6 group animate-bounce-subtle">
      <div className="absolute inset-0 bg-[#ff00ff] blur-xl opacity-5 group-hover:opacity-20 transition-opacity"></div>
      
      <div className="relative bg-black border border-[#ff00ff]/30 overflow-hidden" 
           style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)' }}>
        
        <div className="relative h-32 w-full bg-zinc-900 overflow-hidden">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-[#00f3ff] border-t-transparent rounded-full animate-spin"></div>
              <span className="orbitron text-[8px] text-[#00f3ff] animate-pulse">SYNCING ASSET...</span>
            </div>
          ) : imageUrl ? (
            <>
              <img src={imageUrl} alt="Raffle Mercedes" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
              <div className="absolute top-2 left-2 bg-[#ff00ff] text-black text-[8px] font-black px-1.5 py-0.5 orbitron uppercase">
                NODE_ID: W205_WHITE
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
               <span className="orbitron text-[8px] text-red-500">ASSET_NOT_FOUND</span>
            </div>
          )}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
        </div>

        <div className="p-3 bg-zinc-900/80 border-t border-[#ff00ff]/50">
          <div className="flex justify-between items-center">
            <div>
              <div className="orbitron text-[7px] text-[#00f3ff] tracking-[0.2em] uppercase mb-0.5">PRIZE_PROTOCOL</div>
              <h3 className="orbitron text-sm text-white font-black italic tracking-tighter uppercase leading-none">
                White <span className="text-[#ff00ff]">C-Class</span>
              </h3>
            </div>
            <div className="text-right">
              <div className="orbitron text-[7px] text-gray-500">REF_YEAR</div>
              <div className="orbitron text-[9px] text-[#00f3ff] font-bold">2014</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#ff00ff] flex items-center justify-center" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}>
           <span className="text-black text-[8px] font-black mt-1 ml-1">!</span>
        </div>
      </div>
    </div>
  );
};
