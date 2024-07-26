import { Component } from '@angular/core';
import { SharedService } from './services/shared.service';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    public shared: SharedService,
    private router: Router
  ) {
    if (!('ontouchstart' in window.document)) {
      document.body.classList.add('no-touch');
    }
    this.router.events.subscribe(e => {
      if (!(e instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
;
  toggleOpen = false;
  isShow = true;
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    if (this.shared.isDawhoApp()) {
      this.shared.isDawho = true;
    }
    if (this.shared.CheckhasTko()) {
      this.shared.hasTko = true;
      console.log(this.shared.tkoValue);
    }

  }
  openInitInput(e) {
    e.preventDefault();
    this.shared.openInitInput();
  }
  showSPinfos() {
    this.shared.showSPinfos();
  }

  showInvestWarnings() {
    this.shared.showInvestWarnings();
  }

  toggleMenu() {
    this.toggleOpen = !this.toggleOpen;
  }

  hideAdblock() {
    this.isShow = false;
  }

}
