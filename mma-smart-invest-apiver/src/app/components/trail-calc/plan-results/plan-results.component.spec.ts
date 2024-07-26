import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanResultsComponent } from './plan-results.component';

describe('PlanResultsComponent', () => {
  let component: PlanResultsComponent;
  let fixture: ComponentFixture<PlanResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
