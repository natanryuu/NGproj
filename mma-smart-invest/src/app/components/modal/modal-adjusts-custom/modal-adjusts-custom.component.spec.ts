import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAdjustsCustomComponent } from './modal-adjusts-custom.component';

describe('ModalAdjustsCustomComponent', () => {
  let component: ModalAdjustsCustomComponent;
  let fixture: ComponentFixture<ModalAdjustsCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAdjustsCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAdjustsCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
