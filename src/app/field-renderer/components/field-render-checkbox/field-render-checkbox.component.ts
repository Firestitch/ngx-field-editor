import { ChangeDetectionStrategy, Component, ViewChild, Optional, OnInit } from '@angular/core';
import { ControlContainer, NgForm, NgModel } from '@angular/forms';

import { MatCheckboxChange } from '@angular/material/checkbox';

import { controlContainerFactory } from '@firestitch/core';

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

  @ViewChild('checkboxes', { read: NgModel }) public checkboxes: NgModel;

  public other = false;

  public ngOnInit(): void {
    super.ngOnInit();
    this.other = this.field.data.value.selected.indexOf('other') !== -1;
  }

  public otherInputClick(event: MouseEvent) {
    if (this.field.data.value.selected.indexOf('other') === -1) {
      this.field.data.value.selected = [...this.field.data.value.selected, 'other'];
      this.other = true;
    }

    this.checkboxes.control.updateValueAndValidity();
  }

  public otherChange(value) {
    this.other = value;

    if(!this.other) {
      this.field.data.value.selected = this.field.data.value.selected
        .filter((item) => item !== 'other');
    }
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
