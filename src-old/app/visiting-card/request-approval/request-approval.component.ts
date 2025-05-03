import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  Inject,
} from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-request-approval",
  templateUrl: "./request-approval.component.html",
  styleUrls: ["./request-approval.component.css"],
})
export class RequestApprovalComponent implements OnInit {
  isSubmitted1: false;
  AddCatForm: any;
  updateQuantity: any;
  RequestViewLogData: any = [];

  ResponseData: any;
  dropdownSingleSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  dropdownMultiSelectSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  QuantityData: { Id: string; Name: string }[];
  Id: any;
  loginPerson: any;
  Status: any;
  Rm_Id: any;
  Hod_Id: any;
  Maneger_Id: any;
  Distributor_id: any;
  Loginid: any;
  StatusVal: any;
  isSubmitted: boolean;
  dialogRef: any;
  multiselectReadonly: boolean = true;
  resign_status: any = 0;
  RequestType: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dropdownSingleSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
    this.Id = this.data.Id;
    this.RequestType = this.data.RequestType;

    this.dropdownMultiSelectSettingsType = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
    this.loginPerson = this.api.GetUserData("Id");

    this.QuantityData = [
      {
        Id: "100",
        Name: "100",
      },

      {
        Id: "200",
        Name: "200",
      },

      {
        Id: "300",
        Name: "300",
      },
      {
        Id: "350",
        Name: "350",
      },
      {
        Id: "400",
        Name: "400",
      },
      {
        Id: "450",
        Name: "450",
      },
      {
        Id: "500",
        Name: "500",
      },
    ];

    this.updateQuantity = this.fb.group({
      Quantity: ["", Validators.required],
      Addtion: [""],
      Remarks: [""],
      ActionRemarks: ["", Validators.required],
      status_check: ["", Validators.required],
      VisitingOrderId: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.FetchRequestLog(this.Id);
  }

  get formControls() {
    return this.updateQuantity.controls;
  }

  UpdateRequestLog(SubmitVal: any) {
    this.isSubmitted = true;
    if (this.updateQuantity.invalid) {
      return;
    } else {
      this.multiselectReadonly = false;

      var fields = this.updateQuantity.value;
      const formData = new FormData();
      formData.append("Quantity", JSON.stringify(fields["Quantity"][0]["Id"]));
      formData.append("Addtion", fields["Addtion"]);
      // formData.append('Remark', fields['Remark']);
      formData.append("ActionRemark", fields["ActionRemarks"]);
      formData.append("RequestAction", SubmitVal);
      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());
      formData.append("Status", fields["status_check"]);
      formData.append("VisitingOrderId", fields["VisitingOrderId"]);

      // console.log(formData);
      this.api.IsLoading();
      this.api.HttpPostType("VisitingCard/UpdateRequestLog", formData).then(
        (result) => {
          this.api.HideLoading();

          // console.log(result);

          if (result["status"] == 1) {
            this.FetchRequestLog(this.Id);

            this.api.Toast("Success", result["msg"]);
            // this.updateQuantity.reset();
            this.CloseModel();
          } else {
            const msg = "msg";
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
        }
      );
    }
  }
  CloseModel() {
    this.dialogRef.close();
  }
  FetchRequestLog(VisitingId: any) {
    // var fields = (this.updateQuantity.value);
    const formData = new FormData();

    formData.append("VisitingId", VisitingId);
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());

    // console.log(formData);
    this.api.IsLoading();
    this.api.HttpPostType("VisitingCard/FetchRequestLog", formData).then(
      (result) => {
        this.api.HideLoading();

        // console.log(result);

        if (result["status"] == 1) {
          // this.api.Toast("Success", result["msg"]);
          this.updateQuantity.patchValue(result["Data"]);
          this.RequestViewLogData = result["ViewLog"];
          this.ResponseData = result["ResponseData"];
          this.Status = result["Status_check"];
          this.resign_status = result["resign_status"];
          this.StatusVal = result["Status"];
          this.Rm_Id = result["Rm_Id"];
          this.Hod_Id = result["Hod_Id"];
          this.Maneger_Id = result["Maneger_Id"];
          this.Distributor_id = result["Distributor_id"];
          this.Loginid = result["CreatorId"];
          // console.log(this.ResponseData);

          if (this.Status == "3" && this.Maneger_Id == this.loginPerson) {
            this.multiselectReadonly = false;
          }
        } else {
          const msg = "msg";
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
      }
    );
  }
}
