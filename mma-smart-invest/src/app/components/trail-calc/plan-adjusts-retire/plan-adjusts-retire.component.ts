import { Component, OnInit } from '@angular/core';
import { CommonInput } from 'src/app/interfaces/plan.interfaces';
import { SharedService } from 'src/app/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { TableYieldService } from 'src/app/services/table-yield.service';

@Component({
  selector: 'app-plan-adjusts-retire',
  templateUrl: './plan-adjusts-retire.component.html',
  styleUrls: ['./plan-adjusts-retire.component.scss']
})
export class PlanAdjustsRetireComponent implements OnInit {

  current_route;
  plan_name;
  target_amount;
  init_input: CommonInput;
  retire_age;
  min_retire_age;
  max_retire_age;
  input_initial;
  input_monthly;
  input_period;

  times;
  salary_before_retire; // 退休時月薪
  salary_after_retire; // 退休後所得
  salary_after_retire_monthly; // 退休後月領月份
  target_amount_retire; // 退休時的目標金額
  initial_table = [] ; // 期初投入&每月投入的可得解
  default_ini_rsp_index; // initial_table default 最佳解的 index

  constructor(
    public shared: SharedService,
    private route: ActivatedRoute,
    private table_yield: TableYieldService
  ) {
    this.current_route = this.route.snapshot.routeConfig.path;
    this.plan_name = this.shared.plans[this.current_route];
    this.retire_age = this.shared.retire_age;
    this.shared.setInitInput();
  }

  ngOnInit() {
    this.init_input = this.shared.init_input;
    this.setCanAdjustInput();
    this.getTargetAmount();
    this.getIniRSP();
  }

  setCanAdjustInput() {
    this.setDefaultRetireAge();
    this.setRetireAgeLimit();
    this.setPeriodByAge();
  }

  setRetireAgeLimit() {
    const age = this.init_input.age;
    const death_age = this.shared.death_age[this.init_input.gender];
    this.min_retire_age = age + 3;
    this.max_retire_age = Math.max(age + 30, death_age);
  }

  setDefaultRetireAge() {
    const age = this.init_input.age;
    if (age <= 35) {
      this.retire_age = age + 30;
    } else if (age <= 62) {
      this.retire_age = this.shared.DEFAULT_RETIRE_AGE;
    } else {
      this.retire_age = age + 3;
    }
    this.shared.retire_age = this.retire_age;
  }

  setPeriodByAge() {
    this.input_period = Math.max(3, Math.min(30, this.retire_age - this.init_input.age));
    // console.log(this.retire_age, this.init_input.age, this.retire_age - this.init_input.age);
    this.times = 12 * this.input_period;
    this.shared.emit_period.emit(this.input_period);
  }

  getTargetAmount() {
    this.salary_before_retire =
      Math.round(this.init_input.income * Math.pow( 1 + this.shared.SALARY_GROWTH_RATE, this.input_period));
    this.salary_after_retire =
      this.salary_before_retire * this.shared.INCOME_REPLACE_RATIO;
    this.salary_after_retire_monthly =
      12 * Math.max(1, this.shared.death_age[this.init_input.gender] - this.retire_age);
    this.shared.target_amount_retire =
      Math.round(this.salary_after_retire * this.salary_after_retire_monthly);
    this.target_amount_retire = Math.round(this.shared.target_amount_retire / 10000);

    // console.log('input_period: ' + this.input_period);
    // console.log('retire_age: ' + this.retire_age);
    // console.log('times: ' + this.times);
    // console.log('salary_before_retire: ' + this.salary_before_retire);
    // console.log('salary_after_retire: ' + this.salary_after_retire);
    // console.log('salary_after_retire_monthly: ' + this.salary_after_retire_monthly);
    // console.log('target_amount_retire: ' + this.target_amount_retire);
  }

  getIniRSP() {
    this.shared.getIniRSP();
    this.initial_table = this.shared.initial_table;
    this.default_ini_rsp_index = this.shared.default_ini_rsp_index;
    this.setIniMonthly(this.shared.default_ini_rsp_index);
  }

  // set Values from dynamic adjust filed value
  setTargetAmount(e) {
    this.target_amount_retire = e;
    this.shared.target_amount_retire = Math.round(e * 10000);
    this.getIniRSP();
  }

  setPeriod(e) {
    this.retire_age = this.shared.retire_age = e;
    this.setPeriodByAge();
    this.getIniRSP();
    // console.log(this.target_amount_retire, this.initial_table);
  }

  setIniMonthly(e) {
    this.default_ini_rsp_index = this.shared.default_ini_rsp_index = e;
    this.input_initial = this.initial_table[e]['ini'];
    this.input_monthly = this.initial_table[e]['RSP'];

    this.shared.emit_initial_amount.emit(this.input_initial);
    this.shared.emit_monthly_amount.emit(this.input_monthly);
  }

  // set Values from dynamic adjust filed value

  comeGetSome() {
    this.shared.page_progress.emit('loading');
    this.shared.page_next = 'plan-results';
  }

}
