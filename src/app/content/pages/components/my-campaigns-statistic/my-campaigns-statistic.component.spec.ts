import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCampaignsStatisticComponent } from './my-campaigns-statistic.component';

describe('MyCampaignsStatisticComponent', () => {
  let component: MyCampaignsStatisticComponent;
  let fixture: ComponentFixture<MyCampaignsStatisticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCampaignsStatisticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCampaignsStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
