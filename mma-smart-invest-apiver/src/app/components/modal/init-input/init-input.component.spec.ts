import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitInputComponent } from './init-input.component';

describe('InitInputComponent', () => {
  let component: InitInputComponent;
  let fixture: ComponentFixture<InitInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
