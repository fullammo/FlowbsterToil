import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Input } from '@angular/core';
import {
  DataAccessService,
  DataEntry
} from 'app/workflow/shared/data-access.service';
import { DeploymentService } from 'app/workflow/shared/deployment.service';
import { ExperimentService } from 'app/workflow/shared/experiment.service';
import { Experiment } from 'app/workflow/shared/experiment';
import { Deployment } from 'app/workflow/shared/deployment';

export abstract class ManagerComponent<T, S extends DataEntry>
  implements OnInit, OnDestroy {
  @Input() contextEntry: S;

  dataTableEntries: T[];
  selectedEntries: T[];

  modalVisible: boolean;

  constructor(private dataAccessSVC: DataAccessService<T>) {}

  ngOnInit() {
    this.modalVisible = false;

    this.chooseService();

    this.dataAccessSVC.dataChange.subscribe(entries => {
      this.dataTableEntries = entries;
    });

    (this.contextEntry as DataEntry) = {
      name: ''
    };
  }

  // not a very good solution.
  private chooseService(): void {
    if (this.dataAccessSVC instanceof DeploymentService) {
      (this.dataAccessSVC as DeploymentService).subscribeToDataChanges(
        this.contextEntry.$key
      );
    } else if (this.dataAccessSVC instanceof ExperimentService) {
      (this.dataAccessSVC as ExperimentService).subscribeToDeploymentChanges(
        this.contextEntry as Deployment
      );
    } else {
      this.dataAccessSVC.subscribeToDataChanges();
    }
  }

  ngOnDestroy() {
    this.dataAccessSVC.subscription.unsubscribe();
  }

  onModalButtonClick(entry: S) {
    this.contextEntry = entry;
    this.modalVisible = true;
  }
}
