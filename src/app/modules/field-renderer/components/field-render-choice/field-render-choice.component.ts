import {
  ChangeDetectionStrategy, Component, Input, OnInit, Optional, ViewChild,
} from '@angular/core';
import { ControlContainer, NgForm, NgModel } from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';

import { FieldOption } from '../../../../interfaces';
import { FieldComponent } from '../field/field.component';


@Component({
  selector: 'fs-field-render-choice',
  templateUrl: './field-render-choice.component.html',
  styleUrls: ['./field-render-choice.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: controlContainerFactory,
      deps: [[new Optional(), NgForm]],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldRenderChoiceComponent extends FieldComponent implements OnInit {

  @Input() public field: FieldOption;

  @ViewChild('radiobuttons', { read: NgModel })
  public radiobuttons: NgModel;

  public otherValue = '';

  public ngOnInit(): void {
    this.otherValue = this.field.data.value.other;

    if (this.otherValue) {
      this.field.data.value.selected = 'other';
    }
  }

  public otherInputClick() {
    this.field.data.value.selected = 'other';
    this.field.data.value.other = this.otherValue;
    this.changed.emit(this.field);
  }

  public otherInputChange(value) {
    this.field.data.value.other = value;
    this.changed.emit(this.field);
  }

  public radiosChange(value) {
    if (value !== 'other') {
      this.field.data.value.other = '';
    }

    this.changed.emit(this.field);
  }

  public radioChange(input) {
    setTimeout(() => {
      input.focus();
    });
  }

  public validate = () => {
    if (this.field.configs.required === true && !this.radiobuttons.value) {
      throw new Error('This field is required');
    }
  };
}
