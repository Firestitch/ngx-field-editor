import {
  Component, Input, ChangeDetectionStrategy, ChangeDetectorRef,
  OnInit, OnDestroy, forwardRef, Optional, ViewChild,
} from '@angular/core';
import {
  ControlContainer, ControlValueAccessor,
  NgForm, NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { FsPrompt } from '@firestitch/prompt';
import { controlContainerFactory } from '@firestitch/core';
import { FsGalleryItem } from '@firestitch/gallery';
import { FsFile } from '@firestitch/file';

import { forkJoin, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { Field } from '../../../../interfaces/field.interface';
import { FileRenderFile } from '../../../../classes/file-render-file';
import { FieldRendererService } from '../../../../services';
import { FieldViewGalleryComponent } from '../../../../field-viewer/components/field-view-gallery/field-view-gallery.component';
import { RendererAction } from '../../../../enums';


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

  @ViewChild(FieldViewGalleryComponent)
  public fieldViewGallery: FieldViewGalleryComponent;

  public actions;
  public files = [];

  private _destroy$ = new Subject();

  constructor(
    private _fieldRenderer: FieldRendererService,
    private _cdRef: ChangeDetectorRef,
    private _prompt: FsPrompt,
  ) { }

  public onChange = (data: any) => { };
  public onTouched = () => { };

  public selectFile(files: any) {
    this.onTouched();

    files.forEach((fsFile: FsFile) => {
      this._fieldRenderer.action(RendererAction.FileUpload, this.field, { file: fsFile.file })
        .pipe(
          takeUntil(this._destroy$),
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

  public ngOnInit() {
    forkJoin({
      fileDownload: this._fieldRenderer.allowFileDownload(this.field),
      fileRemove: this._fieldRenderer.allowFileRemove(this.field),
    })
      .subscribe((response) => {
        this.actions = [];
        this._cdRef.markForCheck();

        if (response.fileDownload) {
          this.actions.push({
            label: 'Download',
            click: (file) => {
              this._fieldRenderer.action(RendererAction.FileDownload, this.field, file);
            },
          });
        }

        if (response.fileRemove) {
          this.actions.push({
            label: 'Remove',
            click: (item: FsGalleryItem) => {
              this._prompt.confirm({
                title: 'Confirm',
                template: 'Are you sure you would like to remove this file?',
              })
                .pipe(
                  switchMap(() => {
                    return this._fieldRenderer.action(RendererAction.FileDelete, this.field, item.data);
                  }),
                )
                .subscribe(() => {
                  const idx = this.files.indexOf(item.data);

                  if (idx >= 0) {
                    this.files.splice(idx, 1);
                    this.fieldViewGallery.reload();
                    this.onChange(this.files);

                    if (this._fieldRenderer.config.afterFileRemoved) {
                      this._fieldRenderer.config.afterFileRemoved(this.field, item.data);
                    }
                  }
                });
            },
          });
        }
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
