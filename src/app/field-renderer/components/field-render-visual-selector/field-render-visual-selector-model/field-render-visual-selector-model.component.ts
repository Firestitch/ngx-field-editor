import { ChangeDetectionStrategy, Component, forwardRef, Optional } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, NgForm, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';

import { VisualSelectorFormat } from '../../../../enums';
import { FieldComponent } from '../../field';


@Component({
  selector: 'fs-field-render-visual-selector-model',
  templateUrl: 'field-render-visual-selector-model.component.html',
  styleUrls: [ 'field-render-visual-selector-model.component.scss' ],
  providers: [ 
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FieldRenderVisualSelectorModelComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: FieldRenderVisualSelectorModelComponent,
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldRenderVisualSelectorModelComponent extends FieldComponent implements ControlValueAccessor, Validator {
  
  public selected = {};
  public VisualSelectorFormat = VisualSelectorFormat;

  private _onChange: (value: unknown) => void;
  private _onTouch: (value: unknown) => void;
  
  public ngOnInit(): void {
    super.ngOnInit();

    this.selected = this.field.data.value.selected
    .reduce((accum, guid) => {
      return {
        ...accum,
        [guid]: true,
      }
    }, {});
  }

  
  public writeValue(value: number): void {
    //this.value = value;
  }

  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    if (this.field.config.configs.required === true && !this.field.data.value.selected.length) {
      return { required: 'This field is required' };
    }

    return null;
  }

  public select(option): void {
    const selected = !this.selected[option.guid];

    if(!this.configs.multipleSelection) {
      this.selected = {};  
    }

    this.selected[option.guid] = selected;
    this.field.data.value.selected = Object.keys(this.selected)
    .reduce((accum, name) => {
      if(this.selected[name]) {
        accum.push(name);
      }

      return accum;
    }, []);

    this.changed.emit(this.field);
    this._onChange(this.field);
  }
}
