import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.scss']
})
export class BlankComponent implements OnInit {

  constructor(
    private router: Router,
    private shared: SharedService,
    private _location: Location
  ) { }

  ngOnInit() {
    if (this.shared.in_result_adjusts_plan) {
      this.shared.in_result_adjusts_plan = false;
      this._location.back();
    } else {
      this.router.navigate(['/trailcalc']);
    }
  }

}
