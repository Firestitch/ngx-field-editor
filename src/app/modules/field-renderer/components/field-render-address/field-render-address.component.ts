import { ChangeDetectionStrategy, Component, OnInit, Optional } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { IFsAddressConfig, FsAddressModule } from '@firestitch/address';
import { controlContainerFactory } from '@firestitch/core';

import { FieldComponent } from '../field/field.component';


@Component({
    selector: 'fs-field-render-address',
    styleUrls: ['./field-render-address.component.scss'],
    templateUrl: './field-render-address.component.html',
    viewProviders: [
        {
            provide: ControlContainer,
            useFactory: controlContainerFactory,
            deps: [[new Optional(), NgForm]],
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsAddressModule],
})
export class FieldRenderAddressComponent extends FieldComponent implements OnInit {

  public config: IFsAddressConfig;

  public ngOnInit(): void {
    this.config = {
      label: this.field.label,
      hint: this.field.description,
      name: {
        visible: false,
      },
      street: {
        visible: this.field.configs.street.enabled,
        required: this.field.configs.street.required,
        disabled: this.disabled,
        placeholder: this.field.configs.street.label,
      },
      address2: {
        visible: this.field.configs.address2.enabled,
        required: this.field.configs.address2.required,
        disabled: this.disabled,
        placeholder: this.field.configs.address2.label,
      },
      city: {
        visible: this.field.configs.city.enabled,
        required: this.field.configs.city.required,
        disabled: this.disabled,
        placeholder: this.field.configs.city.label,
      },
      region: {
        visible: this.field.configs.region.enabled,
        required: this.field.configs.region.required,
        disabled: this.disabled,
        placeholder: this.field.configs.region.label,
      },
      zip: {
        visible: this.field.configs.zip.enabled,
        required: this.field.configs.zip.required,
        disabled: this.disabled,
        placeholder: this.field.configs.zip.label,
      },
      country: {
        visible: this.field.configs.country.enabled,
        required: this.field.configs.country.required,
        disabled: this.disabled,
        placeholder: this.field.configs.country.label,
      },
    };
  }

}
