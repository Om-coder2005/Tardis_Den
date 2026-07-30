import React from 'react';
import { useNearEarthObjectsQuery, useIssLocationQuery } from '../services/spaceTelemetry.service';
import { AlertTriangle, Radio, Shield, Globe } from 'lucide-react';

export const NearEarthTracker: React.FC = () => {
  const { data: asteroids = [], isLoading: loadingAsteroids } = useNearEarthObjectsQuery();
  const { data: issData } = useIssLocationQuery(true);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#0A1128] via-[#02040A] to-black p-8 md:p-12 relative font-[var(--font-tele-sans)] text-white">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-15 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* ISS Live Telemetry Banner */}
        <div className="mb-10 bg-gradient-to-r from-[#3A0CA3]/40 via-[#0A1128]/80 to-black p-6 rounded-2xl border border-[#4CC9F0]/30 shadow-[0_0_30px_rgba(76,201,240,0.1)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#4CC9F0]/10 border border-[#4CC9F0]/40 flex items-center justify-center text-[#4CC9F0]">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#4CC9F0] animate-ping" />
                <span className="text-[10px] font-[var(--font-tele-mono)] tracking-widest text-[#4CC9F0] uppercase">LIVE ISS ORBIT TRACKER</span>
              </div>
              <h3 className="text-xl font-bold font-[var(--font-tele-serif)]">International Space Station</h3>
              <p className="text-xs text-[#F4F4F9]/50">Moving at ~28,000 km/h in Low Earth Orbit (LEO)</p>
            </div>
          </div>

          <div className="flex gap-6 bg-black/40 px-6 py-3 rounded-xl border border-white/5 font-[var(--font-tele-mono)] text-xs">
            <div>
              <span className="text-[#F4F4F9]/40 block text-[9px] uppercase tracking-widest">Latitude</span>
              <span className="text-[#4CC9F0] font-bold text-sm">{issData?.iss_position?.latitude || 'CALCULATING...'}°</span>
            </div>
            <div className="border-l border-white/10 pl-6">
              <span className="text-[#F4F4F9]/40 block text-[9px] uppercase tracking-widest">Longitude</span>
              <span className="text-[#4CC9F0] font-bold text-sm">{issData?.iss_position?.longitude || 'CALCULATING...'}°</span>
            </div>
          </div>
        </div>

        {/* Asteroids Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-[#C5A059] font-[var(--font-tele-mono)] text-xs tracking-widest uppercase block mb-1">NASA NeoWS Radar</span>
            <h2 className="text-3xl font-bold font-[var(--font-tele-serif)]">Near-Earth Asteroid Radar</h2>
          </div>
          <div className="flex items-center gap-2 bg-[#C5A059]/10 px-4 py-2 rounded-full border border-[#C5A059]/30 text-[#C5A059] text-xs">
            <Shield className="w-4 h-4" />
            <span>{asteroids.length} Objects Tracked Today</span>
          </div>
        </div>

        {/* Asteroids Grid */}
        {loadingAsteroids ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Globe className="w-12 h-12 text-[#C5A059] animate-spin" />
            <span className="text-xs font-[var(--font-tele-mono)] text-[#C5A059] tracking-widest">SCANNING NEAR-EARTH ORBITS...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {asteroids.map((ast) => {
              const isHazardous = ast.is_potentially_hazardous_asteroid;
              const closeApproach = ast.close_approach_data?.[0];
              const speedKmH = parseFloat(closeApproach?.relative_velocity?.kilometers_per_hour || '0').toLocaleString(undefined, { maximumFractionDigits: 0 });
              const distKm = parseFloat(closeApproach?.miss_distance?.kilometers || '0').toLocaleString(undefined, { maximumFractionDigits: 0 });

              return (
                <div 
                  key={ast.id}
                  className={`p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                    isHazardous 
                      ? 'bg-red-950/20 border-red-500/40 hover:border-red-400' 
                      : 'bg-white/5 border-white/10 hover:border-[#4CC9F0]/40'
                  }`}
                >
                  {isHazardous && (
                    <div className="absolute top-0 right-0 bg-red-500 text-black text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      HAZARDOUS
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] font-[var(--font-tele-mono)] text-[#F4F4F9]/40 tracking-widest block mb-1">
                      ASTEROID {ast.id}
                    </span>
                    <h4 className="text-xl font-bold font-[var(--font-tele-serif)] mb-4 text-white line-clamp-1">{ast.name}</h4>

                    <div className="space-y-2 font-[var(--font-tele-mono)] text-xs">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-[#F4F4F9]/40">Est. Diameter:</span>
                        <span className="text-white font-bold">{Math.round(ast.estimated_diameter.meters.estimated_diameter_max)}m</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-[#F4F4F9]/40">Approach Speed:</span>
                        <span className="text-[#4CC9F0]">{speedKmH} km/h</span>
                      </div>
                      <div className="flex justify-between pb-2">
                        <span className="text-[#F4F4F9]/40">Miss Distance:</span>
                        <span className="text-[#C5A059]">{distKm} km</span>
                      </div>
                    </div>
                  </div>

                  <a 
                    href={ast.nasa_jpl_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-6 w-full text-center py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#F4F4F9]/70 hover:text-white transition-all"
                  >
                    View NASA JPL Telemetry →
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
