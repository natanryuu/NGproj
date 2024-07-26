export interface CommonInput {
  age: number;
  gender: string;
  income: number;
}

export interface ApiReturnData {
  Message: string;
  Status: string;
  SvcRs: Array<any>;
}

export interface Situations {
  years: number; // 年期西元年
  TargetDollar: number; // 目標金額
  ActualDollar: number; // 實際投入金額
  RateReturn: number; // 報酬率
  StockRatio: number; // 股票比例
  BondRatio: number; // 債券比例
}

export interface IniRSPDollar {
  InitialDollar: string;
  RSPDollar: string;
  InitialSetting: string;
}

export interface EquityExpo {
  InitialStockRatio: number; // 股票比例
  InitialBondRatio: number; // 債券比例
  InitialDollar: number; // 期初投入
  RSPDollar: number; // 每月投入
  CalSeqNo: string; // 試算代號
  InitialStockARatio: number; // 美國 ETF 投資比例
  InitialStockBRatio: number; // 非美已開發股市投資比例
  InitialStockCRatio: number; // 新興市場股市投資比例
  InitialBondLRatio: number; // 長期政府公債投資比例
  InitialBondMRatio: number; // 中期政府公債投資比例
  InitialBondSRatio: number; // 短期政府公債投資比例
  InitialStockA: string; // VTI 先鋒整體股市ETF
  InitialStockB: string; // VEA 先鋒富時已開發股市ETF
  InitialStockC: string;
  InitialBondL: string; // SPTL：SPDR 投資組合長期美國公債ETF
  InitialBondM: string; // SCHR：SCHWAB 美國中期公債ETF
  InitialBondS: string; // SCHO：SCHWAB 短期美國公債ETF
}

export interface ModalOptions {
  autofit: boolean;
}

export interface BackProjection {
  Years: number; // 年分
  TargetDollar: number; // 目標金額
  TotalPV: number; // 現值
  TotalInvestDollar: number; // 投入信託本金
  StockRatio: number; // 股票配置比重
  BondRatio: number; // 股票配置比重
  EventName: string; // 重大事件名稱
}

export interface BackProjectionHistory {
  Years: number; //年分
  EventName: string; //重大事件名稱
}
