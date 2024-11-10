import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';

import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

import { Field, FieldEditorConfig, FieldOption, FieldType, FsFieldEditorModule, VisualSelectorFormat } from '../../../../src/public_api';


@Component({
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true, 
  imports: [
    MatDialogModule,
    MatTabsModule,

    FsFieldEditorModule,
  ],
})
export class DialogComponent implements OnInit {
    
  public fieldEditorConfig: FieldEditorConfig;

  public ngOnInit(): void {
    this.fieldEditorConfig = {
      action: null,
      fields: this.getFields(),
    };
  }

  public getFields(): (Field | FieldOption)[] {
    return [
      {
        label: 'Student Date of Birth',
        type: FieldType.Birthday,
        guid: 'birthday',
        maxYear: new Date().getFullYear() + 5,
        data: {},
      },
      {
        data: {},
        guid: '1',
        type: FieldType.Dropdown,
        label: 'Dropdown Question',
        configs: {
          required: true,
          default: 'Option A',
        },
        options: [
          {
            value: '11',
            name: 'Option A',
            guid: '23wd',
          },
          {
            value: '22',
            name: 'Option B',
            guid: '345refsd',
          },
        ],
      },
      {
        data: {},
        guid: '222',
        type: FieldType.ShortText,
        label: 'Short Text Question',
        description: 'Description Description Description',
        configs: {
          identifier: 'shortText',
          populate: true,
        },
      },
      {
        guid: '444',
        type: FieldType.RichText,
        label: 'Rich Text',
        configs: {
          default: 'Default HTML',
          froalaConfig: {
            toolbarSticky: false,
          },
        },
      },
      {
        guid: '3122',
        type: FieldType.VisualSelector,
        label: 'Pets',
        configs: {
          format: VisualSelectorFormat.ImageName,
        },
        options: [
          {
            value: 'dog',
            name: 'Dog',
            image: {
              preview: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Cara_de_quem_caiu_do_caminh%C3%A3o..._%28cropped%29.jpg/220px-Cara_de_quem_caiu_do_caminh%C3%A3o..._%28cropped%29.jpg',
            },
            guid: '2314rewf',
          },
          {
            value: 'cat',
            name: 'Cat',
            image: {
              preview: 'https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&quality=85&auto=format&fit=max&s=a52bbe202f57ac0f5ff7f47166906403',
            },
            guid: '435rtewsd',
          },
          {
            value: 'mouse',
            name: 'Mouse',
            image: {
              preview: 'https://cdn-prod.medicalnewstoday.com/content/images/articles/277/277169/mouse.jpg',
            },
            guid: '56tyrgdf',
          },
          {
            value: 'horse',
            name: 'Horse',
            image: {
              preview: 'https://ichef.bbci.co.uk/news/976/cpsprodpb/B875/production/_102512274_gettyimages-518360318.jpg',
            },
            guid: '76dfvgfd',
          },
          {
            value: 'bat',
            name: 'Bat',
            image: {
              preview: 'https://cdn.britannica.com/21/75121-050-8CF5E1DB/Bats-structures-organs-sound-frequencies-signals-contexts.jpg',
            },
            guid: '3243465t',
          },
        ],
        data: {
          value: {
            selected: ['2314rewf'],
          },
        },
      },
      {
        data: {
          value: '',
        },
        guid: '4',
        type: FieldType.Name,
        label: 'Name Question',
        configs: {
          first_name: {
            display: true,
            label: 'test',
          },
        },
      },
      {
        data: {},
        guid: '3',
        type: FieldType.LongText,
        label: 'Long Text Question',
      },
      {
        data: {},
        guid: '6',
        type: FieldType.Phone,
        label: 'Phone Question',
      },
      {
        data: {},
        guid: '7',
        type: FieldType.Email,
        label: 'Email Question',
      },
      {
        data: {},
        guid: '333',
        type: FieldType.Address,
        label: 'Address',
      },
      {
        data: {
          value: '',
        },
        guid: '133',
        type: FieldType.Gender,
        label: 'Gender',
        configs: {
          populate: true,
          identifier: 'gender',
        },
        options: [
          {
            name: 'Male',
            value: 'male',
            guid: 'sdfvg345fgvds',
          },
          {
            name: 'Female',
            value: 'female',
            guid: 'h5346234443',
          },
        ],
      },
      {
        data: {
          value: {
            //other: 'Some text',
            selected: 'gsdfdsdf',
          },
        },
        guid: '5',
        type: FieldType.Choice,
        label: 'Choice Question',
        configs: {
          other: true,
          identifier: 'choice',
          populate: true,
          default: '2343w346',
        },
        options: [
          {
            value: '66',
            name: 'Option A',
            guid: '3wdasd',
            notes: true,
          },
          {
            value: '77',
            name: 'Option B',
            guid: '2343w346',
            notes: true,
          },
          {
            value: '88',
            name: 'Option C',
            guid: 'gsdfdsdf',
          },
        ],
      },
      {
        data: {},
        guid: '8',
        type: FieldType.Time,
        label: 'Time Question',
      },
      {
        data: {
          value: '2021-05-06T18:59:01+00:00',
        },
        guid: '9',
        type: FieldType.Date,
        label: 'Date Question',
        configs: {
          identifier: 'date',
          populate: true,
        },
      },
      {
        data: {
        },
        guid: '10',
        type: FieldType.Checkbox,
        label: 'Checkboxes Question',
        configs: {
          other: true,
          populate: true,
          identifier: 'checkboxes',
        },
        options: [
          {
            value: '99',
            name: 'Option A',
            guid: '56tgdf',
            notes: true,
          },
          {
            value: '111',
            name: 'Option B',
            guid: '35dfghfh',
            notes: true,
          },
          {
            value: '222',
            name: 'Option C',
            guid: '345435',
          },
        ],
      },
      {
        guid: '111',
        type: 'signature',
        label: 'Signature',
        configs: {
          required: true,
        },
        data: {
          signature: 'https://firestitch-dev.s3.amazonaws.com/pub/fv/file/01b9cc58b1453f43b0fe5fcf96263be1_1619422445.svg',
        },
      },
      {
        guid: '11',
        type: FieldType.File,
        label: 'File Upload',
        configs: {
          basic: true,
          allowMultiple: true,
          allowedFileTypes: { image: true },
        },
        data: {
          files: [
            {
              id: 99999,
              //url: 'http://picsum.photos/id/275/500/300.jpg',
              filename: 'adorable-animal-blur-406014.jpg',
            },
          ],
        },
      },
    ];
  }

}
