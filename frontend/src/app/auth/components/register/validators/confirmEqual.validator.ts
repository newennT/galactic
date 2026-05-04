import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function confirmEqualValidator(
  controlName: string,
  matchingControlName: string
): ValidatorFn {

  return (formGroup: AbstractControl): ValidationErrors | null => {

    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) return null;

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({
        ...matchingControl.errors,
        mismatch: true
      });
    } else {
      const errors = matchingControl.errors;
      if (errors) {
        delete errors['mismatch'];
        matchingControl.setErrors(Object.keys(errors).length ? errors : null);
      }
    }

    return null;
  };
}