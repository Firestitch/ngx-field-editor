import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { FsApiFile } from '@firestitch/api';
import { parseLocal } from '@firestitch/date';

import { FieldType } from '../../../../enums/field-type';
import { initField } from '../../../../helpers';
import { Field, FieldFile } from '../../../../interfaces';


@Component({
  selector: 'fs-field-view',
  templateUrl: './field-view.component.html',
  styleUrls: ['./field-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldViewComponent implements OnChanges {

  @Input() public field: Field;
  @Input() public data: any;
  @Input() public filePreviewDownload: (field: Field, file: FieldFile) => FsApiFile;
  @Input() public fileDownload: (field: Field, file: FieldFile) => FsApiFile;

  public FieldType = FieldType;

  public ngOnChanges(changes: SimpleChanges): void {
    if(changes.field) {
      const field = {
        ...this.field,
      };

      if(this.data) {
        field.data = this.data;
      }

      this.field = initField(field);
    }
  }

  public get dateLocal(): Date {
    if ((this.field.type as FieldType) !== FieldType.Date) {
      return null;
    }

    return parseLocal(this.field.data.value);
  }

}
