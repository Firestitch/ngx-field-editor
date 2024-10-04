import {
  ChangeDetectionStrategy, Component, Input, OnInit, Optional, ViewChild,
} from '@angular/core';
import { ControlContainer, NgForm, NgModel } from '@angular/forms';

import { MatLegacyCheckboxChange as MatCheckboxChange } from '@angular/material/legacy-checkbox';

import { controlContainerFactory } from '@firestitch/core';

import { FieldOption } from '../../../../interfaces';
import { FieldComponent } from '../field/field.component';


@Component({
  selector: 'fs-field-render-checkbox',
  templateUrl: './field-render-checkbox.component.html',
  styleUrls: ['./field-render-checkbox.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: controlContainerFactory,
      deps: [[new Optional(), NgForm]],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldRenderCheckboxComponent extends FieldComponent implements OnInit {

  @Input() declare public field: FieldOption;

  @ViewChild('checkboxes', { read: NgModel })
  public checkboxes: NgModel;

  public other = false;
  public otherValue = '';

  public ngOnInit(): void {
    this.other = !!this.field.data.value.other;
    this.otherValue = this.field.data.value.other;
  }

  public otherInputClick(event: MouseEvent) {
    this.other = true;
    this.field.data.value.other = this.otherValue;
    this.checkboxes.control.updateValueAndValidity();
  }

  public otherChange(value) {
    if (!value) {
      this.field.data.value.other = '';
    }
  }

  public otherInputChange(value) {
    this.field.data.value.other = value;
    this.changed.emit(this.field);
  }

  public otherCheckboxClick(event: KeyboardEvent) {
    event.preventDefault();
    this.checkboxes.control.updateValueAndValidity();
    this.changed.emit(this.field);
  }

  public checkboxChange(event: MatCheckboxChange, input) {
    if (event.checked) {
      setTimeout(() => {
        input.focus();
      });
    }
  }

  public validate = () => {
    const hasValue = this.field.data.value.selected.length
      || (this.field.configs.other && this.other);

    if (this.field.configs.required === true && !hasValue) {
      throw new Error('This field is required');
    }
  };

}
