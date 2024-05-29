import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodAlgorithmComponent } from './method-algorithm.component';

describe('MethodAlgorithmComponent', () => {
  let component: MethodAlgorithmComponent;
  let fixture: ComponentFixture<MethodAlgorithmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MethodAlgorithmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodAlgorithmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
