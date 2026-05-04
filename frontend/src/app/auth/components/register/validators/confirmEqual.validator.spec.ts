import { FormControl, FormGroup } from "@angular/forms"
import { confirmEqualValidator } from "./confirmEqual.validator";

describe('confirmEqualValidator', () => {
    it('should return null when controls are missing', () => {
        const form = new FormGroup({});
        const validator = confirmEqualValidator('password', 'confirm');
        const result = validator(form);
        expect(result).toBeNull();
    });

    it('should add mismatch error when values differ', () => {
        const form = new FormGroup({
            password: new FormControl('abc'),
            confirm: new FormControl('def'),
        });

        const validator = confirmEqualValidator('password', 'confirm');
        validator(form);
        expect(form.get('confirm')?.errors).toEqual({ mismatch: true });
    });

    it('should preserve existing errors when adding mismatch', () => {
        const form = new FormGroup({
            password: new FormControl('abc'),
            confirm: new FormControl('def'),
        });

        const confirmControl = form.get('confirm');
        confirmControl?.setErrors({ otherError: true });

        const validator = confirmEqualValidator('password', 'confirm');
        validator(form);
        expect(confirmControl?.errors).toEqual({
            otherError: true,
            mismatch: true
        });
    });

    it('should remove only mismatch error when values match', () => {
        const form = new FormGroup({
            password: new FormControl('abc'),
            confirm: new FormControl('abc'),
        });

        const confirmControl = form.get('confirm');
        confirmControl?.setErrors({ mismatch: true, required: true });
        const validator = confirmEqualValidator('password', 'confirm');
        validator(form);
        expect(confirmControl?.errors).toEqual({ required: true });
    });

    it('should set errors to null when no remaining errors exist', () => {
        const form = new FormGroup({
            password: new FormControl('abc'),
            confirm: new FormControl('abc'),
        });

        const confirmControl = form.get('confirm');
        confirmControl?.setErrors({ mismatch: true });
        const validator = confirmEqualValidator('password', 'confirm');
        validator(form);
        expect(confirmControl?.errors).toBeNull();
    });
})