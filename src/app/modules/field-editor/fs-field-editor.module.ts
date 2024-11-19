import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FsAddressModule } from '@firestitch/address';
import { FsCheckboxGroupModule } from '@firestitch/checkboxgroup';
import { FsCommonModule } from '@firestitch/common';
import { FsDateModule } from '@firestitch/date';
import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFileModule } from '@firestitch/file';
import { FsFormModule } from '@firestitch/form';
import { FsGalleryModule } from '@firestitch/gallery';
import { FsHtmlEditorModule, FsHtmlRendererModule } from '@firestitch/html-editor';
import { FsLabelModule } from '@firestitch/label';
import { FsMenuModule } from '@firestitch/menu';
import { FsPhoneModule } from '@firestitch/phone';
import { FsPopoverModule } from '@firestitch/popover';
import { FsPromptModule } from '@firestitch/prompt';
import { FsRadioGroupModule } from '@firestitch/radiogroup';

import { DefaultToolbarItems } from 'src/app/consts';

import { FS_FIELD_EDITOR_ORIGINAL_CONFIG } from '../../injectors/fs-field-editor-original.providers';
import { FS_FIELD_EDITOR_CONFIG } from '../../injectors/fs-field-editor.providers';
import { FieldEditorConfig } from '../../interfaces';
import { FieldEditorService } from '../../services';
import { FieldRenderDirective } from '../field-renderer/directives';
import { FsFieldRendererModule } from '../field-renderer/fs-field-renderer.module';
import { FsFieldViewerModule } from '../field-viewer/fs-field-viewer.module';

import {
  FieldConfigVisualSelectorComponent,
  FieldHeaderMenuComponent,
  PopulateUrlComponent,
  SettingsComponent,
} from './components';
import { FieldConfigAddressComponent } from './components/field-config-address/field-config-address.component';
import { FieldConfigContentComponent } from './components/field-config-content/field-config-content.component';
import { FieldConfigFileComponent } from './components/field-config-file/field-config-file.component';
import { FieldConfigGenderComponent } from './components/field-config-gender/field-config-gender.component';
import { FieldConfigHeadingComponent } from './components/field-config-heading/field-config-heading.component';
import { FieldConfigNameComponent } from './components/field-config-name/field-config-name.component';
import { FieldConfigOptionsComponent } from './components/field-config-options/field-config-options.component';
import { FieldConfigRichTextComponent } from './components/field-config-rich-text/field-config-rich-text.component';
import { FieldEditorItemComponent } from './components/field-editor-item/field-editor-item.component';
import { FieldEditorComponent } from './components/field-editor/field-editor.component';
import { FieldHeaderComponent } from './components/field-header/field-header.component';
import { FieldToolbarItemComponent } from './components/field-toolbar-item/field-toolbar-item.component';
import { FieldToolbarComponent } from './components/field-toolbar/field-toolbar.component';
import { FieldComponent } from './components/field/field.component';
import { StickyThingDirective } from './directives';
import { FieldConfigDirective } from './directives/field-config/field-config.directive';
import { FieldContainerDirective } from './directives/field-container/field-container.directive';
import { FieldEditorToolbarDirective } from './directives/field-editor-toolbar/field-editor-toolbar.directive';
import { ScrollableHandlerDirective } from './directives/scrollable/scrollable-handler.directive';

export function defaultConfigFactory(config) {
  return Object.assign(config || {},
    {
      fields: [],
      toolbar: {
        items: DefaultToolbarItems,
      },
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

    DragDropModule,

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
    FieldHeaderMenuComponent,
    ScrollableHandlerDirective,
    StickyThingDirective,
  ],
  exports: [
    FieldEditorComponent,
    FieldConfigDirective,
    FieldEditorToolbarDirective,
    FieldContainerDirective,
    FieldEditorItemComponent,
    FieldRenderDirective,
    ScrollableHandlerDirective,
  ],
})

export class FsFieldEditorModule {
  public static forRoot(
    config: FieldEditorConfig = null,
  ): ModuleWithProviders<FsFieldEditorModule> {
    return {
      ngModule: FsFieldEditorModule,
      providers: [
        FieldEditorService,
        { provide: FS_FIELD_EDITOR_ORIGINAL_CONFIG, useValue: config },
        {
          provide: FS_FIELD_EDITOR_CONFIG,
          useFactory: defaultConfigFactory,
          deps: [FS_FIELD_EDITOR_ORIGINAL_CONFIG],
        },
      ],
    };
  }
}

