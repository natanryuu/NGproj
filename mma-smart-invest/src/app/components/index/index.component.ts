import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  sections = ['index1', 'index2', 'index3', 'index4'];
  current_section = 0;
  checkCurrentDotBond;

  constructor(
    private shared: SharedService
  ) { }

  ngOnInit() {
    (<HTMLElement>document.getElementsByTagName('main')[0]).style.marginTop = '0';
    this.checkCurrentDotBond = this.checkCurrentDot.bind(this);
    window.addEventListener('scroll',  this.checkCurrentDotBond, false);
  }

  ngOnDestroy(): void {
    (<HTMLElement>document.getElementsByTagName('main')[0]).style.marginTop = '';
    window.removeEventListener('scroll', this.checkCurrentDotBond, false);
  }

  checkCurrentDot() {
    const scrollTop = window.scrollY;
    const offset = 100;
    this.sections.slice().reverse().find((v, k) => {
      const currentIndex = document.getElementById(v).offsetTop - offset;
      if (scrollTop >= currentIndex) {
        this.current_section = this.sections.length - 1 - k;
        return true;
      }
      return false;
    });
  }

  openModal(target) {
    this.shared.componentName.emit(target);
  }

}
