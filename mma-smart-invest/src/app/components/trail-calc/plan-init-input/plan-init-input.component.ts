import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { CommonInput } from './../../../interfaces/plan.interfaces';

@Component({
  selector: 'app-plan-init-input',
  templateUrl: './plan-init-input.component.html',
  styleUrls: ['./plan-init-input.component.scss']
})
export class PlanInitInputComponent implements OnInit {

  current_route;
  plan_name;
  income_lists;

  init_input: CommonInput;

  constructor(
    private shared: SharedService,
    private route: ActivatedRoute
  ) {
    this.current_route = this.route.routeConfig.path;
    this.shared.activePlan = this.current_route;
    this.plan_name = this.shared.plans[this.current_route];
  }

  ngOnInit() {
    this.income_lists = this.setIncomeDefaultList();
    this.shared.setDefaultCommonInput();
    this.init_input = this.shared.init_input;
  }

  setIncomeDefaultList() {
    const values: Array<any> = [];
    for (let $i = 0; $i < 50; $i++) {
      values[$i] = ($i + 1) * 10000;
    }
    return values;
  }

  setDefaultValueAndGoNext() {
    this.shared.init_input = this.init_input;
    this.shared.setInitInput();
    this.shared.page_progress.emit('loading');
    switch (this.shared.activePlan) {
      case 'assets-grow':
        this.shared.page_next = 'plan-adjusts';
        break;
      case 'retire-plan':
        this.shared.page_next = 'plan-adjusts-retire';
        break;
      case 'shop-funds':
      case 'buying-house':
      case 'childs-edu':
      case 'custom-plan':
        this.shared.page_next = 'plan-adjusts-custom';
        break;
    }
  }

}
