import { Injectable, EventEmitter } from '@angular/core';
import { CommonInput, Situations, IniRSPDollar, EquityExpo, BackProjection, BackProjectionHistory } from '../interfaces/plan.interfaces';
import { WebapiService } from './webapi.service';
import { ModalService } from './modal.service';
import { delay } from 'q';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { fail } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  run_fake = false;
  isDawho = false;
  isEvent = false;
  tkoValue; // 推廣員編
  hasTko = false;
  // run_fake = true;
  current_route = 'index';
  activePlan;
  page_progress: EventEmitter<String> = new EventEmitter();
  plan_name_set_success: EventEmitter<Boolean> = new EventEmitter();
  adjust_in_result_event: EventEmitter<Boolean> = new EventEmitter();

  init_input: CommonInput = {
    age: 35,
    gender: 'M',
    income: 50000
  };
  current_year = new Date().getFullYear();
  init_input_changed = false;
  value_adjusts_changed = false;
  in_result_adjusts_plan = false;
  input_age_max_limit = 100;
  input_age_min_limit = 1;
  back_proj_history_year_min = 1929;
  back_proj_history_year_max = this.current_year - 1;

  retirement_age; // 退休年齡
  target_dollar; // 目標金額
  pf_type; // 計劃代號：01：退休規劃，02：自訂計畫命名，03：旅遊基金，04：子女教育基金，05：購屋頭期款
  period_range; // 投資年期
  CalSeqNo; // 試算代碼
  plan_name; // 計劃名稱
  ipig_no = ''; // 撲滿編號
  ipig_type = ''; // 撲滿種類
  ini_rsp_dollar: Array<IniRSPDollar>; // 期初投入/每月投入 Array
  default_ini_rsp_index; // 期初投入/每月投入 最佳解 Array Index
  invest_start_year: Number; // 投資起始年
  back_proj_select_year; // 歷史模擬起始年
  back_proj_selected_year; // 歷史模擬已選擇的起始年
  min_age; // 退休年齡調整開始範圍
  max_age; // 退休年齡調整結束範圍
  return_equity_expo: EquityExpo;
  return_back_projections: Array<BackProjection>;
  return_back_projections_irr: Number;
  return_back_projection_histories: Array<BackProjectionHistory>;

  situation_poor: Array<Situations>;
  situation_poor_irr: Number;
  situation_generally: Array<Situations>;
  situation_generally_irr: Number;
  situation_better: Array<Situations>;
  situation_better_irr: Number;

  plans = {
    'retire-plan': '退休規劃',
    'trip-funds': '旅遊基金',
    'childs-edu': '子女教育',
    'buying-house': '購屋頭期',
    'custom-plan': '自訂計劃'
  };
  plans_of_pf_type = {
    'retire-plan': '01',
    'trip-funds': '03',
    'childs-edu': '04',
    'buying-house': '05',
    'custom-plan': '02'
  };

  gender = {
    'M': '男生',
    'F': '女生'
  };

  death_age = {
    'M': 78,
    'F': 84
  };

  constructor(
    private webapi: WebapiService,
    private modalsvc: ModalService,
    private router: Router,
    private cookie: CookieService
  ) { }

  /**
    ######                                                              #####                           #
    #     # ###### ##### # #####  ###### #    # ###### #    # #####    #     # ##### ###### #####      ##
    #     # #        #   # #    # #      ##  ## #      ##   #   #      #         #   #      #    #    # #
    ######  #####    #   # #    # #####  # ## # #####  # #  #   #       #####    #   #####  #    #      #
    #   #   #        #   # #####  #      #    # #      #  # #   #            #   #   #      #####       #
    #    #  #        #   # #   #  #      #    # #      #   ##   #      #     #   #   #      #           #
    #     # ######   #   # #    # ###### #    # ###### #    #   #       #####    #   ###### #         #####
  */

  getRetireStep1PostData() {
    const data = {
      'Gender': this.init_input.gender,
      'Age': this.init_input.age,
      'Salary': this.init_input.income,
      'RetirementAge': this.retirement_age,
      'TargetDollar': this.target_dollar
    };
    if (this.hasTko) {
      data['Tko_EmpNo'] = this.tkoValue;
    }
    return data;
  }

  callRetirement(post_data) {

    return new Promise((resolve, reject) => {
      if (this.run_fake) {
        this.retirement_age = '65';
        this.target_dollar = '5130000';
        this.period_range = '30';
        this.min_age = '38';
        this.max_age = '65';
        return resolve(true);
      }
      this.webapi.getRetirementStep1(post_data).subscribe(data => {
        // console.log('getRetirementStep1', post_data, data);
        if (data.Status === 'SUCCESS') {
          this.retirement_age = data.SvcRs['RsCollect'].RetirementAge;
          // 如果是從退休活動頁近來則 目標金額帶入參數值
          if (!this.isEvent) {
            this.target_dollar = data.SvcRs['RsCollect'].TargetDollar;
          }
          this.period_range = data.SvcRs['RsCollect'].RetirementYear;
          this.min_age = data.SvcRs['RsCollect'].RetirementStAge;
          this.max_age = data.SvcRs['RsCollect'].RetirementEdAge;
          return resolve(true);
        }
        reject(data.Message);
      });
    }).catch(err => {
      this.webapi.apiReturnError(err);
    });

  }


  /**
    ######                                                              #####                          #####
    #     # ###### ##### # #####  ###### #    # ###### #    # #####    #     # ##### ###### #####     #     #
    #     # #        #   # #    # #      ##  ## #      ##   #   #      #         #   #      #    #          #
    ######  #####    #   # #    # #####  # ## # #####  # #  #   #       #####    #   #####  #    #     #####
    #   #   #        #   # #####  #      #    # #      #  # #   #            #   #   #      #####     #
    #    #  #        #   # #   #  #      #    # #      #   ##   #      #     #   #   #      #         #
    #     # ######   #   # #    # ###### #    # ###### #    #   #       #####    #   ###### #         #######
   */

  getRetireStep2PostData() {
    const data = {
      'Gender': this.init_input.gender,
      'Age': this.init_input.age,
      'Salary': this.init_input.income,
      'RetirementAge': this.retirement_age,
      'TargetDollar': this.target_dollar,
      'PFType': this.pf_type
    };
    return data;
  }

  callRetirementIniRsp(post_data) {

    return new Promise((resolve, reject) => {
      if (this.run_fake) {
        this.CalSeqNo = '2019011100000001';
        this.target_dollar = '2000560';
        this.retirement_age = '65';
        this.period_range = Math.max(1, this.retirement_age - this.init_input.age);
        this.ini_rsp_dollar = [{
          InitialDollar: '630000',
          InitialSetting: 'false',
          RSPDollar: '0'
        },
        {
          InitialDollar: '150000',
          InitialSetting: 'false',
          RSPDollar: '5000'
        },
        {
          InitialDollar: '50000',
          InitialSetting: 'true',
          RSPDollar: '6000'
        }];
        this.default_ini_rsp_index = 2;
        return resolve(true);
      }
      this.webapi.getRetirementStep2(post_data).subscribe(data => {
        // console.log('getRetirementStep2', post_data, data);
        if (data.Status === 'SUCCESS') {
          this.CalSeqNo = data.SvcRs['RsCollect1'].CalSeqNo;
          this.target_dollar = data.SvcRs['RsCollect1'].TargetDollar;
          this.retirement_age = data.SvcRs['RsCollect1'].RetirementAge;
          this.period_range = Math.max(1, this.retirement_age - this.init_input.age);
          this.ini_rsp_dollar = data.SvcRs['RsCollect2'];
          // 如果是從退休行銷活動進來則 預設是 第六組 首次投入＆每月投入
          if (this.isEvent === false) {
            this.default_ini_rsp_index = data.SvcRs['RsCollect2'].findIndex(x => x['InitialSetting'] === 'true');
          }

          return resolve(true);
        } else {
          return resolve(data);
        }
      });
    }).catch(err => {
      this.webapi.apiReturnError(err);
    });

  }



  /**
     #####                                        #####                           #
    #     # #    #  ####  #####  ####  #    #    #     # ##### ###### #####      ##
    #       #    # #        #   #    # ##  ##    #         #   #      #    #    # #
    #       #    #  ####    #   #    # # ## #     #####    #   #####  #    #      #
    #       #    #      #   #   #    # #    #          #   #   #      #####       #
    #     # #    # #    #   #   #    # #    #    #     #   #   #      #           #
     #####   ####   ####    #    ####  #    #     #####    #   ###### #         #####
  */

  getCustomPlanStep1PostData() {
    const data = {
      'Gender': this.init_input.gender,
      'Age': this.init_input.age,
      'Salary': this.init_input.income,
      'PFType': this.pf_type, // 計劃代號：01：退休規劃，02：自訂計畫命名，03：旅遊基金，04：子女教育基金，05：購屋頭期款
      'PFName': this.plan_name,
      'TargetDollar': this.target_dollar,
      'InvestYear': this.period_range
    };
    return data;
  }

  callCustomPlanStep1(post_data) {

    return new Promise((resolve, reject) => {
      if (this.run_fake) {
        this.target_dollar = 2000000;
        this.period_range = 3;
        return resolve(true);
      }
      this.webapi.getCustomStep1(post_data).subscribe(data => {
        // console.log('getCustomStep1', post_data, data);
        if (data.Status === 'SUCCESS') {
          if (!this.isEvent) {
            this.target_dollar = data.SvcRs['RsCollect'].TargetDollar;
            this.period_range = data.SvcRs['RsCollect'].InvestYear;
          }
          return resolve(true);
        }
        reject(data.Message);
      });
    }).catch(err => {
      this.webapi.apiReturnError(err);
    });

  }

  /**
     #####                                        #####                          #####
    #     # #    #  ####  #####  ####  #    #    #     # ##### ###### #####     #     #
    #       #    # #        #   #    # ##  ##    #         #   #      #    #          #
    #       #    #  ####    #   #    # # ## #     #####    #   #####  #    #     #####
    #       #    #      #   #   #    # #    #          #   #   #      #####     #
    #     # #    # #    #   #   #    # #    #    #     #   #   #      #         #
     #####   ####   ####    #    ####  #    #     #####    #   ###### #         #######
  */

  getCustomPlanStep2PostData() {
    const data = {
      'Gender': this.init_input.gender,
      'Age': this.init_input.age,
      'Salary': this.init_input.income,
      'InvestYear': this.period_range, // 投資年期
      'TargetDollar': this.target_dollar, // 目標金額
      'PFType': this.pf_type, // 計劃代號： 01：退休規劃，02：自訂計畫命名，03：旅遊基金，04：子女教育基金，05：購屋頭期款
      'PFName': this.plan_name
    };
    return data;
  }

  callCustomPlanStep2(post_data) {
    return new Promise((resolve, reject) => {
      if (this.run_fake) {
        this.CalSeqNo = '2019011100000001';
        this.target_dollar = 2000000;
        this.ini_rsp_dollar = [{
          InitialDollar: '630000',
          InitialSetting: 'false',
          RSPDollar: '0'
        },
        {
          InitialDollar: '150000',
          InitialSetting: 'false',
          RSPDollar: '5000'
        },
        {
          InitialDollar: '50000',
          InitialSetting: 'true',
          RSPDollar: '6000'
        }];
        this.period_range = 3;
        this.default_ini_rsp_index = 0;
        return resolve(true);
      }
      this.webapi.getCustomStep2(post_data).subscribe(data => {
        // console.log('getCustomStep2', post_data, data);
        if (data.Status === 'SUCCESS') {
          this.CalSeqNo = data.SvcRs['RsCollect1'].CalSeqNo;
          this.target_dollar = data.SvcRs['RsCollect1'].TargetDollar;
          this.ini_rsp_dollar = data.SvcRs['RsCollect2'];
          this.period_range = data.SvcRs['RsCollect1'].InvestYear;
          this.default_ini_rsp_index = data.SvcRs['RsCollect2'].findIndex(x => x['InitialSetting'] === 'true');
          return resolve(true);
        } else {
          return resolve(data);
        }
      });
    }).catch(err => {
      this.webapi.apiReturnError(err);
    });

  }

  /**
    #######                                #######
    #        ####  #    # # ##### #   #    #       #    # #####   ####
    #       #    # #    # #   #    # #     #        #  #  #    # #    #
    #####   #    # #    # #   #     #      #####     ##   #    # #    #
    #       #  # # #    # #   #     #      #         ##   #####  #    #
    #       #   #  #    # #   #     #      #        #  #  #      #    #
    #######  ### #  ####  #   #     #      ####### #    # #       ####
  */

  getEquityExpoPostData() {
    const data = {
      'Gender': this.init_input.gender,
      'Age': this.init_input.age,
      'Salary': this.init_input.income,
      'InitialDollar': this.ini_rsp_dollar[this.default_ini_rsp_index].InitialDollar, // 期初投入
      'RSPDollar': this.ini_rsp_dollar[this.default_ini_rsp_index].RSPDollar, // 每月投入
      'TargetDollar': this.target_dollar,
      'PFType': this.pf_type,
      'PFName': this.plan_name,
      'RetirementAge': '',
      'InvestYear': ''
    };
    if (this.hasTko) {
      data['Tko_EmpNo'] = this.tkoValue;
    }
    if (this.pf_type === '01') {
      data['RetirementAge'] = this.retirement_age;
    } else {
      data['InvestYear'] = this.period_range;
    }
    // console.log(data);
    return data;
  }

  callEquityExpo(post_data) {

    return new Promise((resolve, reject) => {
      if (this.run_fake) {
        this.return_equity_expo = {
          CalSeqNo: '2019011100000001',
          InitialBondLRatio: 32.27,
          InitialBondMRatio: 45.33,
          InitialBondRatio: 12.00,
          InitialBondSRatio: 66.60,
          InitialDollar: 50000,
          InitialStockARatio: 60.00,
          InitialStockBRatio: 30.00,
          InitialStockCRatio: 10.00,
          InitialStockRatio: 88.00,
          RSPDollar: 6000,
          InitialStockA: 'VTI 先鋒整體股市ETF',
          InitialStockB: 'VEA 先鋒富時已開發股市ETF',
          InitialStockC: '',
          InitialBondL: 'SPTL：SPDR 投資組合長期美國公債ETF',
          InitialBondM: 'SCHR：SCHWAB 美國中期公債ETF',
          InitialBondS: 'SCHO：SCHWAB 短期美國公債ETF'
        };
        return resolve(true);
      }
      this.webapi.getEquityExpo(post_data).subscribe(data => {
        // console.log('getEquityExpo', post_data, data);
        if (data.Status === 'SUCCESS') {
          const ret_data = data.SvcRs['RsCollect'];
          Object.keys(ret_data).map((value) => {
            // tslint:disable-next-line: max-line-length
            if (value === 'CalSeqNo' || value === 'InitialStockA' || value === 'InitialStockB' || value === 'InitialStockC' || value === 'InitialBondL' || value === 'InitialBondM' || value === 'InitialBondS') {
              return false;
            }
            ret_data[value] = Number(ret_data[value]);
            return true;
          });
          this.return_equity_expo = ret_data;
          this.CalSeqNo = ret_data['CalSeqNo'];
          return resolve(true);
        }
        reject(data.Message);
      });
    }).catch(err => {
      this.webapi.apiReturnError(err);
    });

  }

  /**
    ######
    #     # #####   ####       # ######  ####  ##### #  ####  #    #
    #     # #    # #    #      # #      #    #   #   # #    # ##   #
    ######  #    # #    #      # #####  #        #   # #    # # #  #
    #       #####  #    #      # #      #        #   # #    # #  # #
    #       #   #  #    # #    # #      #    #   #   # #    # #   ##
    #       #    #  ####   ####  ######  ####    #   #  ####  #    #
   */

  getProjectionPostData() {
    const data = {
      'InitialDollar': this.ini_rsp_dollar[this.default_ini_rsp_index].InitialDollar, // 期初投入金額
      'RSPDollar': this.ini_rsp_dollar[this.default_ini_rsp_index].RSPDollar, // 每月投入金額
      'TargetDollar': this.target_dollar, // 目標金額
      'InvestYear': this.period_range // 投資年期
    };
    return data;
  }

  callProjection(post_data) {

    return new Promise((resolve, reject) => {
      if (this.run_fake) {
        this.situation_poor = [
          {
            years: 2019,
            TargetDollar: 125575,
            ActualDollar: 122000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2020,
            TargetDollar: 129934,
            ActualDollar: 194000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2021,
            TargetDollar: 135566,
            ActualDollar: 266000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2022,
            TargetDollar: 142408,
            ActualDollar: 338000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2023,
            TargetDollar: 150343,
            ActualDollar: 410000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2024,
            TargetDollar: 158937,
            ActualDollar: 482000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2025,
            TargetDollar: 168884,
            ActualDollar: 554000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2026,
            TargetDollar: 179991,
            ActualDollar: 626000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2027,
            TargetDollar: 192161,
            ActualDollar: 698000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2028,
            TargetDollar: 205523,
            ActualDollar: 770000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2029,
            TargetDollar: 220538,
            ActualDollar: 842000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2030,
            TargetDollar: 236392,
            ActualDollar: 914000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2031,
            TargetDollar: 255183,
            ActualDollar: 986000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2032,
            TargetDollar: 275036,
            ActualDollar: 1058000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2033,
            TargetDollar: 296476,
            ActualDollar: 1130000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2034,
            TargetDollar: 320754,
            ActualDollar: 1202000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2035,
            TargetDollar: 347034,
            ActualDollar: 1274000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2036,
            TargetDollar: 377683,
            ActualDollar: 1346000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2037,
            TargetDollar: 410764,
            ActualDollar: 1418000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2038,
            TargetDollar: 445195,
            ActualDollar: 1490000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2039,
            TargetDollar: 484045,
            ActualDollar: 1562000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2040,
            TargetDollar: 528134,
            ActualDollar: 1634000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2041,
            TargetDollar: 574758,
            ActualDollar: 1706000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2042,
            TargetDollar: 627328,
            ActualDollar: 1778000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2043,
            TargetDollar: 682275,
            ActualDollar: 1850000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2044,
            TargetDollar: 742284,
            ActualDollar: 1922000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2045,
            TargetDollar: 807224,
            ActualDollar: 1994000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2046,
            TargetDollar: 873469,
            ActualDollar: 2066000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2047,
            TargetDollar: 946435,
            ActualDollar: 2138000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2048,
            TargetDollar: 1023417,
            ActualDollar: 2210000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          }
        ];
        this.situation_generally = [
          {
            years: 2019,
            TargetDollar: 221206,
            ActualDollar: 122000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2020,
            TargetDollar: 236827,
            ActualDollar: 194000,
            RateReturn: null,
            StockRatio: 70.13,
            BondRatio: 29.87
          },
          {
            years: 2021,
            TargetDollar: 253291,
            ActualDollar: 266000,
            RateReturn: null,
            StockRatio: 50.13,
            BondRatio: 49.87
          },
          {
            years: 2022,
            TargetDollar: 270064,
            ActualDollar: 338000,
            RateReturn: null,
            StockRatio: 40.13,
            BondRatio: 59.87
          },
          {
            years: 2023,
            TargetDollar: 288564,
            ActualDollar: 410000,
            RateReturn: null,
            StockRatio: 30.13,
            BondRatio: 69.87
          },
          {
            years: 2024,
            TargetDollar: 307385,
            ActualDollar: 482000,
            RateReturn: null,
            StockRatio: 20.13,
            BondRatio: 79.87
          },
          {
            years: 2025,
            TargetDollar: 327695,
            ActualDollar: 554000,
            RateReturn: null,
            StockRatio: 10.13,
            BondRatio: 89.87
          },
          {
            years: 2026,
            TargetDollar: 349570,
            ActualDollar: 626000,
            RateReturn: null,
            StockRatio: 0.13,
            BondRatio: 99.87
          },
          {
            years: 2027,
            TargetDollar: 372903,
            ActualDollar: 698000,
            RateReturn: null,
            StockRatio: 80.13,
            BondRatio: 19.87
          },
          {
            years: 2028,
            TargetDollar: 398951,
            ActualDollar: 770000,
            RateReturn: null,
            StockRatio: 90.13,
            BondRatio: 9.87
          },
          {
            years: 2029,
            TargetDollar: 426613,
            ActualDollar: 842000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2030,
            TargetDollar: 457337,
            ActualDollar: 914000,
            RateReturn: null,
            StockRatio: 0.00,
            BondRatio: 100.00
          },
          {
            years: 2031,
            TargetDollar: 487292,
            ActualDollar: 986000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2032,
            TargetDollar: 521433,
            ActualDollar: 1058000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2033,
            TargetDollar: 555825,
            ActualDollar: 1130000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2034,
            TargetDollar: 594219,
            ActualDollar: 1202000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2035,
            TargetDollar: 636236,
            ActualDollar: 1274000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2036,
            TargetDollar: 680794,
            ActualDollar: 1346000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2037,
            TargetDollar: 726687,
            ActualDollar: 1418000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2038,
            TargetDollar: 775257,
            ActualDollar: 1490000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2039,
            TargetDollar: 824693,
            ActualDollar: 1562000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2040,
            TargetDollar: 878973,
            ActualDollar: 1634000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2041,
            TargetDollar: 933766,
            ActualDollar: 1706000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2042,
            TargetDollar: 989121,
            ActualDollar: 1778000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2043,
            TargetDollar: 1049366,
            ActualDollar: 1850000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2044,
            TargetDollar: 1109799,
            ActualDollar: 1922000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2045,
            TargetDollar: 1172722,
            ActualDollar: 1994000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2046,
            TargetDollar: 1237515,
            ActualDollar: 2066000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2047,
            TargetDollar: 1301734,
            ActualDollar: 2138000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2048,
            TargetDollar: 1369666,
            ActualDollar: 2210000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          }
        ];
        this.situation_better = [
          {
            years: 2019,
            TargetDollar: 326162,
            ActualDollar: 122000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2020,
            TargetDollar: 360978,
            ActualDollar: 194000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2021,
            TargetDollar: 394876,
            ActualDollar: 266000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2022,
            TargetDollar: 426867,
            ActualDollar: 338000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2023,
            TargetDollar: 460885,
            ActualDollar: 410000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2024,
            TargetDollar: 494631,
            ActualDollar: 482000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2025,
            TargetDollar: 529114,
            ActualDollar: 554000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2026,
            TargetDollar: 564879,
            ActualDollar: 626000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2027,
            TargetDollar: 603429,
            ActualDollar: 698000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2028,
            TargetDollar: 641574,
            ActualDollar: 770000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2029,
            TargetDollar: 681024,
            ActualDollar: 842000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2030,
            TargetDollar: 724933,
            ActualDollar: 914000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2031,
            TargetDollar: 771162,
            ActualDollar: 986000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2032,
            TargetDollar: 820904,
            ActualDollar: 1058000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2033,
            TargetDollar: 870194,
            ActualDollar: 1130000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2034,
            TargetDollar: 926223,
            ActualDollar: 1202000,
            RateReturn: null,
            StockRatio: 60.13,
            BondRatio: 39.87
          },
          {
            years: 2035,
            TargetDollar: 983955,
            ActualDollar: 1274000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2036,
            TargetDollar: 1044401,
            ActualDollar: 1346000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2037,
            TargetDollar: 1108030,
            ActualDollar: 1418000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2038,
            TargetDollar: 1182194,
            ActualDollar: 1490000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2039,
            TargetDollar: 1257422,
            ActualDollar: 1562000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2040,
            TargetDollar: 1344513,
            ActualDollar: 1634000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2041,
            TargetDollar: 1443948,
            ActualDollar: 1706000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2042,
            TargetDollar: 1558115,
            ActualDollar: 1778000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2043,
            TargetDollar: 1681519,
            ActualDollar: 1850000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2044,
            TargetDollar: 1834355,
            ActualDollar: 1922000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2045,
            TargetDollar: 2005349,
            ActualDollar: 1994000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2046,
            TargetDollar: 2189091,
            ActualDollar: 2066000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2047,
            TargetDollar: 2408158,
            ActualDollar: 2138000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          },
          {
            years: 2048,
            TargetDollar: 2637332,
            ActualDollar: 2210000,
            RateReturn: null,
            StockRatio: 100.00,
            BondRatio: 0.00
          }
        ];
        return resolve(true);
      }
      this.webapi.getProjection(post_data).subscribe(data => {
        // console.log('getProjection', post_data, data);
        if (data.Status === 'SUCCESS') {
          this.situation_poor_irr = data.SvcRs['RsCollect1'].IRR_1;
          this.situation_generally_irr = data.SvcRs['RsCollect1'].IRR_2;
          this.situation_better_irr = data.SvcRs['RsCollect1'].IRR_3;

          this.situation_poor = data.SvcRs['RsCollect2'].Situation1;
          this.situation_generally = data.SvcRs['RsCollect2'].Situation2;
          this.situation_better = data.SvcRs['RsCollect2'].Situation3;
          return resolve(true);
        }
        reject(data.Message);
      });
    }).catch(err => {
      this.webapi.apiReturnError(err);
    });

  }

  /**
    #     #                                                         #####
    #     # #  ####  #####  ####  #####  #  ####    ##   #         #     # # #    # #    # #        ##   ##### #  ####  #    #
    #     # # #        #   #    # #    # # #    #  #  #  #         #       # ##  ## #    # #       #  #    #   # #    # ##   #
    ####### #  ####    #   #    # #    # # #      #    # #          #####  # # ## # #    # #      #    #   #   # #    # # #  #
    #     # #      #   #   #    # #####  # #      ###### #               # # #    # #    # #      ######   #   # #    # #  # #
    #     # # #    #   #   #    # #   #  # #    # #    # #         #     # # #    # #    # #      #    #   #   # #    # #   ##
    #     # #  ####    #    ####  #    # #  ####  #    # ######     #####  # #    #  ####  ###### #    #   #   #  ####  #    #
  */

  getBackProjPostData() {
    const data = {
      'TargetDollar': this.target_dollar, // 目標金額
      'InitialDollar': parseInt(this.ini_rsp_dollar[this.default_ini_rsp_index].InitialDollar, 0), // 期初投入
      'RSPDollar': parseInt(this.ini_rsp_dollar[this.default_ini_rsp_index].RSPDollar, 0), // 每月投入
      'InvestYear': this.period_range, // 投資年期
      'InvestStYear': this.current_year - this.period_range - 1,
    };
    return data;
  }

  callBackProj(post_data) {
    return new Promise((resolve, reject) => {
      if (this.run_fake) {
        this.invest_start_year = 1922;
        this.return_back_projections = [{
          Years: 1922,
          TargetDollar: 5130000,
          TotalPV: 0.00,
          TotalInvestDollar: 0,
          StockRatio: 100.0,
          BondRatio: 0.00,
          EventName: ''
        },
        {
          Years: 1987,
          TargetDollar: 5130000,
          TotalPV: 0.00,
          TotalInvestDollar: 0,
          StockRatio: 100.0,
          BondRatio: 0.00,
          EventName: ''
        }, {
          Years: 1988,
          TargetDollar: 5130000,
          TotalPV: 0.00,
          TotalInvestDollar: 0,
          StockRatio: 100.0,
          BondRatio: 0.00,
          EventName: ''
        },
        {
          Years: 1989,
          TargetDollar: 5130000,
          TotalPV: 66074.00,
          TotalInvestDollar: 60000,
          StockRatio: 98.35,
          BondRatio: 1.65,
          EventName: ''
        },
        {
          Years: 1990,
          TargetDollar: 5130000,
          TotalPV: 149274.00,
          TotalInvestDollar: 120000,
          StockRatio: 95.30,
          BondRatio: 4.70,
          EventName: ''
        },
        {
          Years: 1991,
          TargetDollar: 5130000,
          TotalPV: 193131.00,
          TotalInvestDollar: 180000,
          StockRatio: 93.90,
          BondRatio: 6.10,
          EventName: ''
        },
        {
          Years: 1992,
          TargetDollar: 5130000,
          TotalPV: 306072.00,
          TotalInvestDollar: 240000,
          StockRatio: 89.75,
          BondRatio: 10.25,
          EventName: ''
        },
        {
          Years: 1993,
          TargetDollar: 5130000,
          TotalPV: 372540.00,
          TotalInvestDollar: 300000,
          StockRatio: 87.85,
          BondRatio: 12.15,
          EventName: ''
        },
        {
          Years: 1994,
          TargetDollar: 5130000,
          TotalPV: 495267.00,
          TotalInvestDollar: 360000,
          StockRatio: 84.00,
          BondRatio: 16.00,
          EventName: ''
        },
        {
          Years: 1995,
          TargetDollar: 5130000,
          TotalPV: 568814.00,
          TotalInvestDollar: 420000,
          StockRatio: 82.35,
          BondRatio: 17.65,
          EventName: ''
        },
        {
          Years: 1996,
          TargetDollar: 5130000,
          TotalPV: 788418.00,
          TotalInvestDollar: 480000,
          StockRatio: 75.80,
          BondRatio: 24.20,
          EventName: ''
        },
        {
          Years: 1997,
          TargetDollar: 5130000,
          TotalPV: 968568.00,
          TotalInvestDollar: 540000,
          StockRatio: 71.55,
          BondRatio: 28.45,
          EventName: '亞洲金融風暴'
        },
        {
          Years: 1998,
          TargetDollar: 5130000,
          TotalPV: 1226075.00,
          TotalInvestDollar: 600000,
          StockRatio: 67.60,
          BondRatio: 32.40,
          EventName: ''
        },
        {
          Years: 1999,
          TargetDollar: 5130000,
          TotalPV: 1551648.00,
          TotalInvestDollar: 660000,
          StockRatio: 67.95,
          BondRatio: 32.05,
          EventName: ''
        },
        {
          Years: 2000,
          TargetDollar: 5130000,
          TotalPV: 1850591.00,
          TotalInvestDollar: 720000,
          StockRatio: 70.75,
          BondRatio: 29.25,
          EventName: '網路泡沫破裂'
        },
        {
          Years: 2001,
          TargetDollar: 5130000,
          TotalPV: 1826243.00,
          TotalInvestDollar: 780000,
          StockRatio: 59.40,
          BondRatio: 40.60,
          EventName: ''
        },
        {
          Years: 2002,
          TargetDollar: 5130000,
          TotalPV: 1764650.00,
          TotalInvestDollar: 840000,
          StockRatio: 55.15,
          BondRatio: 44.85,
          EventName: ''
        },
        {
          Years: 2003,
          TargetDollar: 5130000,
          TotalPV: 1686752.00,
          TotalInvestDollar: 900000,
          StockRatio: 57.90,
          BondRatio: 42.10,
          EventName: ''
        },
        {
          Years: 2004,
          TargetDollar: 5130000,
          TotalPV: 2060592.00,
          TotalInvestDollar: 960000,
          StockRatio: 49.85,
          BondRatio: 50.15,
          EventName: ''
        },
        {
          Years: 2005,
          TargetDollar: 5130000,
          TotalPV: 2285988.00,
          TotalInvestDollar: 1020000,
          StockRatio: 46.20,
          BondRatio: 53.80,
          EventName: ''
        },
        {
          Years: 2006,
          TargetDollar: 5130000,
          TotalPV: 2462084.00,
          TotalInvestDollar: 1080000,
          StockRatio: 43.45,
          BondRatio: 56.55,
          EventName: ''
        },
        {
          Years: 2007,
          TargetDollar: 5130000,
          TotalPV: 2765198.00,
          TotalInvestDollar: 1140000,
          StockRatio: 39.65,
          BondRatio: 60.35,
          EventName: ''
        },
        {
          Years: 2008,
          TargetDollar: 5130000,
          TotalPV: 3033827.00,
          TotalInvestDollar: 1200000,
          StockRatio: 36.85,
          BondRatio: 63.15,
          EventName: '次級房貸風暴'
        },
        {
          Years: 2009,
          TargetDollar: 5130000,
          TotalPV: 2869639.00,
          TotalInvestDollar: 1260000,
          StockRatio: 39.20,
          BondRatio: 60.80,
          EventName: ''
        },
        {
          Years: 2010,
          TargetDollar: 5130000,
          TotalPV: 3155279.00,
          TotalInvestDollar: 1320000,
          StockRatio: 34.75,
          BondRatio: 65.25,
          EventName: '歐債危機'
        },
        {
          Years: 2011,
          TargetDollar: 5130000,
          TotalPV: 3454852.00,
          TotalInvestDollar: 1380000,
          StockRatio: 30.55,
          BondRatio: 69.45,
          EventName: ''
        },
        {
          Years: 2012,
          TargetDollar: 5130000,
          TotalPV: 3693793.00,
          TotalInvestDollar: 1440000,
          StockRatio: 27.95,
          BondRatio: 72.05,
          EventName: ''
        },
        {
          Years: 2013,
          TargetDollar: 5130000,
          TotalPV: 3963057.00,
          TotalInvestDollar: 1500000,
          StockRatio: 25.05,
          BondRatio: 74.95,
          EventName: ''
        },
        {
          Years: 2014,
          TargetDollar: 5130000,
          TotalPV: 4185585.00,
          TotalInvestDollar: 1560000,
          StockRatio: 22.85,
          BondRatio: 77.15,
          EventName: ''
        },
        {
          Years: 2015,
          TargetDollar: 5130000,
          TotalPV: 4512835.00,
          TotalInvestDollar: 1620000,
          StockRatio: 19.80,
          BondRatio: 80.20,
          EventName: '油價暴跌'
        },
        {
          Years: 2016,
          TargetDollar: 5130000,
          TotalPV: 4604741.00,
          TotalInvestDollar: 1680000,
          StockRatio: 18.90,
          BondRatio: 81.10,
          EventName: ''
        },
        {
          Years: 2017,
          TargetDollar: 5130000,
          TotalPV: 4774553.00,
          TotalInvestDollar: 1740000,
          StockRatio: 17.05,
          BondRatio: 82.95,
          EventName: ''
        },
        {
          Years: 2018,
          TargetDollar: 5130000,
          TotalPV: 5101060.00,
          TotalInvestDollar: 1800000,
          StockRatio: 0.00,
          BondRatio: 0.00,
          EventName: ''
        }
        ];
        this.return_back_projections_irr = 6.09;
        return resolve(true);
      }
      this.webapi.getBackProj(post_data).subscribe(data => {
        // console.log('getBackProj', post_data, data);
        if (data.Status === 'SUCCESS') {
          this.invest_start_year = Number(data.SvcRs['RsCollect1'].InvestStYear);
          this.return_back_projections = data.SvcRs['RsCollect2'];
          this.return_back_projections_irr = Number(data.SvcRs['RsCollect1'].IRR);
          return resolve(true);
        }
        reject(data.Message);
      });
    }).catch(err => {
      this.webapi.apiReturnError(err);
    });
  }

  /**
    #     #                                                        #     #
    #     # #  ####  #####  ####  #####  #  ####    ##   #          #   #  ######   ##   #####   ####
    #     # # #        #   #    # #    # # #    #  #  #  #           # #   #       #  #  #    # #
    ####### #  ####    #   #    # #    # # #      #    # #            #    #####  #    # #    #  ####
    #     # #      #   #   #    # #####  # #      ###### #            #    #      ###### #####       #
    #     # # #    #   #   #    # #   #  # #    # #    # #            #    #      #    # #   #  #    #
    #     # #  ####    #    ####  #    # #  ####  #    # ######       #    ###### #    # #    #  ####
   */

  getBackProjHistoryPostData() {
    const data = {
      'SelectYear': '' // 沒選就空白
    };
    return data;
  }

  callBackProjHistory(post_data) {

    return new Promise((resolve, reject) => {
      if (this.run_fake) {
        this.return_back_projection_histories = [
          {
            Years: 1929,
            EventName: '經濟大蕭條'
          },
          {
            Years: 1973,
            EventName: '石油危機'
          },
          {
            Years: 1980,
            EventName: '拉美債務危機'
          },
          {
            Years: 1987,
            EventName: '美國儲貸危機'
          },
          {
            Years: 1997,
            EventName: '亞洲金融風暴'
          },
          {
            Years: 2000,
            EventName: '網路泡沫破裂'
          },
          {
            Years: 2008,
            EventName: '次級房貸風暴'
          },
          {
            Years: 2010,
            EventName: '歐債危機'
          },
          {
            Years: 2015,
            EventName: '油價暴跌'
          }
        ];
        return resolve(true);
      }
      this.webapi.getBackProjHistory(post_data).subscribe(data => {
        // console.log('getBackProjHistory', post_data, data);
        if (data.Status === 'SUCCESS') {
          this.return_back_projection_histories = data.SvcRs['RsCollect2'];
          return resolve(true);
        }
        reject(data.Message);
      });
    }).catch(err => {
      this.webapi.apiReturnError(err);
    });
  }

  /**
     #####                          #     #
    #     # ###### #    # #####     ##   ##   ##   # #
    #       #      ##   # #    #    # # # #  #  #  # #
     #####  #####  # #  # #    #    #  #  # #    # # #
          # #      #  # # #    #    #     # ###### # #
    #     # #      #   ## #    #    #     # #    # # #
     #####  ###### #    # #####     #     # #    # # ######
  */

  getSendMailPostData() {
    const data = {
      'Email': '',
      'CalSeqNo': this.CalSeqNo, // 步驟二的時候會回傳，要記下來
      'CaptchaNo': '' // 圖形驗證碼
    };
    return data;
  }

  callSendMail(post_data) {

    return new Promise((resolve, reject) => {
      this.webapi.sendMail(post_data).subscribe(data => {
        if (data.Status === 'SUCCESS') {
          // console.log('sendMail', post_data, data);
          return resolve(true);
        } else {
          return resolve(data.Message);
        }
      });
    }).catch(err => {
      this.webapi.apiReturnError(err);
    });

  }

  /**
     #####                          ######
    #     #   ##   #      #         #     # ######  ####  #    # #      #####  ####
    #        #  #  #      #         #     # #      #      #    # #        #   #
    #       #    # #      #         ######  #####   ####  #    # #        #    ####
    #       ###### #      #         #   #   #           # #    # #        #        #
    #     # #    # #      #         #    #  #      #    # #    # #        #   #    #
     #####  #    # ###### ######    #     # ######  ####   ####  ######   #    ####
   */
  async callResults() {
    const post_data_ee = this.getEquityExpoPostData();
    const post_data_pj = this.getProjectionPostData();
    const post_data_pj_his = this.getBackProjHistoryPostData();
    const post_data_pj_bak = this.getBackProjPostData();
    await Promise.all([
      this.callEquityExpo(post_data_ee),
      this.callProjection(post_data_pj),
      this.callBackProjHistory(post_data_pj_his),
      this.callBackProj(post_data_pj_bak)
    ])
      .then(async (values) => {
        this.modalsvc.modal_trigger_close.emit(true);
        await delay(300);
        this.router.navigate(['/trailcalc/results/', this.activePlan]);

      }, reason => {
        console.error(reason);
      });
  }

  /**
    #     # ###  #####   #####
    ##   ##  #  #     # #     #
    # # # #  #  #       #
    #  #  #  #   #####  #
    #     #  #        # #
    #     #  #  #     # #     #
    #     # ###  #####   #####
   */

  callCaptcha() {
    return this.webapi.getCaptchaCode();
  }

  /** Show Adjusts Lightbox */
  async showValueAdjusts() {
    this.modalsvc.modal_trigger_close.emit(true);
    await delay(300);
    this.modalsvc.componentName.emit('value-adjusts');
    this.modalsvc.modalInPlan({
      autofit: true
    });
  }

  /** Show Adjusts Lightbox */
  async showInvestWarnings() {
    this.modalsvc.componentName.emit('warnings');
    this.modalsvc.modal_container_class.emit('modal-warnings');

  }

  /** Show Adjusts Lightbox */
  async showSPinfos() {
    this.modalsvc.componentName.emit('sp-info');
    this.modalsvc.modal_container_class.emit('modal-sp-info');
    this.modalsvc.modal_container_class_back.emit('modal-sp-info');
  }
  getRangeForAreaChart() {
    return Array.from({ length: this.period_range + 1 }, (v, k) => k + this.current_year);
  }

  async trailCalc(init_input) {
    if (!this.run_fake) {
      this.modalsvc.componentName.emit('loading');
      await delay(1500);
      this.modalsvc.modal_trigger_close.emit(true);
      await delay(250);
    }
    this.init_input = init_input;
    this.init_input_changed = true;
    this.setStartInvestPlanDataLayer();
    this.router.navigate(['/trailcalc']);

  }

  setCalSeqNoCookie() {
    // console.log('setCalSeqNoCookie')
    if (!!location.hostname.match(/mma\.sinopac\.com/g) || !!location.hostname.match(/sinopac\.com/g)) {
      this.cookie.set('sinopac_aiCalSeqNo', this.CalSeqNo, undefined, '/', 'sinopac.com', null, null);
      this.cookie.set('sinopac_aiCalSeqNo', this.CalSeqNo, undefined, '/', 'mma.sinopac.com', null, null);
    } else {
      this.cookie.set('sinopac_aiCalSeqNo', this.CalSeqNo, undefined, '/', null, null, null);
      // console.log(this.CalSeqNo);
      // console.log(this.cookie.get('sinopac_aiCalSeqNo'));
    }
  }

  setIncomeDefaultList() {
    const values: Array<any> = [];
    for (let $i = 5000; $i <= 500000; $i += 5000) {
      if ($i <= 60000) {
        values.push($i);
      } else if (($i / 5000) % 2 === 1) {
        continue;
      } else {
        values.push($i);
      }
    }
    return values;
  }

  openInitInput() {
    this.modalsvc.componentName.emit('init-input');
    this.modalsvc.modalAutoFit();
  }

  fixAge() {
    this.init_input.age = Number(parseInt(String(this.init_input.age), 0));
    if (this.init_input.age < this.input_age_min_limit) {
      this.init_input.age = this.input_age_min_limit;
    }
    if (this.init_input.age > this.input_age_max_limit) {
      this.init_input.age = this.input_age_max_limit;
    }
  }

  validateEmail(email) {
    // tslint:disable-next-line:max-line-length
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  isSinopacApp() {
    // return true;
    const ua = navigator.userAgent;
    if (ua.indexOf('Sinopac mobilebanking') > -1) {
      return true;
    }
    return false;
  }


  isDawhoApp() {
    if (location.href.indexOf('dawho') > -1) {
        return true;
    }
    return false;
  }
  CheckhasTko() {
    if (location.href.indexOf('Tko_EmpNo') > -1) {
      let tko = '';
      const ary = location.href.split('?')[1].split('&');
      for (let i = 0; i <= ary.length - 1; i++) {
        if (ary[i].split('=')[0] === 'Tko_EmpNo') {
          tko = decodeURI(ary[i].split('=')[1]);
        }
      }
      if ( ary.indexOf('Tko_EmpNo')) {
        this.tkoValue = tko;
      }
      return true;
    }
      return false;
  }

  setStartInvestPlanDataLayer() {
    const data = {
      event: 'start-invest-plan',
      gender: this.init_input.gender,
      age: this.init_input.age,
      salary: this.init_input.income
    };
    this.setDataLayer(data);
  }

  setInvestPlanSubmitDataLayer() {
    const data = {
      event: 'invest-plan-submit',
      year: this.period_range,
      amount: this.target_dollar
    };
    this.setDataLayer(data);
  }

  setSimulateInsertDataLayer(item) {
    const data = {
      event: 'simulate-insert',
      'simulate-year': item
    };
    this.setDataLayer(data);
  }

  setLaunchNotificationDataLayer() {
    const data = {
      event: 'launch-notification'
    };
    this.setDataLayer(data);
  }

  setDataLayer(obj) {
    window['dataLayer'] = window['dataLayer'] || [];
    window['dataLayer'].push(obj);
  }

}
