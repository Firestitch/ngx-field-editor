import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


import { FsPrompt } from '@firestitch/prompt';
import { guid } from '@firestitch/common';
import { FsFile, FsFileImagePickerComponent } from '@firestitch/file';

import { catchError, delay, filter, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';

import { FieldComponent } from '../field/field.component';
import { FieldEditorService } from '../../../services/field-editor.service';
import { EditorAction } from '../../../enums';
import { FieldOption } from '../../../interfaces';


@Component({
  selector: 'fs-field-config-options',
  templateUrl: 'field-config-options.component.html',
  styleUrls: ['field-config-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldConfigOptionsComponent extends FieldComponent implements OnInit {

  @Input() public showOther = false;
  @Input() public showOptionName = false;
  @Input() public showOptionImage = false;
  @Input() public field: FieldOption;

  public newOption = '';
  public newOptionValue = '';
  public optionLoading$ = new BehaviorSubject<boolean>(false);

  @ViewChild('addOptionInput')
  private _addOptionInput: ElementRef;

  private _newOptionFile: FsFile;
  private _newFileImagePicker: FsFileImagePickerComponent;

  constructor(
    public fieldEditor: FieldEditorService,
    private _prompt: FsPrompt,
    private _cdRef: ChangeDetectorRef,
  ) {
    super(fieldEditor);
  }

  public ngOnInit(): void {
    if (this._addOptionInput) {
      forkJoin([
        this.fieldEditor.fieldCanEdit(this.field),
        this.fieldEditor.fieldCanConfig(this.field),
      ])
        .pipe(
          filter((response) => response[0] && response[1]),
        )
        .subscribe(() => {
          this._addOptionInput.nativeElement.focus();
        });
    }
  }

  public optionSave(option) {
    this.fieldEditor.action(EditorAction.OptionSave, this.field, { option })
      .subscribe(() => {
        this.fieldEditor.fieldChange(this.field);
      });
  }

  public addOptionKeydown(e, listenTab): void {
    if (!(e.key === 'Enter' || (e.key === 'Tab' && listenTab))) {
      return;
    }

    e.preventDefault();

    if (this.newOption.length || this._newOptionFile) {
      if (this._newOptionFile) {
        this._addOptionWithImage();
      } else {
        this.addOption()
          .subscribe((option) => {
            this.field.options.push(option);
            this._cdRef.markForCheck();
            this.fieldEditor.fieldChange(this.field);
          });
      }
    }
  }

  public addOption(): Observable<any> {
    const option = {
      value: this.newOptionValue,
      name: this.newOption,
      guid: guid('xxxxxx'),
    };
    this.optionLoading$.next(true);

    return this.fieldEditor.action(EditorAction.OptionAdd, this.field, { option })
      .pipe(
        map((response) => {
          return {
            ...option,
            ...response.option,
          };
        }),
        finalize(() => {
          this.newOption = '';
          this.newOptionValue = '';
          this.optionLoading$.next(false);
        }),
      );
  }

  public selectNewOptionImage(fsFile: FsFile, fileImagePicker: FsFileImagePickerComponent): void {
    this._newOptionFile = fsFile;
    this._newFileImagePicker = fileImagePicker;
    this._addOptionInput.nativeElement.focus();
  }

  public selectOptionImage(fsFile: FsFile, option, fileImagePicker: FsFileImagePickerComponent): void {
    const data = {
      file: fsFile.file,
      option,
    };

    this.fieldEditor.action(EditorAction.OptionImageUpload, this.field, data)
      .pipe(
        catchError(() => {
          fileImagePicker.cancel();

          return of(null);
        }),
        takeUntil(this._destory$),
      )
      .subscribe(() => {
        this.fieldEditor.fieldChange(this.field);
      });
  }

  public otherToggle(): void {
    this.field.configs.other = !this.field.configs.other;
    this.fieldEditor.action(EditorAction.OptionOther, this.field)
      .pipe(
        takeUntil(this._destory$),
      )
      .subscribe(() => {
        this.fieldEditor.fieldChange(this.field);
        this._cdRef.markForCheck();
      });
  }

  public toggleOptionNotes(option): void {
    option.notes = !option.notes;
    this.fieldEditor.fieldChange(this.field);
  }

  public removeOption(option): void {
    this._prompt.confirm({
      title: 'Confirm',
      template: 'Are you sure you would like to remove this option?',
    })
      .pipe(
        switchMap(() => this.fieldEditor.action(EditorAction.OptionDelete, this.field, { option })),
        tap(() => {
          this.field.options = this.field.options
            .filter((item) => item !== option);
        }),
        takeUntil(this._destory$),
      )
      .subscribe(() => {
        this.fieldEditor.fieldChange(this.field);
        this._cdRef.markForCheck();
      });
  }

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.field.options, event.previousIndex, event.currentIndex);

    this.fieldEditor.action(EditorAction.OptionReorder, this.field)
      .subscribe(() => {
        this.fieldEditor.fieldChange(this.field);
      });
  }

  private _addOptionWithImage(): void {
    this.addOption()
      .pipe(
        switchMap((option) => {
          const data = {
            file: this._newOptionFile.file,
            option,
          };

          return this.fieldEditor.action(EditorAction.OptionImageUpload, this.field, data)
            .pipe(
              map((response) => {
                return {
                  ...option,
                  ...response.option,
                };
              }),
            );
        }),
        tap((option) => {
          this.field.options.push(option);
          this._newOptionFile = null;

          this._cdRef.markForCheck();
        }),
        finalize(() => {
          this._newFileImagePicker.cancel();
          this._newFileImagePicker = null;
        }),
        takeUntil(this._destory$),
      )
      .subscribe(() => {
        this.fieldEditor.fieldChange(this.field);
      });
  }
}
