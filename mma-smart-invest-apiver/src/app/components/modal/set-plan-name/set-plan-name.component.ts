import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-set-plan-name',
  templateUrl: './set-plan-name.component.html',
  styleUrls: ['./set-plan-name.component.scss']
})
export class SetPlanNameComponent implements OnInit {

  plan_name;
  is_empty = false;

  constructor(
    public shared: SharedService,
    private modalsvc: ModalService
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.modalsvc.modal_trigger_close.emit(true);
  }

  call() {
    if (!this.plan_name) {
      this.is_empty = true;
      return false;
    }
    this.is_empty = false;
    this.shared.plan_name = this.shared.plans['custom-plan'] = this.plan_name;
    this.shared.plan_name_set_success.emit(true);
  }
}
