import { 
  Component, Input, ChangeDetectionStrategy, ChangeDetectorRef,
  OnDestroy, forwardRef, Optional } from '@angular/core';
import {
  ControlContainer, ControlValueAccessor,
  NgForm, NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';
import { FsFile } from '@firestitch/file';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
export class FieldRenderFileSingleComponent implements OnDestroy, ControlValueAccessor {
  
  public actions = [];

  @Input() public field: Field;
  @Input() public disabled = false;
  @Input() public accept;

  public onChange = (data: any) => {};
  public onTouched = () => {};
  public file;

  private _destroy$ = new Subject();

  public constructor(
    private _fieldRenderer: FieldRendererService,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public selectFile(fsFile: FsFile) {
    this.onTouched();

    if (this._fieldRenderer.config.fileUpload) {
      this._fieldRenderer.config.fileUpload(this.field, fsFile.file)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((response: any) => {
        this.file = response;
        this.onChange([this.file]);
        this._cdRef.markForCheck();
      });
    }
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

  public get allowDownload(): boolean {
    return !!this._fieldRenderer.config?.fileDownload;
  }

  public get allowRemove(): boolean {
    return !!this._fieldRenderer.config?.fileRemove;
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
