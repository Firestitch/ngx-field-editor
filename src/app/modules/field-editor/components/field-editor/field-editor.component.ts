import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  HostListener,
  inject,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
} from '@angular/core';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialogRef } from '@angular/material/dialog';

import { fromEvent, Subject } from 'rxjs';
import { delay, filter, switchMap, takeUntil } from 'rxjs/operators';

import { EditorAction } from '../../../../enums';
import { clickOutsideElement } from '../../../../helpers/click-outside-element';
import { Field, FieldEditorConfig } from '../../../../interfaces';
import { FieldEditorService, FieldRendererService } from '../../../../services';
import { FieldRenderDirective } from '../../../field-renderer/directives/field-render/field-render.directive';
import { FieldConfigDirective } from '../../directives/field-config/field-config.directive';
import { FieldContainerDirective } from '../../directives/field-container/field-container.directive';
import { FieldEditorToolbarDirective } from '../../directives/field-editor-toolbar/field-editor-toolbar.directive';


@Component({
  selector: 'fs-field-editor',
  templateUrl: './field-editor.component.html',
  styleUrls: ['./field-editor.component.scss'],
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
  private _dialogRef = inject(MatDialogRef, { optional: true });

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public fieldEditor: FieldEditorService,
    public fieldRenderer: FieldRendererService,
    private _cdRef: ChangeDetectorRef,
    private _elRef: ElementRef,
  ) { }

  @HostListener('document:keydown.escape', ['$event'])
  public onKeydownHandler() {
    this.fieldEditor.unselectField();
  }

  public ngOnInit(): void {
    this._listenClickOutside();
    this._listenFieldAdded();
    if(this._dialogRef) {
      this.scrollContainer = document
        .querySelector<HTMLElement>(`#${this._dialogRef.id} .mat-mdc-dialog-content`);
    }
  }

  public get fields(): Field[] {
    return [
      ...this.fieldEditor.config.fields,
    ];
  }

  public ngAfterContentInit() {
    this.queryListFieldConfig
      .forEach((directive: FieldConfigDirective) => {
        this.fieldConfigTemplateRefs[directive.type] = directive.templateRef;
      });

    this.queryListFieldRender
      .forEach((directive: FieldRenderDirective) => {
        this.fieldRenderTemplateRefs[directive.type] = directive.templateRef;
      });

    if (this.fieldEditor.config.selected) {
      this.fieldEditor.selectField(this.fieldEditor.config.selected);
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public fieldClick(field: Field) {
    if (this.fieldEditor.fieldSelected !== field) {
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
          switchMap((field: Field) => this.fieldEditor
            .insertField(
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
      .subscribe((field: Field) => {
        this.fieldEditor.selectField(field);
      });
  }

  private _listenClickOutside(): void {
    fromEvent(this.document, 'mousedown')
      .pipe(
        delay(100),
        filter(() => !!this.fieldEditor.fieldSelected && !this.fieldEditor.inDeletionMode),
        filter(() => {
          return document.querySelectorAll('.cdk-overlay-pane').length === 0;
        }),
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

