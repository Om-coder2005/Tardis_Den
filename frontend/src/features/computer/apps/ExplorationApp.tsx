import { Award, Clock, Compass, Lock } from 'lucide-react';
import React, { useState } from 'react';
import type { AchievementCategory } from '../store/achievementsList';
import { ACHIEVEMENTS } from '../store/achievementsList';
import { useExplorationStore } from '../store/useExplorationStore';

export const ExplorationApp: React.FC = () => {
  const { unlockedAchievements, timeline, statistics } = useExplorationStore();
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Timeline' | AchievementCategory>('Dashboard');
  
  const completionPercentage = Math.round((unlockedAchievements.length / ACHIEVEMENTS.length) * 100);

  const categories: AchievementCategory[] = ['Exploration', 'Library', 'Telescope', 'Journal', 'Photobooth', 'Desktop'];

  return (
    <div className="flex h-full bg-[#fbe4d8] text-[#190019] font-['Space_Mono',monospace]">
      
      {/* Sidebar */}
      <div className="w-1/3 max-w-[210px] border-r border-[#854f6c] p-4 bg-[#2b124c] text-[#fbe4d8] flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#854f6c]/50">
            <Compass className="w-5 h-5 text-[#dfb6b2]" />
            <h2 className="text-base font-bold tracking-tight text-[#fbe4d8]">Captain's Log</h2>
          </div>
          
          <ul className="space-y-1.5 mb-6">
            <li>
              <button 
                onClick={() => setActiveTab('Dashboard')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'Dashboard' ? 'bg-[#dfb6b2] text-[#190019] shadow-[2px_2px_0px_#190019]' : 'text-[#fbe4d8]/80 hover:bg-[#522b5b] hover:text-[#fbe4d8]'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Overview</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('Timeline')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'Timeline' ? 'bg-[#dfb6b2] text-[#190019] shadow-[2px_2px_0px_#190019]' : 'text-[#fbe4d8]/80 hover:bg-[#522b5b] hover:text-[#fbe4d8]'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Timeline</span>
              </button>
            </li>
          </ul>

          <h3 className="text-[10px] uppercase font-bold tracking-widest text-[#dfb6b2]/60 mb-2">Categories</h3>
          <ul className="space-y-1 max-h-56 overflow-y-auto custom-scrollbar pr-1">
            {categories.map(cat => {
              const catAchievements = ACHIEVEMENTS.filter(a => a.category === cat);
              const catUnlocked = catAchievements.filter(a => unlockedAchievements.includes(a.id)).length;
              
              return (
                <li key={cat}>
                  <button 
                    onClick={() => setActiveTab(cat)}
                    className={`w-full flex justify-between items-center px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                      activeTab === cat ? 'bg-[#dfb6b2] text-[#190019] shadow-[2px_2px_0px_#190019]' : 'text-[#fbe4d8]/80 hover:bg-[#522b5b] hover:text-[#fbe4d8]'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] opacity-70 font-mono">{catUnlocked}/{catAchievements.length}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        
        <div className="pt-4 border-t border-[#854f6c]/40">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-[#dfb6b2] mb-1.5">
            <span>Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-[#190019] border border-[#854f6c] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#dfb6b2] transition-all duration-700"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-[#fbe4d8]">
        
        {activeTab === 'Dashboard' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-xl font-bold uppercase tracking-wider text-[#2b124c] border-b-2 border-[#854f6c] pb-3">
              Exploration Overview
            </h1>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 border-2 border-[#190019] bg-white shadow-[4px_4px_0px_#190019]">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#854f6c] mb-1">Total Unlocks</h3>
                <p className="text-3xl font-bold text-[#190019]">{unlockedAchievements.length} <span className="text-xs text-[#854f6c]">/ {ACHIEVEMENTS.length}</span></p>
              </div>
              <div className="p-5 border-2 border-[#190019] bg-white shadow-[4px_4px_0px_#190019]">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#854f6c] mb-1">Recent Discovery</h3>
                <p className="text-sm font-bold text-[#190019] truncate">
                  {timeline.length > 0 
                    ? ACHIEVEMENTS.find(a => a.id === timeline[0].achievementId)?.title 
                    : 'Awaiting first discovery...'}
                </p>
              </div>
            </div>

            <h2 className="text-sm font-bold uppercase tracking-widest text-[#854f6c] border-b border-[#dfb6b2] pb-2">Activity Statistics</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 border-2 border-[#190019] bg-white shadow-[3px_3px_0px_#190019]">
                <div className="text-[10px] uppercase font-bold text-[#854f6c]">Books Read</div>
                <div className="text-xl font-bold text-[#190019] mt-1">{statistics.booksRead}</div>
              </div>
              <div className="p-4 border-2 border-[#190019] bg-white shadow-[3px_3px_0px_#190019]">
                <div className="text-[10px] uppercase font-bold text-[#854f6c]">Journal Entries</div>
                <div className="text-xl font-bold text-[#190019] mt-1">{statistics.journalEntries}</div>
              </div>
              <div className="p-4 border-2 border-[#190019] bg-white shadow-[3px_3px_0px_#190019]">
                <div className="text-[10px] uppercase font-bold text-[#854f6c]">Photos Taken</div>
                <div className="text-xl font-bold text-[#190019] mt-1">{statistics.photosTaken}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Timeline' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-xl font-bold uppercase tracking-wider text-[#2b124c] border-b-2 border-[#854f6c] pb-3">
              Discovery Timeline
            </h1>
            {timeline.length === 0 ? (
              <p className="text-xs font-bold text-[#190019]/60 text-center py-12 italic bg-white border-2 border-[#190019] p-6">
                Your logbook is currently empty. Start exploring the observatory to record your journey.
              </p>
            ) : (
              <div className="relative border-l-2 border-[#854f6c] ml-4 pl-6 space-y-6 py-2">
                {timeline.map((event) => {
                  const achievement = ACHIEVEMENTS.find(a => a.id === event.achievementId);
                  if (!achievement) return null;
                  
                  return (
                    <div key={event.id} className="relative">
                      <div className="absolute -left-[31px] top-2 w-3.5 h-3.5 rounded-full bg-[#190019] border-2 border-[#DFB6B2]" />
                      <div className="text-[10px] font-bold text-[#854f6c] mb-1">
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                      <div className="p-4 border-2 border-[#190019] bg-white shadow-[3px_3px_0px_#190019] flex gap-3 items-center">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <h4 className="font-bold text-sm text-[#190019]">{achievement.title}</h4>
                          <p className="text-xs text-[#190019]/70 mt-0.5">{achievement.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {categories.includes(activeTab as AchievementCategory) && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-xl font-bold uppercase tracking-wider text-[#2b124c] border-b-2 border-[#854f6c] pb-3">
              {activeTab} Milestones
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ACHIEVEMENTS.filter(a => a.category === activeTab).map((achievement) => {
                const isUnlocked = unlockedAchievements.includes(achievement.id);
                
                return (
                  <div 
                    key={achievement.id}
                    className={`p-4 border-2 border-[#190019] flex gap-3 transition-all ${
                      isUnlocked 
                        ? 'bg-white shadow-[4px_4px_0px_#190019]' 
                        : 'bg-[#dfb6b2]/40 opacity-70 border-dashed'
                    }`}
                  >
                    <div className="text-3xl flex-shrink-0 flex items-center justify-center">
                      {isUnlocked ? achievement.icon : <Lock className="w-6 h-6 text-[#190019]/50" />}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-xs uppercase tracking-wide text-[#190019]">
                        {isUnlocked ? achievement.title : 'Undiscovered'}
                      </h4>
                      <p className="text-[11px] text-[#190019]/70 mt-1 leading-snug">
                        {isUnlocked ? achievement.description : 'Keep exploring the observatory to unlock this entry.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
