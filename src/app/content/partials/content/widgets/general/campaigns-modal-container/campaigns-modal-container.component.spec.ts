import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignsModalContainerComponent } from './campaigns-modal-container.component';

describe('CampaignsModalContainerComponent', () => {
  let component: CampaignsModalContainerComponent;
  let fixture: ComponentFixture<CampaignsModalContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignsModalContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignsModalContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
