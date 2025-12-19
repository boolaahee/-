
import React from 'react';
import { PalmPosition } from '../types';

interface PalmDiagramProps {
  highlightIndex?: number;
}

const PalmDiagram: React.FC<PalmDiagramProps> = ({ highlightIndex }) => {
  // Traditional Small Liuren Palm Positions (Left Hand)
  // 1. Index Base (Daan)
  // 2. Index Tip (Liulian)
  // 3. Middle Tip (Suxi)
  // 4. Ring Tip (Chikou)
  // 5. Ring Base (Xiaoji)
  // 6. Middle Base (Kongwang)
  const posCoords = [
    { name: PalmPosition.DAAN, top: '70%', left: '28%' },     
    { name: PalmPosition.LIULIAN, top: '38%', left: '28%' },  
    { name: PalmPosition.SUXI, top: '30%', left: '50%' },     
    { name: PalmPosition.CHIKOU, top: '35%', left: '72%' },   
    { name: PalmPosition.XIAOJI, top: '68%', left: '72%' },   
    { name: PalmPosition.KONGWANG, top: '78%', left: '50%' },  
  ];

  return (
    <div className="relative w-full aspect-square max-h-[350px] mx-auto bg-slate-900/20 rounded-full border border-cyan-500/10 backdrop-blur-sm">
      {/* Visual Hand Silhouette */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 250" className="w-4/5 h-4/5 fill-cyan-500">
          <path d="M50,250 Q30,220 30,150 Q30,80 40,60 Q45,50 50,60 L55,100 L70,40 Q75,30 80,40 L95,100 L110,30 Q115,20 120,30 L135,100 L150,50 Q155,40 160,50 L175,130 Q180,200 160,250 Z" />
        </svg>
      </div>

      {/* Path lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
        <path 
          d="M 28 70 L 28 38 L 50 30 L 72 35 L 72 68 L 50 78 Z" 
          fill="none" 
          stroke="rgba(34, 211, 238, 0.1)" 
          strokeWidth="0.5" 
          strokeDasharray="2,2"
        />
      </svg>
      
      {posCoords.map((pos, idx) => (
        <div 
          key={pos.name}
          className={`absolute transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center
            ${highlightIndex === idx ? 'scale-125 z-20' : 'scale-100 z-10'}`}
          style={{ top: pos.top, left: pos.left }}
        >
          <div className={`w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center font-bold
            ${highlightIndex === idx 
              ? 'bg-cyan-500 border-white text-black shadow-[0_0_25px_rgba(34,211,238,0.9)]' 
              : 'border-cyan-800/40 text-cyan-500/60 bg-black/60 backdrop-blur-md'}`}>
            <span className="text-sm">{pos.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PalmDiagram;
