import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

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
import { FsCheckboxGroupModule } from '@firestitch/checkboxgroup';
import { FsRadioGroupModule } from '@firestitch/radiogroup';
import { FsMenuModule } from '@firestitch/menu';
import { FsAddressModule } from '@firestitch/address';
import { FsHtmlEditorModule, FsHtmlRendererModule } from '@firestitch/html-editor';


import { FieldRenderTextComponent } from './components/field-render-text/field-render-text.component';
import { FieldRenderChoiceComponent } from './components/field-render-choice/field-render-choice.component';
import { FieldRenderDropdownComponent } from './components/field-render-dropdown/field-render-dropdown.component';
import { FieldRenderNameComponent } from './components/field-render-name/field-render-name.component';
import { FieldRenderFileComponent } from './components/field-render-file/field-render-file.component';
import { FieldRenderGenderComponent } from './components/field-render-gender/field-render-gender.component';
import { FieldRenderAddressComponent } from './components/field-render-address/field-render-address.component';
import { FieldRendererComponent } from './components/field-renderer/field-renderer.component';
import { FieldRenderDirective } from './directives/field-render/field-render.directive';
import { FieldRenderComponent } from './components/field-render/field-render.component';

import { FieldRenderContentComponent } from './components/field-render-content/field-render-content.component';
import { FieldRenderRichTextComponent } from './components/field-render-rich-text/field-render-rich-text.component';
import { FieldRenderFileMultipleComponent } from './components/field-render-file/field-render-file-multiple/field-render-file-multiple.component';
import { FieldRenderFileSingleComponent } from './components/field-render-file/field-render-file-single/field-render-file-single.component';
import { FieldRenderNameModelComponent } from './components/field-render-name-model/field-render-name-model.component';
import { FieldRenderCheckboxComponent } from './components/field-render-checkbox/field-render-checkbox.component';
import { FieldRenderDateComponent } from './components/field-render-date/field-render-date.component';
import { FieldRenderTimeComponent } from './components/field-render-time/field-render-time.component';
import { FieldRenderBirthdayComponent } from './components/field-render-birthday/field-render-birthday.component';
import { FsFieldViewerModule } from '../field-viewer/fs-field-viewer.module';
import { FieldRenderVisualSelectorComponent } from './components';


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
    FieldRenderFileSingleComponent,
    FieldRenderBirthdayComponent,
    FieldRenderVisualSelectorComponent,
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
    FieldRenderFileSingleComponent,
    FieldRenderBirthdayComponent,
    FieldRenderVisualSelectorComponent,
  ],
})

export class FsFieldRendererModule {

}

