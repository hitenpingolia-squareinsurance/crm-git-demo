import { Component, OnInit, ChangeDetectionStrategy, ViewChild, AfterViewInit, NgZone } from "@angular/core";

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { map, pairwise, filter, throttleTime } from 'rxjs/operators';


@Component({
  selector: 'app-operation-manage-rights',
  templateUrl: './operation-manage-rights.component.html',
  styleUrls: ['./operation-manage-rights.component.css']
})
export class OperationManageRightsComponent implements OnInit {
  visible = false;
  @ViewChild('scroller1', { static: false }) scroller1: CdkVirtualScrollViewport;

  constructor() { }

  ngOnInit() {
  }


  toggleCollapse(): void {
    this.visible = !this.visible;
  }


  // OperationManageRightsComponent
}
