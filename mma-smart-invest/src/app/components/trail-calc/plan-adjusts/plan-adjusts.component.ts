import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { InputAdjust, CommonInput } from './../../../interfaces/plan.interfaces';
import { TableYieldService } from './../../../services/table-yield.service';

@Component({
  selector: 'app-plan-adjusts',
  templateUrl: './plan-adjusts.component.html',
  styleUrls: ['./plan-adjusts.component.scss']
})
export class PlanAdjustsComponent implements OnInit {

  current_route;
  plan_name;
  target_amount;
  init_input: CommonInput;
  input_initial;
  input_monthly;
  input_period;

  constructor(
    public shared: SharedService,
    private route: ActivatedRoute,
    private table_yield: TableYieldService
  ) {
    this.current_route = this.route.snapshot.routeConfig.path;
    this.plan_name = this.shared.plans[this.current_route];
    this.shared.setInitInput();
  }

  ngOnInit() {
    this.init_input = this.shared.init_input;
    this.setCanAdjustInput();
    this.getTargetAmount();
  }

  setCanAdjustInput() {
    this.input_initial = Math.round(this.shared.initial_amount / 10000);
    this.input_monthly = this.shared.monthly_amount;
    this.input_period = this.shared.period;
  }

  getTargetAmount() {
    this.target_amount = this.shared.getTargetAmount();
  }

  // set Values from dynamic adjust filed value
  setPeriod(e) {
    this.input_period = e;
    this.shared.emit_period.emit(e);
    this.getTargetAmount();
  }

  setInitialAmount(e) {
    this.input_initial = e;
    this.shared.emit_initial_amount.emit(Math.round(e * 10000));
    this.getTargetAmount();
  }

  setMonthlyAmount(e) {
    this.input_monthly = e;
    this.shared.emit_monthly_amount.emit(e);
    this.getTargetAmount();
  }
  // set Values from dynamic adjust filed value

  comeGetSome() {
    this.shared.page_progress.emit('loading');
    this.shared.page_next = 'plan-results';
  }

}
