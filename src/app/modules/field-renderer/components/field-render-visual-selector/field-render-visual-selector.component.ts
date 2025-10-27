import { ChangeDetectionStrategy, Component, Optional } from '@angular/core';
import { ControlContainer, NgForm, FormsModule } from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';

import { FieldComponent } from '../field/field.component';
import { FsLabelModule } from '@firestitch/label';
import { FieldRenderVisualSelectorModelComponent } from './field-render-visual-selector-model/field-render-visual-selector-model.component';
import { FsFormModule } from '@firestitch/form';


@Component({
    selector: 'fs-field-render-visual-selector',
    templateUrl: './field-render-visual-selector.component.html',
    styleUrls: ['./field-render-visual-selector.component.scss'],
    viewProviders: [
        {
            provide: ControlContainer,
            useFactory: controlContainerFactory,
            deps: [[new Optional(), NgForm]],
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsLabelModule,
        FieldRenderVisualSelectorModelComponent,
        FormsModule,
        FsFormModule,
    ],
})
export class FieldRenderVisualSelectorComponent extends FieldComponent {

}
