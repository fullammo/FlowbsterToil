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

  @Output() onSubmitDialog = new EventEmitter<Deployment>();

  constructor(private fb: FormBuilder, private occoSVC: OccoService) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: new FormControl('', Validators.required),
      deployType: new FormControl('', Validators.required)
    });

    this.deployment = {
      name: null
    };
  }

  onSubmit() {
    this.deployment = this.form.value;

    this.occoSVC.buildWorkflow(this.buildTemplate.descriptor).subscribe(
      (res: any) => {
        console.log(res);
        this.deployment.infraid = res.infraid;
        this.deployment.templateKey = this.buildTemplate.$key;
        this.deployment.graph = this.buildTemplate.graph;
        this.onSubmitDialog.emit(this.deployment);
      },
      error => {
        console.log(this.deployment);
        this.deployment.infraid = 'kamuid';
        this.deployment.templateKey = this.buildTemplate.$key;
        this.deployment.graph = this.buildTemplate.graph;
        this.onSubmitDialog.emit(this.deployment);
        console.log(error);
      }
    );

    this.myNgForm.resetForm();
  }
}
