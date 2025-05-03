import {
  Component,
  OnInit, QueryList,
  ViewChildren,
  Inject
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { FormBuilder, Validators } from "@angular/forms";
import { DataTableDirective } from "angular-datatables";

@Component({
  selector: 'app-action-unknown-window',
  templateUrl: './action-unknown-window.component.html',
  styleUrls: ['./action-unknown-window.component.css']
})
export class ActionUnknownWindowComponent implements OnInit {

  dtOptions: DataTables.Settings = {};


  ActivePage: string = "Default";
  UpdateFollowForm: any;
  isSubmitted = false;
  today = new Date();
  Nextes: Date;
  SrTableId: any;
  Status: any;
  DateTimesShow: boolean = false;
  Agent_id: any;
  UserRoleType: string | null;
  SrNewStatus: any;
  SrId: any;
  row: any;
  SpcData: any;
  dropdownSettingsType: { singleSelection: boolean; idField: string; textField: string; itemsShowLimit: number; enableCheckAll: boolean; allowSearchFilter: boolean; };
  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<ActionUnknownWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {


    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.UpdateFollowForm = this.fb.group({
      ActionType: ["", Validators.required],
      Remarks: ["", Validators.required],
      Spc: [""],
    });
  }

  ngOnInit() {
    this.UserRoleType = this.api.GetUserType();

    this.Nextes = new Date();
    this.Nextes.setDate(this.Nextes.getDate() + 365);
    this.SrId = this.data.Id;

    this.GetDetails();
    this.GetSpcDetails();

  }

  get FC() {
    return this.UpdateFollowForm.controls;
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  UpdateFollowFormS() {
    var fields = this.UpdateFollowForm.value;
    const formData = new FormData();
 
    this.isSubmitted = true;
    if (this.UpdateFollowForm.invalid) {
      return;
    } else {
      var fields = this.UpdateFollowForm.value;
      const formData = new FormData();


      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());
      formData.append("SrId",  this.SrId);
      formData.append("Remarks",  fields['Remarks']);
      formData.append("Action",  fields['ActionType']);
      if(fields['ActionType'] == 2){
        formData.append("Spc",  fields['Spc']);
      }
 
      var Confirms = confirm("Are You Sure?");
      if (Confirms == true) {
        this.api.IsLoading();

        this.api.HttpPostType("UnknownWindow/UpdateActionSr", formData).then(
          (result) => {
            this.api.HideLoading();
            if (result["status"] == true) {
              this.api.Toast("Success", result["msg"]);
            } else {
              this.api.Toast("Warning", result["msg"]);
            }
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
    }
  }


  GetDetails() {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("SrId", this.SrId);

    this.api.IsLoading();

    this.api.HttpPostType("UnknownWindow/FetchSingleUnknowCase", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.row = result['Data'];
          this.UpdateFollowForm.get('ActionType').setValue =this.row.SrStatus;
          // this.api.Toast("Success", result["msg"]);
        } else {
          this.api.Toast("Warning", result["msg"]);
        }
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

  GetSpcDetails() {

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());

    this.api.IsLoading();

    this.api.HttpPostType("UnknownWindow/FetchSingleSpc", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.SpcData = result['Data'];
          // this.api.Toast("Success", result["msg"]);
        } else {
          this.api.Toast("Warning", result["msg"]);
        }
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
  // ChangeStatusRenewals(e: any ) {
  //   var Values = e.target.value;
  //   if (Values == "") this.api.Toast("Warning", "Status is mandatory..!");
  //   else {
  //     var Confirms = confirm("Are You Sure To Change Status?");
  //     if (Confirms == true) {

  //       this.api
  //         .HttpGetType(
  //           "UnknownWindow/ChangeStatus?Page=User&User_Id=" +
  //           this.api.GetUserData("Id") +
  //           "&User_Type=" +
  //           this.api.GetUserType() +
  //           "&Id=" +
  //           this.SrId +
  //           "&Status=" +
  //           Values
  //         )
  //         .then(
  //           (result) => {
  //             if (result["status"] == true) {
  //               this.api.Toast("Success", result["msg"]);
  //               setTimeout(() => {
  //                 // this.ResetDT();
  //               }, 500);
  //             } else {
  //               this.api.Toast("Warning", result["msg"]);
  //               // setTimeout(() => {
  //               //   this.router.navigate([result["data"]["Return"]]);
  //               // }, 1000);
  //             }
  //           },
  //           (err) => {
  //             this.api.Toast(
  //               "Warning",
  //               "Network Error : " + err.name + "(" + err.statusText + ")"
  //             );
  //           }
  //         );
  //     }
  //   }
  // }
}