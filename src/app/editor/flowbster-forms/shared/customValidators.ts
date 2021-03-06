import { JointService } from 'app/editor/flowbster-forms/shared/joint.service';
import { Observable } from 'rxjs/Observable';
import { AbstractControl } from '@angular/forms';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/distinctUntilChanged';

/**
 * Holds the neccessary Observable based functions that are used in node validation.
 */
export class NodeValidator {
  /**
   * If the input controls value is changing,
   * then it will check the JointService about the changes made to the Nodes list and workflow name
   * and compare that list with the actual value.
   * If that exists, then this function emits an error message, that says the node exists, otherwise it can work uninterruptedly.
   * @param jointSVC The singleton instance of the JointService.
   * @returns an Observable that informs you about the node's uniqueness.
   */
  static isNodeUnique(jointSVC: JointService) {
    return (control: AbstractControl) => {
      return new Observable((obs: any) => {
        control.valueChanges
          .filter(value => {
            if (value) {
              return value.length > 0;
            }
          })
          .debounceTime(500)
          .distinctUntilChanged()
          .flatMap(nodeName => jointSVC.isNodeNameUniqueObservable(nodeName))
          .subscribe(result => {
            result === false
              ? obs.next({ nodeNameExist: true })
              : obs.next(null);
            obs.complete();
          });
      });
    };
  }

  /**
    If the input controls value is changing,
   * then it will check the JointService about the changes made to the Nodes list and compare that list with the actual value.
   * If that exists, then this function emits an error message, that says the node exists, otherwise it can work uninterruptedly.
   * @param jointSVC The singleton instance of the JointService.
   * @returns an Observable that informs you about the worfklow's uniqueness.
   */
  static isWorkflowUnique(jointSVC: JointService) {
    return (control: AbstractControl) => {
      return new Observable((obs: any) => {
        control.valueChanges
          .filter(value => {
            if (value) {
              return value.length > 0;
            }
          })
          .debounceTime(500)
          .distinctUntilChanged()
          .flatMap(nodeName =>
            jointSVC.isWorkflowNameUniqueObservable(nodeName)
          )
          .subscribe(result => {
            result === false
              ? obs.next({ workflowNameExist: true })
              : obs.next(null);
            obs.complete();
          });
      });
    };
  }

  /**
    If the input controls value is changing,
   * then it will check the JointService about the changes made to the Nodes list
   * including the old name of the updated node too and the workflow,
   * and compares that list with the actual value.
   * If that exists, then this function emits an error message, that says the node exists, otherwise it can work uninterruptedly.
   * @param jointSVC The singleton instance of the JointService.
   * @returns an Observable that informs you about the update node's uniqueness.
   */
  static isUpdateUnique(jointSVC: JointService) {
    return (control: AbstractControl) => {
      return new Observable((obs: any) => {
        control.valueChanges
          .filter(value => {
            if (value) {
              return value.length > 0;
            }
          })
          .distinctUntilChanged()
          .flatMap(nodeName =>
            jointSVC.isUpdateNodeNameUniqueObservable(nodeName)
          )
          .subscribe(result => {
            result === false
              ? obs.next({ nodeNameExist: true })
              : obs.next(null);
            obs.complete();
          });
      });
    };
  }
}

/**
 * Holds the neccessary methods to validate a Port.
 */
export class PortValidator {

  /**
   * Checks reactivly, that a Port name is unique through the entire workflow.
   * And feeds it to Validator control.
   * @param jointSVC The singleton Joint Service to be provided.
   */
  static isPortUnique(jointSVC: JointService) {
    return (control: AbstractControl) => {
      return new Observable((obs: any) => {
        control.valueChanges
          .filter(value => {
            if (value) {
              return value.length > 0;
            }
          })
          .debounceTime(500)
          .distinctUntilChanged()
          .flatMap(portName => jointSVC.isPortNameUniqueObservable(portName))
          .subscribe(result => {
            result === false
              ? obs.next({ portNameExist: true })
              : obs.next(null);
            obs.complete();
          });
      });
    };
  }
}
