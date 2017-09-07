import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'toil-workflow-maint',
  templateUrl: './workflow-maint.component.html',
  styleUrls: ['./workflow-maint.component.scss']
})
export class WorkflowMaintComponent implements OnInit {

  workflowEntries: FirebaseListObservable<any[]>;

  constructor(db: AngularFireDatabase) {
    this.workflowEntries = db.list('/items');
  }

  ngOnInit() {
  }

}
