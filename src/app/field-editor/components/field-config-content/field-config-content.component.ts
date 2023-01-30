import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { throwError } from 'rxjs';

import { FsHtmlEditorConfig } from '@firestitch/html-editor';

import { FieldComponent } from '../field/field.component';
import { FieldAction } from '../../../enums';


@Component({
  selector: 'fs-field-config-content',
  templateUrl: 'field-config-content.component.html',
  styleUrls: ['field-config-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldConfigContentComponent extends FieldComponent implements OnInit {

  public config: FsHtmlEditorConfig = {};

  public ngOnInit() {
    this.config = {
      ...this.field.config.configs,
      autofocus: false,
      image: {
        upload: (file: File) => {
          return this.fieldEditor.fieldAction(FieldAction.ImageUpload, this.field)
          .subscribe(() => {
            if(this.fieldEditor.config.imageUpload) { 
              this.fieldEditor.config.imageUpload(this.field, file);
            }
          });
        }
      }
    };
  }

}
