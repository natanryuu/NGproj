import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { Router } from '@angular/router';
import { delay } from 'q';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-select-plan',
  templateUrl: './select-plan.component.html',
  styleUrls: ['./select-plan.component.scss']
})
export class SelectPlanComponent implements OnInit, OnDestroy, AfterViewInit {

  subs;

  constructor(
    public shared: SharedService,
    private router: Router,
    private modalsvc: ModalService
  ) { }

  ngOnInit() {
    this.shared.current_route = 'select-plan';
    // if (this.shared.isDawho) {
    //   console.log('dawho' + this.shared.isDawho);
    // }
    // if (!this.shared.init_input_changed) {
    //   this.modalsvc.modal_trigger_close.emit(true);
    //   this.router.navigate(['/']);
    // }
  }

  ngAfterViewInit() {
    this.subs = this.shared.plan_name_set_success.subscribe(async () => {
      this.modalsvc.modal_trigger_close.emit(true);
      await delay(300);
      this.setPlan(undefined, this.shared.activePlan, this.shared.plan_name);
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  async setPlan(e, plan, plan_name?) {
    if (e !== undefined) {
      e.preventDefault();
    }

    this.shared.pf_type = this.shared.plans_of_pf_type[plan];
    this.shared.activePlan = plan;

    if (plan_name !== undefined) {
      this.shared.plan_name = plan_name;
      this.modalsvc.componentName.emit('loading');
    } else {
      this.setPlanName();
      return true;
    }

    switch (plan) {
      case 'retire-plan':
        const post_data1 = this.shared.getRetireStep1PostData();
        const step1_returns = await this.shared.callRetirement(post_data1);
        if (!step1_returns) { return false; }

        const post_data2 = this.shared.getRetireStep2PostData();
        const step2_returns = await this.shared.callRetirementIniRsp(post_data2);
        if (!step2_returns) { return false; }

        this.shared.showValueAdjusts();
        break;
      case 'custom-plan':
      case 'trip-funds':
      case 'childs-edu':
      case 'buying-house':
        const custom_plan_post_data_1 = this.shared.getCustomPlanStep1PostData();
        const custom_plan_step1_returns = await this.shared.callCustomPlanStep1(custom_plan_post_data_1);
        if (!custom_plan_step1_returns) { return false; }

        const custom_plan_post_data_2 = this.shared.getCustomPlanStep2PostData();
        const custom_plan_step2_returns = await this.shared.callCustomPlanStep2(custom_plan_post_data_2);
        if (!custom_plan_step2_returns) { return false; }

        this.shared.showValueAdjusts();
        break;
    }

  }

  setPlanName() {
    this.modalsvc.componentName.emit('set-plan-name');
    this.modalsvc.modalInPlan({
      autofit: true
    });
  }
}
