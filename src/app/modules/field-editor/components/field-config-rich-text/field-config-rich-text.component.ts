import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';

import { FsHtmlEditorComponent, FsHtmlEditorConfig } from '@firestitch/html-editor';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { EditorAction } from '../../../../enums';
import { FieldComponent } from '../field/field.component';


@Component({
  selector: 'fs-field-config-rich-text',
  templateUrl: './field-config-rich-text.component.html',
  styleUrls: ['./field-config-rich-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldConfigRichTextComponent extends FieldComponent implements OnInit {

  @ViewChild(FsHtmlEditorComponent)
  public htmlEditor: FsHtmlEditorComponent;

  public config: FsHtmlEditorConfig;

  public ngOnInit(): void {
    this.config = {
      ...this.field.configs,
      disabled: false,
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
