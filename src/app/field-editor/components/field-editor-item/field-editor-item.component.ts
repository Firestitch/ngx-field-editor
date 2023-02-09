import {
  Component,
  Input,
  TemplateRef,
  HostBinding,
  ChangeDetectionStrategy,
  OnInit,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Field } from '../../../interfaces/field.interface';
import { FieldType } from '../../../enums/field-type';
import { FieldEditorService } from '../../../services/field-editor.service';
import { FieldAction } from '../../../enums/field-action';


@Component({
  selector: 'fs-field-editor-item',
  templateUrl: './field-editor-item.component.html',
  styleUrls: ['./field-editor-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldEditorItemComponent implements OnInit, OnDestroy {

  @Input()
  public field: Field;

  @Input()
  public fieldConfigTemplateRefs: Record<string, TemplateRef<unknown>>;

  @Input()
  public fieldRenderTemplateRefs: Record<string, TemplateRef<unknown>>;

  public FieldType = FieldType;
  public canEdit = false;
  public canConfig = false;
  public hasDescription = false;

  private _destroy$ = new Subject();

  constructor(
    public fieldEditor: FieldEditorService,
    private _elRef: ElementRef,
    private _cdRef: ChangeDetectorRef,
  ) {}

  @HostBinding('class.selected')
  public isSelectedField = false;

  public get fieldConfigTemplateRef(): TemplateRef<unknown> | false {
    return this.fieldConfigTemplateRefs && this.fieldConfigTemplateRefs[this.field.config.type];
  }

  public get fieldRenderTemplateRef(): TemplateRef<unknown> | false {
    return this.fieldRenderTemplateRefs && this.fieldRenderTemplateRefs[this.field.config.type];
  }

  public fieldChange(field: Field) {
    this.fieldEditor.fieldChange(field);
    this.field = field;
  }

  public ngOnInit(): void {
    this.hasDescription = !!this.field.config.description;

    this.fieldEditor.fieldCanEdit(this.field)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((value) => {
        this.canEdit = value;
        this._cdRef.markForCheck();
      });

    this.fieldEditor
    .fieldCanConfig(this.field)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((value) => {
        this.canConfig = value;
        this._cdRef.markForCheck();
      });

    if (this.field === this.fieldEditor.scrollTargetField) {
      this.fieldEditor.resetScrollTarget();

      setTimeout(() => {
        this._elRef.nativeElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }, 0);
    }

    this.fieldEditor.selectedField$
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((field) => {
        this.isSelectedField = field?.config?.guid === this.field.config.guid;
        this._cdRef.markForCheck();
      });
  }

  public toggleDescriptionNote(field): void {
    this.hasDescription = !this.hasDescription;


    this.fieldEditor.fieldAction(FieldAction.FieldSave, this.field)
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.fieldEditor.fieldAction(FieldAction.FieldSave, field);
      });
  }

  public dragStarted(): void {
    this.fieldEditor.unselectField();
  }

  public headerFieldChanged(field: Field): void {
    this.field = {
      ...field,
    };
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
