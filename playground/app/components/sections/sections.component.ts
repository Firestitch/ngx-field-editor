import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { FS_FIELD_EDITOR_CONFIG, FieldEditorComponent, FieldEditorConfig, FieldType, Field } from '@firestitch/field-editor';
import { FsApi } from '@firestitch/api';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { DialogExampleComponent } from '../dialog-example';


@Component({
  selector: 'sections',
  templateUrl: 'sections.component.html',
  styleUrls: ['sections.component.scss']
})
export class SectionsComponent implements OnInit {

  @ViewChild('fieldEditor', { static: true }) fieldEditor: FieldEditorComponent;
  public config: FieldEditorConfig;
  public configured: FieldEditorConfig;
  public selectedIndex = 0;

  constructor(@Inject(FS_FIELD_EDITOR_CONFIG) private defaultConfig,
              public dialog: MatDialog,
              public fsApi: FsApi)  {}

  ngOnInit() {

    this.config = {
      fieldDrop: (field, toolbarItem) => {

        if (field.config.type === 'share') {
          field.config.configs.facebook = true;
          field.config.configs.google = true;
          field.config.configs.hideRequired = true;
        }
      },
      fieldChanged: (field: Field) => {
        console.log('Field Changed', field);
      },
      fieldAdd: () => {
        console.log('Field Add');
      },
      fieldAdded: () => {
        console.log('Field Added');
      },
      fieldMoved: () => {
        console.log('Field Moved');
      },
      fieldDuplicate: () => {
        console.log('Field Duplicate');
      },
      fieldDuplicated: () => {
        console.log('Field Duplicated');
      },
      fieldSelected: () => {
        console.log('Field Selected');
      },
      fieldUnselected: () => {
        console.log('Field Unselected');
      },
      fieldRemoved: () => {
        console.log('Field Removed');
      },
      imageUpload: (field, file: File) => {
        return this.fsApi.post('https://boilerplate.firestitch.com/api/dummy/upload', { file: file })
            .pipe(map((response) => response.data.url))
      },
      fileUpload: (field, file: File) => {

        console.log('File Selected', file);

        const data = {
          file: file,
          sleep: 1
        };

        return this.fsApi.post('https://boilerplate.firestitch.com/api/dummy/upload', data)
          .pipe(
            map(response => ({
              id: 99999,
              url: response.data.url,
              name: file.name
            })
          ))
      },
      fileRemove: (field, data) => {
        console.log('File Remove', field, data);
        return of(true);
      },
      fileRemoved: (field, data) => {
        console.log('File Removed', field, data);
      },
      fileDownload: (field, data) => {
        window.location = data.url;
      },
      toolbar: {
        items: [
          {
            section: 'Custom Fields',
            items: this.defaultConfig.toolbar.items,
          },
          {
            section: 'Standard Fields',
            items: [
              {
                icon: 'share',
                label: 'Share',
                type: 'share',
                disabled: true,
              },
              {
                icon: 'edit',
                label: 'Signature',
                type: 'signpad',
                data: {
                  value: 'data:image/png;base64,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',
                },
              }

            ],
          },
        ]
      },
      fields: [ ],
    };
  }

  shareChange() {
    // this.fieldEditor.fieldChanged.emit();
  }

  save() {
    console.log('Saved');
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogExampleComponent, {
      width: '600px',
      data: { config: this.config}
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  tabChange(event) {
    this.selectedIndex = event.index;
  }
}
