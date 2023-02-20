import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { FsPrompt } from '@firestitch/prompt';

import { finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { FieldComponent } from '../field/field.component';
import { FieldEditorService } from '../../../services/field-editor.service';
import { EditorAction, FieldType } from '../../../enums';
import { Field } from '../../../interfaces';


@Component({
  selector: 'fs-field-header',
  templateUrl: 'field-header.component.html',
  styleUrls: ['field-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldHeaderComponent
  extends FieldComponent
  implements OnInit, OnChanges, OnDestroy {

  @Input()
  public hasDescription = false;
  @ViewChild('description')
  public descriptionEl: ElementRef;

  public showDelete = false;
  public canEdit = false;
  public showRequired = false;
  public showDescription = false;
  public showLabel = false;
  public FieldType = FieldType;

  @Output()
  public fieldChanged = new EventEmitter<Field>();

  @Output()
  public toggleDescription = new EventEmitter<Field>();

  private _destroy$ = new Subject();

  public constructor(
    public fieldEditor: FieldEditorService,
    private _prompt: FsPrompt,
    private _cdRef: ChangeDetectorRef,
  ) {
    super(fieldEditor);
  }

  public changed(): void {
    this.fieldChanged.emit(this.field);
    this.fieldEditor.fieldChange(this.field);
  }

  public ngOnInit(): void {
    this.fieldEditor.fieldShowDelete(this.field)
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe((value) => {
      this.showDelete = value;
      this._cdRef.markForCheck();
    });

    this.fieldEditor.fieldCanEdit(this.field)
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe((value) => {
      this.canEdit = value;
      this._cdRef.markForCheck();
    });

    this.fieldEditor.fieldShowRequired(this.field)
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe((value) => {
      this.showRequired = value;
      this._cdRef.markForCheck();
    });

    this.fieldEditor.fieldShowDescription(this.field)
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe((value) => {
      this.showDescription = value;
      this._cdRef.markForCheck();
    });

    this.fieldEditor.fieldCanLabel(this.field)
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe((value) => {
      this.showLabel = value;
      this._cdRef.markForCheck();
    });
  }

  public ngOnChanges(changes: any): void {
    if (changes.hasDescription?.currentValue) {
      setTimeout(() => {
        this.descriptionEl?.nativeElement?.focus();
      });
    }
  }

  public toggleRequired(): void {
    this.field.configs.required = !this.field.configs.required;
    this.fieldEditor.action(EditorAction.FieldSave, this.field)
    .pipe(takeUntil(this._destroy$))
    .subscribe(() => {
      this.changed();
    });
  }

  public toggleDescriptionNote(event: Event): void {
    event.stopPropagation();

    this.toggleDescription.emit(this.field);
  }

  public actionConfig(): void {
    this.fieldEditor.action(EditorAction.FieldSave, this.field)
      .subscribe(() => {
        this.changed();
      });
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
        this.fieldEditor.config.fields.splice(this.fieldEditor.config.fields.indexOf(this.field), 1);
        this.fieldEditor.unselectField();
        this._cdRef.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
