import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, JsonpInterceptor } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { BmsapiService } from "src/app/providers/bmsapi.service";
import { ApiService } from "src/app/providers/api.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ViewQcReportComponent } from "../qc-report/view-qc-report/view-qc-report.component";

class ColumnsObj {
  Id: string;
  SR_No: string;
  User: string;
  LOB_Name: string;
  File_Type: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  totalSRandBussinessCount: any[];
  totalPremium: any[];
  SQL_Where: any;
  where: any;
  DateRangeValue: any;
  RM_Ar: any;
}

@Component({
  selector: "app-qc-pdf-report",
  templateUrl: "./qc-pdf-report.component.html",
  styleUrls: ["./qc-pdf-report.component.css"],
})
export class QcPdfReportComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  SearchForm: FormGroup;
  isSubmitted = false;
  buttonDisable = false;
  AddFieldForm: FormGroup;

  Bulk_Id: any = 0;
  TotalSR: any = 0;
  Export_Id: any = 0;
  assign: any = 0;
  type: any;

  dropdownSettings: any = {};

  Is_Export: any = 0;
  dropdownSingleSelect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  ActivePage: string;

  SR_StatusDropdownSettings: any = {};
  Companies_Ar: any = [];
  UserRights: any = [];
  SRStatus_Ar: any = [];
  RM_Ar: any[] = [];
  Agent_Ar: any[] = [];
  Lob_Ar: any;
  whereAr: any;
  LOB_Ar: { Id: string; Name: string }[];

  selectedFiles: File;
  progress_bar: boolean = true;

  constructor(
    public api: BmsapiService,
    public apiCRM: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.router.events.subscribe((value) => {
      if (router.url.toString() == "/regulatory-report/insurer-wise") {
        this.ActivePage = "Insurer Wise Business Report";
      } else if (router.url.toString() == "/regulatory-report/top-customers") {
        this.ActivePage = "Top Customer's Business Report";
      } else if (router.url.toString() == "/regulatory-report/top-insurer") {
        this.ActivePage = "Top Insurer's Business Report";
      } else if (
        router.url.toString() == "/regulatory-report/department-business"
      ) {
        this.ActivePage = "Department Business Data Report";
      } else if (
        router.url.toString() == "/regulatory-report/business-report"
      ) {
        this.ActivePage = "Business Report";
      } else {
        this.ActivePage = "N/A";
      }
    });

    this.AddFieldForm = this.fb.group({
      agent: ["", Validators.required],
      rm: ["", Validators.required],
      file: ["", Validators.required],
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };

    this.dropdownSingleSelect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.SR_StatusDropdownSettings = {
      singleSelection: true,
      enableCheckAll: false,
      idField: "Id",
      textField: "Name",
    };

    this.SRStatus_Ar = [
      { Id: "Logged", Name: "Logged" },
      { Id: "Complete", Name: "Booked" },
    ];

    this.LOB_Ar = [
      { Id: "Motor", Name: "Motor" },
      { Id: "Health", Name: "Health" },
      { Id: "Personal Accident", Name: "Personal Accident" },
    ];
  }

  ngOnInit(): void {
    this.type = this.api.GetUserData("Type");
    this.Get();
  }

  get FC() {
    return this.AddFieldForm.controls;
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      dtInstance.page(pageinfo).draw(false);
    });
  }

  Get() {
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
              environment.apiUrlBmsBase +
                "/../v2/sr/Offline_Booking/GridData2?User_Id=" +
                this.api.GetUserId() +
                "&source=crm"
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));

            that.dataAr = resp.data;
            that.RM_Ar = resp.RM_Ar;
            this.whereAr = resp.where;

            //alert(resp.SQL_Where);
            if (that.dataAr.length > 0) {
              that.Is_Export = 1;
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  Formate() {
    const formData = new FormData();
    formData.append("type", this.api.GetUserData("Type"));
    this.api
      .HttpPostType("../v2/sr/Offline_Booking/downloadFormat", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            window.open(result["url"]);
          }
        },
        (err) => {}
      );
  }

  UploadExcel(event) {
    this.selectedFiles = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      //   //   //   console.log(this.selectedFiles);
      //   //   //   console.log(this.selectedFiles.name);
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      //   //   //   console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      ////   //   console.log(ext);

      if (ext == "pdf") {
        //   //   //   console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        //   //   //   console.log(Total_Size + ' kb');

        if (Total_Size >= 1024 * 2) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 2 mb");
          this.AddFieldForm.get("file").reset();
        } else {
          if (this.type == "agent") {
            this.Upload();
          }
        }
      } else {
        //   //   //   console.log('Extenstion is not vaild !');
        this.api.Toast("Warning", "Please choose vaild file ! Example :- pdf");
        this.AddFieldForm.get("file").reset();
      }
    }
  }

  Upload() {
    const field = this.AddFieldForm.value;
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    formData.append("PDF_File", this.selectedFiles);

    if (this.type != "agent") {
      formData.append("RM_Code", JSON.stringify(field["rm"]));
      formData.append("Agent_Code", JSON.stringify(field["agent"]));
    }

    formData.append("type", this.api.GetUserData("Type"));

    this.api.HttpPostType("../v2/sr/Offline_Booking/UploadPDF", formData).then(
      (result) => {
        if (this.type != "agent") {
          this.isSubmitted = false;
        }

        if (result["Status"] == true) {
          //   //   //   console.log(result);
          this.Bulk_Id = result["Bulk_Id"];
          this.Reload();
        } else {
          this.apiCRM.Toast("Warning", result["Message"]);
        }
        this.apiCRM.HideLoading();
      },
      (err) => {}
    );
  }

  viewReport(bulk_id: any) {
    const dialogRef = this.dialog.open(ViewQcReportComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { bulk_id: bulk_id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.Reload();
    });
  }

  Submit() {
    this.isSubmitted = true;
    if (this.AddFieldForm.valid) {
      this.Upload();
      this.AddFieldForm.reset();
      document.getElementById("filter_close").click();
    }
  }

  GetAgent() {
    this.apiCRM.IsLoading();
    const field = this.AddFieldForm.value;
    const RM_Id = field["rm"][0]["Id"];

    const formData = new FormData();
    formData.append("RM_Id", RM_Id);

    this.api.HttpPostType("../v2/sr/Offline_Booking/GetAgent", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Agent_Ar = result["Agent_Ar"];
        } else {
          this.apiCRM.Toast("Warning", result["Msg"]);
        }
        this.apiCRM.HideLoading();
      },
      (err) => {}
    );
  }
}
