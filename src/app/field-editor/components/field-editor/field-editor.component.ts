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
import { Overlay } from '@angular/cdk/overlay';

import { fromEvent, Subject } from 'rxjs';
import { delay, filter, switchMap, takeUntil, tap } from 'rxjs/operators';


import { FieldEditorConfig } from '../../../interfaces/field-editor-config.interface';
import { Field } from '../../../interfaces/field.interface';
import { FieldConfigDirective } from '../../directives/field-config/field-config.directive';
import { FieldRenderDirective } from '../../../field-renderer/directives/field-render/field-render.directive';
import { FieldEditorService, FieldRendererService } from '../../../services';
import { clickOutsideElement } from '../../../helpers/click-outside-element';
import { FieldEditorToolbarDirective } from '../../directives/field-editor-toolbar/field-editor-toolbar.directive';
import { EditorAction } from '../../../enums';
import { FieldContainerDirective } from '../../directives/field-container/field-container.directive';


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

  constructor(
    @Inject(DOCUMENT) public document: any,
    public fieldEditor: FieldEditorService,
    public fieldRenderer: FieldRendererService,
    private _cdRef: ChangeDetectorRef,
    private _elRef: ElementRef,
    private _overlay: Overlay,
  ) { }

  @HostListener('document:keydown.escape', ['$event'])
  public onKeydownHandler(event: KeyboardEvent) {
    this.fieldEditor.unselectField();
  }

  public ngOnInit(): void {
    this._listenClickOutside();
    this._listenFieldAdded();
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
    this._destroy$.next();
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
          switchMap((field) => this.fieldEditor
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
      .subscribe((field) => {
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

