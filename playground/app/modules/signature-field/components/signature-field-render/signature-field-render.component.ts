import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Field } from '@firestitch/field-editor';


@Component({
  selector: 'app-signature-field-render',
  templateUrl: './signature-field-render.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SignatureFieldRenderComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignatureFieldRenderComponent implements ControlValueAccessor {

  @Input() public disabled = false;

  public signature;
  public field;

  private _onChange: (value: unknown) => void;
  private _onTouch: (value: unknown) => void;

  constructor(
    private _cdRef: ChangeDetectorRef,
  ) {
  }

  public writeValue(field: Field | undefined): void {
    this.field = field;
    this.signature = field?.data.signature;
    this._cdRef.markForCheck();
  }

  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }

  public changed(signature): void {
    this._onChange({ 
      signature,
      date: new Date(),
    });
  }

}
