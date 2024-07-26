import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  constructor(
    public modalsvc: ModalService
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.modalsvc.msg_type = 'default';
    this.modalsvc.modal_trigger_close.emit(true);
  }

}
