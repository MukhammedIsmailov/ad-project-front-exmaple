import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDialogSaveComponent } from './filter-dialog-save.component';

describe('FilterDialogSaveComponent', () => {
  let component: FilterDialogSaveComponent;
  let fixture: ComponentFixture<FilterDialogSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterDialogSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterDialogSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
