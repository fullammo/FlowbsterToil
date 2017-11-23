import { OccoService } from 'app/workflow/shared/occo.service';
import { WorkflowManagerComponent } from 'app/workflow/workflow-manager/workflow-manager.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

describe('WorkflowManagerComponent', () => {
  let component: WorkflowManagerComponent;
  let fixture: ComponentFixture<WorkflowManagerComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [WorkflowManagerComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
