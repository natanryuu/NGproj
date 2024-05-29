import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexSec3Component } from './index-sec3.component';

describe('IndexSec3Component', () => {
  let component: IndexSec3Component;
  let fixture: ComponentFixture<IndexSec3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexSec3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexSec3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
