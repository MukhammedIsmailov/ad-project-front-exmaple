import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentCampaignsChartComponent } from './recent-campaigns-chart.component';

describe('RecentCampaignsChartComponent', () => {
  let component: RecentCampaignsChartComponent;
  let fixture: ComponentFixture<RecentCampaignsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentCampaignsChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentCampaignsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
