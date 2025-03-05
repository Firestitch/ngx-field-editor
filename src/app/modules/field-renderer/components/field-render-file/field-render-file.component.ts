import { ChangeDetectionStrategy, Component, OnInit, Optional } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';


import { FieldComponent } from '../field/field.component';


@Component({
  selector: 'fs-field-render-file',
  templateUrl: './field-render-file.component.html',
  styleUrls: ['./field-render-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ControlContainer,
      useFactory: controlContainerFactory,
      deps: [[new Optional(), NgForm]],
    },
  ],
})
export class FieldRenderFileComponent extends FieldComponent implements OnInit {

  public accept;
  public required = false;

  public change(files: any) {
    this.field.data.files = files;
    this.updateRequired();
  }

  public ngOnInit(): void {
    const config = this.field?.configs?.allowedFileTypes || {};
    const allowedTypes = this._getAllowedTypes(config);
    this.accept = allowedTypes.length ? allowedTypes.join(',') : '*';
    this.updateRequired();
  }

  public updateRequired() {
    this.required = this.field.configs.required && !this.field.data.files?.length;
  }

  private _getAllowedTypes(allowedTypes) {
    const allowed = [];

    if (allowedTypes.image) {
      allowed.push('image/*');
    }

    if (allowedTypes.video) {
      allowed.push('video/*');
    }

    if (allowedTypes.pdf) {
      allowed.push('application/pdf');
    }

    return allowed;
  }

}
