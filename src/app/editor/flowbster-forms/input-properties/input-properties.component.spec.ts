import { PortValidator } from 'app/editor/flowbster-forms/shared/customValidators';
import { Observable } from 'rxjs/Observable';
import { InputPort } from 'app/editor/flowbster-forms/input-properties/inputPort';
import { FormBuilder, NgForm } from '@angular/forms';
import { InputPropertiesComponent } from 'app/editor/flowbster-forms/input-properties/input-properties.component';

import 'rxjs/add/observable/of';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JointService } from 'app/editor/flowbster-forms/shared/joint.service';
import { componentFactoryName } from '@angular/compiler';
import { AbstractControl, FormGroup } from '@angular/forms/src/model';

// xdescribe('InputPropertiesComponent', () => {
//   let component: InputPropertiesComponent;
//   let fixture: ComponentFixture<InputPropertiesComponent>;

//   beforeEach(
//     async(() => {
//       TestBed.configureTestingModule({
//         declarations: [InputPropertiesComponent]
//       }).compileComponents();
//     })
//   );

//   beforeEach(() => {
//     fixture = TestBed.createComponent(InputPropertiesComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should be created', () => {
//     expect(component).toBeTruthy();
//   });
// });

describe('InputPropertiesComponent Isolated', () => {
  let component: InputPropertiesComponent;
  let form: FormGroup;
  let jointSVC: JointService;
  let jointSpy: jasmine.Spy;

  const fileControlName = 'name';
  const displayControlName = 'displayName';
  const checkboxControlname = 'collector';
  const formatControlName = 'format';

  const testForm = <NgForm>{
    value: {
      name: 'Test'
    },
    resetForm: () => {}
  };

  beforeEach(() => {
    jointSVC = new JointService();
    component = new InputPropertiesComponent(new FormBuilder(), jointSVC);
    jointSpy = spyOn(jointSVC, 'isPortNameUniqueObservable').and.returnValue(
      Observable.of(['testMatchingName', 'testMatchingName2'])
    );
    component.ngOnInit();
    form = component.userform;
  });

  it('should create the form with 4 controls', () => {
    expect(form.get(fileControlName)).toBeTruthy();
    expect(form.get(displayControlName)).toBeTruthy();
    expect(form.get(checkboxControlname)).toBeTruthy();
    expect(form.get(formatControlName)).toBeTruthy();
  });

  it('should make the file name control required', () => {
    const control = form.get(fileControlName);

    control.setValue('');

    expect(control.valid).toBeFalsy();
  });

  it('should raise onSubmitDialog event when the form is submitted', () => {
    let input: InputPort = null;
    component.onSubmitDialog.subscribe(
      submittedInput => (input = submittedInput)
    );
    component.myNgForm = testForm;

    component.onSubmit();

    expect(input).not.toBeNull();
  });

  it('should call the reset method for ngForm on submission', () => {
    component.myNgForm = testForm;
    const spy = spyOn(component.myNgForm, 'resetForm');

    component.onSubmit();

    expect(spy.calls.count()).toBe(1);
  });

  it('should initialize the format control disabled', () => {
    expect(form.contains(formatControlName)).toBeFalsy();
  });

  it('should initialize the form when the component gets initialized', () => {
    expect(component.userform).toBeDefined();
  });

  it('should get the format control enabled when the checkbox is toggled', () => {
    const collectorControl = form.get(checkboxControlname);
    collectorControl.setValue(true);

    component.onCheckboxToggle();

    expect(form.contains(formatControlName)).toBeTruthy();
  });

  it('should get the formatControl still disabled when the checkbox is toggled', () => {
    const collectorControl = form.get(checkboxControlname);
    collectorControl.setValue(false);

    component.onCheckboxToggle();

    expect(form.contains(formatControlName)).toBeFalsy();
  });

  it('should disable all control when the form is in read only mode', () => {
    component.readOnly = true;

    component.userform = component.initForm();
    form = component.userform;

    expect(form.contains(fileControlName)).toBeFalsy();
    expect(form.contains(displayControlName)).toBeFalsy();
    expect(form.contains(checkboxControlname)).toBeFalsy();
    expect(form.contains(formatControlName)).toBeFalsy();
  });
});
