import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Field } from '@firestitch/field-editor';
import { TermsFieldDialogComponent } from '../terms-field-dialog';


@Component({
  selector: 'app-terms-field-render',
  templateUrl: './terms-field-render.component.html',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: TermsFieldRenderComponent,
      multi: true,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TermsFieldRenderComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsFieldRenderComponent implements ControlValueAccessor, Validator {

  private _onChange: (value: unknown) => void;
  private _onTouch: (value: unknown) => void;

  private _disabled = false;
  private _field: Field = null;

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _dialog: MatDialog,
  ) {
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  public get field(): Field {
    return this._field;
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    let errors = null;

    if (this.field?.config.configs.required
      && !this._field.data.value
      && control.dirty
    ) {
      errors = { required: true };
    }

    this._cdRef.markForCheck();

    return errors;
  }

  public urlClick(event: UIEvent): void {
    event.stopPropagation();
  }

  public dialogClick(event: UIEvent): void {
    event.preventDefault();

    this._dialog.open(TermsFieldDialogComponent, {
      data: { content: this.field.config.configs.content },
      minWidth: '500px',
    });
  }

  public writeValue(obj: any): void {
    this._field = obj;
    this._cdRef.markForCheck();
  }

  public setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  public fieldChange(field: Field): void {
    this._field = field;
    this._onChange(field);
  }

  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }

}
