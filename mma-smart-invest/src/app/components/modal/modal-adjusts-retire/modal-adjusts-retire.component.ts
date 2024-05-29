import { Component, OnInit } from '@angular/core';
import { CommonInput } from 'src/app/interfaces/plan.interfaces';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-modal-adjusts-retire',
  templateUrl: './modal-adjusts-retire.component.html',
  styleUrls: ['./modal-adjusts-retire.component.scss']
})
export class ModalAdjustsRetireComponent implements OnInit {

  target_amount;
  init_input: CommonInput;
  retire_age;
  input_initial;
  input_monthly;
  input_period;

  previous_input_initial;
  previous_input_monthly;
  previous_input_period;
  previous_target_amount_retire;
  previous_initial_table;
  previous_default_ini_rsp_index;
  previous_retire_age;

  times;
  salary_before_retire;
  salary_after_retire;
  salary_after_retire_monthly;
  target_amount_retire;
  initial_table = [] ;
  default_ini_rsp_index;

  constructor(
    public shared: SharedService
  ) { }

  ngOnInit() {
    this.init_input = this.shared.init_input;
    this.retire_age = this.shared.retire_age;
    this.setCanAdjustInput();
    this.shared.setModalOptions();
    // console.log(this.shared.period, this.init_input.age, this.input_period);
  }

  setCanAdjustInput() {
    this.previous_input_initial = this.input_initial = this.shared.initial_amount;
    this.previous_input_monthly = this.input_monthly = this.shared.monthly_amount;
    this.previous_input_period = this.input_period = this.shared.period;
    this.previous_target_amount_retire = this.target_amount_retire = Math.round(this.shared.target_amount_retire / 10000);
    this.previous_initial_table = this.initial_table = this.shared.initial_table;
    this.previous_default_ini_rsp_index = this.default_ini_rsp_index = this.shared.default_ini_rsp_index;
    this.previous_retire_age = this.retire_age = this.shared.retire_age;
  }

  setPeriodByAge() {
    this.input_period = Math.max(3, Math.min(30, this.retire_age - this.init_input.age));
    this.times = 12 * this.input_period;
    // console.log(this.retire_age, this.init_input.age, this.retire_age - this.init_input.age);
    this.shared.emit_period.emit(this.input_period);
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
  }

  // set Values from dynamic adjust filed value

  comeGetSome() {
    this.shared.emit_initial_amount.emit(this.input_initial);
    this.shared.emit_monthly_amount.emit(this.input_monthly);
    this.shared.initial_table = this.initial_table;
    this.shared.default_ini_rsp_index = this.default_ini_rsp_index;
    this.shared.retire_age = this.retire_age;

    this.shared.page_progress.emit('loading');
    this.shared.page_next = 'plan-results';
  }

  closeModal() {
    this.shared.modal_trigger_close.emit(true);
  }

  resetData() {
    this.shared.initial_amount = this.previous_input_initial;
    this.shared.monthly_amount = this.previous_input_monthly;
    this.shared.emit_period.emit(this.previous_input_period);
    this.shared.target_amount_retire = Math.round(this.previous_target_amount_retire * 10000);
    this.shared.initial_table = this.previous_initial_table;
    this.shared.default_ini_rsp_index = this.previous_default_ini_rsp_index;
    this.shared.retire_age = this.previous_retire_age;
  }

}
