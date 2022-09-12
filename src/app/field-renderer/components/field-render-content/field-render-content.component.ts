import { ChangeDetectionStrategy, Component, OnInit, Optional } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { FsHtmlEditorConfig } from '@firestitch/html-editor';
import { controlContainerFactory } from '@firestitch/core';

import { FieldEditorService } from '../../../services/field-editor.service';
import { FieldComponent } from '../field/field.component';


@Component({
  selector: 'fs-field-render-content',
  styleUrls: ['./field-render-content.component.scss'],
  templateUrl: 'field-render-content.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: controlContainerFactory,
      deps: [[new Optional(), NgForm]],
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldRenderContentComponent extends FieldComponent implements OnInit {

  public editorConfig: FsHtmlEditorConfig;

  constructor(public fieldEditor: FieldEditorService) {
    super();
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.editorConfig = {
      autofocus: false,
      disabled: this.disabled,
    };

    if (this.fieldEditor.config?.imageUpload) {
      this.editorConfig.image = {
        upload: (file: File) => {
          return this.fieldEditor.config.imageUpload(this.field, file);
        }
      }
    }
  }
}
