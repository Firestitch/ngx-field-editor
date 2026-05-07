import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';

import { FieldComponent } from '../field/field.component';


@Component({
  selector: 'fs-field-config-height',
  templateUrl: './field-config-height.component.html',
  styleUrls: ['./field-config-height.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    FsFormModule,
    FsLabelModule,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatCheckbox,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
  ],
})
export class FieldConfigHeightComponent extends FieldComponent {

  public interfaceChange(value: 'input' | 'slider'): void {
    if (this.field.configs.interface === value) {
      return;
    }

    this.field.configs.interface = value;
    this._resetValue();
    this.fieldSave();
  }

  public configChange(): void {
    this._normalizeMinMax();
    this.fieldSave();
  }

  private _resetValue(): void {
    if (!this.field.data) {
      this.field.data = {};
    }

    this.field.data.value = {
      unit: this.field.data.value?.unit ?? 'in',
      value: null,
    };
  }

  private _normalizeMinMax(): void {
    const min = Number(this.field.configs.min);
    const max = Number(this.field.configs.max);

    if (!Number.isFinite(min) || min < 1) {
      this.field.configs.min = 1;
    }

    if (!Number.isFinite(max) || max <= Number(this.field.configs.min)) {
      this.field.configs.max = Number(this.field.configs.min) + 1;
    }
  }
}
