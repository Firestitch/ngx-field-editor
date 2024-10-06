import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import { guid } from '@firestitch/common';
import { Field } from '@firestitch/field-editor';
import { FsListComponent, FsListConfig } from '@firestitch/list';

import { of, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

import { TermType } from '../../enums';
import { Term } from '../../interfaces/term';
import { TermsFieldConfigDialogComponent } from '../terms-field-config-dialog';


@Component({
  selector: 'app-terms-field-config',
  templateUrl: './terms-field-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TermsFieldConfigComponent),
      multi: true,
    },
  ],  
})
export class TermsFieldConfigComponent implements ControlValueAccessor, OnInit, OnDestroy {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  public listConfig: FsListConfig;
  public terms: Term[] = [];
  public TermType = TermType;

  private _onChange: (value: unknown) => void;
  private _onTouch: (value: unknown) => void;

  private _disabled = false;
  private _field: Field = null;
  private _destroy$ = new Subject();

  constructor(
    private _dialog: MatDialog,
    private _cdRef: ChangeDetectorRef,    
  ) {}

  public ngOnInit(): void {
    this.listConfig = {
      paging: false,
      status: false,
      rowActions: [
        {
          click: (term) => {
            return of(true)
              .pipe(
                tap(() => {
                  this.terms = this.terms
                    .filter((item: Term) => item.guid !== term.guid);                
                }),
              );
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this term?',
          },
          label: 'Delete',
        },  
      ],
      actions: [
        {
          label: 'Add',
          click: () => {
            this._open({
              guid: guid(),
            })
              .subscribe((term) => {
                this.terms.push(term);
                this.termsChange(this.terms);
                this.list.reload();
              });
          },
        },
      ],
      fetch: () => {
        return of({ data: this.terms });
      },
    };    
  }

  public open(term: Term) {
    this._dialog.open(TermsFieldConfigDialogComponent, {
      data: { 
        term,
      },
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((term) => {
        const index = this.terms.findIndex((item) => item.guid === term.guid);
        this.terms[index] = term;
        this.termsChange(this.terms);
        this.list.reload();
      });
  }

  public _open(term: Term) {
    return this._dialog.open(TermsFieldConfigDialogComponent, {
      data: { 
        term,
      },
    })
      .afterClosed()
      .pipe(
        filter((term) => !!term),
        takeUntil(this._destroy$),
      );
  }

  public get field(): Field {
    return this._field;
  }

  public writeValue(field: Field | undefined): void {
    this._field = field;
    this.terms = field?.configs?.terms || [];
    if(this.list) {
      this.list.reload();
    }
    
    this._cdRef.markForCheck();
  }

  public setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  public termsChange(terms): void {
    this.field.configs.terms = terms;
    this.fieldChange(this.field);    
  }

  public fieldChange(field: Field): void {
    this._field = field;
    this._onChange(field);
  }

  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

}
