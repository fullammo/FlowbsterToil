import { Deployment, DeploymentType } from './../shared/deployment';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from '@angular/forms';
import { WorkflowEntry } from 'app/workflow/shared/workflowEntry';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';
import { OccoService } from 'app/workflow/shared/occo.service';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'toil-build-context-properties',
  templateUrl: './build-context-properties.component.html',
  styleUrls: ['./build-context-properties.component.scss']
})
export class BuildContextPropertiesComponent implements OnInit {
  @Input() buildTemplate: WorkflowEntry;
  form: FormGroup;
  deployment: Deployment;

  DeploymentTypes = DeploymentType;

  @ViewChild('f') myNgForm;

  @Output() onSubmitDialog = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private occoSVC: OccoService,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: new FormControl(null, Validators.required),
      deployType: new FormControl(null, Validators.required)
    });

    this.deployment = {
      name: null
    };
  }

  onSubmit() {
    this.occoSVC.buildWorkflow(this.buildTemplate.descriptor).subscribe()

    this.onSubmitDialog.emit();

    this.myNgForm.resetForm();
  }
}
