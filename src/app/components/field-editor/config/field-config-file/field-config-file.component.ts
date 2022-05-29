import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { FieldComponent } from '../../../field/field.component';


@Component({
  selector: 'fs-field-config-file',
  templateUrl: 'field-config-file.component.html',
  styleUrls: ['field-config-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldConfigFileComponent extends FieldComponent implements OnInit {

  public imageQuality;

  public ngOnInit(): void {
    super.ngOnInit();

    this.imageQuality = this.field.config.configs.imageQuality * 100;
  }

  public imageQualityChange(value): void {
    this.field.config.configs.imageQuality = value / 100;
    this.changed.emit(this.field.config.configs.imageQuality);
  }

}
