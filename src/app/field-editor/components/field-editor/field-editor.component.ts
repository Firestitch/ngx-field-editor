import {
  Component,
  HostListener,
  QueryList,
  ContentChildren,
  AfterContentInit,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ElementRef,
  Inject,
  ChangeDetectorRef,
  OnDestroy,
  ContentChild,
  TemplateRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { fromEvent, Observable, Subject } from 'rxjs';
import { delay, filter, switchMap, takeUntil, tap } from 'rxjs/operators';


import { MatDialog } from '@angular/material/dialog';
import { FieldEditorConfig } from '../../../interfaces/field-editor-config.interface';
import { Field } from '../../../interfaces/field.interface';
import { FieldConfigDirective } from '../../directives/field-config/field-config.directive';
import { FieldRenderDirective } from '../../../field-renderer/directives/field-render/field-render.directive';
import { FieldEditorService, FieldRendererService } from '../../../services';
import { clickOutsideElement } from '../../../helpers/click-outside-element';
import { FieldEditorToolbarDirective } from '../../directives/field-editor-toolbar/field-editor-toolbar.directive';
import { EditorAction } from '../../../enums';
import { FieldContainerDirective } from '../../directives/field-container/field-container.directive';
import { FieldEditDialogComponent } from '../field-edit-dialog/field-edit-dialog.component';


@Component({
  selector: 'fs-field-editor',
  templateUrl: 'field-editor.component.html',
  styleUrls: ['field-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FieldEditorService, FieldRendererService],
})
export class FieldEditorComponent implements OnInit, AfterContentInit, OnDestroy {

  @Input()
  public scrollContainer: string | HTMLElement = null;

  @Input()
  public set config(config: FieldEditorConfig) {
    this.fieldEditor.setConfig(config);
  }

  @ContentChild(FieldEditorToolbarDirective, { read: TemplateRef })
  public editorToolbarTpl: TemplateRef<FieldEditorToolbarDirective>;

  @ContentChild(FieldContainerDirective, { read: TemplateRef })
  public fieldContainerTemplateRef: TemplateRef<FieldContainerDirective>;

  @ContentChildren(FieldConfigDirective)
  public queryListFieldConfig: QueryList<FieldConfigDirective>;

  @ContentChildren(FieldRenderDirective)
  public queryListFieldRender: QueryList<FieldRenderDirective>;

  public fieldConfigTemplateRefs = {};
  public fieldRenderTemplateRefs = {};

  private _destroy$ = new Subject<void>();

  constructor(
    @Inject(DOCUMENT) public document: any,
    public fieldEditor: FieldEditorService,
    public fieldRenderer: FieldRendererService,
    private _cdRef: ChangeDetectorRef,
    private _elRef: ElementRef,
    private _dialog: MatDialog,
  ) { }

  @HostListener('document:keydown.escape', ['$event'])
  public onKeydownHandler(event: KeyboardEvent) {
    this.fieldEditor.unselectField();
  }

  public ngOnInit(): void {
    this._listenClickOutside();
    this._listenFieldAdded();
    this._listenOpeningEditDialog();
  }

  public get fields(): Field[] {
    return [
      ...this.fieldEditor.config.fields,
    ];
  }

  public ngAfterContentInit() {
    this.queryListFieldConfig.forEach((directive: FieldConfigDirective) => {
      this.fieldConfigTemplateRefs[directive.type] = directive.templateRef;
    });

    this.queryListFieldRender.forEach((directive: FieldRenderDirective) => {
      this.fieldRenderTemplateRefs[directive.type] = directive.templateRef;
    });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public fieldClick(field: Field) {
    if (this.fieldEditor.selectedField !== field) {
      this.fieldEditor.selectField(field);
    }
  }

  public setConfig(config: FieldEditorConfig) {
    this.fieldEditor.setConfig(config);
    this._cdRef.markForCheck();
  }

  public drop(event: CdkDragDrop<string[]>) {
    if (event.container === event.previousContainer) {
      moveItemInArray(
        this.fieldEditor.config.fields,
        event.previousIndex,
        event.currentIndex,
      );

      const field = this.fieldEditor.config.fields[event.previousIndex];

      this.fieldEditor
        .action(EditorAction.FieldReorder, field, {
          fields: this.fieldEditor.config.fields,
          previousIndex: event.previousIndex,
          currentIndex: event.currentIndex,
        })
        .subscribe();

    } else {
      this.fieldEditor.config.afterFieldDropped(event.item.data.field, event.currentIndex)
        .pipe(
          switchMap((field) => this.fieldEditor.insertNewField(
            field,
            event.currentIndex,
            event.item.data.item,
          )),
        )
        .subscribe();
    }
  }

  private _listenFieldAdded(): void {
    this.fieldEditor.fieldAdded$
      .pipe(
        delay(100),
        takeUntil(this._destroy$),
      )
      .subscribe((field) => {
        this.fieldEditor.selectField(field);
      });
  }

  private _listenOpeningEditDialog(): void {
    this.fieldEditor.isOpenedEditDialog()
      .pipe(
        switchMap((field) => this._openEditDialog(field)),
        takeUntil(this._destroy$),
      )
      .subscribe((field: Field) => {
        this.fieldEditor.fieldChange(field);
      });
  }

  private _openEditDialog(field: Field): Observable<any> {
    const dialogRef = this._dialog.open(FieldEditDialogComponent, {
      width: '600px',
      data: {
        field,
        config: this.fieldEditor.config,
      },
    });

    return dialogRef.afterClosed()
      .pipe(
        filter((dialogField: Field | null) => !!dialogField),
      );
  }

  private _listenClickOutside(): void {
    fromEvent(this.document, 'mousedown')
      .pipe(
        delay(100),
        filter(() => !!this.fieldEditor.selectedField && !this.fieldEditor.inDeletionMode),
        filter((event: Event) => {
          return clickOutsideElement(event, this._elRef.nativeElement);
        }),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.fieldEditor.unselectField();
        this._cdRef.markForCheck();
      });
  }
}

