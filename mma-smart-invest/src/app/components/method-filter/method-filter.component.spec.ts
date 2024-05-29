import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodFilterComponent } from './method-filter.component';

describe('MethodFilterComponent', () => {
  let component: MethodFilterComponent;
  let fixture: ComponentFixture<MethodFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MethodFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
