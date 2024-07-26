import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPlanNameComponent } from './set-plan-name.component';

describe('SetPlanNameComponent', () => {
  let component: SetPlanNameComponent;
  let fixture: ComponentFixture<SetPlanNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetPlanNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPlanNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
