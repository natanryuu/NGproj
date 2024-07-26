import { Component, OnInit, ChangeDetectorRef, AfterViewChecked} from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, AfterViewChecked {

  componentName: string;

  open_modal = false;

  show_close_btn = true;

  operate_class = '';

  operate_class_back = ''

  backdrop_close_trigger = true;

  constructor(
    private cd: ChangeDetectorRef,
    private modalsvc: ModalService
  ) {
    this.modalsvc.componentName.subscribe((value: string) => {
      this.componentName = value;
      this.open_modal = true;
      if (value === 'loading') {
        this.modalsvc.show_modal_close_btn.emit(false);
        this.modalsvc.backdrop_close_trigger.emit(false);
        this.operate_class = 'loading';
      }
      modalsvc.modalShow.emit(true);
    });

    this.modalsvc.modal_container_class.subscribe(value => {
      this.operate_class = value;
    });

    this.modalsvc.modal_container_class_back.subscribe(value => {
      this.operate_class_back = value;
    });

    this.modalsvc.show_modal_close_btn.subscribe(value => {
      this.show_close_btn = value;
    });

    this.modalsvc.modal_trigger_close.subscribe(value => {
      if (value === true) {
        this.closeModal(true);
      }
    });

    this.modalsvc.backdrop_close_trigger.subscribe(value => {
      this.backdrop_close_trigger = value;
    });
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  closeModal(force?) {
    if (this.backdrop_close_trigger || force) {
      this.open_modal = false;
      this.modalsvc.modalShow.emit(false);
      this.operate_class = '';
      this.modalsvc.loadingText();

      this.modalsvc.modal_container_class.emit('');
      this.modalsvc.modal_container_class_back.emit('');
      this.modalsvc.backdrop_close_trigger.emit(true);
      this.modalsvc.show_modal_close_btn.emit(true);
    }
  }

}
