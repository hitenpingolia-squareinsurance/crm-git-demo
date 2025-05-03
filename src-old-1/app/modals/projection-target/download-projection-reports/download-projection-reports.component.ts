import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { ApiService } from "../../../providers/api.service";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DownloadingViewComponent } from "../../../modals/downloading-view/downloading-view.component";

@Component({
  selector: "app-download-projection-reports",
  templateUrl: "./download-projection-reports.component.html",
  styleUrls: ["./download-projection-reports.component.css"],
})
export class DownloadProjectionReportsComponent implements OnInit {
  SearchForm: FormGroup;
  isSubmitted = false;
  YearArray: any = [];
  SelectedYear: any = [];

  MonthArray: any = [];
  SelectedMonth: any = "";
  CurrentMonth: any = "";
  Name: any = "";
  SelectedCurrentMonth: any = [];
  SelectedMonthNo: any = "";

  dropdownSettingsingleselect1: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  constructor(
    public dialogRef: MatDialogRef<DownloadProjectionReportsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public api: ApiService,
    private http: HttpClient,
    public formBuilder: FormBuilder
  ) {
    this.SearchForm = this.formBuilder.group({
      Year_Name: ["", [Validators.required]],
      Month_Name: ["", [Validators.required]],
    });

    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false,
    };
  }

  ngOnInit() {
    this.MonthArray = [
      { Id: "04", Name: "April" },
      { Id: "05", Name: "May" },
      { Id: "06", Name: "June" },
      { Id: "07", Name: "July" },
      { Id: "08", Name: "August" },
      { Id: "09", Name: "September" },
      { Id: "10", Name: "October" },
      { Id: "11", Name: "November" },
      { Id: "12", Name: "December" },
      { Id: "01", Name: "January" },
      { Id: "02", Name: "Feburary" },
      { Id: "03", Name: "March" },
    ];

    //Month Related Filter Values
    const d = new Date();
    this.CurrentMonth = d.getMonth();
    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    //Month String Value
    this.Name = month[d.getMonth()];

    //Month Numeric Value
    this.CurrentMonth = +this.CurrentMonth + +1;
    if (this.CurrentMonth < 10) {
      this.CurrentMonth = "0" + this.CurrentMonth;
    }

    this.SelectedCurrentMonth = [{ Id: this.CurrentMonth, Name: this.Name }];

    this.YearArray = [{ Id: "2022", Name: "2022" }];
    this.SelectedYear = [{ Id: "2022", Name: "2022" }];
    //this.GetFilterData();
  }

  //===== GET VALIDATION FROM CONTROLS =====//
  get formControls() {
    return this.SearchForm.controls;
  }

  //===== GET SR DETAILS =====//
  GetFilterData() {
    const formData = new FormData();

    this.api.IsLoading();
    this.api.HttpPostTypeBms("common/Common/GetSimpleArrays", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.YearArray = result["Data"]["YearArray"];
          this.SelectedYear = result["Data"]["SelectedYear"];
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast("Warning", err.message);
      }
    );
  }

  //===== EXPORT REPORTS =====//
  ExportReport(): void {
    //Month Name
    var SelectedMonth = "";
    var SelectedYear = "";
    var fields = this.SearchForm.value;

    if (this.SearchForm.get("Year_Name").value.length == 1) {
      SelectedYear = fields["Year_Name"][0]["Name"];
    } else {
      this.api.Toast("Warning", "Please select Year !");
      return;
    }

    if (this.SearchForm.get("Month_Name").value.length == 1) {
      SelectedMonth = fields["Month_Name"][0]["Id"];
    } else {
      this.api.Toast("Warning", "Please select Month Name !");
      return;
    }

    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = "25%";
    dialogConfig.height = "14%";
    dialogConfig.hasBackdrop = false;

    dialogConfig.position = {
      top: "40%",
      left: "1%",
    };

    dialogConfig.data = {
      ReportType: "ProjectionReports",
      YearName: SelectedYear,
      MonthName: SelectedMonth,
    };

    const dialogRef = this.dialog.open(DownloadingViewComponent, dialogConfig);
    this.CloseModel();
    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
    });
  }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
