import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router';
import { Login } from './routes/Login';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicRoute } from './routes/PublicRoute';
import { RoomScene } from './features/room/RoomScene';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useSettingsStore } from './features/computer/store/useSettingsStore';
import { SearchShortcutListener } from './features/search/components/SearchShortcutListener';
import { SearchOverlay } from './features/search/components/SearchOverlay';
import { AudioEngine } from './features/audio/components/AudioEngine';

const Landing = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
    <h1 className="text-4xl font-light tracking-widest mb-4">TARDIS Den</h1>
    <Link to="/login" className="text-blue-400 hover:text-blue-300 underline transition-colors">Enter</Link>
  </div>
);

const Room = () => {
  return <RoomScene />;
};

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
    <h2 className="text-2xl font-light tracking-widest">404 - Not Found</h2>
  </div>
);

function App() {
  const { theme, accentColor } = useSettingsStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-day', 'theme-night');

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'theme-night' : 'theme-day');
      
      const listener = (e: MediaQueryListEvent) => {
        root.classList.remove('theme-day', 'theme-night');
        root.classList.add(e.matches ? 'theme-night' : 'theme-day');
      };
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener);
      return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener);
    } else {
      root.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  useEffect(() => {
    const accents = {
      brass: ['#B5A642', '#9A8C35'],
      blue: ['#6CA0DC', '#5A8ECA'],
      green: ['#78A878', '#5F8D5F'],
      burgundy: ['#9B5361', '#7F3D4C'],
    } as const;
    const root = document.documentElement;
    const [accent, hover] = accents[accentColor];
    root.style.setProperty('--color-accent-val', accent);
    root.style.setProperty('--color-accent-hover-val', hover);
  }, [accentColor]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
          </Route>
          
          <Route element={<ProtectedRoute />}>
            <Route path="/room" element={<Room />} />
            <Route path="/settings" element={<Room />} />
            <Route path="/gallery" element={<Room />} />
            <Route path="/journal" element={<Room />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AudioEngine />
        <SearchShortcutListener />
        <SearchOverlay />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
