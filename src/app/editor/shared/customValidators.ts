import { JointService } from 'app/editor/shared/joint.service';
import { Observable } from 'rxjs/Observable';
import { AbstractControl } from '@angular/forms';

export class NodeValidator {
  static isUnique(jointSVC: JointService) {
    return (control: AbstractControl) => {
      return new Observable((obs: any) => {
        control
          .valueChanges
          .debounceTime(500)
          .filter(value => {
            if (value) {
              return value.length > 0;
            }
          })
          .distinctUntilChanged()
          .flatMap(nodeName => jointSVC.isUniqueNodeName(nodeName))
          .subscribe(result => {
            result === false ?
              obs.next({ nodeNameExist: true }) : obs.next(null);
            obs.complete();
          });
      });
    };
  }
}
