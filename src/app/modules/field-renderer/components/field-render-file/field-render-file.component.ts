import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

import { FieldComponent } from '../field/field.component';


@Component({
  selector: 'fs-field-render-file',
  templateUrl: './field-render-file.component.html',
  styleUrls: ['./field-render-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldRenderFileComponent extends FieldComponent implements OnInit {

  public accept;

  public change(files: any) {
    this.field.data.files = files;
  }

  public ngOnInit(): void {
    const config = this.field?.configs?.allowedFileTypes || {};
    const allowedTypes = this._getAllowedTypes(config);
    this.accept = allowedTypes.length ? allowedTypes.join(',') : '*';
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
