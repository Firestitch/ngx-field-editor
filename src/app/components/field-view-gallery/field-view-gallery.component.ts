import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

import { FsGalleryComponent, FsGalleryConfig, FsGalleryItem, GalleryLayout, GalleryThumbnailSize, mime, ThumbnailScale } from '@firestitch/gallery';

import { Observable, of } from 'rxjs';


@Component({
  selector: 'fs-field-view-gallery',
  templateUrl: 'field-view-gallery.component.html',
  styleUrls: ['field-view-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldViewGalleryComponent implements OnInit {

  @ViewChild(FsGalleryComponent)
  public gallery: FsGalleryComponent;

  @Input() public field: any = { config: {} };
  @Input() public actions = [];

  public galleryConfig: FsGalleryConfig;

  public ngOnInit(): void {
    this._initGalleryConfig();
  }
  
  public reload(): void {
    this.gallery.reload();
  }

  private _initGalleryConfig(): void {
    let info: any = {
      icon: true,
    };

    if (this.actions.length) {
      info = {
        ...info,
        menu: {
          actions: this.actions,
        },
      };
    }

    this.galleryConfig = {
      thumbnail: {
        width: 250,
        height: 200,
        size: GalleryThumbnailSize.Cover,
      },
      showChangeSize: false,
      showChangeView: false,
      noResults: false,
      persist: false,
      layout: GalleryLayout.Flow,
      zoom: false,
      info,
      fetch: (query?: any, item?: FsGalleryItem): Observable<FsGalleryItem[]> => {
        const items = this.field.data.value
        .map((item) => ({
          url: item.url,
          preview: item.url,
          name: item.name,
          mime: item.mime || mime(item.name, item.url, '', false),
        }));

        return of(items);
      },
    }
  }
}
