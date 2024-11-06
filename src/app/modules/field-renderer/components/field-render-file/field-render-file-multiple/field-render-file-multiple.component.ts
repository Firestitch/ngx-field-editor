import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Optional, ViewChild,
} from '@angular/core';
import {
  ControlContainer, ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgForm,
} from '@angular/forms';

import { FsApiFile } from '@firestitch/api';
import { controlContainerFactory } from '@firestitch/core';
import { FsFile } from '@firestitch/file';
import { FsGalleryItem, FsGalleryItemAction } from '@firestitch/gallery';
import { FsPrompt } from '@firestitch/prompt';

import { forkJoin, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { FileRenderFile } from '../../../../../classes/file-render-file';
import { RendererAction } from '../../../../../enums';
import { Field, FieldFile } from '../../../../../interfaces';
import { FieldRendererService } from '../../../../../services';
import { FieldGalleryComponent } from '../../../../field-common/components';

@Component({
  selector: 'app-field-render-file-multiple',
  templateUrl: './field-render-file-multiple.component.html',
  styleUrls: ['./field-render-file-multiple.component.scss'],
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

  @Input() public field: Field;
  @Input() public disabled = false;
  @Input() public accept;

  @ViewChild(FieldGalleryComponent)
  public fieldGallery: FieldGalleryComponent;

  public actions: FsGalleryItemAction[];
  public files = [];
  public onChange: (data: any) => void;
  public onTouched: () => void;

  private _destroy$ = new Subject();

  constructor(
    private _fieldRenderer: FieldRendererService,
    private _cdRef: ChangeDetectorRef,
    private _prompt: FsPrompt,
  ) { }

  public selectFile(files) {
    this.onTouched();

    if (!this.field.configs.allowMultiple) {
      files = [files];
    }

    files
      .forEach((fsFile: FsFile) => {
        this._fieldRenderer.action(RendererAction.FileUpload, this.field, { file: fsFile.file })
          .pipe(
            takeUntil(this._destroy$),
          )
          .subscribe((response: any) => {
            const file = new FileRenderFile(response.url, response.filename);
            file.value = response;

            if (this.field.configs.allowMultiple) {
              this.files.push(response);
            } else {
              this.files = [response];
            }

            this.onChange(this.files);
            this.fieldGallery.reload();
            this._cdRef.markForCheck();
          });
      });
  }

  public writeValue(data: any): void {
    this.files = data || [];
    this._cdRef.markForCheck();
  }

  public registerOnChange(fn: (data: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public filePreviewDownload = (field: Field, file: FieldFile): FsApiFile => {
    return this._fieldRenderer.filePreviewDownload(field, file);
  };

  public ngOnInit() {
    forkJoin({
      canFileDownload: this._fieldRenderer.canFileDownload(this.field),
      canFileDelete: this._fieldRenderer.canFileDelete(this.field),
    })
      .subscribe(({ canFileDownload, canFileDelete }) => {
        this._initActions(canFileDownload, canFileDelete);
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  private _initActions(canFileDownload: boolean, canFileDelete: boolean) {
    this.actions = [];
    
    if (canFileDownload) {
      this.actions.push({
        label: 'Download',
        click: (item: FsGalleryItem) => {
          this._fieldRenderer
            .fileDownload(this.field, item.data)
            .download();
        },
      });
    }

    if (canFileDelete) {
      this.actions.push({
        label: 'Remove',
        click: (item: FsGalleryItem) => {
          this._prompt.confirm({
            title: 'Confirm',
            template: 'Are you sure you would like to remove this file?',
          })
            .pipe(
              switchMap(() => {
                return this._fieldRenderer
                  .action(RendererAction.FileDelete, this.field, { fieldFile: item.data });
              }),
            )
            .subscribe(() => {
              const idx = this.files.indexOf(item.data);

              if (idx >= 0) {
                this.files.splice(idx, 1);
                this.fieldGallery.reload();
                this.onChange(this.files);

                if (this._fieldRenderer.config.afterFileDeleted) {
                  this._fieldRenderer.config.afterFileDeleted(this.field, item.data);
                }
              }
            });
        },
      });
    }

    this._cdRef.markForCheck();
  }
}
