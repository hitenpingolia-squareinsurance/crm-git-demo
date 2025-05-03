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
  selector: "app-follow-up-report",
  templateUrl: "./follow-up-report.component.html",
  styleUrls: ["./follow-up-report.component.css"],
})
export class FollowUpReportComponent implements OnInit {
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  FilterData: ColumnsObj[];

  ActivePage: string = "Default";
  UpdateFollowForm: any;
  isSubmitted = false;
  today = new Date();
  Nextes: Date;
  SrTableId: any;
  Status: any;
  DateTimesShow: boolean = false;
  Agent_id: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<FollowUpReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.UpdateFollowForm = this.fb.group({
      Dates: ["", Validators.required],
      Times: ["", Validators.required],
      Remarks: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.Nextes = new Date();
    this.Nextes.setDate(this.Nextes.getDate() + 365);

    this.Agent_id = this.data.Id;
    this.Get();
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

    // alert(fields["Times"]);

    this.isSubmitted = true;
    if (this.UpdateFollowForm.invalid) {
      return;
    } else {
      var fields = this.UpdateFollowForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());
      formData.append("AgentId", this.Agent_id);
      formData.append("dates", fields["Dates"]);
      formData.append("times", fields["Times"]);
      formData.append("remark", fields["Remarks"]);

      var Confirms = confirm("Are You Sure?");
      if (Confirms == true) {
        this.api.IsLoading();

        this.api.HttpPostType("reports/PospReport/FollowUp", formData).then(
          (result) => {
            this.api.HideLoading();
            if (result["status"] == true) {
              this.api.Toast("Success", result["msg"]);
              this.Get();
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

  Get() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

    const that = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/reports/PospReport/FollowUpPospData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&AgentId=" +
                this.Agent_id
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            // console.log(that.dataAr);

            that.FilterData = resp.FilterPolicyData;

            if (that.dataAr.length > 0) {
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
              FilterPolicyData: [],
            });
          });
      },
    };
  }
}
