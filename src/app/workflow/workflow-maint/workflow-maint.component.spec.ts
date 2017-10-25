import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowMaintComponent } from './workflow-maint.component';

describe('WorkflowMaintComponent', () => {
  let component: WorkflowMaintComponent;
  let fixture: ComponentFixture<WorkflowMaintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowMaintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowMaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
