import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';

import { FsHtmlEditorComponent, FsHtmlEditorConfig } from '@firestitch/html-editor';

import { FieldAction } from '../../../enums';
import { FieldComponent } from '../field/field.component';


@Component({
  selector: 'fs-field-config-rich-text',
  templateUrl: 'field-config-rich-text.component.html',
  styleUrls: ['field-config-rich-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldConfigRichTextComponent extends FieldComponent implements OnInit {

  @ViewChild(FsHtmlEditorComponent)
  public htmlEditor: FsHtmlEditorComponent;

  public config: FsHtmlEditorConfig;

  public ngOnInit(): void {
    this.config = {
      ...this.field.config.configs,
      disabled: true,
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
