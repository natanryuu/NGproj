import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanAdjustsComponent } from './plan-adjusts.component';

describe('PlanAdjustsComponent', () => {
  let component: PlanAdjustsComponent;
  let fixture: ComponentFixture<PlanAdjustsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanAdjustsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanAdjustsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
