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
  selector: "app-confrim-payment-method",
  templateUrl: "./confrim-payment-method.component.html",
  styleUrls: ["./confrim-payment-method.component.css"],
})
export class ConfrimPaymentMethodComponent implements OnInit {
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  FilterData: ColumnsObj[];

  ActivePage: string = "Default";
  UpdatePaymentMethodForm: FormGroup;
  isSubmitted = false;
  today = new Date();
  Nextes: Date;
  SrTableId: any;
  Status: any;
  DateTimesShow: boolean = false;
  Agent_id: any;
  Id: any;
  Type: any;
  QuotationId: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<ConfrimPaymentMethodComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.UpdatePaymentMethodForm = this.fb.group({
      PaymentMethod: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.Nextes = new Date();
    this.Nextes.setDate(this.Nextes.getDate() + 365);

    this.Id = this.data.Id;
    this.Type = this.data.type;
    this.QuotationId = this.data.Quotation;
    // console.log(this.data);
    this.Get();
  }

  get FC() {
    return this.UpdatePaymentMethodForm.controls;
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  UpdatePaymentMethod() {
    this.isSubmitted = true;
    if (this.UpdatePaymentMethodForm.invalid) {
      return;
    } else {
      var fields = this.UpdatePaymentMethodForm.value;

      const formData = new FormData();
      formData.append("PaymentMethod", fields["PaymentMethod"]);
      formData.append("Type", this.Type);
      formData.append("Id", this.Id);

      if (confirm("Are you sure !") == true) {
        this.api.IsLoading();
        this.api
          .HttpPostType(
            "Offlinequote/AcceptQuotesData?User_Id=" +
              this.api.GetUserData("Id") +
              "&User_Type=" +
              this.api.GetUserType() +
              "&Quotation=" +
              this.QuotationId,
            formData
          )
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
