import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from "../../providers/api.service";
import { MatDialogRef } from "@angular/material/dialog";
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-view-popup',
  templateUrl: './view-popup.component.html',
  styleUrls: ['./view-popup.component.css']
})
export class ViewPopupComponent implements OnInit {
  ClaimId: any;
  dataArr: any;
  lobDtata: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private api: ApiService,private datePipe: DatePipe, private dialogRef: MatDialogRef<ViewPopupComponent>,) {
    this.ClaimId = this.data.id;
  }

  ngOnInit() {
    // alert(this.ClaimId);
    this.getValue();
  }

  getValue() {
    const formData = new FormData();
    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("id", this.ClaimId);

    this.api.IsLoading();
    this.api.HttpPostType("ClaimView/GetClaimValue", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.dataArr = result["data"];
          this.lobDtata = this.dataArr['lob'];

        } else {
          const msg = "msg";
          //alert(result['message']);
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
        //this.api.ErrorMsg('Network Error :- ' + err.message);
      }
    );
  }
  CloseModel() {
    this.dialogRef.close();
  }
  // date formate 

  // formatDateFunction(inputDate: string, format: string) {
  //   const date = new Date(inputDate);
  //   alert('test');
  //   return this.datePipe.transform(date, format);
  // }


}
