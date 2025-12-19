
import React, { useState, useEffect } from 'react';
import SmokeParticles from './components/SmokeParticles';
import PalmDiagram from './components/PalmDiagram';
import { 
  PalmPosition, 
  PalmDetails, 
  PositionsInOrder, 
  EarthlyBranches, 
  CalculationStep, 
  MetaphysicalAnalysis 
} from './types';
import { getShiChen, calculateSteps, performMetaphysicalAnalysis } from './utils/divination';

const mockLunarConvert = (dateStr: string, timeStr: string) => {
  const date = new Date(dateStr);
  const hours = parseInt(timeStr.split(':')[0]);
  return {
    lunarMonth: (date.getMonth() + 1),
    lunarDay: date.getDate(),
    shiChenIndex: getShiChen(hours)
  };
};

const App: React.FC = () => {
  const [screen, setScreen] = useState<'splash' | 'main'>('splash');
  const [showInputModal, setShowInputModal] = useState(false);
  const [dateInput, setDateInput] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5)
  });
  
  const [lunarData, setLunarData] = useState({ month: 10, day: 7, shi: 8 });
  const [calcSteps, setCalcSteps] = useState<CalculationStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [currentPathIdx, setCurrentPathIdx] = useState(-1);
  const [showResult, setShowResult] = useState(false);
  const [analysis, setAnalysis] = useState<MetaphysicalAnalysis | null>(null);

  const startCalculation = (m: number, d: number, s: number) => {
    setLunarData({ month: m, day: d, shi: s });
    setScreen('main');
    const steps = calculateSteps(m, d, s);
    setCalcSteps(steps);
    
    // Perform Analysis
    const finalPos = PositionsInOrder[steps[2].endIndex];
    const ana = performMetaphysicalAnalysis(m, d, s, finalPos);
    setAnalysis(ana);

    runAnimation(steps);
  };

  const handleUseCurrent = () => {
    const now = new Date();
    const dStr = now.toISOString().split('T')[0];
    const tStr = now.toTimeString().slice(0, 5);
    const converted = mockLunarConvert(dStr, tStr);
    startCalculation(converted.lunarMonth, converted.lunarDay, converted.shiChenIndex);
  };

  const handleCustomInputSubmit = () => {
    const converted = mockLunarConvert(dateInput.date, dateInput.time);
    setShowInputModal(false);
    startCalculation(converted.lunarMonth, converted.lunarDay, converted.shiChenIndex);
  };

  const resetToSplash = () => {
    setShowResult(false);
    setScreen('splash');
    setCurrentStepIdx(-1);
    setCurrentPathIdx(-1);
    setAnalysis(null);
  };

  const runAnimation = async (steps: CalculationStep[]) => {
    setCurrentStepIdx(0);
    setCurrentPathIdx(0);
    setShowResult(false);

    for (let s = 0; s < steps.length; s++) {
      setCurrentStepIdx(s);
      for (let p = 0; p < steps[s].path.length; p++) {
        setCurrentPathIdx(p);
        await new Promise(r => setTimeout(r, 450));
      }
      await new Promise(r => setTimeout(r, 800));
    }
    setShowResult(true);
  };

  const activePositionIndex = calcSteps[currentStepIdx]?.path[currentPathIdx];

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden bg-black text-white font-sans">
      <SmokeParticles />

      {screen === 'splash' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black mb-24 tracking-[0.5em] hologram-glow text-cyan-400 uppercase">
              六神課
            </h1>
            
            <div className="space-y-4 flex flex-col items-center">
              <button 
                onClick={handleUseCurrent}
                className="w-64 py-4 rounded-full bg-cyan-600/20 border border-cyan-400 text-cyan-300 font-bold hover:bg-cyan-600/40 transition-all backdrop-blur-md"
              >
                [ 使用當下時間 ]
              </button>
              <button 
                onClick={() => setShowInputModal(true)}
                className="w-64 py-4 rounded-full bg-slate-900/60 border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-all backdrop-blur-md"
              >
                [ 輸入時間日期 ]
              </button>
            </div>
            
            <p className="mt-12 text-[10px] text-cyan-800 tracking-widest uppercase animate-pulse">
              點擊掌心以開始掐指演算
            </p>
          </div>
        </div>
      )}

      {showInputModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
          <div className="bg-slate-900 border border-cyan-500/30 p-8 rounded-[40px] w-full max-w-sm">
            <h2 className="text-xl font-bold mb-6 text-cyan-400 text-center">自定義時間</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-cyan-600 uppercase mb-1 block">國曆日期</label>
                <input 
                  type="date" 
                  value={dateInput.date}
                  onChange={e => setDateInput({...dateInput, date: e.target.value})}
                  className="w-full bg-black border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-cyan-600 uppercase mb-1 block">時間</label>
                <input 
                  type="time" 
                  value={dateInput.time}
                  onChange={e => setDateInput({...dateInput, time: e.target.value})}
                  className="w-full bg-black border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowInputModal(false)}
                  className="flex-1 py-3 border border-slate-800 rounded-xl text-slate-500 font-bold"
                >
                  取消
                </button>
                <button 
                  onClick={handleCustomInputSubmit}
                  className="flex-1 py-3 bg-cyan-600 text-black font-black rounded-xl"
                >
                  確認
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === 'main' && (
        <div className="z-10 h-full flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full">
          <div className="flex-none bg-slate-900/40 border border-cyan-500/20 p-6 rounded-[32px] backdrop-blur-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-cyan-500 tracking-[0.2em] uppercase">演算參數</span>
              <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] rounded-full border border-cyan-500/20">
                {dateInput.date} {dateInput.time}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-black/40 p-3 rounded-2xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 mb-1">農曆月份</div>
                <div className="text-xl font-bold text-cyan-100">{lunarData.month}月</div>
              </div>
              <div className="bg-black/40 p-3 rounded-2xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 mb-1">農曆日期</div>
                <div className="text-xl font-bold text-cyan-100">{lunarData.day}日</div>
              </div>
              <div className="bg-black/40 p-3 rounded-2xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 mb-1">時辰</div>
                <div className="text-xl font-bold text-cyan-100">{EarthlyBranches[lunarData.shi]}時 ({lunarData.shi + 1})</div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center py-4">
            <PalmDiagram highlightIndex={activePositionIndex} />
          </div>

          <div className="flex-none grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {calcSteps.map((step, idx) => {
              const isActive = currentStepIdx === idx;
              const isDone = currentStepIdx > idx;
              return (
                <div 
                  key={idx}
                  className={`p-4 rounded-3xl border transition-all duration-300 flex flex-col justify-center
                    ${isActive 
                      ? 'bg-cyan-500/10 border-cyan-400 ring-2 ring-cyan-400/20' 
                      : isDone ? 'bg-slate-900/80 border-cyan-900/40 opacity-70' : 'bg-slate-950/20 border-slate-900 opacity-40'}`}
                >
                  <div className="text-[10px] font-black mb-1 tracking-tighter text-slate-500">{step.title}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-200">
                      {PositionsInOrder[step.startIndex]} → {PositionsInOrder[step.endIndex]}
                    </span>
                    <span className="text-[10px] bg-black/60 px-2 py-0.5 rounded text-cyan-600">計 {step.count}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex-none h-1 bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-400 shadow-[0_0_10px_cyan] transition-all duration-300"
              style={{ width: `${((currentStepIdx + 1) / 3) * 100}%` }}
            />
          </div>
          
          <button 
            onClick={() => setScreen('splash')}
            className="mt-6 text-[10px] text-slate-600 uppercase tracking-widest hover:text-cyan-600 transition self-center"
          >
            返回首頁
          </button>
        </div>
      )}

      {showResult && analysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 animate-in fade-in duration-500">
          <div className="bg-slate-900 w-full max-w-md rounded-[48px] border-2 border-cyan-400 p-6 md:p-8 shadow-[0_0_60px_rgba(34,211,238,0.4)] relative overflow-hidden max-h-[95vh] overflow-y-auto custom-scrollbar">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
            
            <div className="text-center mb-6">
              <span className="text-[10px] font-black text-cyan-500 tracking-[0.4em] uppercase mb-2 block">演算最終結果</span>
              <div className="text-6xl font-black text-white mb-2 tracking-tighter hologram-glow">
                {PositionsInOrder[calcSteps[2].endIndex]}
              </div>
              <div className="bg-cyan-500/10 py-2 px-4 rounded-xl border border-cyan-400/30 text-cyan-300 font-bold text-base inline-block">
                「{PalmDetails[PositionsInOrder[calcSteps[2].endIndex]].meaning}」
              </div>
            </div>

            {/* Metaphysical Section */}
            <div className="bg-black/50 rounded-3xl p-5 border border-slate-800 mb-6 space-y-4">
              <h3 className="text-xs font-black text-cyan-500 border-b border-slate-800 pb-2 flex items-center gap-2">
                <span className="w-1 h-3 bg-cyan-500 rounded-full"></span>
                玄學命理解析
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 mb-1">月支環境</div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-white">{analysis.monthBranch}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 mt-1">
                      {analysis.envAttr.element}({analysis.envAttr.color})
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 mb-1">日干主氣</div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-white">{analysis.dayStem}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 mt-1">
                      {analysis.dayAttr.element}({analysis.dayAttr.color})
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 mb-1">時支行動</div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-white">{analysis.hourBranch}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 mt-1">
                      {analysis.actionAttr.element}({analysis.actionAttr.color})
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2">
                   <span className="text-[10px] font-bold text-cyan-400 uppercase">主導方位：</span>
                   <span className="text-xs text-white">{analysis.dominantLevel === '時辰' ? analysis.actionAttr.direction : analysis.dominantLevel === '日干' ? analysis.dayAttr.direction : analysis.envAttr.direction}</span>
                   <span className="text-[10px] font-bold text-cyan-400 uppercase ml-2">主導顏色：</span>
                   <span className="text-xs text-white">{analysis.dominantLevel === '時辰' ? analysis.actionAttr.color : analysis.dominantLevel === '日干' ? analysis.dayAttr.color : analysis.envAttr.color}</span>
                </div>
                <p className="text-xs text-cyan-100 italic bg-cyan-900/20 p-3 rounded-2xl border border-cyan-900/40 leading-relaxed">
                   {analysis.suggestion}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6">
              {PositionsInOrder.map((pos) => (
                <div key={pos} className={`flex justify-between items-center px-3 py-1.5 rounded-xl border transition-all
                  ${pos === PositionsInOrder[calcSteps[2].endIndex] ? 'bg-cyan-400/20 border-cyan-400' : 'bg-black/40 border-slate-800 opacity-40'}`}>
                  <span className="text-[11px] font-black text-cyan-400">{pos}</span>
                  <span className="text-[9px] text-slate-300">{PalmDetails[pos].meaning}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={resetToSplash}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-black py-4 rounded-3xl transition-all shadow-xl shadow-cyan-900/30 text-sm"
              >
                [ 再起一卦 ]
              </button>
              <button 
                onClick={() => setShowResult(false)}
                className="w-full border border-slate-700 hover:border-slate-500 text-slate-400 font-bold py-3 rounded-3xl transition-all text-xs"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34,211,238,0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default App;
