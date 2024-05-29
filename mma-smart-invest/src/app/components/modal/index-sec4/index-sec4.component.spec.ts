import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexSec4Component } from './index-sec4.component';

describe('IndexSec4Component', () => {
  let component: IndexSec4Component;
  let fixture: ComponentFixture<IndexSec4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexSec4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexSec4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
