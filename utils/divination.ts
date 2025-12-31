
import solarLunar from 'solarlunar';
import { 
  EarthlyBranches, 
  HeavenlyStems, 
  PalmPosition, 
  FiveElement, 
  ElementMap, 
  MetaphysicalAnalysis,
  CalculationStep,
  PositionsInOrder
} from '../types';

/**
 * Gregorian Date/Time to Lunar and ShiChen index
 */
export function convertToLunarDate(year: number, month: number, day: number, hour: number) {
  const lunarData = solarLunar.solar2lunar(year, month, day);
  const shiIndex = getShiChen(hour);

  return {
    solar: { year, month, day, hour },
    lunar: {
      year: lunarData.lYear,
      month: lunarData.lMonth,
      day: lunarData.lDay,
      monthCn: lunarData.monthCn,
      dayCn: lunarData.dayCn,
      gzYear: lunarData.gzYear,
      gzMonth: lunarData.gzMonth,
      gzDay: lunarData.gzDay,
      zodiac: lunarData.animal
    },
    shiIndex
  };
}

/**
 * Gregorian Hour -> Earthly Branch Index (0-11)
 */
export const getShiChen = (hours: number): number => {
  if (hours >= 23 || hours < 1) return 0; // 子
  return Math.floor((hours + 1) / 2);
};

/**
 * Mapping Branches to Elements
 */
const getBranchElement = (branch: string): FiveElement => {
  if (['寅', '卯'].includes(branch)) return '木';
  if (['巳', '午'].includes(branch)) return '火';
  if (['申', '酉'].includes(branch)) return '金';
  if (['亥', '子'].includes(branch)) return '水';
  return '土'; // 辰戌丑未
};

/**
 * Mapping Stems to Elements
 */
const getStemElement = (stem: string): FiveElement => {
  if (['甲', '乙'].includes(stem)) return '木';
  if (['丙', '丁'].includes(stem)) return '火';
  if (['庚', '辛'].includes(stem)) return '金';
  if (['壬', '癸'].includes(stem)) return '水';
  return '土'; // 戊己
};

/**
 * Five Elements Interaction Check
 */
const checkInteraction = (source: FiveElement, target: FiveElement): '生' | '剋' | '同' | '洩' | '耗' => {
  const seq: FiveElement[] = ['木', '火', '土', '金', '水'];
  const sIdx = seq.indexOf(source);
  const tIdx = seq.indexOf(target);
  
  if (sIdx === tIdx) return '同';
  if ((sIdx + 1) % 5 === tIdx) return '生'; // source generates target
  if ((sIdx + 2) % 5 === tIdx) return '剋'; // source controls target
  if ((tIdx + 1) % 5 === sIdx) return '洩'; // target generates source
  return '耗'; // target controls source
};

/**
 * Core Small Liuren Calculation Steps
 */
export const calculateSteps = (month: number, day: number, shiIndex: number): CalculationStep[] => {
  const steps: CalculationStep[] = [];
  
  // Step 1: Month
  const monthStart = 0;
  const monthPath: number[] = [];
  for (let i = 0; i < month; i++) {
    monthPath.push((monthStart + i) % 6);
  }
  const monthEnd = (monthStart + month - 1) % 6;
  steps.push({ title: '步驟一：月份定位', count: month, startIndex: monthStart, endIndex: monthEnd, path: monthPath });

  // Step 2: Day
  const dayStart = monthEnd;
  const dayPath: number[] = [];
  for (let i = 0; i < day; i++) {
    dayPath.push((dayStart + i) % 6);
  }
  const dayEnd = (dayStart + day - 1) % 6;
  steps.push({ title: '步驟二：日期定位', count: day, startIndex: dayStart, endIndex: dayEnd, path: dayPath });

  // Step 3: Shi
  const shiCount = shiIndex + 1;
  const shiStart = dayEnd;
  const shiPath: number[] = [];
  for (let i = 0; i < shiCount; i++) {
    shiPath.push((shiStart + i) % 6);
  }
  const shiEnd = (shiStart + shiCount - 1) % 6;
  steps.push({ title: '步驟三：時辰定位', count: shiCount, startIndex: shiStart, endIndex: shiEnd, path: shiPath });

  return steps;
};

/**
 * Metaphysical Analysis Integration
 */
export const performMetaphysicalAnalysis = (
  month: number, 
  day: number, 
  shi: number, 
  result: PalmPosition,
  gzMonth: string,
  gzDay: string
): MetaphysicalAnalysis => {
  // Extract month branch (e.g., "乙亥" -> "亥")
  const mBranch = gzMonth.charAt(gzMonth.length - 1);
  const dStem = gzDay.charAt(0);
  const hBranch = EarthlyBranches[shi];

  const envAttr = ElementMap[getBranchElement(mBranch)];
  const dayAttr = ElementMap[getStemElement(dStem)];
  const actionAttr = ElementMap[getBranchElement(hBranch)];

  let dominantLevel: '月份' | '日干' | '時辰' = '時辰';
  let avoidanceNote = "";

  if (result === PalmPosition.SUXI) dominantLevel = '時辰';
  else if ([PalmPosition.DAAN, PalmPosition.XIAOJI].includes(result)) dominantLevel = '日干';
  else if ([PalmPosition.LIULIAN, PalmPosition.KONGWANG].includes(result)) dominantLevel = '月份';
  else if (result === PalmPosition.CHIKOU) {
    dominantLevel = '時辰';
    avoidanceNote = " + 月份避忌";
  }

  const dominantAttr = dominantLevel === '日干' ? dayAttr : (dominantLevel === '月份' ? envAttr : actionAttr);
  
  // Weights based on interaction with dominant element
  let weightAdvice = "";
  const levels = [
    { name: '環境', attr: envAttr },
    { name: '主氣', attr: dayAttr },
    { name: '行動', attr: actionAttr }
  ];

  levels.forEach(l => {
    if (l.attr.element === dominantAttr.element) return;
    const interaction = checkInteraction(l.attr.element, dominantAttr.element);
    if (interaction === '生') weightAdvice += `「${l.name}」助勢，${l.attr.direction}之氣相生，宜把握。 `;
    if (interaction === '剋') weightAdvice += `「${l.name}」受阻，${l.attr.direction}之氣相剋，宜避。 `;
  });

  const tips: Record<PalmPosition, string> = {
    [PalmPosition.DAAN]: "事事昌隆，求謀在東方，求財利官。宜靜守、長遠佈局。",
    [PalmPosition.LIULIAN]: "難成之事，暫且擱置，需等申時或改日。宜耐心等待，不宜強求。",
    [PalmPosition.SUXI]: "喜訊已在途中，求財向南。宜迅速行動，事不宜遲。",
    [PalmPosition.CHIKOU]: "口舌是非，謹防官非。宜避開尖銳爭執，行事低調。",
    [PalmPosition.XIAOJI]: "貴人相助，合夥利成。宜主動交流，必有好事發生。",
    [PalmPosition.KONGWANG]: "諸事空亡，財物失脫。宜反省修身，靜待時變。"
  };

  const suggestion = tips[result] + ` 今日關鍵主導在於${dominantLevel}${avoidanceNote}。`;

  return {
    monthBranch: mBranch,
    dayStem: dStem,
    hourBranch: hBranch,
    envAttr,
    dayAttr,
    actionAttr,
    dominantLevel: (dominantLevel + avoidanceNote) as any,
    suggestion,
    leadingDirection: dominantAttr.direction,
    leadingColor: dominantAttr.color,
    supplementaryAdvice: weightAdvice || "五行平穩，順其自然。"
  };
};
