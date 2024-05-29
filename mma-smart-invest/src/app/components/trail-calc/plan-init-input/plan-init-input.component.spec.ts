import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanInitInputComponent } from './plan-init-input.component';

describe('PlanInitInputComponent', () => {
  let component: PlanInitInputComponent;
  let fixture: ComponentFixture<PlanInitInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanInitInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanInitInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
