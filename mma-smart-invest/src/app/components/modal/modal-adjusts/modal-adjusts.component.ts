import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-modal-adjusts',
  templateUrl: './modal-adjusts.component.html',
  styleUrls: ['./modal-adjusts.component.scss']
})
export class ModalAdjustsComponent implements OnInit {

  target_amount;
  input_initial;
  input_monthly;
  input_period;

  previous_input_initial;
  previous_input_monthly;
  previous_input_period;

  constructor(
    public shared: SharedService
  ) {
  }

  ngOnInit() {
    this.setCanAdjustInput();
    this.getTargetAmount();
    this.shared.setModalOptions();
  }

  setCanAdjustInput() {
    this.previous_input_initial = this.input_initial = Math.round(this.shared.initial_amount / 10000);
    this.previous_input_monthly = this.input_monthly = this.shared.monthly_amount;
    this.previous_input_period = this.input_period = this.shared.period;
  }

  getTargetAmount() {
    this.target_amount = this.shared.getTargetAmount();
  }

  // get target amount when trigger changes

  setInitialAmount(e) {
    this.input_initial = e;
    this.shared.emit_initial_amount.emit(Math.round(this.input_initial * 10000));
    this.getTargetAmount();
  }
  setMonthlyAmount(e) {
    this.input_monthly = e;
    this.shared.emit_monthly_amount.emit(this.input_monthly);
    this.getTargetAmount();
  }
  setPeriod(e) {
    this.input_period = e;
    this.shared.emit_period.emit(this.input_period);
    this.getTargetAmount();
  }

  // set Values from dynamic adjust filed value

  comeGetSome() {
    this.shared.page_progress.emit('loading');
    this.shared.page_next = 'plan-results';
  }

  closeModal() {
    this.shared.modal_trigger_close.emit(true);
  }

  resetData() {
    this.input_initial = this.previous_input_initial;
    this.input_monthly = this.previous_input_monthly;
    this.input_period = this.previous_input_period;
    this.shared.emit_initial_amount.emit(Math.round(this.input_initial * 10000));
    this.shared.emit_monthly_amount.emit(this.input_monthly);
    this.shared.emit_period.emit(this.input_period);
    this.getTargetAmount();
  }

}
