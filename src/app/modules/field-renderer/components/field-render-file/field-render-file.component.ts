import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { of } from 'rxjs';

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

  public validate = () => {
    if(this.field.configs.required && !this.field.data.files?.length) {
      return of({ required: true });
    }

    return of(null);
  };

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
