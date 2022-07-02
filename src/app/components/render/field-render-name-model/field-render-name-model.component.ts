import {ChangeDetectionStrategy, Component, forwardRef, Input} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

import { FieldComponent } from '../../field/field.component';

@Component({
  selector: 'fs-field-render-name-model',
  templateUrl: './field-render-name-model.component.html',
  styleUrls: ['./field-render-name-model.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FieldRenderNameModelComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: FieldRenderNameModelComponent,
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldRenderNameModelComponent extends FieldComponent implements ControlValueAccessor, Validator {

  @Input() public field;
  @Input() public disabled = false;

  value;

  onChange: (_: any) => void = (_: any) => {};
  onTouched: () => void = () => {};

  change(event, name) {
    this.field.data.value[name] = event;
    this.onChange(this.field.data.value);
  }

  writeValue(value: number): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const errors = [];
    if(this.field.config.configs.required) {
      if(!this.field.data.value.firstName) {
        errors.push('first name');
      }

      if(!this.field.data.value.lastName) {
        errors.push('last name');
      }
    }

    if(errors.length) {
      let message =  `${errors.join(' and ')} ${errors.length > 1 ? 'are' : 'is'} required`;
      message = message.charAt(0).toUpperCase() + message.slice(1);

      return { 'firstLastName': message };
    }
     
    return null;
  }
}
