import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCampaignsComponent } from './service-campaigns.component';

describe('ServiceCampaignsComponent', () => {
  let component: ServiceCampaignsComponent;
  let fixture: ComponentFixture<ServiceCampaignsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceCampaignsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
