export interface CommonInput {
  age: number;
  gender: number;
  income: number;
}

export interface InputAdjust {
  input_initial: number;
  input_monthly: number;
  input_period: number;
}

export interface YieldData {
  Period: number;
  EquityRatio: number;
  FR: number;
}

export interface AllocationData {
  Period: number;
  Allocation: object;
}

export interface PreProjData {
  Period: number;
  PreProjection: object;
}
