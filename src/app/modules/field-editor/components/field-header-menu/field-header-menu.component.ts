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

import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { Subject, forkJoin, of } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { cloneDeep } from 'lodash-es';

import { EditorAction } from '../../../../enums';
import { initField } from '../../../../helpers';
import { Field, FieldMenuItem } from '../../../../interfaces';
import { FieldEditorService } from '../../../../services';
import { SettingsComponent } from '../settings';


@Component({
  selector: 'fs-field-header-menu',
  templateUrl: './field-header-menu.component.html',
  styleUrls: ['./field-header-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldHeaderMenuComponent implements OnInit, OnDestroy {

  @Input() public field: Field;

  @Output() public fieldChanged = new EventEmitter<Field>();

  public menuItems;

  private _destroy$ = new Subject();

  constructor(
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
        label: 'Duplicate',
        click: (event) => {
          this.duplicate(event);
        },
        show: this.fieldEditor.fieldShowDuplicate(this.field),
      },
      {
        label: 'Settings',
        click: (event) => {
          this.settings(event);
        },
        show: this.fieldEditor.fieldShowSettings(this.field),
      },
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
    this._destroy$.next(null);
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
    this.fieldEditor.fieldChange(this.field);
    this.fieldChanged.emit(this.field);
  }

  public duplicate(event: Event): void {
    let index = this.fieldEditor.findFieldIndexByField(this.field);

    if(index !== -1) {
      index++;

      const copiedField = {
        ...cloneDeep(this.field),
        data: {},
      };

      this.fieldEditor.config.beforeFieldDuplicate(copiedField)
        .pipe(
          switchMap((field) => this.fieldEditor
            .action(EditorAction.FieldDuplicate, field, { index })),
          map((response) => initField(response.field)),
          switchMap((field) => this.fieldEditor.config.afterFieldDuplicated(field)),
          tap((field) => {
            this.fieldEditor.config.fields.splice(index, 0, field);
            this.fieldEditor.selectField(field);
          }),
          takeUntil(this._destroy$),
        )
        .subscribe();
    }
  }
}
