import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueAdjustsComponent } from './value-adjusts.component';

describe('ValueAdjustsComponent', () => {
  let component: ValueAdjustsComponent;
  let fixture: ComponentFixture<ValueAdjustsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueAdjustsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueAdjustsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
