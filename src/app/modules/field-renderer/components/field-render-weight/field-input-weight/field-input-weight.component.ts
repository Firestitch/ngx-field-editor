import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject, Input } from '@angular/core';
import {
  AbstractControl, ControlValueAccessor, FormsModule,
  NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator,
} from '@angular/forms';

import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';


export interface WeightValue {
  unit: 'lb' | 'kg';
  value: number | null;
}


@Component({
  selector: 'fs-field-input-weight',
  templateUrl: './field-input-weight.component.html',
  styleUrls: ['./field-input-weight.component.scss'],
  host: { class: 'fs-form-wrapper' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FieldInputWeightComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FieldInputWeightComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatSuffix,
    MatButtonToggleGroup,
    MatButtonToggle,
  ],
})
export class FieldInputWeightComponent implements ControlValueAccessor, Validator {

  @Input() public label: string | null = null;
  @Input() public hint: string | null = null;
  @Input() public required = false;
  @Input() public disabled = false;
  @Input() public showUnitToggle = true;

  public unit: 'lb' | 'kg' = 'lb';
  public value: number | null = null;

  private _cdRef = inject(ChangeDetectorRef);
  private _onChange: (value: WeightValue | null) => void = () => {
    //
  };
  private _onTouched: () => void = () => {
    //
  };

  public writeValue(value: WeightValue | null): void {
    if (!value) {
      this.unit = 'lb';
      this.value = null;
      this._cdRef.markForCheck();

      return;
    }

    this.unit = value.unit ?? 'lb';
    this.value = value.value === null || value.value === undefined
      ? null
      : Math.max(0, Math.floor(Number(value.value)));

    this._cdRef.markForCheck();
  }

  public registerOnChange(fn: (value: WeightValue | null) => void): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._cdRef.markForCheck();
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    if (this.required && this.value === null) {
      return { required: 'This field is required' };
    }

    return null;
  }

  public unitChange(unit: 'lb' | 'kg'): void {
    this.unit = unit;
    this.value = null;
    this._emit();
  }

  public valueChange(): void {
    this.value = this._coerce(this.value);
    this._emit();
  }

  private _emit(): void {
    this._onChange({ unit: this.unit, value: this.value });
    this._onTouched();
  }

  private _coerce(value: number | null): number | null {
    if (value === null || value === undefined) {
      return null;
    }

    const num = Number(value);

    return Number.isFinite(num) ? Math.max(0, Math.floor(num)) : null;
  }
}
