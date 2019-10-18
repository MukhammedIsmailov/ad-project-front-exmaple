import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWebsitesComponent } from './my-websites.component';

describe('MyWebsitesComponent', () => {
  let component: MyWebsitesComponent;
  let fixture: ComponentFixture<MyWebsitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyWebsitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWebsitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
