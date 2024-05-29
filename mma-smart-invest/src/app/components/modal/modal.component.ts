import { Component, OnInit, ChangeDetectorRef, AfterViewChecked} from '@angular/core';
import { SharedService } from '../../services/shared.service';

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

  backdrop_close_trigger = true;

  constructor(
    private shared: SharedService,
    private cd: ChangeDetectorRef
  ) {
    this.shared.componentName.subscribe((value: string) => {
      this.componentName = value;
      this.open_modal = true;
      shared.modalShow.emit(true);
      // shared.setBackgroundFixed();
    });

    this.shared.modal_container_class.subscribe(value => {
      this.operate_class = value;
    });

    this.shared.show_modal_close_btn.subscribe(value => {
      this.show_close_btn = value;
    });

    this.shared.modal_trigger_close.subscribe(value => {
      if (value === true) {
        this.closeModal(true);
      }
    });
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  closeModal(force?) {
    if (this.shared.backdrop_close_trigger || force) {
      this.open_modal = false;
      this.shared.modalShow.emit(false);

      this.shared.modal_container_class.emit('');
      this.shared.backdrop_close_trigger = true;
      this.shared.show_modal_close_btn.emit(true);
      // this.shared.resetBackgroundFixed();
    }
  }

}
