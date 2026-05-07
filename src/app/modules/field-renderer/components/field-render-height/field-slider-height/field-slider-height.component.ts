import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  forwardRef, inject, Input, OnChanges, SimpleChanges,
} from '@angular/core';
import {
  AbstractControl, ControlValueAccessor, FormsModule,
  NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator,
} from '@angular/forms';

import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';

import { HeightValue } from '../field-input-height/field-input-height.component';


const CM_PER_FOOT = 30.48;


@Component({
  selector: 'fs-field-slider-height',
  templateUrl: './field-slider-height.component.html',
  styleUrls: ['./field-slider-height.component.scss'],
  host: { class: 'fs-form-wrapper' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FieldSliderHeightComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FieldSliderHeightComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    MatSlider,
    MatSliderThumb,
    MatButtonToggleGroup,
    MatButtonToggle,
  ],
})
export class FieldSliderHeightComponent implements ControlValueAccessor, Validator, OnChanges {

  @Input() public label: string | null = null;
  @Input() public hint: string | null = null;
  @Input() public required = false;
  @Input() public disabled = false;
  @Input() public showUnitToggle = true;
  @Input() public minFeet = 4;
  @Input() public maxFeet = 7;

  public unit: 'in' | 'cm' = 'in';
  public value: number | null = null;
  public touched = false;

  private _cdRef = inject(ChangeDetectorRef);
  private _onChange: (value: HeightValue | null) => void = () => {
    //
  };
  private _onTouched: () => void = () => {
    //
  };

  public get sliderMin(): number {
    return this.unit === 'in'
      ? Math.round(this.minFeet * 12)
      : Math.round(this.minFeet * CM_PER_FOOT);
  }

  public get sliderMax(): number {
    return this.unit === 'in'
      ? Math.round(this.maxFeet * 12)
      : Math.round(this.maxFeet * CM_PER_FOOT);
  }

  public get displayValue(): { number: string; unit: string | null } {
    const value = this.value ?? this.sliderMin;

    if (this.unit === 'in') {
      const feet = Math.floor(value / 12);
      const inches = value % 12;

      return { number: `${feet}'${inches}"`, unit: null };
    }

    return {
      number: String(value),
      unit: this.showUnitToggle ? null : 'cm',
    };
  }

  public get displayMin(): string {
    return this._format(this.sliderMin, this.unit);
  }

  public get displayMax(): string {
    return this._format(this.sliderMax, this.unit);
  }

  public get thumbValue(): number {
    return this.value ?? this.sliderMin;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ((changes.minFeet || changes.maxFeet) && this.value !== null) {
      this.value = this._clamp(this.value);
      this._emit();
    }
  }

  public writeValue(value: HeightValue | null): void {
    this.unit = value?.unit ?? 'in';

    const incoming = value?.value;
    const hasValue = incoming !== null && incoming !== undefined;

    this.value = hasValue ? Math.round(Number(incoming)) : null;
    this._cdRef.markForCheck();

    if (!hasValue) {
      Promise.resolve().then(() => {
        if (this.value === null) {
          this.value = this.sliderMin;
          this._emit();
        }
      });
    }
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

  public validate(_control: AbstractControl): ValidationErrors | null {
    if (this.required && this.value === null) {
      return { required: 'This field is required' };
    }

    return null;
  }

  public unitChange(unit: 'in' | 'cm'): void {
    if (unit === this.unit) {
      return;
    }

    if (this.value !== null) {
      this.value = unit === 'cm'
        ? Math.round(this.value * (CM_PER_FOOT / 12))
        : Math.round(this.value * (12 / CM_PER_FOOT));
    }

    this.unit = unit;
    if (this.value !== null) {
      this.value = this._clamp(this.value);
    }

    this._emit();
  }

  public sliderInput(value: number | string): void {
    const num = Math.round(Number(value));
    this.value = Number.isFinite(num) ? num : null;
    this.touched = true;
    this._emit();
  }

  private _emit(): void {
    this._onChange({ unit: this.unit, value: this.value });
    this._onTouched();
    this._cdRef.markForCheck();
  }

  private _clamp(value: number): number {
    return Math.min(this.sliderMax, Math.max(this.sliderMin, value));
  }

  private _format(value: number, unit: 'in' | 'cm'): string {
    if (unit === 'in') {
      const feet = Math.floor(value / 12);
      const inches = value % 12;

      return `${feet}'${inches}"`;
    }

    return `${value} cm`;
  }
}
