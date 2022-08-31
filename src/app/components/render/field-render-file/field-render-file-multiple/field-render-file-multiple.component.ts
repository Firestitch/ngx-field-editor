import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef,
  OnInit, OnDestroy, forwardRef, Optional, ViewChild, } from '@angular/core';
import {
  ControlContainer, ControlValueAccessor,
  NgForm, NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { FsPrompt } from '@firestitch/prompt';
import { controlContainerFactory } from '@firestitch/core';
import { FsFile } from '@firestitch/file';

import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { Field } from '../../../../interfaces/field.interface';
import { FileRenderFile } from '../../../../classes/file-render-file';
import { FieldEditorService } from '../../../../services/field-editor.service';
import { FieldViewGalleryComponent } from '../../../field-view-gallery/field-view-gallery.component';
import { FsGalleryItem } from '@firestitch/gallery';


@Component({
  selector: 'app-field-render-file-multiple',
  templateUrl: 'field-render-file-multiple.component.html',
  styleUrls: ['field-render-file-multiple.component.scss'],
  providers: [
    {
      provide: ControlContainer,
      useFactory: controlContainerFactory,
      deps: [[new Optional(), NgForm]],
    },
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => FieldRenderFileMultipleComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldRenderFileMultipleComponent implements OnInit, OnDestroy, ControlValueAccessor {
  
  @ViewChild(FieldViewGalleryComponent)
  public fieldViewGallery: FieldViewGalleryComponent;

  public actions = [];

  @Input() public field: Field;
  @Input() public disabled = false;
  @Input() public accept;

  public onChange = (data: any) => {};
  public onTouched = () => {};
  public files = [];

  private _destroy$ = new Subject();

  public constructor(
    private _fieldEditor: FieldEditorService,
    private _cdRef: ChangeDetectorRef,
    private _prompt: FsPrompt,
  ) {}

  public selectFile(files: any) {
    this.onTouched();

    if (this._fieldEditor.config.fileUpload) {
      files.forEach((fsFile: FsFile) => {
        this._fieldEditor.config.fileUpload(this.field, fsFile.file)
        .pipe(
          takeUntil(this._destroy$)
        )
        .subscribe((response: any) => {
          const file = new FileRenderFile(response.url, response.name);
          file.value = response;

          this.files.push(response);
          this.onChange(this.files);
          this.fieldViewGallery.reload();
          this._cdRef.markForCheck();
        });
      });
    }
  }

  public writeValue(data: any): void {
    this.files = data || [];
  }

  public registerOnChange(fn: (data: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public ngOnInit() {
    const config = this.field.config?.configs?.allowedFileTypes || {};

    if (this._fieldEditor.config && this._fieldEditor.config.fileDownload) {
      this.actions.push({
        label: 'Download',
        click: (item) => {
          this._fieldEditor.config.fileDownload(this.field, item);
        }
      });
    }

    if (this._fieldEditor.config?.fileRemove) {
      this.actions.push({
        label: 'Remove',
        click: (item: FsGalleryItem) => {
          this._prompt.confirm({
            title: 'Confirm',
            template: 'Are you sure you would like to remove this file?',
          })
          .pipe(
            switchMap(() => {
              return this._fieldEditor.config.fileRemove(this.field, item.data);
            })
          )
          .subscribe(() => {
            const idx = this.files.indexOf(item.data);

            if (idx >= 0) {
              this.files.splice(idx, 1);
              this.fieldViewGallery.reload();
              this.onChange(this.files);

              if (this._fieldEditor.config.fileRemoved) {
                this._fieldEditor.config.fileRemoved(this.field, item.data);
              }
            }
          });
        }
      });
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
