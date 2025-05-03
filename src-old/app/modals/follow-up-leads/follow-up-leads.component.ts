import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  Inject,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataTableDirective } from "angular-datatables";

class ColumnsObj {
  SrNo: string;
  Id: string;
  FollowUpDate: any;
  FollowUpTime: any;
  FollowUpRemark: any;
  ActionByType: string;
  UpDatedTime: string;
  ActionByCode: string;
  ActionByName: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterPolicyData: any[];
}
@Component({
  selector: "app-follow-up-leads",
  templateUrl: "./follow-up-leads.component.html",
  styleUrls: ["./follow-up-leads.component.css"],
})
export class FollowUpLeadsComponent implements OnInit {
  UpdateFollowForm: FormGroup;
  isSubmitted: boolean;
  TableName: any;
  Id: any;
  Type: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<FollowUpLeadsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.TableName = this.data.table_name;
    this.Id = this.data.Id;
    this.Type = this.data.Type;

    // console.log(this.data);

    this.UpdateFollowForm = this.fb.group({
      Dates: [""],
      Times: [""],
      Remarks: ["", Validators.required],
    });
  }
  ngOnInit() {}

  get FC() {
    return this.UpdateFollowForm.controls;
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
      formData.append("table_name", this.TableName);
      formData.append("Id", this.Id);
      formData.append("Type", this.Type);
      formData.append("dates", fields["Dates"]);
      formData.append("times", fields["Times"]);
      formData.append("remark", fields["Remarks"]);

      var Confirms = confirm("Are You Sure?");
      if (Confirms == true) {
        this.api.IsLoading();

        this.api
          .HttpPostType("CustomerQuery/update_lead_status", formData)
          .then(
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
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
