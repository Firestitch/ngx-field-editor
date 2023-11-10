import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

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

import { FsAddressModule } from '@firestitch/address';
import { FsCheckboxGroupModule } from '@firestitch/checkboxgroup';
import { FsCommonModule } from '@firestitch/common';
import { FsDateModule } from '@firestitch/date';
import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsFileModule } from '@firestitch/file';
import { FsFormModule } from '@firestitch/form';
import { FsHtmlEditorModule, FsHtmlRendererModule } from '@firestitch/html-editor';
import { FsLabelModule } from '@firestitch/label';
import { FsMenuModule } from '@firestitch/menu';
import { FsPhoneModule } from '@firestitch/phone';
import { FsPromptModule } from '@firestitch/prompt';
import { FsRadioGroupModule } from '@firestitch/radiogroup';


import { FsFieldViewerModule } from '../field-viewer/fs-field-viewer.module';
import { FsFieldCommonModule } from '../field-common/fs-field-common.module';

import {
  FieldRenderVisualSelectorComponent,
  FieldRenderVisualSelectorModelComponent,
} from './components';
import { FieldRenderAddressComponent } from './components/field-render-address/field-render-address.component';
import { FieldRenderBirthdayComponent } from './components/field-render-birthday/field-render-birthday.component';
import { FieldRenderCheckboxComponent } from './components/field-render-checkbox/field-render-checkbox.component';
import { FieldRenderChoiceComponent } from './components/field-render-choice/field-render-choice.component';
import { FieldRenderContentComponent } from './components/field-render-content/field-render-content.component';
import { FieldRenderDateComponent } from './components/field-render-date/field-render-date.component';
import { FieldRenderDropdownComponent } from './components/field-render-dropdown/field-render-dropdown.component';
import { FieldRenderFileMultipleComponent } from './components/field-render-file/field-render-file-multiple/field-render-file-multiple.component';
import { FieldRenderFileComponent } from './components/field-render-file/field-render-file.component';
import { FieldRenderGenderComponent } from './components/field-render-gender/field-render-gender.component';
import { FieldRenderNameModelComponent } from './components/field-render-name/field-render-name-model/field-render-name-model.component';
import { FieldRenderNameComponent } from './components/field-render-name/field-render-name.component';
import { FieldRenderRichTextComponent } from './components/field-render-rich-text/field-render-rich-text.component';
import { FieldRenderTextComponent } from './components/field-render-text/field-render-text.component';
import { FieldRenderTimeComponent } from './components/field-render-time/field-render-time.component';
import { FieldRenderComponent } from './components/field-render/field-render.component';
import { FieldRendererComponent } from './components/field-renderer/field-renderer.component';
import { FieldRenderDirective } from './directives/field-render/field-render.directive';


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

    FsFormModule,
    FsCommonModule,
    FsPromptModule,
    FsDatePickerModule,
    FsPhoneModule,
    FsLabelModule,
    FsDateModule,
    FsHtmlEditorModule,
    FsHtmlRendererModule,
    FsFileModule,
    FsPromptModule,
    FsCheckboxGroupModule,
    FsRadioGroupModule,
    FsMenuModule,
    FsAddressModule,
    FsFieldCommonModule,
    FsFieldViewerModule,
  ],
  declarations: [
    FieldRendererComponent,
    FieldRenderComponent,
    FieldRenderFileMultipleComponent,
    FieldRenderChoiceComponent,
    FieldRenderDropdownComponent,
    FieldRenderTextComponent,
    FieldRenderNameComponent,
    FieldRenderFileComponent,
    FieldRenderGenderComponent,
    FieldRenderAddressComponent,
    FieldRenderDirective,
    FieldRenderNameModelComponent,
    FieldRenderContentComponent,
    FieldRenderRichTextComponent,
    FieldRenderCheckboxComponent,
    FieldRenderDateComponent,
    FieldRenderTimeComponent,
    FieldRenderBirthdayComponent,
    FieldRenderVisualSelectorComponent,
    FieldRenderVisualSelectorModelComponent,
  ],
  exports: [
    FieldRendererComponent,
    FieldRenderComponent,
    FieldRenderChoiceComponent,
    FieldRenderDropdownComponent,
    FieldRenderTextComponent,
    FieldRenderNameComponent,
    FieldRenderFileComponent,
    FieldRenderGenderComponent,
    FieldRenderAddressComponent,
    FieldRenderDirective,
    FieldRenderNameModelComponent,
    FieldRenderContentComponent,
    FieldRenderRichTextComponent,
    FieldRenderCheckboxComponent,
    FieldRenderDateComponent,
    FieldRenderTimeComponent,
    FieldRenderBirthdayComponent,
    FieldRenderVisualSelectorComponent,
  ],
})

export class FsFieldRendererModule {

}

