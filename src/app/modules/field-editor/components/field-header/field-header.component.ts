import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { FsPrompt } from '@firestitch/prompt';

import { Subject } from 'rxjs';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';

import { EditorAction, FieldType } from '../../../../enums';
import { Field } from '../../../../interfaces';
import { FieldEditorService } from '../../../../services';
import { FieldComponent } from '../field/field.component';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { NgClass, AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FieldHeaderMenuComponent } from '../field-header-menu/field-header-menu.component';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';


@Component({
    selector: 'fs-field-header',
    templateUrl: './field-header.component.html',
    styleUrls: ['./field-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatFormField,
        MatInput,
        FormsModule,
        FsFormModule,
        MatIconButton,
        MatTooltip,
        NgClass,
        MatIcon,
        FieldHeaderMenuComponent,
        CdkTextareaAutosize,
        AsyncPipe,
    ],
})
export class FieldHeaderComponent
  extends FieldComponent
  implements OnInit, OnDestroy {

  @Input()
  public hasDescription = false;

  public showDelete = false;
  public canEdit = false;
  public canConfig = false;
  public showRequired = false;
  public showDescription = false;
  public showLabel = false;
  public showActions = false;
  public FieldType = FieldType;

  @Output()
  public fieldChanged = new EventEmitter<Field>();

  @Output()
  public toggleDescription = new EventEmitter<Field>();

  private _destroy$ = new Subject();

  constructor(
    public fieldEditor: FieldEditorService,
    private _prompt: FsPrompt,
    private _cdRef: ChangeDetectorRef,
  ) {
    super(fieldEditor);
  }

  public ngOnInit(): void {
    this._initHeaderConfig();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public changed(): void {
    this.fieldChanged.emit(this.field);
    this.fieldEditor.fieldChange(this.field);
  }

  public toggleRequired(): void {
    this.field.configs.required = !this.field.configs.required;
    this.changed();
  }

  public toggleDescriptionNote(event: Event): void {
    event.stopPropagation();

    this.toggleDescription.emit(this.field);
  }

  public actionConfig(): void {
    this.changed();
  }

  public delete(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.fieldEditor.inDeletionMode = true;

    this._prompt
      .confirm({
        title: 'Confirm',
        template: 'Are you sure you would like to remove this field?',
      })
      .pipe(
        switchMap(() => this.fieldEditor.action(EditorAction.FieldDelete, this.field)),
        finalize(() => this.fieldEditor.inDeletionMode = false),
        takeUntil(this._destory$),
      )
      .subscribe(() => {
        const field = this.fieldEditor.findFieldByGuid(this.field.guid);
        const fieldIndex = this.fieldEditor.findFieldIndexByField(field);

        if(fieldIndex !== -1) {
          this.fieldEditor.config.fields.splice(fieldIndex, 1);
          this.fieldEditor.unselectField();
          this._cdRef.markForCheck();
        }
      });
  }

  private _initHeaderConfig(): void {
    this._checkShowDelete();
    this._checkFieldCanEdit();
    this._checkFieldCanConfig();
    this._checkFieldShowRequired();
    this._checkFieldShowDescription();
    this._checkFieldCanLabel();
    this._checkFieldShowActions();

  }

  private _checkShowDelete(): void {
    this.fieldEditor.fieldShowDelete(this.field)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((value) => {
        this.showDelete = value;
        this._cdRef.markForCheck();
      });
  }

  private _checkFieldCanEdit(): void {
    this.fieldEditor.fieldCanEdit(this.field)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((value) => {
        this.canEdit = value;
        this._cdRef.markForCheck();
      });
  }

  private _checkFieldCanConfig(): void {
    this.fieldEditor.fieldCanConfig(this.field)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((value) => {
        this.canConfig = value;
        this._cdRef.markForCheck();
      });
  }

  private _checkFieldShowRequired(): void {
    this.fieldEditor.fieldShowRequired(this.field)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((value) => {
        this.showRequired = value;
        this._cdRef.markForCheck();
      });
  }

  private _checkFieldShowDescription(): void {
    this.fieldEditor.fieldShowDescription(this.field)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((value) => {
        this.showDescription = value;
        this._cdRef.markForCheck();
      });
  }

  private _checkFieldCanLabel(): void {
    this.fieldEditor.fieldCanLabel(this.field)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((value) => {
        this.showLabel = value;
        this._cdRef.markForCheck();
      });
  }

  private _checkFieldShowActions(): void {
    this.fieldEditor.fieldShowActions(this.field)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((value: boolean) => {
        this.showActions = value;
        this._cdRef.markForCheck();
      });
  }
}
