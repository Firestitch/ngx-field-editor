import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgForm,
  NgModel,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { Field } from '@firestitch/field-editor';


@Component({
  selector: 'app-terms-field-config',
  templateUrl: './terms-field-config.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TermsFieldConfigComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef( () => TermsFieldConfigComponent),
      multi: true,
    },
    {
      provide: ControlContainer,
      useExisting: NgForm,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsFieldConfigComponent implements Validator, ControlValueAccessor {

  @ViewChild('url', { read: NgModel })
  private _urlModel: NgModel;

  private _onChange: (value: unknown) => void;
  private _onTouch: (value: unknown) => void;

  private _disabled = false;
  private _field: Field = null;

  constructor(
    private _cdRef: ChangeDetectorRef,
  ) {
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  public get field(): Field {
    return this._field;
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    if (this.field?.config?.configs?.termsContentSource === 'url' && !this._urlModel?.control.valid) {
      return {
        url: false,
      };
    }

    return null;
  }

  public writeValue(obj: Field | undefined): void {
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
