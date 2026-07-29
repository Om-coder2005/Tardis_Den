import React, { useState } from 'react';
import { useSettingsStore, type ThemeMode, type AccentColor } from '../store/useSettingsStore';
import { useEnvironmentStore, type TimeOfDay, type Weather } from '../../room/store/useEnvironmentStore';
import { Palette, Home, Image, Volume2, Eye, Zap, Database, Check } from 'lucide-react';

const WALLPAPERS = [
  { id: '1', name: 'Observatory', url: '/wallpapers/javier-miranda-AlJ9TQqeCV0-unsplash.jpg' },
  { id: '2', name: 'Library', url: '/wallpapers/boston-public-library-s9LUPztrlig-unsplash.jpg' },
  { id: '3', name: 'Space', url: '/wallpapers/asi-mong-2MaZTXk49zQ-unsplash.jpg' },
  { id: '4', name: 'Milky Way', url: '/wallpapers/lukasz-lada-LtWFFVi1RXQ-unsplash.jpg' },
  { id: '5', name: 'Classic Library', url: '/wallpapers/the-new-york-public-library-OOarepLo6io-unsplash.jpg' },
  { id: '6', name: 'Astrology', url: '/wallpapers/chun-wang-Lc-1mbcslEg-unsplash.jpg' },
  { id: '7', name: 'Starry Night Campsite', url: '/wallpapers/Starry Night Campsite.png' },
  { id: '8', name: 'Rainy Night', url: '/wallpapers/rain.png' },
  { id: '9', name: 'Cat Night', url: '/wallpapers/cat night.png' },
  { id: '10', name: 'Mt Fuji Beach', url: '/wallpapers/Die 3 besten Foto Spots vom Mount Fuji — The Beach Office.png' },
  { id: '11', name: 'Artist Yuuun', url: '/wallpapers/Artist _ yun_yuuun [ instagram ].png' },
  { id: '12', name: 'Totoro Night', url: '/wallpapers/totoro_3.png' },
  { id: '13', name: 'Park Evening', url: '/wallpapers/#オリジナル 湿った公園の香り - ゲン助のイラスト - pixiv.jpg' },
  { id: '14', name: 'Happy Friday', url: '/wallpapers/Happy Friday_.png' },
  { id: '15', name: 'ArtStation Explore', url: '/wallpapers/ArtStation - Explore.jpg' },
  { id: '16', name: 'Cute Night Sky', url: '/wallpapers/hình nền cute cho mấy ní nè.png' },
  { id: '17', name: 'Anime Desk Night', url: '/wallpapers/download (21).png' },
  { id: '18', name: 'Lofi Room Window', url: '/wallpapers/download (23).png' },
];

export const SettingsApp: React.FC = () => {
  const { 
    theme, setTheme, 
    accentColor, setAccentColor,
    currentWallpaper, setWallpaper,
    masterVolume, ambientVolume, uiVolume, isMuted,
    setMasterVolume, setAmbientVolume, setUiVolume, toggleMute,
    reducedMotion, highContrast, largeFonts,
    toggleReducedMotion, toggleHighContrast, toggleLargeFonts,
    performanceMode, setPerformanceMode,
    resetToDefaults 
  } = useSettingsStore();

  const { timeOfDay, weather, autoMode, setTimeOfDay, setWeather, setAutoMode } = useEnvironmentStore();

  const [activeTab, setActiveTab] = useState('Appearance');
  const [resetSuccess, setResetSuccess] = useState(false);

  const tabs: { id: string; label: string; icon: React.ReactNode }[] = [
    { id: 'Appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'Room', label: 'Room & Climate', icon: <Home className="w-4 h-4" /> },
    { id: 'Wallpaper', label: 'Wallpaper', icon: <Image className="w-4 h-4" /> },
    { id: 'Audio', label: 'Audio & Sound', icon: <Volume2 className="w-4 h-4" /> },
    { id: 'Accessibility', label: 'Accessibility', icon: <Eye className="w-4 h-4" /> },
    { id: 'Performance', label: 'Performance', icon: <Zap className="w-4 h-4" /> },
    { id: 'Data', label: 'Data & System', icon: <Database className="w-4 h-4" /> },
  ];

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      resetToDefaults();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="flex h-full bg-[#fbe4d8] text-[#190019] font-['Space_Mono',monospace]">
      {/* Sidebar */}
      <div className="w-1/3 max-w-[210px] border-r border-[#854f6c] p-4 bg-[#2b124c] text-[#fbe4d8] flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#854f6c]/50">
            <div className="w-7 h-7 rounded-lg bg-[#dfb6b2] text-[#190019] flex items-center justify-center font-bold text-xs shadow-[2px_2px_0px_#190019]">
              ⚙
            </div>
            <h2 className="text-base font-bold tracking-tight text-[#fbe4d8]">Settings</h2>
          </div>
          
          <nav className="space-y-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 ${
                  activeTab === tab.id
                    ? 'bg-[#dfb6b2] text-[#190019] shadow-[2px_2px_0px_#190019]'
                    : 'text-[#fbe4d8]/80 hover:bg-[#522b5b] hover:text-[#fbe4d8]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-[#854f6c]/40 text-[10px] uppercase tracking-widest text-[#dfb6b2]/60">
          TARDIS Den OS v1.2.0
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#fbe4d8] custom-scrollbar">
        <h1 className="text-xl font-bold mb-6 uppercase tracking-wider text-[#2b124c] border-b-2 border-[#854f6c] pb-3 flex items-center gap-2">
          {tabs.find((t) => t.id === activeTab)?.icon}
          <span>{activeTab}</span>
        </h1>

        {/* APPEARANCE TAB */}
        {activeTab === 'Appearance' && (
          <div className="space-y-8 max-w-xl">
            <section className="bg-white border-2 border-[#190019] p-5 shadow-[4px_4px_0px_#190019]">
              <h3 className="font-bold mb-2 uppercase text-xs tracking-widest text-[#854f6c]">Theme Mode</h3>
              <p className="text-xs text-[#190019]/70 mb-4">Choose light, dark, or system color themes for the TARDIS workspace.</p>
              <div className="grid grid-cols-3 gap-3">
                {(['day', 'night', 'system'] as ThemeMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setTheme(mode)}
                    className={`py-2.5 px-3 border-2 border-[#190019] font-bold text-xs capitalize transition-all ${
                      theme === mode
                        ? 'bg-[#190019] text-[#fbe4d8] shadow-[2px_2px_0px_#854f6c]'
                        : 'bg-[#dfb6b2] text-[#190019] hover:bg-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white border-2 border-[#190019] p-5 shadow-[4px_4px_0px_#190019]">
              <h3 className="font-bold mb-2 uppercase text-xs tracking-widest text-[#854f6c]">Accent Color</h3>
              <p className="text-xs text-[#190019]/70 mb-4">Select the primary accent highlights for buttons and interactive controls.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'brass', name: 'Brass', bg: 'bg-[#c5a059]' },
                  { id: 'blue', name: 'Soft Blue', bg: 'bg-[#4cc9f0]' },
                  { id: 'green', name: 'Emerald', bg: 'bg-[#2a9d8f]' },
                  { id: 'burgundy', name: 'Burgundy', bg: 'bg-[#854f6c]' },
                ].map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setAccentColor(color.id as AccentColor)}
                    className={`py-2.5 px-3 border-2 border-[#190019] font-bold text-xs capitalize transition-all flex items-center justify-center gap-2 ${
                      accentColor === color.id
                        ? 'bg-[#190019] text-[#fbe4d8] shadow-[2px_2px_0px_#854f6c]'
                        : 'bg-[#dfb6b2] text-[#190019] hover:bg-white'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full border border-black ${color.bg}`} />
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ROOM & CLIMATE TAB */}
        {activeTab === 'Room' && (
          <div className="space-y-8 max-w-xl">
            <section className="bg-white border-2 border-[#190019] p-5 shadow-[4px_4px_0px_#190019]">
              <div className="flex items-center justify-between mb-4 border-b border-[#dfb6b2] pb-3">
                <div>
                  <h3 className="font-bold uppercase text-xs tracking-widest text-[#854f6c]">Time of Day</h3>
                  <p className="text-xs text-[#190019]/70 mt-1">Control room lighting and solar position.</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold bg-[#dfb6b2] px-3 py-1.5 border border-[#190019]">
                  <input
                    type="checkbox"
                    checked={autoMode}
                    onChange={(e) => setAutoMode(e.target.checked)}
                    className="w-4 h-4 accent-[#190019]"
                  />
                  <span>Auto (Real Clock)</span>
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['morning', 'afternoon', 'sunset', 'night'] as TimeOfDay[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeOfDay(t)}
                    disabled={autoMode}
                    className={`py-2.5 px-3 border-2 border-[#190019] font-bold text-xs capitalize transition-all ${
                      timeOfDay === t && !autoMode
                        ? 'bg-[#190019] text-[#fbe4d8] shadow-[2px_2px_0px_#854f6c]'
                        : 'bg-[#dfb6b2] text-[#190019] hover:bg-white'
                    } ${autoMode ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white border-2 border-[#190019] p-5 shadow-[4px_4px_0px_#190019]">
              <h3 className="font-bold mb-2 uppercase text-xs tracking-widest text-[#854f6c]">Weather Effect</h3>
              <p className="text-xs text-[#190019]/70 mb-4">Set window environmental effects & ambient rain soundscapes.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['clear', 'cloudy', 'rain', 'stars'] as Weather[]).map((w) => (
                  <button
                    key={w}
                    onClick={() => setWeather(w)}
                    className={`py-2.5 px-3 border-2 border-[#190019] font-bold text-xs capitalize transition-all ${
                      weather === w
                        ? 'bg-[#190019] text-[#fbe4d8] shadow-[2px_2px_0px_#854f6c]'
                        : 'bg-[#dfb6b2] text-[#190019] hover:bg-white'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* WALLPAPER TAB */}
        {activeTab === 'Wallpaper' && (
          <div className="space-y-6 max-w-3xl">
            <p className="text-xs text-[#190019]/80 font-bold bg-[#dfb6b2] p-3 border border-[#190019]">
              Select background wallpaper for the Work Desk computer desktop ({WALLPAPERS.length} available):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {WALLPAPERS.map((wp) => (
                <div
                  key={wp.id}
                  onClick={() => setWallpaper(wp.url)}
                  className={`relative aspect-video border-2 border-[#190019] cursor-pointer overflow-hidden transition-all ${
                    currentWallpaper === wp.url
                      ? 'ring-4 ring-[#854f6c] shadow-[4px_4px_0px_#190019] scale-[1.02]'
                      : 'hover:scale-[1.01] hover:shadow-[2px_2px_0px_#190019]'
                  }`}
                >
                  <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-[#190019]/80 text-[#fbe4d8] p-2 text-xs font-bold flex items-center justify-between">
                    <span className="truncate pr-2">{wp.name}</span>
                    {currentWallpaper === wp.url && <Check className="w-3.5 h-3.5 text-[#dfb6b2] shrink-0" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AUDIO TAB */}
        {activeTab === 'Audio' && (
          <div className="space-y-6 max-w-lg">
            <section className="bg-white border-2 border-[#190019] p-5 shadow-[4px_4px_0px_#190019] flex items-center justify-between">
              <div>
                <h3 className="font-bold uppercase text-xs tracking-widest text-[#854f6c]">Global Mute</h3>
                <p className="text-xs text-[#190019]/70 mt-1">Mute all system ambient and interaction audio.</p>
              </div>
              <button
                onClick={toggleMute}
                className={`px-4 py-2 border-2 border-[#190019] font-bold text-xs transition-all ${
                  isMuted ? 'bg-[#190019] text-[#fbe4d8]' : 'bg-[#dfb6b2] text-[#190019] hover:bg-white'
                }`}
              >
                {isMuted ? 'Muted 🔇' : 'Audio On 🔊'}
              </button>
            </section>

            <section className="bg-white border-2 border-[#190019] p-5 shadow-[4px_4px_0px_#190019] space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-[#854f6c] mb-1">
                  <span>Master Volume</span>
                  <span>{Math.round(masterVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={masterVolume}
                  onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                  className="w-full h-3 bg-[#dfb6b2] border border-[#190019] appearance-none cursor-pointer accent-[#190019]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#854f6c] mb-1">
                  <span>Ambient Weather Volume</span>
                  <span>{Math.round(ambientVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={ambientVolume}
                  onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                  className="w-full h-3 bg-[#dfb6b2] border border-[#190019] appearance-none cursor-pointer accent-[#190019]"
                />
              </div>

              <div>
                <div className="flex justify-between text-[#854f6c] text-xs font-bold mb-1">
                  <span>Interface Volume</span>
                  <span>{Math.round(uiVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={uiVolume}
                  onChange={(e) => setUiVolume(parseFloat(e.target.value))}
                  className="w-full h-3 bg-[#dfb6b2] border border-[#190019] appearance-none cursor-pointer accent-[#190019]"
                />
              </div>
            </section>
          </div>
        )}

        {/* ACCESSIBILITY TAB */}
        {activeTab === 'Accessibility' && (
          <div className="space-y-4 max-w-lg">
            {[
              {
                id: 'reducedMotion',
                title: 'Reduced Motion',
                desc: 'Disables particle dust, rain streaks, and heavy UI animations.',
                checked: reducedMotion,
                onChange: toggleReducedMotion,
              },
              {
                id: 'highContrast',
                title: 'High Contrast Mode',
                desc: 'Increases contrast on computer desk windows and typography.',
                checked: highContrast,
                onChange: toggleHighContrast,
              },
              {
                id: 'largeFonts',
                title: 'Larger Typography',
                desc: 'Scales overall desk text size by 15% for improved legibility.',
                checked: largeFonts,
                onChange: toggleLargeFonts,
              },
            ].map((item) => (
              <label
                key={item.id}
                className="bg-white border-2 border-[#190019] p-4 shadow-[3px_3px_0px_#190019] flex items-start gap-4 cursor-pointer hover:bg-[#fbe4d8]/40 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={item.onChange}
                  className="mt-1 w-5 h-5 accent-[#190019] border-2 border-[#190019] cursor-pointer shrink-0"
                />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-[#2b124c]">{item.title}</h4>
                  <p className="text-xs text-[#190019]/70 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>
        )}

        {/* PERFORMANCE TAB */}
        {activeTab === 'Performance' && (
          <div className="space-y-6 max-w-lg">
            <section className="bg-white border-2 border-[#190019] p-5 shadow-[4px_4px_0px_#190019]">
              <h3 className="font-bold mb-2 uppercase text-xs tracking-widest text-[#854f6c]">Rendering Profile</h3>
              <p className="text-xs text-[#190019]/70 mb-4">
                Adjust visual rendering complexity to optimize graphics memory & CPU performance.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {(['high', 'balanced', 'performance'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPerformanceMode(mode)}
                    className={`py-3 px-3 border-2 border-[#190019] font-bold text-xs capitalize transition-all ${
                      performanceMode === mode
                        ? 'bg-[#190019] text-[#fbe4d8] shadow-[2px_2px_0px_#854f6c]'
                        : 'bg-[#dfb6b2] text-[#190019] hover:bg-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* DATA TAB */}
        {activeTab === 'Data' && (
          <div className="space-y-6 max-w-lg">
            <section className="bg-white border-2 border-[#190019] p-5 shadow-[4px_4px_0px_#190019]">
              <h3 className="font-bold mb-2 uppercase text-xs tracking-widest text-[#854f6c]">System Data Management</h3>
              <p className="text-xs text-[#190019]/70 mb-6 leading-relaxed">
                Reset your local storage configurations for themes, wallpapers, sound levels, and accessibility options back to factory defaults.
              </p>

              {resetSuccess && (
                <div className="mb-4 p-3 bg-green-100 border border-green-700 text-green-800 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>All preferences successfully reset to defaults.</span>
                </div>
              )}

              <button
                onClick={handleReset}
                className="w-full bg-[#854f6c] text-[#fbe4d8] font-bold py-3 px-4 hover:bg-[#190019] transition-colors border-2 border-[#190019] shadow-[3px_3px_0px_#190019] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-xs uppercase tracking-wider"
              >
                Reset All Settings To Default
              </button>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
