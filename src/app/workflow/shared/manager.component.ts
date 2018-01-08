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

/**
 * Holds the implementation of a basic datatable manager component.
 */
export abstract class ManagerComponent<T, S extends DataEntry>
  implements OnInit, OnDestroy {

  /**
   * The generic context Entry of the Component, where it is getting made from.
   */
  @Input() contextEntry: S;

  /**
   * The holding array of the generic table entries,that is represented in the table.
   */
  dataTableEntries: T[];

  /**
   *The holding array of the selected table entries.
   */
  selectedEntries: T[];

  /**
   * An indicator that turns or shuts the modal's visibility.
   */
  modalVisible: boolean;

  /**
   * Initializes the service for dataAccess.
   * @param dataAccessSVC The Generic dataService that provides DataAccess to the generic entities
   */
  constructor(private dataAccessSVC: DataAccessService<T>) {}

  /**
   * Sets the modal off, and populates the dataTable with Database Entries.
   * Initializes the contextEntry.
   */
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

  /**
   * Based on the generic services, changes the subscription.
   */
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

  /**
   * Whenever the component gets destroyed,it unsubscribes from the dataAccesses subscription.
   */
  ngOnDestroy() {
    this.dataAccessSVC.subscription.unsubscribe();
  }

  /**
   * When the create button is clicked, it sets the context Entry of the actual dataTabel record,
   * and brings up the contextualization Modal.
   * @param entry
   */
  onModalButtonClick(entry: S) {
    this.contextEntry = entry;
    this.modalVisible = true;
  }
}
