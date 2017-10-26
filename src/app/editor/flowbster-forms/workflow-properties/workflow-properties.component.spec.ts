import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowPropertiesComponent } from './workflow-properties.component';

describe('WorkflowPropertiesComponent', () => {
  let component: WorkflowPropertiesComponent;
  let fixture: ComponentFixture<WorkflowPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
