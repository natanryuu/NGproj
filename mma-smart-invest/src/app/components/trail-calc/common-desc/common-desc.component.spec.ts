import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonDescComponent } from './common-desc.component';

describe('CommonDescComponent', () => {
  let component: CommonDescComponent;
  let fixture: ComponentFixture<CommonDescComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonDescComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
