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
import { MatDialog } from '@angular/material/dialog';

import { cloneDeep } from 'lodash-es';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { forkJoin, of, Subject } from 'rxjs';

import { FieldEditorService } from '../../../services/field-editor.service';
import { SettingsComponent } from '../settings';
import { EditorAction } from '../../../enums';
import { Field, FieldMenuItem } from '../../../interfaces';
import { FieldEditDialogComponent } from '../field-edit-dialog';


@Component({
  selector: 'fs-field-header-menu',
  templateUrl: 'field-header-menu.component.html',
  styleUrls: ['field-header-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldHeaderMenuComponent implements OnInit, OnDestroy {

  @Input() public field: Field;

  @Output() public fieldChanged = new EventEmitter<Field>();

  public menuItems;

  private _destroy$ = new Subject();

  public constructor(
    public fieldEditor: FieldEditorService,
    private _dialog: MatDialog,
    private _cdRef: ChangeDetectorRef,
  ) {
  }

  public ngOnInit(): void {
    const menuItems = [];

    (this.fieldEditor.config.fieldMenu?.items || [])
      .forEach((menuItem: FieldMenuItem) => {
        menuItems.push(
          {
            label: menuItem.label,
            click: (event: Event) => {
              event.preventDefault();
              event.stopPropagation();

              if (menuItem.click) {
                menuItem.click(this.field);
              }
            },
            show: menuItem.show ? menuItem.show(this.field) : of(true),
          },
        );
      });
    menuItems.push(...[
      {
        label: 'Edit',
        click: (event) => {
          this.openEditDialog(event);
        },
        show: this.fieldEditor.fieldShowEditAction(this.field),
      },
      {
        label: 'Duplicate',
        click: (event) => {
          this.duplicate(event);
        },
        show: this.fieldEditor.fieldShowDuplicate(this.field),
      },
      {
        label: 'Settings',
        click:  (event) => {
          this.settings(event);
        },
        show: this.fieldEditor.fieldShowSettings(this.field),
      }
    ]);

    forkJoin(
      menuItems.map((menuItem) => menuItem.show),
    )
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe((response: any) => {
      this.menuItems = menuItems
        .filter((menuItem, index) => response[index]);

      this._cdRef.markForCheck();
    });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public settings(event: Event): void {
    this._dialog.open(SettingsComponent, {
      data: {
        field: this.field,
        fieldEditor: this.fieldEditor,
      },
    })
      .afterClosed()
      .pipe(
        filter((field) => !!field),
        takeUntil(this._destroy$),
      )
      .subscribe((field) => {
        this.field = field;
        this._cdRef.markForCheck();
        this.fieldChanged.emit(this.field);
      });
  }

  public actionConfig(): void {
    this.fieldEditor.action(EditorAction.FieldSave, this.field)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.fieldChanged.emit(this.field);
      });
  }

  public openEditDialog(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const dialogRef = this._dialog.open(FieldEditDialogComponent, {
      width: '600px',
      data: {
        field: this.field,
        config: this.fieldEditor.config,
      },
    })

    dialogRef.afterClosed()
      .pipe(
        filter((field) => !!field),
        takeUntil(this._destroy$),
      )
      .subscribe((field) => {
        this.field = field;
        this._cdRef.markForCheck();
        this.fieldChanged.emit(this.field);
      });
  }

  public duplicate(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const index = this.fieldEditor.config.fields.indexOf(this.field) + 1;

    const copiedField = {
      ...cloneDeep(this.field),
      data: {},
    };

    this.fieldEditor.config.beforeFieldDuplicate(copiedField)
      .pipe(
        switchMap((field) => this.fieldEditor.action(EditorAction.FieldDuplicate, field, { index })),
        map((response) => response.field),
        switchMap((field) => this.fieldEditor.config.afterFieldDuplicated(field)),
        tap((field) =>  {
          this.fieldEditor.config.fields.splice(index, 0, field);
          this.fieldEditor.selectField(field);
        }),
        takeUntil(this._destroy$),
      )
    .subscribe();
  }
}
