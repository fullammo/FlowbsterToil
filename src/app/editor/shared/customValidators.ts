import { ValidatorFn, AbstractControl } from '@angular/forms';

export function forbiddenNameValidator(forbiddenNames: string[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const forbidden = forbiddenNames.includes(control.value);
    return forbidden ? { 'forbiddenName': { value: control.value } } : null;
  };
}

export function forbiddenRegexpValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? {'forbiddenName': {value: control.value}} : null;
  };
}
