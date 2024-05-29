import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  constructor(
    private shared: SharedService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.shared.page_progress.emit(this.shared.page_next);
    }, 1500);
  }

}
