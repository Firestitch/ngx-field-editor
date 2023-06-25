import { ChangeDetectionStrategy, Component, ViewChild, Optional, OnInit, Input } from '@angular/core';
import { ControlContainer, NgForm, NgModel } from '@angular/forms';

import { MatCheckboxChange } from '@angular/material/checkbox';

import { controlContainerFactory } from '@firestitch/core';

import { FieldComponent } from '../field/field.component';
import { FieldOption } from '../../../interfaces';


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

  @Input() public field: FieldOption;

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
    if(!value) {
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
    if(event.checked) {
      setTimeout(() => {
        input.focus();
      });
    }
  }

  public validate = () => {
    if (this.field.configs.required === true && !this.field.data.value.selected.length) {
      throw new Error('This field is required');
    }
  };

}
