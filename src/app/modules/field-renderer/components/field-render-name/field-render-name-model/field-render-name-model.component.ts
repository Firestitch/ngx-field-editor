import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, FormsModule } from '@angular/forms';

import { FieldComponent } from '../../field/field.component';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FsFormModule } from '@firestitch/form';

@Component({
    selector: 'fs-field-render-name-model',
    templateUrl: './field-render-name-model.component.html',
    styleUrls: ['./field-render-name-model.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FieldRenderNameModelComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: FieldRenderNameModelComponent,
            multi: true,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatFormField,
        MatLabel,
        MatInput,
        FormsModule,
        FsFormModule,
        MatHint,
    ],
})
export class FieldRenderNameModelComponent extends FieldComponent implements ControlValueAccessor, Validator {

  @Input() public disabled = false;

  public value;

  public onChange: (_: any) => void = (_: any) => { 
    //
  };
  public onTouched: () => void = () => {
    //
  };

  public change(event, name) {
    this.field.data.value[name] = event;
    this.onChange(this.field.data.value);
  }

  public writeValue(value: number): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    const errors = [];
    if (this.field.configs.required) {
      if (!this.field.data.value.firstName) {
        errors.push('first name');
      }

      if (!this.field.data.value.lastName) {
        errors.push('last name');
      }
    }

    if (errors.length) {
      let message = `${errors.join(' and ')} ${errors.length > 1 ? 'are' : 'is'} required`;
      message = message.charAt(0).toUpperCase() + message.slice(1);

      return { firstLastName: message };
    }

    return null;
  }
}
