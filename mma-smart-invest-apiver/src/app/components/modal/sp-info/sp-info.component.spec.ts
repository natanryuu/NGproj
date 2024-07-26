import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpInfoComponent } from './sp-info.component';

describe('SpInfoComponent', () => {
  let component: SpInfoComponent;
  let fixture: ComponentFixture<SpInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
