import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { FsGalleryItem, FsGalleryItemAction } from '@firestitch/gallery';

import { ViewerAction } from '../../../../enums';
import { Field } from '../../../../interfaces';
import { FieldViewerService } from '../../../../services';


@Component({
  selector: 'fs-field-view-gallery',
  templateUrl: './field-view-gallery.component.html',
  styleUrls: ['./field-view-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldViewGalleryComponent implements OnInit {

  @Input() public field: Field;

  public menuItems: FsGalleryItemAction[];

  constructor(
    private _fieldViewerService: FieldViewerService,
    private _cdRef: ChangeDetectorRef,
  ) { }

  public fileDownload(data): void {
    this._fieldViewerService.action(ViewerAction.FileDownload, this.field, data)
      .subscribe();
  }

  public ngOnInit(): void {
    this._fieldViewerService.canFileDownload(this.field)
      .subscribe((canFileDownload) => {
        this.menuItems = canFileDownload ? [
          {
            label: 'Download',
            click: (galleryItem: FsGalleryItem) => {
              this.fileDownload({ fieldFile: galleryItem.data });
            },
          },
        ] : [];

        this._cdRef.markForCheck();
      });
  }


}
