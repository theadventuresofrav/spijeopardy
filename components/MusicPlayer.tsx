import React, { useState, useRef, useEffect } from 'react';
import { Music, Upload, Play, Pause, Volume2, X } from 'lucide-react';

interface MusicPlayerProps {
  globalVolume?: number;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ globalVolume = 1.0 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [localVolume, setLocalVolume] = useState(0.2);
  const [trackName, setTrackName] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // --- IndexedDB for Music ---
  const DB_NAME = 'EchoJeopardyMusic';
  const STORE_NAME = 'UserTracks';

  useEffect(() => {
    const initDB = async () => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const getReq = store.get('currentTrack');
        getReq.onsuccess = () => {
          if (getReq.result) {
            const file = getReq.result as File;
            const url = URL.createObjectURL(file);
            if (audioRef.current) {
              audioRef.current.src = url;
              setTrackName(file.name);
              // Don't auto-play on load to be polite, or maybe do? 
              // Let's just load it.
            }
          }
        };
      };
    };
    initDB();
  }, []);

  const saveToDB = (file: File) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onsuccess = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(file, 'currentTrack');
    };
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = localVolume * globalVolume;
    }
  }, [localVolume, globalVolume]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      saveToDB(file);
      const url = URL.createObjectURL(file);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
        setTrackName(file.name);
      }
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 md:p-2.5 rounded-lg transition-all ${isPlaying ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-500 hover:text-white'}`}
        title="Background Music"
      >
        <Music size={14} />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-64 bg-slate-900 border border-white/10 rounded-xl p-4 shadow-2xl z-[100] backdrop-blur-xl animate-in slide-in-from-top-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Background Audio</h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white"><X size={12} /></button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="audio/*" 
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-300 transition-colors flex items-center justify-center gap-2"
              >
                <Upload size={12} />
                Upload Track
              </button>
            </div>

            {trackName ? (
              <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] text-cyan-400 truncate max-w-[120px]" title={trackName}>{trackName}</div>
                  <button onClick={togglePlay} className="text-cyan-400 hover:text-white">
                    {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Volume2 size={10} className="text-slate-500" />
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={localVolume} 
                    onChange={(e) => setLocalVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500"
                  />
                </div>
              </div>
            ) : (
              <p className="text-[9px] text-slate-600 italic text-center">
                Supports MP3, WAV. Upload a file to loop in the background.
              </p>
            )}
            
            <audio ref={audioRef} loop className="hidden" />
          </div>
        </div>
      )}
    </div>
  );
};
