import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitesSettingsComponent } from './sites-settings.component';

describe('SitesSettingsComponent', () => {
  let component: SitesSettingsComponent;
  let fixture: ComponentFixture<SitesSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitesSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
