import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Observable, throwError } from 'rxjs';

import { FsHtmlEditorConfig } from '@firestitch/html-editor';

import { FieldComponent } from '../field/field.component';
import { EditorAction } from '../../../enums';


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
      ...this.field.configs,
      autofocus: false,
      image: {
        upload: (file: File): Observable<string> => {
          return this.fieldEditor.action(EditorAction.ImageUpload, this.field, { file })
        }
      }
    };
  }

}
