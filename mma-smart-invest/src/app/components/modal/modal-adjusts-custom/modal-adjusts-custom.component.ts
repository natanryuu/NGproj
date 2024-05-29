import { Component, OnInit } from '@angular/core';
import { CommonInput } from 'src/app/interfaces/plan.interfaces';
import { SharedService } from 'src/app/services/shared.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modal-adjusts-custom',
  templateUrl: './modal-adjusts-custom.component.html',
  styleUrls: ['./modal-adjusts-custom.component.scss']
})
export class ModalAdjustsCustomComponent implements OnInit {

  target_amount;
  init_input: CommonInput;
  input_initial;
  input_monthly;
  input_period;

  previous_target_amount;
  previous_input_period;
  previous_initial_table;
  previous_default_ini_rsp_index;

  initial_table = [] ;
  default_ini_rsp_index;

  constructor(
    public shared: SharedService
  ) { }

  ngOnInit() {
    this.init_input = this.shared.init_input;
    this.setCanAdjustInput();
    this.shared.setModalOptions();
  }

  setCanAdjustInput() {
    this.previous_input_period = this.input_period = this.shared.period;
    this.previous_target_amount = this.target_amount = Math.round(this.shared.target_amount_custom / 10000);
    this.previous_initial_table = this.initial_table = this.shared.initial_table;
    this.previous_default_ini_rsp_index = this.default_ini_rsp_index = this.shared.default_ini_rsp_index;
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

  closeModal() {
    this.shared.modal_trigger_close.emit(true);
  }

  resetData() {
    this.shared.initial_table = this.previous_initial_table;
    this.shared.default_ini_rsp_index = this.previous_default_ini_rsp_index;
    this.shared.initial_amount = this.previous_initial_table[this.previous_default_ini_rsp_index]['ini'];
    this.shared.monthly_amount = this.previous_initial_table[this.previous_default_ini_rsp_index]['RSP'];
    this.shared.emit_period.emit(this.previous_input_period);
    this.shared.target_amount_custom = Math.round(this.previous_target_amount * 10000);
  }

}
