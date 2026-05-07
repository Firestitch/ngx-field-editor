import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ControlContainer } from '@angular/forms';

import { FieldComponent } from '../field/field.component';
import { FsLabelModule } from '@firestitch/label';
import { FsHtmlRendererModule } from '@firestitch/html-editor';


@Component({
    selector: 'fs-field-render-content',
    styleUrls: ['./field-render-content.component.scss'],
    templateUrl: './field-render-content.component.html',
    viewProviders: [
        {
            provide: ControlContainer,
            useFactory: () => inject(ControlContainer, { skipSelf: true, optional: true }),
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsLabelModule, FsHtmlRendererModule],
})
export class FieldRenderContentComponent extends FieldComponent {
}
