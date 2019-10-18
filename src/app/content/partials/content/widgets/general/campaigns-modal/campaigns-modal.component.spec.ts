import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignsModalComponent } from './campaigns-modal.component';

describe('CampaignsModalComponent', () => {
  let component: CampaignsModalComponent;
  let fixture: ComponentFixture<CampaignsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
