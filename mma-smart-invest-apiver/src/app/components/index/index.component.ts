import { Component, OnInit, HostListener } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ModalService } from '../../services/modal.service';
import { CommonInput } from '../../interfaces/plan.interfaces';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  init_input: CommonInput;
  income_lists;

  @HostListener('window:resize', ['$event'])
  onresize(event) {
  }

  constructor(
    public shared: SharedService,
    private router: Router,
    private modalsvc: ModalService
  ) { }

  ngOnInit() {
    this.shared.current_route = 'index';
    this.income_lists = this.shared.setIncomeDefaultList();
    this.init_input = this.shared.init_input;
    this.isFromDawhoAd();
    this.isFromEvent();
  }

  openInitInput() {
    this.modalsvc.componentName.emit('init-input');
    this.modalsvc.modalAutoFit();
  }

  clearValue(e) {
    e.target.value = '';
  }

  recoveryValue(e) {
    if (e.target.value === '') {
      e.target.value = this.init_input.age;
    }
  }

  async trailCalc() {
    if (!this.init_input.age) {
      this.modalsvc.loadingText('請輸入年齡');
      this.modalsvc.componentName.emit('messages');
      this.modalsvc.msg_type = 'error';
      this.modalsvc.modalAutoFit();
      return false;
    }
    await this.shared.trailCalc(this.init_input);
  }

  // 判斷網址是否帶有參數並解析，得知是否從撲滿來
  isFromEvent() {
    const url = location.href;
    if (url.indexOf('retire') !== -1) {
      this.shared.isEvent = true;
      let Gender = '';
      let Age = '';
      let Salary = '';
      let RetirementAge = '';
      let InvestYear = '';
      let TargetDollar = '';
      let Tko_EmpNo = '';
      let IniRspGrp = '';
      const ary = url.split('?')[1].split('&');
      for (let i = 0; i <= ary.length - 1; i++) {
        // if (ary[i].split('=')[0] == 'PFName')
        //   PFName = decodeURI(ary[i].split('=')[1]);
        if (ary[i].split('=')[0] === 'Gender') { Gender = decodeURI(ary[i].split('=')[1]); }
        if (ary[i].split('=')[0] === 'Age') {
          Age = ary[i].split('=')[1];
        }
        if (ary[i].split('=')[0] === 'Salary') {
          Salary = ary[i].split('=')[1];
        }
        if (ary[i].split('=')[0] === 'RetirementAge') {
          RetirementAge = ary[i].split('=')[1];
        }
        if (ary[i].split('=')[0] === 'InvestYear') {
          InvestYear = ary[i].split('=')[1];
        }
        if (ary[i].split('=')[0] === 'TargetDollar') {
          TargetDollar = ary[i].split('=')[1];
        }
        if (ary[i].split('=')[0] === 'Tko_EmpNo') {
          Tko_EmpNo = ary[i].split('=')[1];
        }
        if (ary[i].split('=')[0] === 'IniRspGrp') {
          IniRspGrp = ary[i].split('=')[1];
        }
      }
      // tslint:disable-next-line:max-line-length
      if ( ary.indexOf('Gender') && ary.indexOf('Age') && ary.indexOf('Salary') && ary.indexOf('RetirementAge')  && ary.indexOf('TargetDollar') && ary.indexOf('InvestYear')) {
        // tslint:disable-next-line: max-line-length
        console.log( Gender + ',' + Age + ',' + Salary + ',' + RetirementAge + ',' + TargetDollar + ',' +  InvestYear + ',' + IniRspGrp + ',' + Tko_EmpNo);
        this.router.navigate(['/trailcalc']);
        this.setRetirePlanValue(Gender, Age, Salary, RetirementAge , TargetDollar , InvestYear , IniRspGrp, Tko_EmpNo);
      }
    }
  }

  // 解析網址後，將參數帶入欄位並顯示
  async setRetirePlanValue(Gender, Age, Salary, RetirementAge, TargetDollar, InvestYear , IniRspGrp , Tko_EmpNo) {
    this.shared.pf_type = '01';
    this.shared.plan_name = '退休規劃';
    this.shared.activePlan = 'retire-plan';
    this.modalsvc.componentName.emit('loading');
    this.shared.init_input.gender = Gender;
    this.shared.init_input.age = Age;
    this.shared.retirement_age = RetirementAge;
    this.shared.init_input.income = Salary;
    this.shared.period_range = InvestYear;
    this.shared.target_dollar = TargetDollar * 10000;
    if (Tko_EmpNo) {
      this.shared.hasTko = true;
      this.shared.tkoValue = Tko_EmpNo;
    }
    if (IniRspGrp) {
      this.shared.default_ini_rsp_index = IniRspGrp;
    } else {
      this.shared.default_ini_rsp_index = 5;
    }
    const post_data1 = this.shared.getRetireStep1PostData();
    const step1_returns = await this.shared.callRetirement(post_data1);
    if (!step1_returns) { return false; }
    const post_data2 = this.shared.getRetireStep2PostData();
    const step2_returns = await this.shared.callRetirementIniRsp(post_data2);
    if (!step2_returns) { return false; }
    this.shared.showValueAdjusts();
  }

  // 判斷網址是否帶有參數並解析，得知是否從撲滿來
  isFromDawhoAd() {
    const url = location.href;
    if (url.indexOf('dawho') !== -1) {
      this.shared.isEvent = true;
      let PFName = '';
      let TargetDollar = '';
      let InvestYear = '';
      const ary = url.split('?')[1].split('&');
      for (let i = 0; i <= ary.length - 1; i++) {
        if (ary[i].split('=')[0] === 'PFName') {
          PFName = decodeURI(ary[i].split('=')[1]);
        }
        if (ary[i].split('=')[0] === 'TargetDollar') {
          TargetDollar = ary[i].split('=')[1];
        }
        if (ary[i].split('=')[0] === 'InvestYear') {
          InvestYear = ary[i].split('=')[1];
        }
      }
      if (ary.indexOf('PFName') && ary.indexOf('TargetDollar') && ary.indexOf('InvestYear')) {
        console.log(PFName + ',' + TargetDollar + ',' + InvestYear);
        this.router.navigate(['/trailcalc']);
        this.setDawhoPlanValue(PFName, TargetDollar, InvestYear);
      }
    }
  }
  // 解析網址後，將參數帶入欄位並顯示
  async setDawhoPlanValue(PFName, TargetDollar, InvestYear) {
    this.shared.pf_type = '02';
    this.shared.activePlan = 'custom-plan';
    this.shared.plan_name = PFName;
    this.modalsvc.componentName.emit('loading');
    this.shared.init_input.gender = 'M';
    this.shared.init_input.age = 35;
    this.shared.init_input.income = 50000;
    this.shared.period_range = InvestYear;
    this.shared.target_dollar = TargetDollar * 10000;
    const custom_plan_post_data_1 = this.shared.getCustomPlanStep1PostData();
    const custom_plan_step1_returns = await this.shared.callCustomPlanStep1(custom_plan_post_data_1);
    if (!custom_plan_step1_returns) { return false; }
    const custom_plan_post_data_2 = this.shared.getCustomPlanStep2PostData();
    const custom_plan_step2_returns = await this.shared.callCustomPlanStep2(custom_plan_post_data_2);
    if (!custom_plan_step2_returns) { return false; }
    this.shared.value_adjusts_changed = true;
    await this.shared.callResults();
    this.shared.setInvestPlanSubmitDataLayer();
    if (this.shared.in_result_adjusts_plan) {
      this.shared.adjust_in_result_event.emit(true);
    }
  }
}
