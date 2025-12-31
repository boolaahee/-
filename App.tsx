
import React, { useState, useEffect } from 'react';
import SmokeParticles from './components/SmokeParticles';
import PalmDiagram from './components/PalmDiagram';
import { 
  PalmPosition, 
  PalmMeanings, 
  PositionsInOrder, 
  EarthlyBranches, 
  CalculationStep, 
  MetaphysicalAnalysis 
} from './types';
import { 
  convertToLunarDate, 
  calculateSteps, 
  performMetaphysicalAnalysis 
} from './utils/divination';

// Helper to get Taipei time strings for HTML inputs
const getTaipeiDateTime = (targetDate: Date = new Date()) => {
  const formatterDate = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  
  const formatterTime = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Taipei',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return {
    date: formatterDate.format(targetDate), // YYYY-MM-DD
    time: formatterTime.format(targetDate), // HH:mm
    parts: {
      year: parseInt(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Taipei', year: 'numeric' }).format(targetDate)),
      month: parseInt(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Taipei', month: 'numeric' }).format(targetDate)),
      day: parseInt(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Taipei', day: 'numeric' }).format(targetDate)),
      hour: parseInt(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Taipei', hour: 'numeric', hour12: false }).format(targetDate))
    }
  };
};

const App: React.FC = () => {
  const [screen, setScreen] = useState<'splash' | 'main'>('splash');
  const [showInputModal, setShowInputModal] = useState(false);
  const [showConversionModal, setShowConversionModal] = useState(false);
  
  // Initial state using Taipei time
  const [dateInput, setDateInput] = useState(() => {
    const tp = getTaipeiDateTime();
    return { date: tp.date, time: tp.time };
  });

  const [lunarData, setLunarData] = useState<any>(null);
  const [calcSteps, setCalcSteps] = useState<CalculationStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [currentPathIdx, setCurrentPathIdx] = useState(-1);
  const [showResult, setShowResult] = useState(false);
  const [analysis, setAnalysis] = useState<MetaphysicalAnalysis | null>(null);

  // 1. Initial Selection
  const handleSelection = (isCurrent: boolean) => {
    let y, m, d, h;
    if (isCurrent) {
      const tp = getTaipeiDateTime();
      y = tp.parts.year;
      m = tp.parts.month;
      d = tp.parts.day;
      h = tp.parts.hour;
      setDateInput({ date: tp.date, time: tp.time });
    } else {
      const dateParts = dateInput.date.split('-');
      const timeParts = dateInput.time.split(':');
      y = parseInt(dateParts[0]); 
      m = parseInt(dateParts[1]); 
      d = parseInt(dateParts[2]);
      h = parseInt(timeParts[0]);
    }

    const converted = convertToLunarDate(y, m, d, h);
    setLunarData(converted);
    setShowConversionModal(true);
    if (!isCurrent) setShowInputModal(false);
  };

  // 2. Start Divination after conversion check
  const startDivination = () => {
    setShowConversionModal(false);
    setScreen('main');
    
    const steps = calculateSteps(lunarData.lunar.month, lunarData.lunar.day, lunarData.shiIndex);
    setCalcSteps(steps);
    
    const finalPosIndex = steps[2].endIndex;
    const finalPos = PositionsInOrder[finalPosIndex];
    
    const ana = performMetaphysicalAnalysis(
      lunarData.lunar.month, 
      lunarData.lunar.day, 
      lunarData.shiIndex, 
      finalPos,
      lunarData.lunar.gzMonth,
      lunarData.lunar.gzDay
    );
    setAnalysis(ana);

    runAnimation(steps);
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

  const resetToSplash = () => {
    setShowResult(false);
    setScreen('splash');
    setCurrentStepIdx(-1);
    setCurrentPathIdx(-1);
    setAnalysis(null);
  };

  const activePositionIndex = calcSteps[currentStepIdx]?.path[currentPathIdx];

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden bg-black text-white font-sans selection:bg-cyan-500/30">
      <SmokeParticles />

      {/* SPLASH SCREEN */}
      {screen === 'splash' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 animate-in fade-in duration-1000">
          <div className="text-center relative">
            <div className="absolute -inset-20 bg-cyan-500/10 blur-[100px] rounded-full animate-pulse"></div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-[0.5em] hologram-text uppercase italic">
              六神課
            </h1>
            <p className="text-cyan-600/60 font-mono tracking-widest text-xs mb-24 animate-pulse-slow">
              [ PALM-BASED QUANTUM DIVINATION ]
            </p>
            
            <div className="space-y-6 flex flex-col items-center z-10 relative">
              <button 
                onClick={() => handleSelection(true)}
                className="glow-btn w-72 py-5 rounded-2xl bg-cyan-600/10 border border-cyan-400/50 text-cyan-300 font-black tracking-[0.3em] hover:bg-cyan-600/30 hover:border-cyan-400 transition-all backdrop-blur-md"
              >
                [ 心血來潮 ]
              </button>
              
              <button 
                onClick={() => setShowInputModal(true)}
                className="glow-btn w-72 py-5 rounded-2xl bg-slate-900/40 border border-slate-700 text-slate-400 font-black tracking-[0.3em] hover:bg-slate-800 transition-all backdrop-blur-md"
              >
                [ 指定時間日期 ]
              </button>
            </div>
            
            <p className="mt-20 text-[10px] text-cyan-900 uppercase tracking-[0.4em] font-bold">
              TAP PANEL TO SYNC TEMPORAL FREQUENCY
            </p>
          </div>
        </div>
      )}

      {/* CUSTOM INPUT MODAL */}
      {showInputModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl animate-in zoom-in duration-300">
          <div className="futuristic-panel p-10 rounded-[48px] w-full max-w-sm border-cyan-500/20">
            <h2 className="text-xl font-black mb-10 text-cyan-400 text-center tracking-widest uppercase">指定演算參數</h2>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] text-cyan-700 uppercase mb-2 block font-bold tracking-widest">西元日期 (YYYY-MM-DD)</label>
                <input 
                  type="date" 
                  value={dateInput.date}
                  onChange={e => setDateInput({...dateInput, date: e.target.value})}
                  className="w-full bg-black/40 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-cyan-500 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] text-cyan-700 uppercase mb-2 block font-bold tracking-widest">西元時間 (HH:MM)</label>
                <input 
                  type="time" 
                  value={dateInput.time}
                  onChange={e => setDateInput({...dateInput, time: e.target.value})}
                  className="w-full bg-black/40 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-cyan-500 transition-all"
                />
              </div>
              <div className="flex gap-4 mt-12">
                <button 
                  onClick={() => setShowInputModal(false)}
                  className="flex-1 py-4 border border-slate-800 rounded-2xl text-slate-500 font-bold hover:bg-slate-900"
                >
                  取消
                </button>
                <button 
                  onClick={() => handleSelection(false)}
                  className="flex-1 py-4 bg-cyan-600 text-black font-black rounded-2xl hover:bg-cyan-500 shadow-xl shadow-cyan-900/30"
                >
                  確認
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONVERSION PREVIEW MODAL */}
      {showConversionModal && lunarData && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/80 backdrop-blur-lg animate-in fade-in duration-500">
          <div className="futuristic-panel p-10 rounded-[64px] w-full max-w-md border-cyan-500/30 text-center">
            <span className="text-[10px] text-cyan-500 font-black tracking-[0.5em] uppercase mb-10 block">Temporal Translation</span>
            
            <div className="mb-10 p-6 bg-cyan-900/10 rounded-3xl border border-cyan-900/20">
              <div className="text-[9px] text-cyan-800 uppercase mb-3 tracking-widest font-bold">西元日期 (GREGORIAN)</div>
              <div className="text-xl font-bold text-white tracking-widest">{dateInput.date} {dateInput.time}</div>
            </div>

            <div className="mb-12 space-y-8">
              <div className="text-[11px] text-cyan-600 uppercase tracking-[0.4em] font-black">農曆轉換結果 (LUNAR SYNC)</div>
              <div className="grid grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-white hologram-text">{lunarData.lunar.month}</span>
                  <span className="text-[10px] text-slate-500 mt-2 font-black uppercase tracking-widest">農曆月份</span>
                </div>
                <div className="flex flex-col border-x border-slate-800">
                  <span className="text-4xl font-black text-white hologram-text">{lunarData.lunar.day}</span>
                  <span className="text-[10px] text-slate-500 mt-2 font-black uppercase tracking-widest">農曆日期</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-cyan-400 hologram-text">{EarthlyBranches[lunarData.shiIndex]}</span>
                  <span className="text-[10px] text-slate-500 mt-2 font-black uppercase tracking-widest">對應時辰</span>
                </div>
              </div>
              <div className="text-[10px] text-cyan-800 tracking-widest font-bold">
                {lunarData.lunar.gzYear}年 {lunarData.lunar.gzMonth}月 {lunarData.lunar.gzDay}日
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={startDivination}
                className="glow-btn w-full bg-cyan-600 hover:bg-cyan-500 text-black font-black py-5 rounded-2xl transition-all shadow-xl shadow-cyan-900/40 text-lg tracking-widest"
              >
                [ 啟動演算流程 ]
              </button>
              <button 
                onClick={() => { setShowConversionModal(false); setScreen('splash'); }}
                className="w-full text-slate-600 font-bold py-2 text-[10px] uppercase tracking-widest hover:text-slate-400 transition-colors"
              >
                Reset Calibration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CALCULATION SCREEN */}
      {screen === 'main' && (
        <div className="z-10 h-full flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-700">
          
          {/* UPPER: Date Display */}
          <div className="flex-none bg-slate-900/40 border border-cyan-500/10 p-6 rounded-[32px] backdrop-blur-md mb-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-black text-cyan-600 tracking-[0.5em] uppercase">Calibration Stream</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-slate-500 font-mono">{dateInput.date} {dateInput.time}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/60 p-4 rounded-2xl border border-slate-900/50 flex flex-col items-center">
                <div className="text-[9px] text-slate-600 mb-1 uppercase tracking-widest font-black">西元曆</div>
                <div className="text-lg font-bold text-white tracking-widest">{lunarData.solar.month}/{lunarData.solar.day} {lunarData.solar.hour}:00</div>
              </div>
              <div className="bg-black/60 p-4 rounded-2xl border border-slate-900/50 flex flex-col items-center">
                <div className="text-[9px] text-slate-600 mb-1 uppercase tracking-widest font-black">農曆時辰</div>
                <div className="text-lg font-bold text-cyan-400 tracking-widest">{lunarData.lunar.monthCn}{lunarData.lunar.dayCn} {EarthlyBranches[lunarData.shiIndex]}時</div>
              </div>
            </div>
          </div>

          {/* MIDDLE: Palm Diagram */}
          <div className="flex-1 flex flex-col justify-center py-2 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>
             <PalmDiagram highlightIndex={activePositionIndex} />
          </div>

          {/* LOWER: Steps */}
          <div className="flex-none grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {calcSteps.map((step, idx) => {
              const isActive = currentStepIdx === idx;
              const isDone = currentStepIdx > idx;
              return (
                <div 
                  key={idx}
                  className={`p-6 rounded-[32px] border transition-all duration-500 flex flex-col justify-center relative overflow-hidden
                    ${isActive 
                      ? 'bg-cyan-500/10 border-cyan-400 ring-4 ring-cyan-400/5 shadow-[0_0_40px_rgba(0,255,255,0.1)]' 
                      : isDone ? 'bg-slate-900/80 border-cyan-900/40 opacity-70 scale-95' : 'bg-slate-950/20 border-slate-900 opacity-40 scale-90'}`}
                >
                  <div className="text-[10px] font-black mb-3 tracking-widest text-slate-500 uppercase flex justify-between">
                    {step.title}
                    {isActive && <span className="text-cyan-400 animate-pulse font-mono">[ ACTIVE ]</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-base font-black transition-colors ${isActive ? 'text-white' : 'text-slate-600'}`}>
                      {PositionsInOrder[step.startIndex]} <span className="text-slate-800">➔</span> {PositionsInOrder[step.endIndex]}
                    </span>
                    <span className="text-[11px] bg-black/80 px-3 py-1 rounded-xl text-cyan-600 font-mono font-black border border-cyan-900/30">
                      COUNT {step.count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex-none h-1 bg-slate-950 rounded-full overflow-hidden border border-slate-900/50">
            <div 
              className="h-full bg-gradient-to-r from-cyan-950 via-cyan-400 to-cyan-100 shadow-[0_0_20px_rgba(0,255,255,0.6)] transition-all duration-500 ease-out"
              style={{ width: `${((currentStepIdx + 1) / 3) * 100}%` }}
            />
          </div>
          
          <button 
            onClick={resetToSplash}
            className="mt-8 text-[10px] text-slate-700 uppercase tracking-[0.4em] font-black hover:text-cyan-600 transition self-center"
          >
            Abort Calculation
          </button>
        </div>
      )}

      {/* FINAL RESULT CARD */}
      {showResult && analysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 animate-in fade-in duration-700 backdrop-blur-3xl">
          <div className="futuristic-panel w-full max-w-lg rounded-[64px] border-2 border-cyan-400 p-8 md:p-12 shadow-[0_0_120px_rgba(0,255,255,0.4)] relative overflow-hidden max-h-[92vh] flex flex-col scrollbar-hide">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
            
            <div className="flex-1 overflow-y-auto scrollbar-hide pr-2">
              <div className="text-center mb-10">
                <div className="text-[10px] text-slate-600 font-mono mb-2 uppercase tracking-widest">{dateInput.date} {dateInput.time}</div>
                <span className="text-[11px] font-black text-cyan-600 tracking-[0.6em] uppercase mb-4 block">Divination Conclusion</span>
                <div className="text-8xl font-black text-white mb-6 tracking-tighter hologram-text drop-shadow-[0_0_40px_rgba(0,255,255,0.6)]">
                  {PositionsInOrder[calcSteps[2].endIndex]}
                </div>
                <div className="bg-cyan-500/10 py-5 px-10 rounded-[32px] border border-cyan-400/40 text-cyan-300 font-black text-xl mb-4 tracking-widest inline-block shadow-inner">
                  「{PalmMeanings[PositionsInOrder[calcSteps[2].endIndex]]}」
                </div>
              </div>

              <div className="bg-black/40 rounded-[40px] p-8 border border-slate-800/60 space-y-8 shadow-inner">
                <div className="flex justify-between items-center border-b border-slate-800/50 pb-4">
                  <h3 className="text-xs font-black text-cyan-500 uppercase tracking-[0.3em]">命理玄學映射</h3>
                  <span className="text-[10px] bg-cyan-950 text-cyan-400 px-4 py-1.5 rounded-full border border-cyan-400/30 font-black uppercase tracking-widest">
                    {analysis.dominantLevel}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/30 rounded-3xl border border-slate-800/40 flex flex-col items-center">
                    <div className="text-[9px] text-slate-500 mb-2 uppercase tracking-widest font-black">主導方位</div>
                    <div className="text-lg font-black text-white">{analysis.leadingDirection}</div>
                  </div>
                  <div className="p-4 bg-slate-900/30 rounded-3xl border border-slate-800/40 flex flex-col items-center">
                    <div className="text-[9px] text-slate-500 mb-2 uppercase tracking-widest font-black">主導顏色</div>
                    <div className="text-lg font-black text-white">{analysis.leadingColor}</div>
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="text-[10px] text-cyan-800 uppercase font-black tracking-widest flex items-center gap-2">
                     <div className="w-1 h-3 bg-cyan-800 rounded-full"></div>
                     生剋加權建議 (Weights)
                   </div>
                   <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-5 rounded-3xl border border-slate-900 italic font-medium">
                      {analysis.supplementaryAdvice}
                   </p>
                </div>

                <div className="pt-2">
                   <div className="text-[10px] text-cyan-600 uppercase font-black tracking-widest mb-4 flex items-center gap-2">
                      <div className="w-1 h-3 bg-cyan-600 rounded-full"></div>
                      天時地利綜合建議
                   </div>
                   <p className="text-base text-cyan-100 font-black leading-relaxed border-l-4 border-cyan-500/40 pl-5">
                      {analysis.suggestion}
                   </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 flex-none">
              <button 
                onClick={resetToSplash}
                className="glow-btn w-full bg-cyan-600 hover:bg-cyan-500 text-black font-black py-5 rounded-[28px] transition-all shadow-2xl shadow-cyan-900/50 text-lg tracking-[0.4em] uppercase"
              >
                [ 再起一卦 ]
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="w-full text-slate-600 font-bold py-3 text-xs uppercase tracking-[0.3em] hover:text-slate-400 transition-colors"
              >
                Terminate System
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
