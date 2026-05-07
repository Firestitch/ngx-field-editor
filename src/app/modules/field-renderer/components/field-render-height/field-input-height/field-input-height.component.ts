import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject, Input } from '@angular/core';
import {
  AbstractControl, ControlValueAccessor, FormsModule,
  NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator,
} from '@angular/forms';

import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';


export interface HeightValue {
  unit: 'in' | 'cm';
  value: number | null;
}


@Component({
  selector: 'fs-field-input-height',
  templateUrl: './field-input-height.component.html',
  styleUrls: ['./field-input-height.component.scss'],
  host: { class: 'fs-form-wrapper' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FieldInputHeightComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FieldInputHeightComponent),
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
export class FieldInputHeightComponent implements ControlValueAccessor, Validator {

  @Input() public label: string | null = null;
  @Input() public hint: string | null = null;
  @Input() public required = false;
  @Input() public disabled = false;
  @Input() public showUnitToggle = true;

  public unit: 'in' | 'cm' = 'in';
  public feet: number | null = null;
  public inches: number | null = null;
  public cm: number | null = null;

  private _cdRef = inject(ChangeDetectorRef);


  public writeValue(value: HeightValue | null): void {
    if (!value) {
      this.unit = 'in';
      this.feet = null;
      this.inches = null;
      this.cm = null;
      this._cdRef.markForCheck();

      return;
    }

    this.unit = value.unit ?? 'in';

    if (this.unit === 'in') {
      const total = value.value;

      if (total === null || total === undefined) {
        this.feet = null;
        this.inches = null;
      } else {
        const intTotal = Math.max(0, Math.floor(Number(total)));
        this.feet = Math.floor(intTotal / 12);
        this.inches = intTotal % 12;
      }
      this.cm = null;
    } else {
      this.cm = value.value === null || value.value === undefined
        ? null
        : Math.max(0, Math.floor(Number(value.value)));
      this.feet = null;
      this.inches = null;
    }

    this._cdRef.markForCheck();
  }

  public registerOnChange(fn: (value: HeightValue | null) => void): void {
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
    if (this.required) {
      if (this.unit === 'in' && this.feet === null && this.inches === null) {
        return { required: 'This field is required' };
      }

      if (this.unit === 'cm' && this.cm === null) {
        return { required: 'This field is required' };
      }
    }

    if (this.unit === 'in' && this.inches !== null && (this.inches < 0 || this.inches > 11)) {
      return { range: 'Inches must be between 0 and 11' };
    }

    return null;
  }

  public unitChange(unit: 'in' | 'cm'): void {
    this.unit = unit;
    this.feet = null;
    this.inches = null;
    this.cm = null;
    this._emit();
  }

  public feetInchesChange(): void {
    this.feet = this._coerce(this.feet);
    this.inches = this._coerce(this.inches);
    this._emit();
  }

  public cmChange(): void {
    this.cm = this._coerce(this.cm);
    this._emit();
  }

  private _onChange: (value: HeightValue | null) => void = () => {
    //
  };
  private _onTouched: () => void = () => {
    //
  };
  
  private _emit(): void {
    const value = this.unit === 'in'
      ? (this.feet === null && this.inches === null ? null : (this.feet ?? 0) * 12 + (this.inches ?? 0))
      : this.cm;

    this._onChange({ unit: this.unit, value });
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
