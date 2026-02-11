import React from 'react';
import { UserSettings } from '../types';
import { X, Volume2, VolumeX, Speaker, Music, Mic, Settings, Key, Eye, EyeOff, Activity } from 'lucide-react';

interface SettingsModalProps {
  settings: UserSettings;
  onUpdate: (newSettings: UserSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onUpdate, onClose }) => {
  const [showKey, setShowKey] = React.useState(false);

  const handleVolumeChange = (type: keyof UserSettings['volumes'], value: number) => {
    onUpdate({
      ...settings,
      volumes: {
        ...settings.volumes,
        [type]: value
      }
    });
  };

  const toggleMute = () => {
    onUpdate({
      ...settings,
      muted: !settings.muted
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg tech-border-container p-0.5 rounded-3xl animate-in zoom-in-95 duration-200">
        <div className="tech-corner tl accent-cyan"></div>
        <div className="tech-corner tr accent-cyan"></div>
        <div className="tech-corner bl accent-cyan"></div>
        <div className="tech-corner br accent-cyan"></div>

        <div className="bg-slate-900/90 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(8,145,178,0.2)]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="flex items-center space-x-3 relative z-10">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <Settings className="text-cyan-400" size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] font-cinzel">System Config</h2>
              <div className="h-0.5 w-full bg-cyan-500/50 mt-1"></div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors relative z-10">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-10">
          
          {/* Master Toggle */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl transition-colors ${settings.muted ? 'bg-red-500/10 text-red-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                {settings.muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </div>
              <div>
                <div className="text-sm font-bold text-white uppercase tracking-wider">Audio Protocol</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mt-1">
                  Status: {settings.muted ? 'OFFLINE' : 'ONLINE'}
                </div>
              </div>
            </div>
            <button 
              onClick={toggleMute}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                settings.muted 
                  ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20' 
                  : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20'
              }`}
            >
              {settings.muted ? 'Enable' : 'Disable'}
            </button>
          </div>

          {/* Sliders */}
          <div className={`space-y-8 transition-all duration-300 ${settings.muted ? 'opacity-50 pointer-events-none blur-sm' : 'opacity-100'}`}>
            
            {/* Master Volume */}
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] text-slate-400 uppercase font-black tracking-widest">
                <span className="flex items-center gap-2 text-white"><Volume2 size={14} className="text-cyan-400" /> Master Output</span>
                <span className="font-mono text-cyan-400">{Math.round(settings.volumes.master * 100)}%</span>
              </div>
              <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                 <div className="absolute inset-y-0 left-0 bg-cyan-500 rounded-full" style={{ width: `${settings.volumes.master * 100}%` }}></div>
                 <input 
                    type="range" min="0" max="1" step="0.05"
                    value={settings.volumes.master}
                    onChange={(e) => handleVolumeChange('master', parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                 />
              </div>
            </div>

            {/* Sub Channels */}
            <div className="space-y-6 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between group">
                <div className="flex items-center space-x-3 text-slate-400 group-hover:text-white transition-colors">
                  <Speaker size={16} />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Effects</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.1"
                  value={settings.volumes.sfx}
                  onChange={(e) => handleVolumeChange('sfx', parseFloat(e.target.value))}
                  className="w-32 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center space-x-3 text-slate-400 group-hover:text-white transition-colors">
                  <Mic size={16} />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Voice Synthesis</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.1"
                  value={settings.volumes.voice}
                  onChange={(e) => handleVolumeChange('voice', parseFloat(e.target.value))}
                  className="w-32 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center space-x-3 text-slate-400 group-hover:text-white transition-colors">
                  <Music size={16} />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Music</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.1"
                  value={settings.volumes.music}
                  onChange={(e) => handleVolumeChange('music', parseFloat(e.target.value))}
                  className="w-32 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center space-x-3 text-slate-400 group-hover:text-white transition-colors">
                  <Activity size={16} />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Ambience</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.1"
                  value={settings.volumes.ambience ?? 0.5} 
                  onChange={(e) => handleVolumeChange('ambience', parseFloat(e.target.value))}
                  className="w-32 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>
            </div>
          </div>

          {/* API Configuration */}
          <div className="pt-8 border-t border-white/10 space-y-6">
             <div className="flex items-center space-x-3 text-cyan-400">
                <div className="p-1.5 bg-cyan-500/10 rounded border border-cyan-500/20">
                    <Key size={14} />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Core Access</h3>
             </div>
             
             <div className="space-y-3">
                <label className="text-[9px] text-slate-400 uppercase font-bold tracking-wider flex justify-between">
                    <span>Gemini API Key</span>
                    <span className="text-cyan-500">Required for Infinite Mode</span>
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl opacity-20 group-focus-within:opacity-50 transition-opacity blur"></div>
                  <input 
                    type={showKey ? "text" : "password"}
                    value={settings.geminiApiKey || ''}
                    onChange={(e) => onUpdate({ ...settings, geminiApiKey: e.target.value })}
                    placeholder="ENTER API KEY..."
                    className="relative w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-xs text-white outline-none focus:border-cyan-500/50 font-mono tracking-wider placeholder:text-slate-700"
                  />
                  <button 
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors z-10"
                  >
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-[9px] text-slate-500 font-mono leading-relaxed">
                  Keys are stored locally in your browser's encrypted storage. We do not transmit keys to external servers.
                </p>
             </div>
          </div>

          <div className="pt-4 border-t border-white/5 text-center">
             <a href="mailto:info@spiphysic.com" className="text-[9px] text-slate-600 hover:text-cyan-500 uppercase tracking-widest font-mono transition-colors">
                Report System Failure / Support
             </a>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-950/50 border-t border-white/5 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-white text-slate-950 font-black uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-cyan-400 transition-all shadow-lg hover:shadow-cyan-500/20 active:scale-95"
          >
            Confirm Configuration
          </button>
        </div>

        </div>
      </div>
    </div>
  );
};
