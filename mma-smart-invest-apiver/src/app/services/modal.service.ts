import { Injectable, EventEmitter } from '@angular/core';
import { ModalOptions } from '../interfaces/plan.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  componentName: EventEmitter<String> = new EventEmitter();
  modalShow: EventEmitter<Boolean> = new EventEmitter();
  modal_container_class: EventEmitter<String> = new EventEmitter();
  modal_container_class_back: EventEmitter<String> = new EventEmitter();
  backdrop_close_trigger: EventEmitter<Boolean> = new EventEmitter();
  show_modal_close_btn: EventEmitter<Boolean> = new EventEmitter();
  modal_trigger_close: EventEmitter<Boolean> = new EventEmitter();

  msg_type = 'default';

  loading_text_default = '請稍候...';
  loading_text = '';

  constructor() {
    this.loading_text = this.loading_text_default;
  }

  loadingText(text?) {
    if (text === 'calc') {
      this.loading_text = '正在計算<br>您的專屬投資配置';
    } else if (text !== undefined) {
      this.loading_text = text;
    } else {
      this.loading_text = this.loading_text_default;
    }
  }

  modalInPlan(opt?: ModalOptions) {
    let class_name = 'in-plan';
    if (opt !== undefined) {
      if (opt.autofit === true) {
        class_name += ' auto-fit';
      }
    }
    this.modal_trigger_close.emit(false);
    this.show_modal_close_btn.emit(false);
    this.backdrop_close_trigger.emit(false);
    this.modal_container_class.emit(class_name);
  }

  modalAutoFit() {
    this.modal_container_class.emit('auto-fit');
  }
}
