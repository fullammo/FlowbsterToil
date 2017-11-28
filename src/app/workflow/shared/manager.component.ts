import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Input } from '@angular/core';
import { DataAccessService } from 'app/workflow/shared/data-access.service';

export abstract class ManagerComponent<T, S> implements OnInit, OnDestroy {
  @Input() contextEntry: S;

  dataTableEntries: T[];
  selectedEntries: T[];

  modalVisible: boolean;

  constructor(
    private dataAccessSVC: DataAccessService<T>,
    private additionalPath: string = ''
  ) {}

  ngOnInit() {
    this.modalVisible = false;
    this.dataAccessSVC.subscribeToDataChanges(this.additionalPath);
    this.dataAccessSVC.dataChange.subscribe(entries => {
      this.dataTableEntries = entries;
    });
  }

  ngOnDestroy() {
    this.dataAccessSVC.subscription.unsubscribe();
  }

  onModalButtonClick(entry: S) {
    this.contextEntry = entry;
    this.modalVisible = true;
  }
}
