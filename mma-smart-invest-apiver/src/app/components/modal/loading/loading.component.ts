import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit, OnDestroy {

  constructor(
    public modalsvc: ModalService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
