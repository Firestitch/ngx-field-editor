import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-populate-url',
  templateUrl: './populate-url.component.html',
  styleUrls: ['./populate-url.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopulateUrlComponent implements OnChanges {

  @Input() public identifier;
  @Input() public value;

  public populateUrl;
  public populateUrlTrust;

  constructor(
    private _domSanitizer: DomSanitizer,
  ) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const url = new URL(location.href);
    url.searchParams.set(this.identifier || '', this.value || '');
    this.populateUrl = String(url);
    this.populateUrlTrust = this._domSanitizer.bypassSecurityTrustUrl(this.populateUrl);  
  }

}
