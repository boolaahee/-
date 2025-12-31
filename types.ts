
export enum PalmPosition {
  DAAN = '大安',
  LIULIAN = '留連',
  SUXI = '速喜',
  CHIKOU = '赤口',
  XIAOJI = '小吉',
  KONGWANG = '空亡'
}

export const PalmMeanings: Record<PalmPosition, string> = {
  [PalmPosition.DAAN]: '諸事順利',
  [PalmPosition.LIULIAN]: '運氣平平',
  [PalmPosition.SUXI]: '時機已到',
  [PalmPosition.CHIKOU]: '謹防小人',
  [PalmPosition.XIAOJI]: '好事發生，耐心等待',
  [PalmPosition.KONGWANG]: '諸事不順，事事小心'
};

export type FiveElement = '木' | '火' | '土' | '金' | '水';

export interface ElementAttr {
  element: FiveElement;
  direction: string;
  color: string;
  colorHex: string;
}

export const ElementMap: Record<FiveElement, ElementAttr> = {
  '木': { element: '木', direction: '東方', color: '青色', colorHex: '#10b981' },
  '火': { element: '火', direction: '南方', color: '紅色', colorHex: '#ef4444' },
  '土': { element: '土', direction: '中央', color: '黃色', colorHex: '#f59e0b' },
  '金': { element: '金', direction: '西方', color: '白色', colorHex: '#f8fafc' },
  '水': { element: '水', direction: '北方', color: '黑色', colorHex: '#334155' }
};

export const EarthlyBranches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
export const HeavenlyStems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

export const PositionsInOrder: PalmPosition[] = [
  PalmPosition.DAAN,
  PalmPosition.LIULIAN,
  PalmPosition.SUXI,
  PalmPosition.CHIKOU,
  PalmPosition.XIAOJI,
  PalmPosition.KONGWANG
];

export interface CalculationStep {
  title: string;
  count: number;
  startIndex: number;
  endIndex: number;
  path: number[];
}

export interface MetaphysicalAnalysis {
  monthBranch: string;
  dayStem: string;
  hourBranch: string;
  envAttr: ElementAttr;
  dayAttr: ElementAttr;
  actionAttr: ElementAttr;
  dominantLevel: '月份' | '日干' | '時辰';
  suggestion: string;
  leadingDirection: string;
  leadingColor: string;
  supplementaryAdvice: string;
}
