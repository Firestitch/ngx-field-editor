import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core';

import { FieldComponent } from '../../field/field.component';
import { FieldEditorService } from '../../../services/field-editor.service';
import { FieldFilePickerComponent } from './file-picker/field-file-picker.component';
import { FsPrompt } from '@firestitch/prompt';
import { switchMap } from 'rxjs/operators';
import { FieldViewGalleryComponent } from '../../field-view-gallery/field-view-gallery.component';


@Component({
  selector: 'fs-field-render-file',
  templateUrl: 'field-render-file.component.html',
  styleUrls: ['field-render-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldRenderFileComponent extends FieldComponent implements OnInit {

  @ViewChild(FieldFilePickerComponent)
  public filePicker: FieldFilePickerComponent;

  @ViewChild(FieldViewGalleryComponent)
  public fieldViewGallery: FieldViewGalleryComponent;

  public actions = [];

  public constructor(
    public fieldEditor: FieldEditorService,
    public _prompt: FsPrompt,
  ) {
    super();
  }

  public change(files: any) {
    this.field.data.value = files;
    this.fieldViewGallery.reload();
  }

  public ngOnInit() {
    super.ngOnInit();

    if (!this.field?.data?.value) {
      this.field.data.value = [];
    }

    if (this.fieldEditor.config && this.fieldEditor.config.fileDownload) {
      this.actions.push({
        label: 'Download',
        click: (item) => {
          this.fieldEditor.config.fileDownload(this.field, item);
        }
      });
    }

    if (this.fieldEditor.config?.fileRemove) {
      this.actions.push({
        label: 'Remove',
        click: (item) => {
          this._prompt.confirm({
            title: 'Confirm',
            template: 'Are you sure you would like to remove this file?',
          })
          .pipe(
            switchMap(() => {
              return this.fieldEditor.config.fileRemove(this.field, item);
            })
          )
          .subscribe(() => {
            const idx = this.field.data.value.indexOf(item);

            if (idx >= 0) {
              this.field.data.value.splice(idx, 1);
              this.fieldViewGallery.reload();
              this.filePicker.triggerChange();

              if (this.fieldEditor.config.fileRemoved) {
                this.fieldEditor.config.fileRemoved(this.field, item);
              }
            }
          });
        }
      });
    }

  }

}
