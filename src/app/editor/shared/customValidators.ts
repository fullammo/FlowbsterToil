import { JointService } from 'app/editor/shared/joint.service';
import { Observable } from 'rxjs/Observable';
import { AbstractControl } from '@angular/forms';

export class NodeValidator {
  static isNodeUnique(jointSVC: JointService) {
    return (control: AbstractControl) => {
      return new Observable((obs: any) => {
        control
          .valueChanges
          .filter(value => {
            if (value) {
              return value.length > 0;
            }
          })
          .debounceTime(500)
          .distinctUntilChanged()
          .flatMap(nodeName => jointSVC.isNodeNameUniqueObservable(nodeName))
          .subscribe(result => {
            result === false ?
              obs.next({ nodeNameExist: true }) : obs.next(null);
            obs.complete();
          });
      });
    };
  }

  static isWorkflowUnique(jointSVC: JointService) {
    return (control: AbstractControl) => {
      return new Observable((obs: any) => {
        control
          .valueChanges
          .filter(value => {
            if (value) {
              return value.length > 0;
            }
          })
          .debounceTime(500)
          .distinctUntilChanged()
          .flatMap(nodeName => jointSVC.isWorkflowNameUniqueObservable(nodeName))
          .subscribe(result => {
            result === false ?
              obs.next({ workflowNameExist: true }) : obs.next(null);
            obs.complete();
          });
      });
    };
  }

  static isUpdateUnique(jointSVC: JointService) {
    return (control: AbstractControl) => {
      return new Observable((obs: any) => {
        control
          .valueChanges
          .filter(value => {
            if (value) {
              return value.length > 0;
            }
          })
          .distinctUntilChanged()
          .flatMap(nodeName => jointSVC.isUpdateNodeNameUniqueObservable(nodeName))
          .subscribe(result => {
            result === false ?
              obs.next({ nodeNameExist: true }) : obs.next(null);
            obs.complete();
          });
      });
    };
  }
}
