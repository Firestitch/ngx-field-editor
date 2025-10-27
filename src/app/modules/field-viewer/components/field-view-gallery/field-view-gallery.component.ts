import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';

import { FsApiFile } from '@firestitch/api';
import { FsGalleryItem, FsGalleryItemAction } from '@firestitch/gallery';

import { ViewerAction } from '../../../../enums';
import { Field, FieldFile } from '../../../../interfaces';
import { FieldViewerService } from '../../../../services';
import { FieldGalleryComponent } from '../../../field-common/components/field-view-gallery/field-gallery.component';


@Component({
    selector: 'fs-field-view-gallery',
    templateUrl: './field-view-gallery.component.html',
    styleUrls: ['./field-view-gallery.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FieldGalleryComponent],
})
export class FieldViewGalleryComponent implements OnInit {

  @Input() public field: Field;
  @Input() public filePreviewDownload: (field: Field, file: FieldFile) => FsApiFile;
  @Input() public fileDownload: (field: Field, file: FieldFile) => FsApiFile;

  public menuItems: FsGalleryItemAction[];
  
  private _fieldViewerService = inject(FieldViewerService, { optional: true });
  private _cdRef = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    if(this._fieldViewerService) {
      this._fieldViewerService
        .canFileDownload(this.field)
        .subscribe((canFileDownload) => {
          this.menuItems = canFileDownload ? [
            {
              label: 'Download',
              click: (galleryItem: FsGalleryItem) => {
                this._fileDownload(galleryItem.data);
              },
            },
          ] : [];

          this._cdRef.markForCheck();
        });
    } else {
      this.menuItems = [];  
    }
  }

  private _fileDownload(data): void {
    this._fieldViewerService
      .action(ViewerAction.FileDownload, this.field, { fieldFile: data })
      .subscribe();
  }


}
