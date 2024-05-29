import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodBalanceComponent } from './method-balance.component';

describe('MethodBalanceComponent', () => {
  let component: MethodBalanceComponent;
  let fixture: ComponentFixture<MethodBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MethodBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
