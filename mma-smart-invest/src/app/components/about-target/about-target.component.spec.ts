import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutTargetComponent } from './about-target.component';

describe('AboutTargetComponent', () => {
  let component: AboutTargetComponent;
  let fixture: ComponentFixture<AboutTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
