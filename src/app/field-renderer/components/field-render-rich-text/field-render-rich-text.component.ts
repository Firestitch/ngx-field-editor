import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Optional } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';


import { FsHtmlEditorConfig } from '@firestitch/html-editor';
import { controlContainerFactory } from '@firestitch/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FieldComponent } from '../field/field.component';
import { FieldRendererService } from '../../../services';
import { RendererAction } from '../../../enums';


@Component({
  selector: 'fs-field-render-rich-text',
  styleUrls: ['./field-render-rich-text.component.scss'],
  templateUrl: './field-render-rich-text.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: controlContainerFactory,
      deps: [[new Optional(), NgForm]],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldRenderRichTextComponent extends FieldComponent implements OnInit {

  public editorConfig: FsHtmlEditorConfig;

  constructor(
    private _fieldRenderer: FieldRendererService,
    private _cdRef: ChangeDetectorRef,
  ) {
    super();
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this._fieldRenderer.canImageUpload(this.field)
      .subscribe((canImageUpload) => {
        this.editorConfig = {
          autofocus: false,
          disabled: this.disabled,
        };

        if (canImageUpload) {
          this.editorConfig.image = {
            upload: (file: File): Observable<string> => {
              return this._fieldRenderer.action(RendererAction.ImageUpload, this.field, { file })
                .pipe(
                  map((response) => response.url),
                );
            },
          };
        }

        this._cdRef.markForCheck();
      });
  }
}
