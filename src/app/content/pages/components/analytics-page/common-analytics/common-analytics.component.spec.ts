import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonAnalyticsComponent } from './common-analytics.component';

describe('CommonAnalyticsComponent', () => {
  let component: CommonAnalyticsComponent;
  let fixture: ComponentFixture<CommonAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
