import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailCalcComponent } from './trail-calc.component';

describe('TrailCalcComponent', () => {
  let component: TrailCalcComponent;
  let fixture: ComponentFixture<TrailCalcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailCalcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
