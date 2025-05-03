import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../providers/api.service";

import { MatDialog } from "@angular/material/dialog";
import { GemsDetailsViewRemarkComponent } from "../gems-details-view-remark/gems-details-view-remark.component";

@Component({
  selector: "app-viewgemsdetailspopup",
  templateUrl: "./viewgemsdetailspopup.component.html",
  styleUrls: ["./viewgemsdetailspopup.component.css"],
})
export class ViewgemsdetailspopupComponent implements OnInit {
  Agent_Id: any;
  DataAr: any = [];
  Session_Year: any;
  ShowType: any;
  ActionForm: FormGroup;
  dropdownSettingsingleselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  SR_Session_Year: any;
  isSubmitted: boolean;
  colspanss: any = 5;
  UrlCalls: string = "";
  financialYearVal: { Id: string; Name: string }[];
  showGemsSelect: string = "Yes";

  constructor(
    public dialogRef: MatDialogRef<ViewgemsdetailspopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public api: ApiService,
    public dialog: MatDialog
  ) {
    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.Agent_Id = this.data.Id;
    this.Session_Year = this.data.FinancialYear;

    var Explods = this.Session_Year.split("-");
    var Year1 = parseInt(Explods[0]);
    var Year2 = Year1 + 1;

    this.showGemsSelect = "No";

    if (Year1 > 2023) {
      this.showGemsSelect = "Yes";
    }

    this.ShowType = this.data.Type;

    this.ActionForm = this.formBuilder.group({
      FinancialYears: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.ShowType == "Wallet") {
      this.colspanss = 5;
      this.ShowFinicialYears();
      this.SubmitActionForm();
      this.UrlCalls = "GemsViewDetailsAgent";

      this.GetDetails();
    } else {
      this.colspanss = 3;
      this.GetDetails();
      this.UrlCalls = "GemsViewDetails";
    }

    this.financialYearVal = [{ Id: "2025-26", Name: "2025-26" }];
  }
  ShowFinicialYears() {
    this.api.IsLoading();
    this.api.HttpGetType("b-crm/Filter/GetOnlySessionYears").then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          // console.log(result);

          this.SR_Session_Year = result["Data"]["SR_Session_Year"];
        } else {
          this.api.Toast("Warning", result["Message"]);
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

  //===== ON OPTION SELECT =====//
  onItemSelect(item: any, Type: any) {
    //Financial Year
    if (Type == "FinancialYear") {
      var Years = item.Id;
      var Explods = Years.split("-");
      var Year1 = parseInt(Explods[0]);
      var Year2 = Year1 + 1;

      this.showGemsSelect = "No";

      if (Year1 > 2023) {
        this.showGemsSelect = "Yes";
      }
    }
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
  get FC_6() {
    return this.ActionForm.controls;
  }

  SubmitActionForm() {
    this.isSubmitted = true;
    if (this.ActionForm.invalid) {
      return;
    } else {
      var fields = this.ActionForm.value;
      const formData = new FormData();
      this.Session_Year = fields["FinancialYears"][0]["Id"];

      this.GetDetails();
    }
  }

  GetDetails() {
    if (this.ShowType == "Wallet") {
      var UrlCalls = "GemsViewDetailsAgent";
    } else {
      var UrlCalls = "GemsViewDetails";
    }

    this.api.IsLoading();
    this.api
      .HttpGetType(
        "PrimeAgent/" +
          UrlCalls +
          "?Agent_Id=" +
          this.Agent_Id +
          "&Login_Id=" +
          this.api.GetUserData("Id") +
          "&Session_Year=" +
          this.Session_Year
      )
      .then(
        (result: any) => {
          console.log(result["Status"]);
          console.log(result["Data"]);
          console.log(result);
          console.log(result.Status);

          if (result["Status"] == true) {
            this.DataAr = result["Data"];

            console.log(this.DataAr);
          }
          this.api.HideLoading();
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  ViewGemsRemark(v) {
    const dialogRef = this.dialog.open(GemsDetailsViewRemarkComponent, {
      width: "30%",
      height: "30%",
      data: { Remark: v },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
    });
  }
}
