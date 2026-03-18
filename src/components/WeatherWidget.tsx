import React from 'react';
import { Sun, CloudRain, Wind, Waves } from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  return (
    <div className="skeuo-outer rounded-[2rem] p-6 flex flex-col gap-6 max-w-xs mx-auto md:mx-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 skeuo-inner rounded-xl flex items-center justify-center text-island-gold">
            <Sun size={20} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-island-deep/40">Weather</div>
            <div className="text-sm font-bold text-island-deep">Sunny</div>
          </div>
        </div>
        <div className="text-2xl font-display font-bold text-island-deep">29°C</div>
      </div>

      <div className="h-0.5 bg-island-deep/5 skeuo-inner rounded-full" />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 skeuo-inner rounded-lg flex items-center justify-center text-island-teal">
            <Wind size={16} />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-tight text-island-deep/30">Wind</div>
            <div className="text-xs font-bold text-island-deep">12 km/h</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 skeuo-inner rounded-lg flex items-center justify-center text-island-teal">
            <Waves size={16} />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-tight text-island-deep/30">Tide</div>
            <div className="text-xs font-bold text-island-deep">High</div>
          </div>
        </div>
      </div>
    </div>
  );
};
