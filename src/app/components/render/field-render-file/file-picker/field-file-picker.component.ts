import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef,
  OnInit, OnDestroy, forwardRef, Optional, } from '@angular/core';
import {
  ControlContainer, ControlValueAccessor,
  NgForm, NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { FsFile } from '@firestitch/file';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Field } from '../../../../interfaces/field.interface';
import { FileRenderFile } from '../../../../classes/file-render-file';
import { FieldEditorService } from '../../../../services/field-editor.service';
import { controlContainerFactory } from '@firestitch/core';


@Component({
  selector: 'app-field-file-picker',
  templateUrl: 'field-file-picker.component.html',
  styleUrls: ['field-file-picker.component.scss'],
  providers: [
    {
      provide: ControlContainer,
      useFactory: controlContainerFactory,
      deps: [[new Optional(), NgForm]],
    },
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => FieldFilePickerComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldFilePickerComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() public field: Field;
  @Input() public disabled = false;

  public onChange = (data: any) => {};
  public onTouched = () => {};
  public allowedTypes = {};

  private _files = [];
  private _destroy$ = new Subject();

  public constructor(
    private _fieldEditor: FieldEditorService,
    private _cdRef: ChangeDetectorRef,
  ) {
  }

  public selectFile(files: any) {
    this.onTouched();

    if (this._fieldEditor.config.fileUpload) {
      if (!this.field.config.configs.allowMultiple) {
        files = [files];
      }

      files.forEach((fsFile: FsFile) => {
        this._fieldEditor.config.fileUpload(this.field, fsFile.file)
        .pipe(
          takeUntil(this._destroy$)
        )
        .subscribe((response: any) => {
          debugger;
          const file = new FileRenderFile(response.url, response.name);
          file.value = response;

          if (!this.field.config.configs.allowMultiple) {
            this._files = [];
          }

          this._files.push(response);
          this.onChange(this._files);
          this._cdRef.markForCheck();
        });
      });
    }
  }

  public writeValue(data: any): void {
    this._files = data || [];
  }

  public registerOnChange(fn: (data: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public triggerChange(): void {
    this.onChange(this._files);
  }

  public ngOnInit() {
    const config = this.field.config?.configs?.allowedFileTypes || {};
    const types = this._getAllowedTypes(config);

    this.allowedTypes = types.length ? types.join(',') : '*';

    const actions = [];
    if (this._fieldEditor.config && this._fieldEditor.config.fileDownload) {
      actions.push({
        label: 'Download',
        click: (item) => {
          this._fieldEditor.config.fileDownload(this.field, item);
        }
      });
    }

    if (this._fieldEditor.config && this._fieldEditor.config.fileRemove) {
      actions.push({
        label: 'Remove',
        click: (item) => {

          this._fieldEditor.config.fileRemove(this.field, item)
          .subscribe(() => {

            const idx = this._files.indexOf(item);

            if (idx >= 0) {
              this._files.splice(idx, 1);
              this.onChange(this._files);

              if (this._fieldEditor.config.fileRemoved) {
                this._fieldEditor.config.fileRemoved(this.field, item);
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

  private _getAllowedTypes(allowedTypes) {

    const allowed = [];

    if (!allowedTypes.other) {
      if (allowedTypes.image) {
        allowed.push('image/*');
      }

      if (allowedTypes.video) {
        allowed.push('video/*');
      }

      if (allowedTypes.pdf) {
        allowed.push('application/pdf');
      }
    }

    return allowed;
  }

}
