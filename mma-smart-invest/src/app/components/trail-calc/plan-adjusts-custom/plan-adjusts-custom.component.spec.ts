import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanAdjustsCustomComponent } from './plan-adjusts-custom.component';

describe('PlanAdjustsCustomComponent', () => {
  let component: PlanAdjustsCustomComponent;
  let fixture: ComponentFixture<PlanAdjustsCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanAdjustsCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanAdjustsCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
