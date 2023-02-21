import {
  Component, Input, ChangeDetectionStrategy, ChangeDetectorRef,
  OnDestroy, forwardRef, Optional, OnInit,
} from '@angular/core';
import {
  ControlContainer, ControlValueAccessor,
  NgForm, NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';
import { FsFile } from '@firestitch/file';

import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RendererAction } from '../../../../enums';
import { Field } from '../../../../interfaces/field.interface';
import { FieldRendererService } from '../../../../services';


@Component({
  selector: 'app-field-render-file-single',
  templateUrl: 'field-render-file-single.component.html',
  styleUrls: ['field-render-file-single.component.scss'],
  providers: [
    {
      provide: ControlContainer,
      useFactory: controlContainerFactory,
      deps: [[new Optional(), NgForm]],
    },
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => FieldRenderFileSingleComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldRenderFileSingleComponent implements OnDestroy, OnInit, ControlValueAccessor {

  @Input() public field: Field;
  @Input() public disabled = false;
  @Input() public accept;

  public actions = [];
  public onChange = (data: any) => { };
  public onTouched = () => { };
  public file;
  public allow: { fileDownload: boolean; fileRemove: boolean };

  private _destroy$ = new Subject();

  constructor(
    private _fieldRenderer: FieldRendererService,
    private _cdRef: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    forkJoin({
      fileDownload: this._fieldRenderer.allowFileDownload(this.field),
      fileRemove: this._fieldRenderer.allowFileRemove(this.field),
    })
      .subscribe((allow) => {
        this.allow = allow;
        this._cdRef.markForCheck();
      });
  }

  public selectFile(fsFile: FsFile) {
    this.onTouched();

    this._fieldRenderer.action(RendererAction.FileUpload, this.field, { file: fsFile.file })
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response: any) => {
        this.file = response;
        this.onChange([this.file]);
        this._cdRef.markForCheck();
      });
  }

  public writeValue(files: any): void {
    this.file = (files ? files[0] : null) || null;
    this._cdRef.detectChanges();
  }

  public get pickerFile() {
    return this.file ? new FsFile(this.file.url, this.file.name) : null;
  }

  public registerOnChange(fn: (data: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public remove() {
    if (this._fieldRenderer.config.afterFileRemoved) {
      this._fieldRenderer.config.afterFileRemoved(this.field, this.file);
      this.file = null;
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
