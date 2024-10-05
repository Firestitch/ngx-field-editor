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


@Component({
  selector: 'fs-field-header',
  templateUrl: './field-header.component.html',
  styleUrls: ['./field-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldHeaderComponent
  extends FieldComponent
  implements OnInit, OnDestroy {

  @Input()
  public hasDescription = false;

  public showDelete = false;
  public canEdit = false;
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
