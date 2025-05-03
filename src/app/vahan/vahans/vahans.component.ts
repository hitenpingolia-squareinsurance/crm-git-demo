import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { DatePipe } from "@angular/common";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import * as XLSX from "xlsx";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiService } from "src/app/providers/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NewDateComponent } from "../new-date/new-date.component";

class ColumnsObj {
  Id: string;
  Claim_Id: string;
  Claim_Creator: string;
  Claim_Manager: string;
  PolicyType: string;
  LossType: string;
  Intimated_To_Insurer: string;
  Survey_Status: string;
  Add_Stamp: string;
  SrNo: string;
  Status: string;
  CauseOfLossType: string;
  Spot_Survey_Status: string;
  Quotation_Id: string;
  CustomerName: string;
  registration_no: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-vahans",
  templateUrl: "./vahans.component.html",
  styleUrls: ["./vahans.component.css"],
  providers: [DatePipe],
})
export class VahansComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;

  SearchForm: FormGroup;

  dtOptions: DataTables.Settings = {};

  dataTable: any[] = [];
  dataTable1: any[] = [];
  dataTable2: any[] = [];
  exportTable: any[] = [];
  exportBtn: any[] = [];

  financialYearVal: { Id: string; Name: string }[];

  currentDate: Date;
  minDate: Date = new Date();
  maxDate: Date = new Date();
  firstTime = true;

  urlSegmentSub: any;
  isSubmitted: boolean = false;
  buttonDisable = false;
  Is_Export: any = 0;
  dataAr: ColumnsObj[];

  deDate: boolean = true;
  fileName = "ExcelSheet.xlsx";
  type: any;
  ToDate: any;
  FromDate: any;

  today: any;
  aDataSort: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    public dialog: MatDialog
  ) {
    this.SearchForm = this.fb.group({
      QuoteType: [""],
      Company_Id: [""],
      LossType: [""],
      PolicyType: [""],
      Claim_Status: [""],
      DateOrDateRange: [""],
      SearchValue: [""],
    });

    this.financialYearVal = [{ Id: "2025-26", Name: "2025-26" }];
    var Values1 = this.financialYearVal[0].Id.split("-");
    var Year1 = parseInt(Values1[0]);
    var Year2 = Year1 + 1;

    this.minDate = new Date("04-01-" + Year1);
    this.maxDate = new Date("03-31-" + Year2);

    var currentDate = new Date();
    var currentDateString =
      currentDate.getDate() +
      "/" +
      (currentDate.getMonth() + 1) +
      "/" +
      currentDate.getFullYear();
    var OneMonthBefore =
      currentDate.getDate() +
      "/" +
      currentDate.getMonth() +
      "/" +
      currentDate.getFullYear();
    var currentDateString = OneMonthBefore + " - " + currentDateString;
  }

  ngOnInit() {
    this.SearchBtn();
    this.currentDate = new Date();
  }

  get formControls() {
    return this.SearchForm.controls;
  }

  SearchBtn() {
    this.buttonDisable = true;
    var fields = this.SearchForm.value;
    let DateOrDateRange = fields["DateOrDateRange"];

    if (DateOrDateRange) {
      this.ToDate = DateOrDateRange[0];
      this.FromDate = DateOrDateRange[1];
    } else {
      this.ToDate = this.getFormattedDate();
      this.FromDate = this.ToDate;
    }

    this.Is_Export = 0;
    this.dataAr = [];
    this.Get();
    this.Get1();
    // this.getBtn();
  }

  getFormattedDate() {
    var currentDate = new Date();
    var dd = String(currentDate.getDate()).padStart(2, "0");
    var mm = String(currentDate.getMonth() + 1).padStart(2, "0");
    var yyyy = currentDate.getFullYear();

    return yyyy + "-" + mm + "-" + dd;
  }

  getDate(date: Date) {
    var dd = String(date.getDate().toString().padStart(2, "0"));
    var mm = String(date.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    var yyyy = date.getFullYear();

    return yyyy + "-" + mm + "-" + dd;
  }

  SearchData(event: any) {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      if (TablesNumber == "Table1") {
        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(event))).draw();
      }
    });
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.Is_Export = 0;
  }

  Get() {
    let To_Date = JSON.stringify(this.api.StandrdToDDMMYYY(this.ToDate));
    let From_Date = JSON.stringify(this.api.StandrdToDDMMYYY(this.FromDate));

    const formData = new FormData();

    formData.append("ToDate", To_Date);
    formData.append("FromDate", From_Date);

    const that = this;

    this.api.IsLoading();
    this.api.HttpPostType("vahan/loadvahan", formData).then(
      (resp) => {
        that.dataTable = resp["data"];
        this.api.HideLoading();
        this.buttonDisable = false;
      },
      (err) => {
        this.api.HideLoading();
      }
    );
  }

  Get1() {
    let To_Date = JSON.stringify(this.api.StandrdToDDMMYYY(this.ToDate));
    let From_Date = JSON.stringify(this.api.StandrdToDDMMYYY(this.FromDate));

    const formData = new FormData();
    formData.append("ToDate", To_Date);
    formData.append("FromDate", From_Date);
    const that = this;
    this.api.HttpPostType("vahan/loadwhstapp", formData).then(
      (resp) => {
        that.dataTable1 = resp["data"];
        this.api.HideLoading();
        this.buttonDisable = false;
        this.Get2();
      },
      (err) => {
        this.api.HideLoading();
      }
    );
  }

  Get2() {
    let To_Date = JSON.stringify(this.api.StandrdToDDMMYYY(this.ToDate));
    let From_Date = JSON.stringify(this.api.StandrdToDDMMYYY(this.FromDate));

    const formData = new FormData();

    formData.append("ToDate", To_Date);
    formData.append("FromDate", From_Date);
    const that = this;
    this.api.HttpPostType("vahan/loadsms", formData).then(
      (resp) => {
        that.dataTable2 = resp["data"];
        this.api.HideLoading();
        this.buttonDisable = false;
      },
      (err) => {
        this.api.HideLoading();
      }
    );
  }

  getTodays() {
    var currentDate = new Date();
    var dd = String(currentDate.getDate()).padStart(2, "0");
    var mm = String(currentDate.getMonth() + 1).padStart(2, "0");
    var yyyy = currentDate.getFullYear();

    var h = String(currentDate.getHours()).padStart(2, "0");
    var m = String(currentDate.getMinutes()).padStart(2, "0");
    var s = String(currentDate.getSeconds()).padStart(2, "0");

    return yyyy + "-" + mm + "-" + dd + "_" + h + m + s;
  }

  exTable(nameType: any): void {
    let name = "";
    let arr: any[] = [];

    if (nameType.match(/vahans/)) {
      name = "Vahan";
      arr = ["Vahan Data", "Vahan Failed"];
    } else if (nameType.match(/whatsapp/)) {
      name = "Whatsapp";
      arr = ["Whatsapp Log", "CRM Renewal"];
    } else if (nameType.match(/sms/)) {
      name = "SMS";
      arr = ["SMS"];
    }

    if (this.exportTable && this.exportTable.length > 0) {
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      for (let i = 0; i < this.exportTable.length; i++) {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
          this.exportTable[i]
        );
        // Use sheet names from arr variable
        const sheetName = arr[i % arr.length];
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      }

      XLSX.writeFile(wb, name + "-" + this.getTodays() + ".xlsx");
    } else {
      console.error("No data to export.");
    }
  }

  exportData(type: any, num: any) {
    let To_Date = JSON.stringify(this.api.StandrdToDDMMYYY(this.ToDate));
    let From_Date = JSON.stringify(this.api.StandrdToDDMMYYY(this.FromDate));

    const formData = new FormData();

    formData.append("ToDate", To_Date);
    formData.append("FromDate", From_Date);
    formData.append("num", num);

    const that = this;

    this.api.IsLoading();
    this.api.HttpPostType("/" + type, formData).then(
      (resp: any[]) => {
        this.exportTable = resp;
        this.buttonDisable = false;
        this.exTable(type);
        this.api.HideLoading();
        if (that.dataAr.length > 0) {
          //that.Is_Export = 1;
        }
      },
      (err) => {
        this.api.HideLoading();
      }
    );
  }

  dailog() {
    const dialogRef = this.dialog.open(NewDateComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.Get();
      this.Get1();
      // this.getBtn();
    });
  }
}
