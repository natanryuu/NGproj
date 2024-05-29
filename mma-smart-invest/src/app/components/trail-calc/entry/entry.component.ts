import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {

  current_route;
  plan_name;
  page_progress = 'init-input';

  constructor(
    private shared: SharedService,
    private route: ActivatedRoute
  ) {
    this.current_route = this.route.snapshot.routeConfig.path;
    this.shared.activePlan = this.current_route;
    this.plan_name = this.shared.plans[this.current_route];
  }

  ngOnInit() {
    this.shared.page_progress.subscribe(page => this.page_progress = page);
  }

}
