import React from 'react';
import { useRestStore } from '../store/useRestStore';
import type { RestActivity } from '../store/useRestStore';
import { Quote, Sparkles, PenTool } from 'lucide-react';

export const RestSidebar: React.FC = () => {
  const { currentActivity, setActivity } = useRestStore();

  const activities: { id: RestActivity; label: string; icon: React.ReactNode }[] = [
    { id: 'quote', label: 'Thought of the Day', icon: <Quote className="w-5 h-5" /> },
    { id: 'fact', label: 'Space Facts', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'reflection', label: 'Daily Reflection', icon: <PenTool className="w-5 h-5" /> },
  ];

  return (
    <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-[#334155] p-6 flex flex-col gap-4 bg-[#0F1524]">
      <h2 className="text-xs uppercase tracking-widest text-[#E2E8F0]/50 mb-4 font-bold">Activities</h2>
      
      {activities.map((act) => (
        <button
          key={act.id}
          onClick={() => setActivity(act.id)}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all font-medium ${
            currentActivity === act.id
              ? 'bg-[#E2E8F0] text-[#0F1524]'
              : 'text-[#E2E8F0]/70 hover:bg-[#162032] hover:text-[#E2E8F0]'
          }`}
        >
          {act.icon}
          {act.label}
        </button>
      ))}
    </div>
  );
};
