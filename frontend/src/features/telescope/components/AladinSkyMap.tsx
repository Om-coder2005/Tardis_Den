import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    A?: any;
  }
}

interface AladinSkyMapProps {
  fov?: number; // Field of view in degrees (e.g. 5)
  target?: string; // Target object name or coordinates (e.g. "M31" or "00:42:44.3 +41:16:09")
  survey?: string; // Sky survey (e.g. "P/DSS2/color", "P/WISE/color")
}

export const AladinSkyMap: React.FC<AladinSkyMapProps> = ({
  fov = 5,
  target = 'M31',
  survey = 'P/DSS2/color',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const aladinInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Load Aladin Lite CDN Script dynamically if not already loaded
    const loadAladinScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.A) {
          resolve();
          return;
        }

        // Check if CSS is injected
        if (!document.getElementById('aladin-lite-css')) {
          const link = document.createElement('link');
          link.id = 'aladin-lite-css';
          link.rel = 'stylesheet';
          link.href = 'https://aladin.cds.unistra.fr/AladinLite/api/v3/latest/aladin.site.min.css';
          document.head.appendChild(link);
        }

        // Inject JS
        if (!document.getElementById('aladin-lite-js')) {
          const script = document.createElement('script');
          script.id = 'aladin-lite-js';
          script.src = 'https://aladin.cds.unistra.fr/AladinLite/api/v3/latest/aladin.js';
          script.charset = 'utf-8';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Aladin Lite script'));
          document.head.appendChild(script);
        } else {
          const checkInterval = setInterval(() => {
            if (window.A) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 100);
        }
      });
    };

    loadAladinScript()
      .then(() => {
        if (!containerRef.current || !window.A) return;

        // Initialize Aladin Lite instance: A.aladin('#aladin-lite-div')
        if (!aladinInstanceRef.current) {
          aladinInstanceRef.current = window.A.aladin(containerRef.current, {
            survey,
            fov,
            target,
            showReticle: true,
            showZoomControl: true,
            showFullscreenControl: false,
            showLayersControl: true,
            showGotoControl: true,
          });
        } else {
          aladinInstanceRef.current.gotoObject(target);
          aladinInstanceRef.current.setFov(fov);
        }
      })
      .catch((err) => {
        console.error('Aladin Lite initialization error:', err);
      });

    return () => {
      // Cleanup on unmount if needed
    };
  }, [target, fov, survey]);

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      <div 
        ref={containerRef} 
        className="w-full h-full min-h-[450px] bg-black"
        id="aladin-lite-div"
      />
    </div>
  );
};
