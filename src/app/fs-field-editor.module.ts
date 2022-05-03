import { FieldEditorService } from './services/field-editor.service';
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
import { FsFileModule } from '@firestitch/file';
import { FsLabelModule } from '@firestitch/label';
import { FsDateModule } from '@firestitch/date';
import { FsGalleryModule } from '@firestitch/gallery';
import { FsCheckboxGroupModule } from '@firestitch/checkboxgroup';
import { FsRadioGroupModule } from '@firestitch/radiogroup';
import { FsAddressModule } from '@firestitch/address';
import { FsHtmlEditorModule } from '@firestitch/html-editor';

import { AngularStickyThingsModule } from '@w11k/angular-sticky-things';

import { FS_FIELD_EDITOR_CONFIG } from './injectors/fs-field-editor.providers';
import { FS_FIELD_EDITOR_ORIGINAL_CONFIG } from './injectors/fs-field-editor-original.providers';

import { FieldEditorComponent } from './components/field-editor/field-editor.component';
import { FieldRenderTextComponent } from './components/render/field-render-text/field-render-text.component';
import { FieldHeaderComponent } from './components/field-editor/field-header/field-header.component';
import { FieldToolbarComponent } from './components/field-editor/field-toolbar/field-toolbar.component';
import { FieldRenderChoiceComponent } from './components/render/field-render-choice/field-render-choice.component';
import { FieldRenderDropdownComponent } from './components/render/field-render-dropdown/field-render-dropdown.component';
import { FieldRenderNameComponent } from './components/render/field-render-name/field-render-name.component';
import { FieldRenderFileComponent } from './components/render/field-render-file/field-render-file.component';
import { FieldRenderGenderComponent } from './components/render/field-render-gender/field-render-gender.component';
import { FieldRenderAddressComponent } from './components/render/field-render-address/field-render-address.component';
import { FieldComponent } from './components/field/field.component';
import { FieldRendererComponent } from './components/field-renderer/field-renderer.component';
import { FieldViewerComponent } from './components/field-viewer/field-viewer.component';
import { FieldConfigDirective } from './directives/field-config/field-config.directive';
import { FieldRenderDirective } from './directives/field-render/field-render.directive';
import { FieldViewDirective } from './directives/field-view/field-view.directive';
import { FieldEditorConfig } from './interfaces/field.interface';
import { FieldType } from './enums/field-type';
import { FieldRenderComponent } from './components/render/field-render/field-render.component';
import { FieldViewGalleryComponent } from './components/field-view-gallery/field-view-gallery.component';
import { FieldViewComponent } from './components/field-view/field-view.component';
import { FieldConfigNameComponent } from './components/config/field-config-name/field-config-name.component';
import { FieldConfigOptionsComponent } from './components/config/field-config-options/field-config-options.component';
import { FieldConfigFileComponent } from './components/config/field-config-file/field-config-file.component';
import { FieldConfigGenderComponent } from './components/config/field-config-gender/field-config-gender.component';
import { FieldConfigAddressComponent } from './components/config/field-config-address/field-config-address.component';
import { FieldConfigRichTextComponent } from './components/config/field-config-rich-text/field-config-rich-text.component';
import { FieldRenderNameModelComponent } from './components/render/field-render-name-model/field-render-name-model.component';
import { FieldConfigHeadingComponent } from './components/config/field-config-heading/field-config-heading.component';
import { FieldRenderHeadingComponent } from './components/render/field-render-heading/field-render-heading.component';
import { FieldConfigContentComponent } from './components/config/field-config-content/field-config-content.component';
import { FieldRenderContentComponent } from './components/render/field-render-content/field-render-content.component';
import { FieldRenderRichTextComponent } from './components/render/field-render-rich-text/field-render-rich-text.component';
import { FieldFilePickerComponent } from './components/render/field-render-file/file-picker/field-file-picker.component';
import { FieldRenderCheckboxComponent } from './components/render/field-render-checkbox/field-render-checkbox.component';
import { FieldToolbarItemComponent } from './components/field-editor/field-toolbar-item/field-toolbar-item.component';
import { FieldRenderDateComponent } from './components/render/field-render-date/field-render-date.component';
import { FieldEditorItemComponent } from './components/field-editor/field-editor-item/field-editor-item.component';
import { FieldEditorToolbarDirective } from './directives/field-editor-toolbar/field-editor-toolbar.directive';


export function defaultConfigFactory(config) {
  return Object.assign(config,
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
          { type: FieldType.Date },
          { type: FieldType.Time },
          { type: FieldType.Divider },
          { type: FieldType.Name },
          { type: FieldType.Phone },
          { type: FieldType.Email },
          { type: FieldType.Address },
          { type: FieldType.Gender },
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
    FsFileModule,
    FsPromptModule,
    FsCheckboxGroupModule,
    FsRadioGroupModule,
    FsAddressModule,
  ],
  exports: [
    FieldEditorComponent,
    FieldRendererComponent,
    FieldViewerComponent,
    FieldConfigDirective,
    FieldRenderDirective,
    FieldRenderComponent,
    FieldViewComponent,
    FieldViewDirective,
    FieldEditorToolbarDirective,
  ],
  declarations: [
    FieldEditorComponent,
    FieldEditorItemComponent,
    FieldToolbarComponent,
    FieldToolbarItemComponent,
    FieldHeaderComponent,
    FieldComponent,
    FieldViewerComponent,
    FieldFilePickerComponent,

    FieldViewComponent,
    FieldViewDirective,
    FieldViewDirective,
    FieldViewGalleryComponent,

    FieldRendererComponent,
    FieldRenderChoiceComponent,
    FieldRenderDropdownComponent,
    FieldRenderTextComponent,
    FieldRenderNameComponent,
    FieldRenderFileComponent,
    FieldRenderGenderComponent,
    FieldRenderAddressComponent,
    FieldRenderDirective,
    FieldRenderComponent,
    FieldRenderNameModelComponent,
    FieldRenderHeadingComponent,
    FieldRenderContentComponent,
    FieldRenderRichTextComponent,
    FieldRenderCheckboxComponent,
    FieldRenderDateComponent,

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
  ],
})

export class FsFieldEditorModule {
  static forRoot(config: FieldEditorConfig = { case: 'camel' }): ModuleWithProviders<FsFieldEditorModule> {
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

