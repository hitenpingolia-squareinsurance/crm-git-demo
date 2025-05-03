import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../../environments/environment";
import { ApiService } from "../../../providers/api.service";
import { Router } from "@angular/router";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

class ColumnsObj {
  SNo: string;
  InsertDate: string;
  Date: string;
  SelfTarget: string;
  TeamTarget: string;
  SelfBusiness: string;
  TeamBusiness: string;
  SelfAchivementPercent: string;
  TeamAchivementPercent: string;
  ShowTeamData: string;
}

class DataTablesResponse {
  Status: any;
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  SQL_Where: any;
}

@Component({
  selector: "app-projection-target-log",
  templateUrl: "./projection-target-log.component.html",
  styleUrls: ["./projection-target-log.component.css"],
})
export class ProjectionTargetLogComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  SearchForm: FormGroup;
  isSubmitted = false;

  Employee_Id: string = "";
  ProfileName: string = "";

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
    public dialogRef: MatDialogRef<ProjectionTargetLogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
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

    this.Employee_Id = this.data.Employee_Id;
    this.ProfileName = this.data.ProfileName;
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
    this.GetFilterData();
    this.Get();
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
      (result:any) => {
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

  //===== SEARCH DATATABLE DATA =====//
  SearchBtn() {
    var fields = this.SearchForm.value;
    var query = {
      Year: fields["Year_Name"][0]["Id"],
      MonthName: fields["Month_Name"][0]["Id"],
    };

    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(query)))
        .draw();
    });
  }

  //===== CLOSE MODAL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  //===== CLEAR SEARCH DATA =====//
  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.SearchForm.get("Interaction_Type").setValue("");
    this.dataAr = [];
    this.ResetDT();
  }

  //===== RESET DATATABLE =====//
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== RELOAD DATATABLE =====//
  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  //===== GET DATATABLE DATA =====//
  Get() {
    const that = this;

    this.dtOptions = {
      pagingType: "full_numbers",
      // lengthMenu: [10, 25, 50, 100],
      pageLength: 10,
      serverSide: true,
      processing: true,
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/projection-target/ProjectionTarget/GetPreviousLog?&User_Code=" +
                this.api.GetUserData("Code") +
                "&Employee_Id=" +
                this.Employee_Id +
                "&Portal=CRM"
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            if (resp.Status == false) {
              that.dataAr = [];
            } else {
              that.dataAr = resp.data;
              that.GetDataInChanks();
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },

      // columnDefs: [
      //   {
      //     targets: [0, 1, 2, 3, 4], // column index (start from 0)
      //     orderable: false, // set orderable false for selected columns
      //   },
      // ],
    };
  }

  //===== GET DATA IN CHUNKS =====//
  async GetDataInChanks() {
    for (let i = 0; i < this.dataAr.length; i++) {
      var InsertDate = this.dataAr[i]["InsertDate"];

      const formData = new FormData();
      formData.append("Employee_Id", this.Employee_Id);
      formData.append("Portal", "CRM");
      formData.append("Type", "TableData");
      formData.append("InsertDate", InsertDate);

      var url =
        environment.apiUrlBmsBase +
        "/projection-target/ProjectionTarget/GetDataInChanks";

      await this.http
        .post<any>(
          this.api.additionParmsEnc(url),
          this.api.enc_FormData(formData),
          this.api.getHeader(environment.apiUrlBmsBase)
        )
        .toPromise()
        .then((res: any) => {
          var data = JSON.parse(this.api.decryptText(res.response));
          //// console.log(data.Agent_Id);
          this.dataAr[i]["SelfTarget"] = data.SelfTarget;
          this.dataAr[i]["TeamTarget"] = data.TeamTarget;
          this.dataAr[i]["SelfBusiness"] = data.SelfBusiness;
          this.dataAr[i]["TeamBusiness"] = data.TeamBusiness;
          this.dataAr[i]["SelfAchivementPercent"] = data.SelfAchivementPercent;
          this.dataAr[i]["TeamAchivementPercent"] = data.TeamAchivementPercent;
        });
    }
  }
}
