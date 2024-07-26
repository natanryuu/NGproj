import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { ModalService } from '../../../services/modal.service';
import { delay } from 'q';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-value-adjusts',
  templateUrl: './value-adjusts.component.html',
  styleUrls: ['./value-adjusts.component.scss']
})
export class ValueAdjustsComponent implements OnInit, OnDestroy {

  is_retire = false;
  showToolTip = false;
  tipNo = 1;
  err_msg = '';
  ngFormSubs: Array<Subscription> = [];

  period_range_or_retire_age;
  target_dollar;
  ini_rsp_dollar;
  default_ini_rsp_index;

  min_period;
  max_period;

  min_target = 20;
  max_target = 10000;

  ngForm = this.fb.group({
    formPeriod: [''],
    formTargetDollar: [''],
    formIniRSP: ['']
  });

  constructor(
    public shared: SharedService,
    private modalsvc: ModalService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.setData();
    Object.keys(this.ngForm.controls).forEach(v => {
      if (v === 'formIniRSP') {
        return false;
      }
      this.ngFormSubs[v] = this.ngForm.controls[v].valueChanges.pipe(
        distinctUntilChanged((x, y) => {
          return x === y;
        }),
        tap(data => {
          this.ngForm.controls.formIniRSP.disable({emitEvent: false});
        }),
        debounceTime(1000),
        tap(data => {
          if (data === null) {
            return false;
          }

          if (v === 'formPeriod') {
            this.ngForm.controls[v].setValue(parseInt(this.ngForm.controls[v].value, 0), {emitEvent: false});

            if (this.min_period > data) {
              this.ngForm.controls[v].setValue(this.min_period);
              return false;
            }
            if (this.max_period < data) {
              this.ngForm.controls[v].setValue(this.max_period);
              return false;
            }
          }

          if (v === 'formTargetDollar') {
            if (this.min_target > data) {
              this.ngForm.controls[v].setValue(this.min_target);
              return false;
            }
            if (this.max_target < data) {
              this.ngForm.controls[v].setValue(this.max_target);
              return false;
            }
          }
          this.getIniRSPValues();
        })
      ).subscribe();
    });
  }

  ngOnDestroy() {
    this.ngFormSubs.forEach(v => {
      v.unsubscribe();
    });
  }

  getIniRSPValues() {
    this.err_msg = '';
    this.getIniRSP();
  }

  setData() {
    if (this.shared.pf_type === '01') {
      this.is_retire = true;
      this.ngForm.controls.formPeriod.setValue(this.shared.retirement_age, {emitEvent: false});
      this.min_period = this.shared.min_age;
      this.max_period = this.shared.max_age;
    } else {
      this.ngForm.controls.formPeriod.setValue(this.shared.period_range, {emitEvent: false});
      this.min_period = 3;
      this.max_period = 30;
    }
    this.ngForm.controls.formPeriod.setValidators([Validators.required, Validators.min(this.min_period)]);
    this.ngForm.controls.formTargetDollar.setValue(Math.round(this.shared.target_dollar / 10000), {emitEvent: false});
    this.ngForm.controls.formIniRSP.setValue(this.shared.default_ini_rsp_index, {emitEvent: false});
    this.ini_rsp_dollar = this.shared.ini_rsp_dollar;
    this.ngForm.controls.formIniRSP.enable({emitEvent: false});
    this.err_msg = '';
  }

  async getIniRSP() {
    if (this.shared.pf_type === '01') {
      const post_data = this.shared.getRetireStep2PostData();
            post_data.RetirementAge = this.ngForm.controls.formPeriod.value;
            post_data.TargetDollar = this.ngForm.controls.formTargetDollar.value * 10000;
      const step2_returns = await this.shared.callRetirementIniRsp(post_data);
      if (step2_returns !== true) {
        this.showErrors(step2_returns);
        return false;
      }
    } else {
      const post_data_custom = this.shared.getCustomPlanStep2PostData();
            post_data_custom.InvestYear = this.ngForm.controls.formPeriod.value;
            post_data_custom.TargetDollar = this.ngForm.controls.formTargetDollar.value * 10000;
      const step2_returns_custom = await this.shared.callCustomPlanStep2(post_data_custom);
      if (step2_returns_custom !== true) {
        this.showErrors(step2_returns_custom);
        return false;
      }
    }
    this.setData();
  }

  showErrors(msg) {
    this.err_msg = msg.Message;
  }

  closeModal() {
    this.modalsvc.modal_trigger_close.emit(true);
  }

  async call() {
    // 按下查看試算結果才將資料寫入 shared
    if (this.is_retire) {
      this.shared.retirement_age = this.ngForm.controls.formPeriod.value;
    } else {
      this.shared.period_range = this.ngForm.controls.formPeriod.value;
    }
    this.shared.target_dollar = this.ngForm.controls.formTargetDollar.value * 10000;
    this.shared.default_ini_rsp_index = this.ngForm.controls.formIniRSP.value;

    this.modalsvc.modal_trigger_close.emit(true);
    await delay(300);
    this.modalsvc.componentName.emit('loading');
    this.shared.value_adjusts_changed = true;
    await this.shared.callResults();
    this.shared.setInvestPlanSubmitDataLayer();
    if (this.shared.in_result_adjusts_plan) {
      this.shared.adjust_in_result_event.emit(true);
    }
  }

  onSubmit(form) {
    if (this.err_msg === '') {
      this.call();
    }
  }

  setOperations(formName, operator, limit) {
    const old_value = parseInt(this.ngForm.controls[formName].value, 0);
    let new_value;
    if (operator === 'plus') {
      new_value = old_value + 1;
      if (new_value > limit) {
        new_value = old_value;
      }
    } else if (operator === 'minus') {
      new_value = old_value - 1;
      if (new_value < limit) {
        new_value = old_value;
      }
    }
    this.ngForm.controls[formName].setValue(new_value);
  }

   showTips(_tip){

    //alert(_tip);
      this.tipNo = _tip;
      this.showToolTip = true;

   }
}
