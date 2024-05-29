import { Component, OnInit } from '@angular/core';
import { CommonInput } from 'src/app/interfaces/plan.interfaces';
import { SharedService } from 'src/app/services/shared.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-plan-adjusts-custom',
  templateUrl: './plan-adjusts-custom.component.html',
  styleUrls: ['./plan-adjusts-custom.component.scss']
})
export class PlanAdjustsCustomComponent implements OnInit {

  current_route;
  plan_name;
  target_amount;
  init_input: CommonInput;
  input_initial;
  input_monthly;
  input_period;

  initial_table = [] ;
  default_ini_rsp_index;

  constructor(
    public shared: SharedService,
    private route: ActivatedRoute,
  ) {
    this.current_route = this.route.snapshot.routeConfig.path;
    this.plan_name = this.shared.plans[this.current_route];
    this.shared.setInitInput();
  }

  ngOnInit() {
    this.init_input = this.shared.init_input;
    this.setCanAdjustInput();
    this.getIniRSP();
  }

  setCanAdjustInput() {
    this.input_period = this.shared.period_default_items[this.shared.activePlan];
    this.shared.emit_period.emit(this.input_period);
    this.shared.target_amount_custom = this.shared.target_amount_default_items[this.shared.activePlan];
    this.target_amount = Math.round(this.shared.target_amount_custom / 10000);
  }

  getIniRSP() {
    this.shared.getIniRSP();
    this.initial_table = this.shared.initial_table;
    this.default_ini_rsp_index = this.shared.default_ini_rsp_index;
    this.setIniMonthly(this.shared.default_ini_rsp_index);
  }

  // set Values from dynamic adjust filed value
  setPeriod(e) {
    this.input_period = e;
    this.shared.emit_period.emit(e);
    this.getIniRSP();
    // console.log(this.target_amount_retire, this.initial_table);
  }

  setTargetAmount(e) {
    this.target_amount = e;
    this.shared.target_amount_custom = Math.round(e * 10000);
    this.getIniRSP();
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
