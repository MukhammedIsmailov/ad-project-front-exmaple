import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteIntegrationComponent } from './website-integration.component';

describe('WebsiteIntegrationComponent', () => {
  let component: WebsiteIntegrationComponent;
  let fixture: ComponentFixture<WebsiteIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsiteIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
