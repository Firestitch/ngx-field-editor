import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { FsHtmlEditorConfig } from '@firestitch/html-editor';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { EditorAction } from '../../../../enums';
import { FieldComponent } from '../field/field.component';


@Component({
  selector: 'fs-field-config-content',
  templateUrl: './field-config-content.component.html',
  styleUrls: ['./field-config-content.component.scss'],
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
            .pipe(
              map((response) => response.url),
            );
        },
      },
    };
  }

}
