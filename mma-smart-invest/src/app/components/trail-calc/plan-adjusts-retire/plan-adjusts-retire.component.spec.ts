import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanAdjustsRetireComponent } from './plan-adjusts-retire.component';

describe('PlanAdjustsRetireComponent', () => {
  let component: PlanAdjustsRetireComponent;
  let fixture: ComponentFixture<PlanAdjustsRetireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanAdjustsRetireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanAdjustsRetireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
