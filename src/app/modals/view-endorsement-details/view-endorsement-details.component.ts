import $ from "jquery";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-view-endorsement-details",
  templateUrl: "./view-endorsement-details.component.html",
  styleUrls: ["./view-endorsement-details.component.css"],
})
export class ViewEndorsementDetailsComponent implements OnInit {
  srno: any;
  DataArr: any;
  Id: any;
  rightType: any;

  statusData: any = [];
  dropdownSettingsType1: any = {};
  selectedStatus: any;
  curStatus: any;
  currentRemark: any;

  requestData: any = "";
  status: any;
  assignedToEmp: any;
  NameUpdateReason: any;
  NcbUpdateReason: any;
  RcFrontDoc: any;
  RcBackDoc: any;
  RequestLetterDoc: any;
  SupportingDoc: any;
  selectedFiles: File;
  EndorsementCopy: File;
  EndorsementCopyDoc: any;
  row: any;
  addedBy: any;
  mappedTo: any;

  constructor(
    public api: ApiService,
    private route: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<ViewEndorsementDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.srno = this.data.Id;
    // alert(this.srno);
  }

  ngOnInit() {
    this.Id = this.data.qid;
    this.rightType = this.data.right;
    this.getSingleSrDetails();
  }

  //===== GET SINGLE SR DETAILS ======//
  getSingleSrDetails() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "b-crm/Reports/ViewEndorsementRequestUsingSrno?Type=Normal&Id=" +
          this.Id +
          "&User_Id=" +
          this.api.GetUserData("Id") +
          "&Srno=" +
          this.srno
      )
      .then(
        (result) => {
          this.api.HideLoading();

          // if(result['Status'] == true){

          // this.row = result['Data'];
          this.requestData = result["Data"];

          // console.log(result['Data']);
          // }else{
          //   this.api.Toast('Warning',result['Message']);
          // }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }
  CloseModel() {
    this.dialogRef.close();
  }

  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }
}
