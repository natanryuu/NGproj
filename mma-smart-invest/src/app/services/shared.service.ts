import { Injectable, EventEmitter } from '@angular/core';
import { YieldData, CommonInput, AllocationData, PreProjData } from '../interfaces/plan.interfaces';
import { TableYieldService } from './table-yield.service';
import { TablePreprojService } from './table-preproj.service';
import { TableAllocationService } from './table-allocation.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  INITIAL_RATIO = 6; // 600% 期初投入比率
  MONTHLY_RATIO = 0.2; // 20% 每月投入比率
  DEATHAGE_MALE = 80; // 死亡年齡(男)
  DEATHAGE_FEMALE = 85; // 死亡年齡(女)
  DEFAULT_RETIRE_AGE = 65; // 退休年齡
  SALARY_GROWTH_RATE = 0.015; // 1.5% 薪資成長率
  INCOME_REPLACE_RATIO = 0.5; // 50% 所得替代率
  DEFAULT_PERIOD = 5;
  DEFAULT_PERIOD_CUSTOM = 5;
  DEFAULT_PERIOD_SHOP = 5;
  DEFAULT_PERIOD_EDU = 18;
  DEFAULT_PERIOD_HOUSE = 8;
  DEFAULT_TARGET_AMOUNT_CUSTOM = 2000000;
  DEFAULT_TARGET_AMOUNT_SHOP = 1000000;
  DEFAULT_TARGET_AMOUNT_EDU = 5000000;
  DEFAULT_TARGET_AMOUNT_HOUSE = 3000000;

  componentName: EventEmitter<String> = new EventEmitter();
  modalShow: EventEmitter<Boolean> = new EventEmitter();
  element = (<HTMLElement>document.body);
  page_progress: EventEmitter<String> = new EventEmitter();
  page_next;
  emit_period: EventEmitter<Number> = new EventEmitter();
  emit_initial_amount: EventEmitter<Number> = new EventEmitter();
  emit_monthly_amount: EventEmitter<Number> = new EventEmitter();

  modal_container_class: EventEmitter<String> = new EventEmitter();
  backdrop_close_trigger = true;
  show_modal_close_btn: EventEmitter<Boolean> = new EventEmitter();
  modal_trigger_close: EventEmitter<Boolean> = new EventEmitter();

  activePlan;
  init_input: CommonInput;
  current_year = new Date().getFullYear();
  period;
  period_range = [];
  retire_age = this.DEFAULT_RETIRE_AGE;
  initial_table = [];
  default_ini_rsp_index;
  initial_amount;
  monthly_amount;
  target_amount_retire;
  target_amount_custom = this.DEFAULT_TARGET_AMOUNT_CUSTOM;
  death_age = {
    1: this.DEATHAGE_MALE,
    2: this.DEATHAGE_FEMALE
  };

  yield_data: YieldData;
  allocation_data: AllocationData;
  preproj_data: PreProjData;


  plans = {
    'assets-grow': '資產增值',
    'retire-plan': '退休規劃',
    'shop-funds': '開店基金',
    'buying-house': '購屋頭期',
    'childs-edu': '子女教育',
    'custom-plan': '自訂計畫'
  };

  gender = {
    1: '男性',
    2: '女性'
  };

  period_default_items = {
    'assets-grow': this.DEFAULT_PERIOD,
    'retire-plan': this.DEFAULT_PERIOD,
    'shop-funds': this.DEFAULT_PERIOD_SHOP,
    'buying-house': this.DEFAULT_PERIOD_HOUSE,
    'childs-edu': this.DEFAULT_PERIOD_EDU,
    'custom-plan': this.DEFAULT_PERIOD_CUSTOM
  };

  target_amount_default_items = {
    'shop-funds': this.DEFAULT_TARGET_AMOUNT_SHOP,
    'buying-house': this.DEFAULT_TARGET_AMOUNT_HOUSE,
    'childs-edu': this.DEFAULT_TARGET_AMOUNT_EDU,
    'custom-plan': this.DEFAULT_TARGET_AMOUNT_CUSTOM
  };

  constructor(
    private table_yield: TableYieldService,
    private table_preproj: TablePreprojService,
    private table_allocation: TableAllocationService,
    private http: HttpClient
  ) {
    this.setDefaultCommonInput();
    this.setInitInput();
    this.period = this.DEFAULT_PERIOD;
    this.setPeriodRange();

    this.emit_period.subscribe(data => {
      this.period = data;
      this.setPeriodRange();
      this.getTableData();
    });
    this.emit_initial_amount.subscribe(data => {
      this.initial_amount = data;
    });
    this.emit_monthly_amount.subscribe(data => {
      this.monthly_amount = data;
    });

    this.getTableData();
  }

  /**
   * period 年期資料
   * 是取得本 class 的 period
   * 從 plan-adjusts 那邊輸入進來的
   */

  setDefaultCommonInput() {
    this.init_input = {
      age: 32,
      gender: 1,
      income: 50000
    };
  }

  setPeriodRange() {
    this.period_range = Array.from({length: this.period + 1}, (v, k) => k + this.current_year);
  }

  setInitInput() {
    this.initial_amount = this.init_input.income * this.INITIAL_RATIO;
    this.monthly_amount = this.init_input.income * this.MONTHLY_RATIO;
    this.emit_period.emit(this.DEFAULT_PERIOD);
  }

  getTableData() {
    this.yield_data = this.table_yield.getYieldData(this.period);
    this.allocation_data = this.table_allocation.getAllocation(this.period);
    this.preproj_data = this.table_preproj.getPreProj(this.period);
  }

  getEquityRatio() { // 股債比
    const data = this.yield_data.EquityRatio;
    // console.log('getEquityRatio: ' + data);
    return data;
  }

  getAllocation() {
    const data = this.allocation_data.Allocation;
    // console.log(data);
    return data;
  }

  getFRRatio() { // 資金投入率
    const data = this.yield_data.FR;
    // console.log('getFRRatio: ' + data);
    return data;
  }

  getDiscountRate() { // 折現率
    const data = 0.1 * this.getEquityRatio() + 0.04 * ( 1 - this.getEquityRatio() );
    // console.log('getDiscountRate: ' + data);
    return data;
  }

  getDiscountFactor() { // 折現因子
    const data = 1 / ( 1 + ( this.getDiscountRate() / 12 ) );
    // console.log('getDiscountFactor: ' + data);
    return data;
  }

  getInvestAllocation() { // 投資配置
    const data = this.allocation_data.Allocation;
    // console.log('getInvestAllocation: ' + data);
    return data;
  }

  getPreProj() { // Allocation 前的 Proj 參數，參考 Excel 檔的 Projection Sheet 的第一隻金字塔表
    const data = this.preproj_data.PreProjection;
    // console.log('getPreProj: ' + data);
    return data;
  }

  getTimes() {
    const data = this.period * 12;
    // console.log('getTimes: ' + data);
    return data;
  }

  getNumerator() { // 分子，資產增值才用得到
    const data = this.initial_amount
                  + ( this.monthly_amount * this.getDiscountFactor() )
                  * ( 1 - Math.pow(this.getDiscountFactor(), this.getTimes()) )
                  / ( 1 - this.getDiscountFactor());
    // console.log('getNumerator: ' + data);
    return data;
  }

  getNumeratorForRetire() { // 退休規劃與其他自訂計劃的分子
    let data;
    if (this.activePlan === 'retire-plan') {
      data = this.target_amount_retire * this.getFRRatio();
    } else {
      data = this.target_amount_custom * this.getFRRatio();
    }
    // console.log(this.target_amount_retire, this.getFRRatio());
    return data;
  }

  getTargetAmount() {
    const data = this.getNumerator() / this.getFRRatio();
    // console.log('getTargetAmount: ' + data, this.getNumerator(), this.getFRRatio());
    return data;
  }

  getPreProj2() { // Allocation 前的第二隻 Proj 參數，看 Excel Projection Sheet 的第二隻金字塔表
    const proj_year = [];
    for (let $i = 1; $i <= this.period; $i++) {
      const proj_each = [];
      for (let $j = 0; $j < 5; $j += 2) {
        proj_each.push(this.processPreProj($i, $j));
      }
      proj_year.push(proj_each);
    }
    return proj_year;
  }

  getProjection() {
    const proj_year = this.getPreProj2();
    const projc = [];
    for (let $i = 0; $i < 4; $i++) { // 計算資產展望(較佳、一般、較差、投入本金)
      const per_projc = [];
      if ($i < 3) { // 計算較差($i=0)、一般($i=1)、較佳($i=2)
        for (let $j = 0; $j <= this.period; $j++) { // 計算 Porjection
          if ($j === 0) { // 第一年只有本金
            per_projc.push(this.initial_amount);
          } else { // 第二年起開始計算投報
            let temp = 0;
            // BQ22*(1+AJ22)+12*RSP+6*RSP*AJ22
            temp = per_projc[$j - 1] * ( 1 + proj_year[$j - 1][$i] )
                 + 12 * this.monthly_amount
                 + 6 * this.monthly_amount * proj_year[$j - 1][$i];
            per_projc.push(Math.round(temp));
          }
        }
      } else { // 計算投入本金($i=3)
        for (let $j = 0; $j <= this.period; $j++) {
          if ($j === 0) {
            per_projc.push(this.initial_amount);
          } else {
            per_projc.push(this.initial_amount + this.monthly_amount * 12 * $j);
          }
        }
      }
      projc.push(per_projc);
    }
    return projc;
  }

  processPreProj($i, $j) {
    if ($i === 1) {
      return this.preproj_data.PreProjection[$i][$j] / this.getFRRatio() - 1;
    } else {
      return this.preproj_data.PreProjection[$i][$j] / this.preproj_data.PreProjection[$i - 1][$j] - 1;
    }
  }

  getIniRSP() {
    let $i = 0, RSP = 0, current_FR = 0;
    const FR = this.getFRRatio();
    const min_RSP = 3000;
    const roundUp = this.roundUp;
    const times = this.getTimes();
    const numerator = this.getNumeratorForRetire();
    const discountFactor = this.getDiscountFactor();
    const target_amount = this.activePlan === 'retire-plan' ? this.target_amount_retire : this.target_amount_custom ;
    this.initial_table = [];

    do {
      if ($i > 1000 ) { break ; } // 防 bug 無限迴圈咬死
      RSP = $i <= 1 ? min_RSP * $i : min_RSP + ( $i - 1 ) * 1000;
      const $ini_amount = Math.max( 0,
        roundUp(
          numerator - RSP * discountFactor
          * ( 1 - Math.pow(discountFactor, ( 12 * this.period )))
          / ( 1 - discountFactor )
        , -4 )
      );
      current_FR = Math.floor(
        ( $ini_amount + RSP * discountFactor
          * ( 1 - Math.pow(discountFactor, times) )
          / ( 1 - discountFactor )
        ) / target_amount * 100
      );
      // console.log(numerator, RSP, discountFactor, this.period, times, target_amount);
      // console.log($ini_amount, current_FR, Math.round(FR * 100));
      if (current_FR !== Math.round(FR * 100)) {
        if (this.initial_table.length === 0) {
          this.initial_table.push({
            'ini': 0,
            'RSP': 0
          });
        }
        break;
      }
      this.initial_table.push({
        'ini': $ini_amount,
        'RSP': RSP,
        // 'FR': current_FR
      });
      $i++;
    } while (true);

    // find default option
    const threshold = Math.max(0, Math.min(10, (this.init_input.age - 34))) * this.init_input.income;
    const default_ini_rsp = this.initial_table.slice().reverse().findIndex(x => x['ini'] >= threshold);
    this.default_ini_rsp_index = this.initial_table.length - 1 - default_ini_rsp;
    // console.log(threshold, default_ini_rsp, this.default_ini_rsp_index, this.initial_table, 'default');
  }

  roundUp(num, precision) {
    precision = Math.pow(10, precision);
    return Math.ceil(num * precision) / precision;
  }

  setModalOptions() {
    this.modal_container_class.emit('in-plan');
    this.backdrop_close_trigger = false;
    this.show_modal_close_btn.emit(false);
  }

  // sendErrorReporting(err) {
  //   console.log(err);
  //   const client = atob('aHR0cHM6Ly9ob29rcy5zbGFjay5jb20vc2VydmljZXMvVEVLSjU2Tkc3L0JFSFVDMk00MS9iZ3JOTXVuaDc5MGxVN1hjeXJHcWNwcUQ=');
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-type': 'application/json'
  //     })
  //   };
  //   this.http.post(client, {'text': 'hi'}).subscribe();
  // }

}
