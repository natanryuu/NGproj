import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutModeComponent } from './about-mode.component';

describe('AboutModeComponent', () => {
  let component: AboutModeComponent;
  let fixture: ComponentFixture<AboutModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
