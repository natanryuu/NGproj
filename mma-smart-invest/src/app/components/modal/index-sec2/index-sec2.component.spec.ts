import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexSec2Component } from './index-sec2.component';

describe('IndexSec2Component', () => {
  let component: IndexSec2Component;
  let fixture: ComponentFixture<IndexSec2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexSec2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexSec2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
