import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PushDetailsComponent } from './push-details.component';

describe('PushDetailsComponent', () => {
  let component: PushDetailsComponent;
  let fixture: ComponentFixture<PushDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PushDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
