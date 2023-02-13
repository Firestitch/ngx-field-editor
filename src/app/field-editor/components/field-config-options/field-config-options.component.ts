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

import { forkJoin, Observable, of } from 'rxjs';
import { catchError, filter, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { FsPrompt } from '@firestitch/prompt';
import { guid } from '@firestitch/common';
import { FsFile, FsFileImagePickerComponent } from '@firestitch/file';

import { FieldComponent } from '../field/field.component';
import { FieldEditorService } from '../../../services/field-editor.service';
import { FieldAction } from '../../../enums';
import { FieldOption } from '../../../interfaces';


@Component({
  selector: 'fs-field-config-options',
  templateUrl: 'field-config-options.component.html',
  styleUrls: ['field-config-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldConfigOptionsComponent
  extends FieldComponent
  implements OnInit {

  @Input() public showOther = false;
  @Input() public showOptionName = false;
  @Input() public showOptionImage = false;
  @Input() public field: FieldOption;

  public newOption = '';
  public newOptionValue = '';

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
        this.fieldEditor.fieldCanConfig(this.field)
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
    this.fieldEditor.fieldAction(FieldAction.OptionSave, this.field, { option })
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
            this.field.config.options.push(option);
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

    return this.fieldEditor.fieldAction(FieldAction.OptionAdd, this.field, { option })
      .pipe(
        tap(() => {
          this.newOption = '';
          this.newOptionValue = '';
          this._cdRef.markForCheck();
        }),
        map((response) => {
          return {
              ...option,
              ...response.option,
            };
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

    this.fieldEditor.fieldAction(FieldAction.OptionImageUpload, this.field, data)
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
    this.field.config.configs.other = !this.field.config.configs.other;
    this.fieldEditor.fieldAction(FieldAction.OptionOther, this.field)
    .pipe(
      takeUntil(this._destory$),
    )
      .subscribe(() => {
        this.fieldEditor.fieldChange(this.field);
        this._cdRef.markForCheck();
      });
  }

  public removeOption(option): void {
    this._prompt.confirm({
      title: 'Confirm',
      template: 'Are you sure you would like to remove this option?',
    })
      .pipe(
        switchMap(() => this.fieldEditor.fieldAction(FieldAction.OptionDelete, this.field, { option })),
        tap(() => {
          this.field.config.options = this.field.config.options
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
    moveItemInArray(this.field.config.options, event.previousIndex, event.currentIndex);

    this.fieldEditor.fieldAction(FieldAction.OptionReorder, this.field)
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

        return this.fieldEditor.fieldAction(FieldAction.OptionImageUpload, this.field, data)
        .pipe(
          map((response) => {
            return {
              ...option,
              ...response.option,
            };
          })
        );
      }),
      tap((option) => {
        this.field.config.options.push(option);
        this._newOptionFile = null;

        this._cdRef.markForCheck();
      }),
      finalize(() => {
        this._newFileImagePicker.cancel()
        this._newFileImagePicker = null;
      }),
      takeUntil(this._destory$),
    )
    .subscribe(() => {
      this.fieldEditor.fieldChange(this.field);
    });
  }
}
