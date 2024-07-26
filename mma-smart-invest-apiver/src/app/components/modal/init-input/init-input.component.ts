import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { ModalService } from 'src/app/services/modal.service';
import { delay } from 'q';

@Component({
  selector: 'app-init-input',
  templateUrl: './init-input.component.html',
  styleUrls: ['./init-input.component.scss']
})
export class InitInputComponent implements OnInit {

  ngForm = this.fb.group({
    formGender: [''],
    formAge: ['', [Validators.min(1), Validators.max(100)]],
    formIncome: ['']
  });

  err_msg = '';

  income_lists;


  constructor(
    public shared: SharedService,
    private modalsvc: ModalService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.income_lists = this.shared.setIncomeDefaultList();
    this.ngForm.patchValue({
      formGender: this.shared.init_input.gender,
      formAge: this.shared.init_input.age,
      formIncome: this.shared.init_input.income
    });
  }

  closeModal() {
    this.modalsvc.modal_trigger_close.emit(true);
  }

  fixAge() {
    this.ngForm.controls.formAge.setValue(parseInt(this.ngForm.controls.formAge.value, 0));
    if (this.ngForm.controls.formAge.value > this.shared.input_age_max_limit) {
      this.ngForm.controls.formAge.setValue(this.shared.input_age_max_limit);
    }
    if (this.ngForm.controls.formAge.value < this.shared.input_age_min_limit) {
      this.ngForm.controls.formAge.setValue(this.shared.input_age_min_limit);
    }
  }

  async onSubmit(form) {

    const init_input = {
      age: form.value.formAge,
      gender: form.value.formGender,
      income: form.value.formIncome
    };

    this.modalsvc.modal_trigger_close.emit(true);
    await delay(300);

    this.shared.trailCalc(init_input);

  }

}
