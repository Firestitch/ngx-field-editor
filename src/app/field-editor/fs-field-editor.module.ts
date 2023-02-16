import { FieldEditorService } from '../services/field-editor.service';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FsCommonModule } from '@firestitch/common';
import { FsPromptModule } from '@firestitch/prompt';
import { FsFormModule } from '@firestitch/form';
import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsPhoneModule } from '@firestitch/phone';
import { FsMenuModule } from '@firestitch/menu';
import { FsFileModule } from '@firestitch/file';
import { FsLabelModule } from '@firestitch/label';
import { FsDateModule } from '@firestitch/date';
import { FsGalleryModule } from '@firestitch/gallery';
import { FsCheckboxGroupModule } from '@firestitch/checkboxgroup';
import { FsPopoverModule } from '@firestitch/popover';
import { FsRadioGroupModule } from '@firestitch/radiogroup';
import { FsAddressModule } from '@firestitch/address';
import { FsHtmlEditorModule, FsHtmlRendererModule } from '@firestitch/html-editor';

import { AngularStickyThingsModule } from '@w11k/angular-sticky-things';

import { FS_FIELD_EDITOR_CONFIG } from '../injectors/fs-field-editor.providers';
import { FS_FIELD_EDITOR_ORIGINAL_CONFIG } from '../injectors/fs-field-editor-original.providers';

import { FieldEditorComponent } from './components/field-editor/field-editor.component';
import { FieldHeaderComponent } from './components/field-header/field-header.component';
import { FieldToolbarComponent } from './components/field-toolbar/field-toolbar.component';
import { FieldComponent } from './components/field/field.component';
import { FieldConfigDirective } from './directives/field-config/field-config.directive';
import { FieldContainerDirective } from './directives/field-container/field-container.directive';
import { FieldType } from '../enums/field-type';

import { FieldConfigOptionsComponent } from './components/field-config-options/field-config-options.component';
import { FieldConfigNameComponent } from './components/field-config-name/field-config-name.component';
import { FieldConfigFileComponent } from './components/field-config-file/field-config-file.component';
import { FieldConfigGenderComponent } from './components/field-config-gender/field-config-gender.component';
import { FieldConfigAddressComponent } from './components/field-config-address/field-config-address.component';
import { FieldConfigRichTextComponent } from './components/field-config-rich-text/field-config-rich-text.component';
import { FieldConfigHeadingComponent } from './components/field-config-heading/field-config-heading.component';
import { FieldConfigContentComponent } from './components/field-config-content/field-config-content.component';

import { FieldToolbarItemComponent } from './components/field-toolbar-item/field-toolbar-item.component';
import { FieldEditorItemComponent } from './components/field-editor-item/field-editor-item.component';
import { FieldEditorToolbarDirective } from './directives/field-editor-toolbar/field-editor-toolbar.directive';
import { FieldEditorConfig } from '../interfaces/field-editor-config.interface';
import { FsFieldViewerModule } from '../field-viewer/fs-field-viewer.module';
import { FsFieldRendererModule } from '../field-renderer/fs-field-renderer.module';
import { FieldConfigVisualSelectorComponent, PopulateUrlComponent, SettingsComponent } from './components';
import { MatDialogModule } from '@angular/material/dialog';
import { FsDialogModule } from '@firestitch/dialog';


export function defaultConfigFactory(config) {
  return Object.assign(config || {},
    { fields: [],
      toolbar: {
        items: [
          { type: FieldType.Heading },
          { type: FieldType.Content },
          { type: FieldType.Divider },
          { type: FieldType.ShortText },
          { type: FieldType.LongText },
          { type: FieldType.RichText },
          { type: FieldType.Dropdown },
          { type: FieldType.Choice },
          { type: FieldType.Checkbox },
          { type: FieldType.VisualSelector },
          { type: FieldType.Date },
          { type: FieldType.Time },
          { type: FieldType.Divider },
          { type: FieldType.Name },
          { type: FieldType.Phone },
          { type: FieldType.Email },
          { type: FieldType.Address },
          { type: FieldType.Gender },
          { type: FieldType.Birthday },
          { type: FieldType.Divider },
          { type: FieldType.File },
        ]
      }
  });
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule,

    FlexLayoutModule,

    DragDropModule,
    AngularStickyThingsModule,

    FsFormModule,
    FsCommonModule,
    FsPromptModule,
    FsDatePickerModule,
    FsPhoneModule,
    FsGalleryModule,
    FsLabelModule,
    FsDateModule,
    FsHtmlEditorModule,
    FsHtmlRendererModule,
    FsFileModule,
    FsPromptModule,
    FsCheckboxGroupModule,
    FsRadioGroupModule,
    FsMenuModule,
    FsPopoverModule,
    FsAddressModule,
    FsFieldViewerModule,
    FsFieldRendererModule,
    FsDialogModule,
  ],
  exports: [
    FieldEditorComponent,
    FieldConfigDirective,
    FieldEditorToolbarDirective,
    FieldContainerDirective,
  ],
  declarations: [
    FieldEditorComponent,
    FieldEditorItemComponent,
    FieldToolbarComponent,
    FieldToolbarItemComponent,
    FieldHeaderComponent,
    FieldComponent,
    FieldConfigNameComponent,
    FieldConfigOptionsComponent,
    FieldConfigFileComponent,
    FieldConfigGenderComponent,
    FieldConfigAddressComponent,
    FieldConfigHeadingComponent,
    FieldConfigContentComponent,
    FieldConfigRichTextComponent,
    FieldConfigDirective,
    FieldEditorToolbarDirective,
    FieldContainerDirective,
    SettingsComponent,
    PopulateUrlComponent,
    FieldConfigVisualSelectorComponent,
  ],
})

export class FsFieldEditorModule {
  static forRoot(config: FieldEditorConfig = null): ModuleWithProviders<FsFieldEditorModule> {
    return {
      ngModule: FsFieldEditorModule,
      providers: [
        FieldEditorService,
        { provide: FS_FIELD_EDITOR_ORIGINAL_CONFIG, useValue: config },
        {
          provide: FS_FIELD_EDITOR_CONFIG,
          useFactory: defaultConfigFactory,
          deps: [FS_FIELD_EDITOR_ORIGINAL_CONFIG]
        },
      ]
    };
  }
}

