import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAdjustsComponent } from './modal-adjusts.component';

describe('ModalAdjustsComponent', () => {
  let component: ModalAdjustsComponent;
  let fixture: ComponentFixture<ModalAdjustsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAdjustsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAdjustsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
