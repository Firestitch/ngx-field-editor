import {
  ChangeDetectionStrategy,
  Component,
  Input, OnChanges,
  OnInit, SimpleChanges,
  ViewChild,
} from '@angular/core';

import { FsGalleryComponent, FsGalleryConfig, FsGalleryItem, GalleryLayout, GalleryThumbnailSize, mime } from '@firestitch/gallery';

import { Observable, of } from 'rxjs';


@Component({
  selector: 'fs-field-view-gallery',
  templateUrl: 'field-view-gallery.component.html',
  styleUrls: ['field-view-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldViewGalleryComponent implements OnInit, OnChanges {

  @ViewChild(FsGalleryComponent)
  public gallery: FsGalleryComponent;

  @Input() public field: any = { config: {} };
  @Input() public actions = [];

  public galleryConfig: FsGalleryConfig;

  public ngOnInit(): void {
    this._initGalleryConfig();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.field?.currentValue !== changes.field?.previousValue
      || changes.actions?.currentValue !== changes.actions?.previousValue
    ) {
      this.gallery.reload();
    }
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
        const items = Array.isArray(this.field.data?.value) ?
          this.field.data.value :
          [];

        return of(
          items.map((item) => ({
            url: item.url,
            preview: item.url,
            name: item.name,
            mime: item.mime || mime(item.name, item.url, '', false),
            data: item,
          }))
        );
      },
    }
  }
}
