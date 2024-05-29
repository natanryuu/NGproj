import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-select-plan',
  templateUrl: './select-plan.component.html',
  styleUrls: ['./select-plan.component.scss']
})
export class SelectPlanComponent implements OnInit {

  constructor(
    private shared: SharedService
  ) { }

  ngOnInit() {
  }

  setPlan(plan) {
    this.shared.activePlan = plan;
  }

}
