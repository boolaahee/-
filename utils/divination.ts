
import { 
  EarthlyBranches, 
  HeavenlyStems, 
  CalculationStep, 
  PositionsInOrder, 
  PalmPosition, 
  FiveElement, 
  ElementMap, 
  MetaphysicalAnalysis 
} from '../types';

export const getShiChen = (hours: number): number => {
  if (hours >= 23 || hours < 1) return 0;
  return Math.floor((hours + 1) / 2);
};

// Simplified Branch/Stem mapping for Small Liuren logic
const getBranchElement = (branchIdx: number): FiveElement => {
  const branch = EarthlyBranches[branchIdx];
  if (['寅', '卯'].includes(branch)) return '木';
  if (['巳', '午'].includes(branch)) return '火';
  if (['申', '酉'].includes(branch)) return '金';
  if (['亥', '子'].includes(branch)) return '水';
  return '土'; // 辰戌丑未
};

const getStemElement = (stemIdx: number): FiveElement => {
  const stem = HeavenlyStems[stemIdx];
  if (['甲', '乙'].includes(stem)) return '木';
  if (['丙', '丁'].includes(stem)) return '火';
  if (['戊', '己'].includes(stem)) return '土';
  if (['庚', '辛'].includes(stem)) return '金';
  return '水'; // 壬癸
};

const checkInteraction = (source: FiveElement, target: FiveElement): '生' | '剋' | '同' | '耗' | '洩' => {
  const sequence: FiveElement[] = ['木', '火', '土', '金', '水'];
  const sIdx = sequence.indexOf(source);
  const tIdx = sequence.indexOf(target);
  
  if (sIdx === tIdx) return '同';
  if ((sIdx + 1) % 5 === tIdx) return '生'; // source generates target
  if ((sIdx + 2) % 5 === tIdx) return '剋'; // source controls target
  if ((tIdx + 1) % 5 === sIdx) return '洩'; // target generates source
  return '耗'; // target controls source
};

export const performMetaphysicalAnalysis = (month: number, day: number, shiChen: number, result: PalmPosition): MetaphysicalAnalysis => {
  // Mapping inputs to Branches/Stems (Simplified remainder logic)
  const monthBranchIdx = (month + 1) % 12; // Standard: Month 1 is Yin (index 2)
  const dayStemIdx = (day - 1) % 10;
  const hourBranchIdx = shiChen;

  const envAttr = ElementMap[getBranchElement(monthBranchIdx)];
  const dayAttr = ElementMap[getStemElement(dayStemIdx)];
  const actionAttr = ElementMap[getBranchElement(hourBranchIdx)];

  let dominantLevel: '月份' | '日干' | '時辰' = '時辰';
  if ([PalmPosition.DAAN, PalmPosition.XIAOJI].includes(result)) dominantLevel = '日干';
  if ([PalmPosition.LIULIAN, PalmPosition.KONGWANG].includes(result)) dominantLevel = '月份';
  if ([PalmPosition.SUXI, PalmPosition.CHIKOU].includes(result)) dominantLevel = '時辰';

  const dominantAttr = dominantLevel === '日干' ? dayAttr : (dominantLevel === '月份' ? envAttr : actionAttr);
  
  // Logic for suggestion
  const inter1 = checkInteraction(dayAttr.element, dominantAttr.element);
  const inter2 = checkInteraction(actionAttr.element, dominantAttr.element);
  
  let suggestion = `今日卦象屬${dominantLevel}主導。`;
  if (inter1 === '生' || inter2 === '生') suggestion += "貴人相助，宜把握時機。";
  if (inter1 === '剋' || inter2 === '剋') suggestion += "氣勢受阻，宜守不宜進。";
  if (result === PalmPosition.CHIKOU) suggestion += " 且月份避忌，口舌之爭宜避之。";
  
  suggestion += ` 建議朝${dominantAttr.direction}行事，穿戴${dominantAttr.color}服飾可助運。`;

  return {
    monthBranch: EarthlyBranches[monthBranchIdx],
    dayStem: HeavenlyStems[dayStemIdx],
    hourBranch: EarthlyBranches[hourBranchIdx],
    envAttr,
    dayAttr,
    actionAttr,
    dominantLevel,
    suggestion
  };
};

export const calculateSteps = (month: number, day: number, shiChen: number): CalculationStep[] => {
  const steps: CalculationStep[] = [];
  let currentPos = 0;
  
  // Month
  let path1: number[] = [];
  for (let i = 0; i < month; i++) {
    path1.push(currentPos);
    if (i < month - 1) currentPos = (currentPos + 1) % 6;
  }
  steps.push({ title: '步驟一：月份定位', count: month, startIndex: 0, endIndex: currentPos, path: path1 });

  // Day
  let dayStart = currentPos;
  let path2: number[] = [];
  for (let i = 0; i < day; i++) {
    path2.push(currentPos);
    if (i < day - 1) currentPos = (currentPos + 1) % 6;
  }
  steps.push({ title: '步驟二：日期定位', count: day, startIndex: dayStart, endIndex: currentPos, path: path2 });

  // ShiChen
  const countShi = shiChen + 1;
  let shiStart = currentPos;
  let path3: number[] = [];
  for (let i = 0; i < countShi; i++) {
    path3.push(currentPos);
    if (i < countShi - 1) currentPos = (currentPos + 1) % 6;
  }
  steps.push({ title: '步驟三：時辰定位', count: countShi, startIndex: shiStart, endIndex: currentPos, path: path3 });

  return steps;
};
