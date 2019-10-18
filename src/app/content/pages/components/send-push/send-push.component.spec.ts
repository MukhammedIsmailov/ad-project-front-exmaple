import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPushComponent } from './send-push.component';

describe('SendPushComponent', () => {
  let component: SendPushComponent;
  let fixture: ComponentFixture<SendPushComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendPushComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendPushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
