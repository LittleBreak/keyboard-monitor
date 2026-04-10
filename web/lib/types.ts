export interface DailyStats {
  date: string;
  totalCount: number;
  uniqueKeys: number;
  topCombo: string | null;
  topComboCount: number;
  keys: KeyCount[];
  combos: ComboCount[];
}

export interface KeyCount {
  keyName: string;
  count: number;
}

export interface ComboCount {
  combo: string;
  count: number;
}

export interface DailyTotal {
  date: string;
  count: number;
}
