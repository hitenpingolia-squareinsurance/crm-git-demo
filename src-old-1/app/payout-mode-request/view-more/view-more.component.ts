import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-view-more',
  templateUrl: './view-more.component.html',
  styleUrls: ['./view-more.component.css']
})
export class ViewMoreComponent implements OnInit {
  dataAr: any = [];
  searchText: any = "";
  Type: any = "";
  expandedRM: boolean = false;
  
  constructor(
    public dialogRef: MatDialogRef<ViewMoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.Type = this.data.Type;
    this.dataAr = this.data.DataAr;

  }

  ngOnInit() {
  }
  LoadMore(section: string, data: any[]): void {
    if (section === 'RM') {
      this.expandedRM = !this.expandedRM; // Toggle the RM section view
    }
    // You can add other logic here for LOB and Product if necessary
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
