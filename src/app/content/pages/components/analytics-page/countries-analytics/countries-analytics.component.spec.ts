import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountriesAnalyticsComponent } from './countries-analytics.component';

describe('CountriesAnalyticsComponent', () => {
  let component: CountriesAnalyticsComponent;
  let fixture: ComponentFixture<CountriesAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountriesAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountriesAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
