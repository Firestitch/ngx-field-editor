import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';


import { controlContainerFactory } from '@firestitch/core';
import { FsHtmlEditorComponent, FsHtmlEditorConfig } from '@firestitch/html-editor';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RendererAction } from '../../../../enums';
import { FieldRendererService } from '../../../../services';
import { FieldComponent } from '../field/field.component';


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
export class FieldRenderRichTextComponent extends FieldComponent implements OnInit, OnChanges {

  @ViewChild(FsHtmlEditorComponent)
  public htmlEditor: FsHtmlEditorComponent;

  public editorConfig: FsHtmlEditorConfig;

  constructor(
    private _fieldRenderer: FieldRendererService,
    private _cdRef: ChangeDetectorRef,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.editorConfig = {
      hint: this.field.description,
    };

    this._fieldRenderer.canImageUpload(this.field)
      .subscribe((canImageUpload) => {
        this.editorConfig = {
          ...this.editorConfig,
          autofocus: false,
          disabled: this.disabled,
          label: this.field.label,
        };

        if (canImageUpload) {
          this.editorConfig.image = {
            upload: (file: File): Observable<string> => {
              return this._fieldRenderer
                .action(RendererAction.ImageUpload, this.field, { file })
                .pipe(
                  map((response) => response.url),
                );
            },
          };
        }

        this._cdRef.markForCheck();
      });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.field && changes.field.currentValue !== changes.field.previousValue) {
      if (!this.field.data.value && !!this.field.configs.default) {
        this.field.data.value = this.field.configs.default;
      }
    }

    if (changes.disabled && changes.disabled.currentValue !== changes.disabled.previousValue) {
      if (this.htmlEditor) {
        this.htmlEditor.disable();
      }
    }
  }
}
