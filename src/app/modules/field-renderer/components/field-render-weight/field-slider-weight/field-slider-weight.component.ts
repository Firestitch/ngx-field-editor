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

import { WeightValue } from '../field-input-weight/field-input-weight.component';


const KG_PER_LB = 0.45359237;


@Component({
  selector: 'fs-field-slider-weight',
  templateUrl: './field-slider-weight.component.html',
  styleUrls: ['./field-slider-weight.component.scss'],
  host: { class: 'fs-form-wrapper' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FieldSliderWeightComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FieldSliderWeightComponent),
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
export class FieldSliderWeightComponent implements ControlValueAccessor, Validator, OnChanges {

  @Input() public label: string | null = null;
  @Input() public hint: string | null = null;
  @Input() public required = false;
  @Input() public disabled = false;
  @Input() public showUnitToggle = true;
  @Input() public minLb = 80;
  @Input() public maxLb = 400;

  public unit: 'lb' | 'kg' = 'lb';
  public value: number | null = null;

  private _cdRef = inject(ChangeDetectorRef);
  private _onChange: (value: WeightValue | null) => void = () => {
    //
  };
  private _onTouched: () => void = () => {
    //
  };

  public get sliderMin(): number {
    return this.unit === 'lb'
      ? Math.round(this.minLb)
      : Math.round(this.minLb * KG_PER_LB);
  }

  public get sliderMax(): number {
    return this.unit === 'lb'
      ? Math.round(this.maxLb)
      : Math.round(this.maxLb * KG_PER_LB);
  }

  public get displayValue(): { number: string; unit: string | null } {
    const value = this.value ?? this.sliderMin;

    return {
      number: String(value),
      unit: this.showUnitToggle ? null : this._unitLabel(this.unit),
    };
  }

  public get displayMin(): string {
    return `${this.sliderMin} ${this._unitLabel(this.unit)}`;
  }

  public get displayMax(): string {
    return `${this.sliderMax} ${this._unitLabel(this.unit)}`;
  }

  public get thumbValue(): number {
    return this.value ?? this.sliderMin;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ((changes.minLb || changes.maxLb) && this.value !== null) {
      this.value = this._clamp(this.value);
      this._emit();
    }
  }

  public writeValue(value: WeightValue | null): void {
    this.unit = value?.unit ?? 'lb';

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

  public validate(_control: AbstractControl): ValidationErrors | null {
    if (this.required && this.value === null) {
      return { required: 'This field is required' };
    }

    return null;
  }

  public unitChange(unit: 'lb' | 'kg'): void {
    if (unit === this.unit) {
      return;
    }

    if (this.value !== null) {
      this.value = unit === 'kg'
        ? Math.round(this.value * KG_PER_LB)
        : Math.round(this.value / KG_PER_LB);
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

  private _unitLabel(unit: 'lb' | 'kg'): string {
    return unit === 'lb' ? 'lbs' : 'kg';
  }
}
