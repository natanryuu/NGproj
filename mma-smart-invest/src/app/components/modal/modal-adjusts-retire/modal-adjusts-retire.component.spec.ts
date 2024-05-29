import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAdjustsRetireComponent } from './modal-adjusts-retire.component';

describe('ModalAdjustsRetireComponent', () => {
  let component: ModalAdjustsRetireComponent;
  let fixture: ComponentFixture<ModalAdjustsRetireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAdjustsRetireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAdjustsRetireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
