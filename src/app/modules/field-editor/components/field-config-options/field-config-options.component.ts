import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';

import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';


import { guid } from '@firestitch/common';
import { FsFile, FsFileImagePickerComponent, FsFileModule } from '@firestitch/file';
import { FsPrompt } from '@firestitch/prompt';

import { BehaviorSubject, forkJoin, Observable, of, pipe } from 'rxjs';
import {
  catchError,
  delay,
  filter, finalize, map, switchMap, takeUntil, tap,
} from 'rxjs/operators';

import { EditorAction, VisualSelectorFormat } from '../../../../enums';
import { FieldOption } from '../../../../interfaces';
import { FieldEditorService } from '../../../../services';
import { FieldComponent } from '../field/field.component';
import { NgClass, NgTemplateOutlet, NgStyle, AsyncPipe } from '@angular/common';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { MatTooltip } from '@angular/material/tooltip';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatRadioButton } from '@angular/material/radio';


@Component({
    selector: 'fs-field-config-options',
    templateUrl: './field-config-options.component.html',
    styleUrls: ['./field-config-options.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CdkDropList,
        CdkDrag,
        NgClass,
        CdkDragHandle,
        MatIconButton,
        MatIcon,
        NgTemplateOutlet,
        FsFileModule,
        MatFormField,
        MatInput,
        FormsModule,
        FsFormModule,
        MatTooltip,
        MatButton,
        NgStyle,
        MatCheckbox,
        MatRadioButton,
        AsyncPipe,
    ],
})
export class FieldConfigOptionsComponent extends FieldComponent implements OnInit {

  @Input() public showOther = false;
  @Input() public showOptionLabel = false;
  @Input() public showNotes = false;
  @Input() public showOptionImage = false;
  @Input() declare public field: FieldOption;

  public VisualSelectorFormat = VisualSelectorFormat;

  private _optionLoading$ = new BehaviorSubject<boolean>(false);
  private _el = inject(ElementRef);

  constructor(
    public fieldEditor: FieldEditorService,
    private _prompt: FsPrompt,
    private _cdRef: ChangeDetectorRef,
  ) {
    super(fieldEditor);
  }

  public ngOnInit(): void {
    forkJoin([
      this.fieldEditor.fieldCanEdit(this.field),
      this.fieldEditor.fieldCanConfig(this.field),
    ])
      .pipe(
        filter((response) => response[0] && response[1]),
      )
      .subscribe();
  }

  public get optionLoading$(): Observable<any> {
    return this._optionLoading$.asObservable();
  }

  public optionSave(option) {
    this.fieldEditor.action(EditorAction.OptionSave, this.field, { option })
      .subscribe();
  }

  public addOptionFocus(): void {
    this.addOption()
      .pipe(
        this.addOptionPipe(),
      )
      .subscribe();
  }

  public addOptionPipe()  {
    return pipe(
      tap((option) => {
        this.field.options.push(option);
        this._cdRef.markForCheck();
      }),
      delay(0),
      tap(() => {
        this._el.nativeElement
          .querySelector(`input[name="label${(this.field.options.length - 1)}"]`)
          .focus();
      }),
    );
  }

  public addOption(): Observable<any> {
    const option = {
      value: '',
      name: '',
      guid: guid('xxxxxx'),
    };
    this._optionLoading$.next(true);

    return this.fieldEditor
      .action(EditorAction.OptionAdd, this.field, { option })
      .pipe(
        map((response) => {
          return {
            ...option,
            ...response.option,
          };
        }),
        finalize(() => {
          this._optionLoading$.next(false);
        }),
      );
  }

  public addOptionImage(fsFile: FsFile, fileImagePicker: FsFileImagePickerComponent): void {
    this.addOption()
      .pipe(
        switchMap((option) => {
          const data = {
            file: fsFile.file,
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
        this.addOptionPipe(),
        finalize(() => {
          fileImagePicker.cancel();
        }),
        takeUntil(this._destory$),
      )
      .subscribe();
  }

  public selectOptionImage(
    fsFile: FsFile,
    option,
    fileImagePicker: FsFileImagePickerComponent,
  ): void {
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
      .subscribe((response) => {
        const options = this.field.options
          .map((item) => {
            if (response.option.guid === item.guid) {
              item = {
                ...item,
                ...response.option,
              };
            }

            return item;
          });

        this.field = {
          ...this.field,
          options,
        };

        this._cdRef.markForCheck();
      });
  }

  public otherToggle(): void {
    this.field.configs.other = !this.field.configs.other;
    this.fieldEditor.action(EditorAction.OptionOther, this.field)
      .pipe(
        takeUntil(this._destory$),
      )
      .subscribe();
  }

  public toggleOptionNotes(option): void {
    option.notes = !option.notes;

    this.fieldEditor.action(EditorAction.OptionSave, this.field, { option })
      .subscribe();
  }

  public removeOption(option): void {
    this._prompt.confirm({
      title: 'Confirm',
      template: 'Are you sure you would like to remove this option?',
    })
      .pipe(
        switchMap(() => this.fieldEditor.action(EditorAction.OptionDelete, this.field, { option })),
        takeUntil(this._destory$),
      )
      .subscribe(() => {
        this.field.options = this.field.options
          .filter((item) => item !== option);
        this._cdRef.markForCheck();
      });
  }

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.field.options, event.previousIndex, event.currentIndex);

    this.fieldEditor.action(EditorAction.OptionReorder, this.field)
      .subscribe();
  }
}
